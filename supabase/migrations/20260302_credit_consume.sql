-- Atomic credit consumption helpers
create unique index if not exists credit_transactions_user_request_reason_idx
  on credit_transactions(user_id, request_id, reason)
  where request_id is not null;

create or replace function consume_credits(
  p_user_id uuid,
  p_amount integer,
  p_reason text,
  p_request_id text
)
returns table(status text, balance integer)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_balance integer;
begin
  if p_amount <= 0 then
    return query select 'INVALID_AMOUNT'::text, null::integer;
    return;
  end if;

  insert into credit_accounts (user_id, balance)
  values (p_user_id, 0)
  on conflict (user_id) do nothing;

  begin
    with updated as (
      update credit_accounts
      set balance = balance - p_amount,
          updated_at = now()
      where user_id = p_user_id
        and balance >= p_amount
      returning balance
    )
    insert into credit_transactions (user_id, delta, reason, request_id)
    select p_user_id, -p_amount, p_reason, p_request_id
    from updated
    returning (select balance from updated) into v_balance;
  exception
    when unique_violation then
      select balance into v_balance
      from credit_accounts
      where user_id = p_user_id;

      return query select 'DUPLICATE_REQUEST'::text, coalesce(v_balance, 0);
      return;
  end;

  if v_balance is null then
    select balance into v_balance
    from credit_accounts
    where user_id = p_user_id;

    return query select 'INSUFFICIENT_CREDITS'::text, coalesce(v_balance, 0);
    return;
  end if;

  return query select 'OK'::text, v_balance;
end;
$$;

grant execute on function consume_credits(uuid, integer, text, text) to service_role;
