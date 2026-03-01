import { z } from 'zod'

export const OfferCopySchema = z.object({
  product: z.string().min(2),
  audience: z.string().min(2),
  valueProp: z.string().min(2),
  tone: z.enum(['专业', '简洁', '活泼', '高级']),
})

export type OfferCopyInput = z.infer<typeof OfferCopySchema>
