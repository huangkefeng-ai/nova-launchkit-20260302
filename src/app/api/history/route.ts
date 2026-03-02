import { z } from 'zod'
import { createRequestId } from '@/lib/core/request-id'
import { apiError } from '@/lib/http/api-error'
import { createServerSupabase } from '@/utils/supabase/server'

const HistoryQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(16).default(12),
  offset: z.coerce.number().int().min(0).default(0),
})

export async function GET(request: Request) {
  const requestId = createRequestId()
  try {
    const supabase = await createServerSupabase()
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return apiError(401, 'UNAUTHORIZED', 'Authentication required', requestId)

    const url = new URL(request.url)
    const parsedQuery = HistoryQuerySchema.safeParse({
      limit: url.searchParams.get('limit') ?? 12,
      offset: url.searchParams.get('offset') ?? 0,
    })
    if (!parsedQuery.success) {
      return apiError(400, 'INVALID_INPUT', 'Invalid query params', requestId)
    }

    const { limit, offset } = parsedQuery.data

    const { data, count } = await supabase
      .from('offer_copy_generations')
      .select('id, created_at, output', { count: 'exact' })
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    const total = count ?? 0
    const items = data ?? []
    return Response.json({ requestId, items, total, hasMore: offset + items.length < total })
  } catch {
    return apiError(500, 'INTERNAL_ERROR', 'Internal server error', requestId)
  }
}
