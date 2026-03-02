import { z } from 'zod'
import { createRequestId } from '@/lib/core/request-id'
import { apiError } from '@/lib/http/api-error'
import { createServerSupabase } from '@/utils/supabase/server'

const ParamsSchema = z.object({
  id: z.string().uuid(),
})

type RouteContext = {
  params: Promise<{ id: string }> | { id: string }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const requestId = createRequestId()

  try {
    const supabase = await createServerSupabase()
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return apiError(401, 'UNAUTHORIZED', 'Authentication required', requestId)
    }

    const params = await Promise.resolve(context.params)
    const parsedParams = ParamsSchema.safeParse(params)
    if (!parsedParams.success) {
      return apiError(400, 'INVALID_INPUT', 'Invalid history id', requestId)
    }

    const { data, error } = await supabase
      .from('offer_copy_generations')
      .delete()
      .eq('id', parsedParams.data.id)
      .eq('user_id', session.user.id)
      .select('id')
      .maybeSingle()

    if (error) {
      return apiError(500, 'INTERNAL_ERROR', 'Failed to delete history item', requestId)
    }

    if (!data) {
      return apiError(404, 'NOT_FOUND', 'History item not found', requestId)
    }

    return Response.json({
      requestId,
      id: data.id,
      deleted: true,
    })
  } catch {
    return apiError(500, 'INTERNAL_ERROR', 'Internal server error', requestId)
  }
}
