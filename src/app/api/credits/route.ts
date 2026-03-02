import { createRequestId } from '@/lib/core/request-id'
import { apiError } from '@/lib/http/api-error'
import { createServerSupabase } from '@/utils/supabase/server'

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
