import { z } from 'zod'
import { OfferCopyOutputSchema, OfferCopySchema, type OfferCopyInput } from '@/features/offer-copy/schema'
import { rollbackCredits } from '@/lib/credits/transactions'
import { createRequestId } from '@/lib/core/request-id'
import { apiError, type ApiErrorCode } from '@/lib/http/api-error'
import { createServerSupabase } from '@/utils/supabase/server'

const CreditsConsumePayloadSchema = z.object({
  amount: z.literal(1),
  reason: z.literal('offer_copy_generate'),
})

const CreditsConsumeSuccessSchema = z.object({
  requestId: z.string(),
  balance: z.number(),
})

const ErrorPayloadSchema = z.object({
  errorCode: z.string(),
  message: z.string(),
  requestId: z.string(),
})

function isApiErrorCode(value: string): value is ApiErrorCode {
  return [
    'UNAUTHORIZED',
    'FORBIDDEN',
    'INVALID_INPUT',
    'INVALID_SIGNATURE',
    'NOT_FOUND',
    'CONFLICT',
    'INSUFFICIENT_CREDITS',
    'RATE_LIMITED',
    'INTERNAL_ERROR',
  ].includes(value)
}

function buildMockCopy(input: OfferCopyInput) {
  return OfferCopyOutputSchema.parse({
    headline: `${input.product}，现在更适合${input.audience}`,
    subheadline: `围绕“${input.valueProp}”打造的一站式体验。`,
    bullets: [
      `更快落地：为${input.audience}优化上手路径`,
      `更强转化：聚焦${input.valueProp}的核心表达`,
      '更低成本：按需扩展，避免过度开发',
    ],
    cta: '立即开始免费试用',
  })
}

type ConsumeCreditResult =
  | { ok: true }
  | {
      ok: false
      status: number
      errorCode: ApiErrorCode
      message: string
    }

async function consumeOfferCopyCredit(request: Request): Promise<ConsumeCreditResult> {
  const payload = CreditsConsumePayloadSchema.parse({ amount: 1, reason: 'offer_copy_generate' })

  const response = await fetch(new URL('/api/credits', request.url), {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      cookie: request.headers.get('cookie') ?? '',
    },
    cache: 'no-store',
    body: JSON.stringify(payload),
  })

  let body: unknown = null
  try {
    body = await response.json()
  } catch {
    body = null
  }

  if (response.ok) {
    const parsed = CreditsConsumeSuccessSchema.safeParse(body)
    if (!parsed.success) {
      return {
        ok: false,
        status: 500,
        errorCode: 'INTERNAL_ERROR',
        message: 'Invalid credits response',
      }
    }

    return { ok: true }
  }

  const parsedError = ErrorPayloadSchema.safeParse(body)
  if (!parsedError.success) {
    return {
      ok: false,
      status: response.status || 500,
      errorCode: 'INTERNAL_ERROR',
      message: 'Failed to consume credits',
    }
  }

  return {
    ok: false,
    status: response.status || 500,
    errorCode: isApiErrorCode(parsedError.data.errorCode) ? parsedError.data.errorCode : 'INTERNAL_ERROR',
    message: parsedError.data.message,
  }
}

export async function POST(request: Request) {
  const requestId = createRequestId()
  let consumedCredit = false
  let userId: string | null = null

  try {
    const supabase = await createServerSupabase()
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return apiError(401, 'UNAUTHORIZED', 'Authentication required', requestId)
    }
    userId = session.user.id

    let payload: unknown
    try {
      payload = await request.json()
    } catch {
      return apiError(400, 'INVALID_INPUT', 'Invalid JSON payload', requestId)
    }

    const parsedInput = OfferCopySchema.safeParse(payload)
    if (!parsedInput.success) {
      return apiError(400, 'INVALID_INPUT', 'Invalid payload', requestId)
    }

    const consumeResult = await consumeOfferCopyCredit(request)
    if (!consumeResult.ok) {
      return apiError(consumeResult.status, consumeResult.errorCode, consumeResult.message, requestId)
    }
    consumedCredit = true

    const output = buildMockCopy(parsedInput.data)

    const { error: insertError } = await supabase.from('offer_copy_generations').insert({
      user_id: userId,
      input: parsedInput.data,
      output,
    })

    if (insertError) {
      throw new Error('FAILED_TO_SAVE_GENERATION')
    }

    return Response.json({ requestId, output })
  } catch {
    if (consumedCredit && userId) {
      await rollbackCredits({
        userId,
        amount: 1,
        reason: 'offer_copy_generate_rollback',
        requestId,
      })
    }

    return apiError(500, 'INTERNAL_ERROR', 'Internal server error', requestId)
  }
}
