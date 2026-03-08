-- Enable row-level security for core tables
alter table profiles enable row level security;
alter table subscriptions enable row level security;
alter table credit_accounts enable row level security;
alter table credit_transactions enable row level security;
alter table offer_copy_generations enable row level security;
alter table webhook_events enable row level security;

-- Profiles: users can manage only their own row.
drop policy if exists profiles_select_own on profiles;
create policy profiles_select_own
  on profiles
  for select
  to authenticated
  using (id = auth.uid());

drop policy if exists profiles_insert_own on profiles;
create policy profiles_insert_own
  on profiles
  for insert
  to authenticated
  with check (id = auth.uid());

drop policy if exists profiles_update_own on profiles;
create policy profiles_update_own
  on profiles
  for update
  to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

-- Subscriptions: users can read their own subscription status.
drop policy if exists subscriptions_select_own on subscriptions;
create policy subscriptions_select_own
  on subscriptions
  for select
  to authenticated
  using (user_id = auth.uid());

-- Credit account and ledger visibility limited to owner.
drop policy if exists credit_accounts_select_own on credit_accounts;
create policy credit_accounts_select_own
  on credit_accounts
  for select
  to authenticated
  using (user_id = auth.uid());

drop policy if exists credit_transactions_select_own on credit_transactions;
create policy credit_transactions_select_own
  on credit_transactions
  for select
  to authenticated
  using (user_id = auth.uid());

-- Offer copy history is scoped per user.
drop policy if exists offer_copy_generations_select_own on offer_copy_generations;
create policy offer_copy_generations_select_own
  on offer_copy_generations
  for select
  to authenticated
  using (user_id = auth.uid());

drop policy if exists offer_copy_generations_insert_own on offer_copy_generations;
create policy offer_copy_generations_insert_own
  on offer_copy_generations
  for insert
  to authenticated
  with check (user_id = auth.uid());

drop policy if exists offer_copy_generations_delete_own on offer_copy_generations;
create policy offer_copy_generations_delete_own
  on offer_copy_generations
  for delete
  to authenticated
  using (user_id = auth.uid());
