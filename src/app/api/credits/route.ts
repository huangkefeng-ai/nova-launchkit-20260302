import { z } from 'zod'
import { createRequestId } from '@/lib/core/request-id'
import { apiError } from '@/lib/http/api-error'
import { consumeCredits } from '@/lib/credits/transactions'
import { createServerSupabase } from '@/utils/supabase/server'

const ConsumeCreditsSchema = z.object({
  amount: z.number().int().positive(),
  reason: z.string().trim().min(2).max(120),
})

export async function GET() {
  const requestId = createRequestId()
  try {
    const supabase = await createServerSupabase()
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return apiError(401, 'UNAUTHORIZED', 'Authentication required', requestId)

    const { data } = await supabase
      .from('credit_accounts')
      .select('balance')
      .eq('user_id', session.user.id)
      .maybeSingle()

    return Response.json({ requestId, balance: data?.balance ?? 0 })
  } catch {
    return apiError(500, 'INTERNAL_ERROR', 'Internal server error', requestId)
  }
}

export async function POST(request: Request) {
  const requestId = createRequestId()
  try {
    const supabase = await createServerSupabase()
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return apiError(401, 'UNAUTHORIZED', 'Authentication required', requestId)

    let payload: unknown
    try {
      payload = await request.json()
    } catch {
      return apiError(400, 'INVALID_INPUT', 'Invalid JSON payload', requestId)
    }

    const parsed = ConsumeCreditsSchema.safeParse(payload)
    if (!parsed.success) {
      return apiError(400, 'INVALID_INPUT', 'Invalid payload', requestId)
    }

    const consumeResult = await consumeCredits({
      userId: session.user.id,
      amount: parsed.data.amount,
      reason: parsed.data.reason,
      requestId,
    })

    if (consumeResult.ok) {
      return Response.json({
        requestId,
        balance: consumeResult.balance,
      })
    }

    if (consumeResult.status === 'INSUFFICIENT_CREDITS') {
      return apiError(409, 'INSUFFICIENT_CREDITS', 'Insufficient credits', requestId)
    }

    if (consumeResult.status === 'DUPLICATE_REQUEST') {
      return apiError(409, 'CONFLICT', 'Duplicate consume request', requestId)
    }

    if (consumeResult.status === 'INVALID_AMOUNT') {
      return apiError(400, 'INVALID_INPUT', 'Invalid amount', requestId)
    }

    return apiError(500, 'INTERNAL_ERROR', 'Internal server error', requestId)
  } catch {
    return apiError(500, 'INTERNAL_ERROR', 'Internal server error', requestId)
  }
}
