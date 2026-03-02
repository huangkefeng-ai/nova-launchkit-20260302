import { z } from 'zod'
import { createRequestId } from '@/lib/core/request-id'
import { apiError } from '@/lib/http/api-error'
import { createServerSupabase } from '@/utils/supabase/server'

const InputSchema = z.object({
  product: z.string().min(2),
  audience: z.string().min(2),
  valueProp: z.string().min(2),
  tone: z.enum(['专业', '简洁', '活泼', '高级']),
})

function buildMockCopy(input: z.infer<typeof InputSchema>) {
  return {
    headline: `${input.product}，现在更适合${input.audience}`,
    subheadline: `围绕“${input.valueProp}”打造的一站式体验。`,
    bullets: [
      `更快落地：为${input.audience}优化上手路径`,
      `更强转化：聚焦${input.valueProp}的核心表达`,
      `更低成本：按需扩展，避免过度开发`,
    ],
    cta: '立即开始免费试用',
  }
}

export async function POST(request: Request) {
  const requestId = createRequestId()

  try {
    const supabase = await createServerSupabase()
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return apiError(401, 'UNAUTHORIZED', 'Authentication required', requestId)

    const body = await request.json()
    const parsed = InputSchema.safeParse(body)
    if (!parsed.success) return apiError(400, 'INVALID_INPUT', 'Invalid payload', requestId)

    const output = buildMockCopy(parsed.data)

    await supabase.from('offer_copy_generations').insert({
      user_id: session.user.id,
      input: parsed.data,
      output,
    })

    return Response.json({ requestId, output })
  } catch {
    return apiError(500, 'INTERNAL_ERROR', 'Internal server error', requestId)
  }
}
