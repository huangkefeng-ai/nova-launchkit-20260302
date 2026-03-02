import { createRequestId } from '@/lib/core/request-id'
import { apiError } from '@/lib/http/api-error'
import { createServerSupabase } from '@/utils/supabase/server'

export async function GET(request: Request) {
  const requestId = createRequestId()
  try {
    const supabase = await createServerSupabase()
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return apiError(401, 'UNAUTHORIZED', 'Authentication required', requestId)

    const url = new URL(request.url)
    const limit = Math.min(Math.max(Number(url.searchParams.get('limit') || 12), 1), 16)
    const offset = Math.max(Number(url.searchParams.get('offset') || 0), 0)

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
