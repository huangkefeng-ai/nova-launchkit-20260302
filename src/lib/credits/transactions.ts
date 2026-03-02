import { createServiceRoleSupabase } from '@/utils/supabase/service-role'

export type CreditTransactionType = 'credit' | 'debit'

export type CreateCreditTransactionInput = {
  userId: string
  amount: number
  type: CreditTransactionType
  reason: string
  requestId?: string
}

export async function createCreditTransaction(input: CreateCreditTransactionInput) {
  if (!Number.isInteger(input.amount) || input.amount <= 0) {
    throw new Error('INVALID_AMOUNT')
  }

  const delta = input.type === 'debit' ? -input.amount : input.amount
  const supabase = createServiceRoleSupabase()

  const { error } = await supabase.from('credit_transactions').insert({
    user_id: input.userId,
    delta,
    reason: input.reason,
    request_id: input.requestId ?? null,
  })

  if (error) {
    throw new Error(`CREDIT_TRANSACTION_INSERT_FAILED:${error.message}`)
  }
}

type ConsumeCreditsRpcRow = {
  status: string
  balance: number | null
}

type ConsumeCreditsStatus =
  | 'OK'
  | 'INSUFFICIENT_CREDITS'
  | 'DUPLICATE_REQUEST'
  | 'INVALID_AMOUNT'
  | 'INTERNAL_ERROR'

export type ConsumeCreditsResult =
  | {
      ok: true
      status: 'OK'
      balance: number
    }
  | {
      ok: false
      status: Exclude<ConsumeCreditsStatus, 'OK'>
      balance?: number
    }

export type ConsumeCreditsInput = {
  userId: string
  amount: number
  reason: string
  requestId: string
}

export async function consumeCredits(input: ConsumeCreditsInput): Promise<ConsumeCreditsResult> {
  if (!Number.isInteger(input.amount) || input.amount <= 0) {
    return { ok: false, status: 'INVALID_AMOUNT' }
  }

  const supabase = createServiceRoleSupabase()
  const { data, error } = await supabase.rpc('consume_credits', {
    p_user_id: input.userId,
    p_amount: input.amount,
    p_reason: input.reason,
    p_request_id: input.requestId,
  })

  if (error) {
    return { ok: false, status: 'INTERNAL_ERROR' }
  }

  const row = Array.isArray(data) ? (data[0] as ConsumeCreditsRpcRow | undefined) : undefined
  if (!row || typeof row.status !== 'string') {
    return { ok: false, status: 'INTERNAL_ERROR' }
  }

  switch (row.status) {
    case 'OK':
      return { ok: true, status: 'OK', balance: row.balance ?? 0 }
    case 'INSUFFICIENT_CREDITS':
      return { ok: false, status: 'INSUFFICIENT_CREDITS', balance: row.balance ?? 0 }
    case 'DUPLICATE_REQUEST':
      return { ok: false, status: 'DUPLICATE_REQUEST', balance: row.balance ?? 0 }
    case 'INVALID_AMOUNT':
      return { ok: false, status: 'INVALID_AMOUNT' }
    default:
      return { ok: false, status: 'INTERNAL_ERROR' }
  }
}
