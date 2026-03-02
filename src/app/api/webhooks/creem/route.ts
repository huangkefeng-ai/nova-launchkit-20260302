import { z } from 'zod'
import { createRequestId } from '@/lib/core/request-id'
import { apiError } from '@/lib/http/api-error'
import { verifyCreemSignatureStub } from '@/lib/billing/creem-signature'
import { createServiceRoleSupabase } from '@/utils/supabase/service-role'

const CreemWebhookSchema = z
  .object({
    id: z.string().min(1).optional(),
    event_id: z.string().min(1).optional(),
    type: z.string().min(1).optional(),
  })
  .passthrough()
  .refine((payload) => Boolean(payload.id ?? payload.event_id), {
    message: 'Missing event id',
  })

function readSignatureHeader(request: Request) {
  return request.headers.get('creem-signature') ?? request.headers.get('x-creem-signature')
}

export async function POST(request: Request) {
  const requestId = createRequestId()

  try {
    const rawBody = await request.text()
    const signatureCheck = verifyCreemSignatureStub(rawBody, readSignatureHeader(request))
    if (!signatureCheck.isValid) {
      return apiError(401, 'INVALID_SIGNATURE', 'Invalid webhook signature', requestId)
    }

    let payload: unknown
    try {
      payload = JSON.parse(rawBody)
    } catch {
      return apiError(400, 'INVALID_INPUT', 'Invalid JSON payload', requestId)
    }

    const parsedPayload = CreemWebhookSchema.safeParse(payload)
    if (!parsedPayload.success) {
      return apiError(400, 'INVALID_INPUT', 'Invalid webhook payload', requestId)
    }

    const eventId = parsedPayload.data.id ?? parsedPayload.data.event_id
    if (!eventId) {
      return apiError(400, 'INVALID_INPUT', 'Invalid webhook payload', requestId)
    }

    const supabase = createServiceRoleSupabase()
    const { data, error } = await supabase
      .from('webhook_events')
      .upsert(
        {
          provider: 'creem',
          event_id: eventId,
          payload: parsedPayload.data,
        },
        { onConflict: 'provider,event_id', ignoreDuplicates: true },
      )
      .select('id')
      .maybeSingle()

    if (error) {
      return apiError(500, 'INTERNAL_ERROR', 'Failed to store webhook event', requestId)
    }

    return Response.json({
      requestId,
      received: true,
      duplicate: data === null,
    })
  } catch {
    return apiError(500, 'INTERNAL_ERROR', 'Internal server error', requestId)
  }
}
