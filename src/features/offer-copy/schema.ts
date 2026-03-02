import { z } from 'zod'

export const OFFER_COPY_TONES = ['专业', '简洁', '活泼', '高级'] as const

export const OfferCopySchema = z.object({
  product: z.string().trim().min(2),
  audience: z.string().trim().min(2),
  valueProp: z.string().trim().min(2),
  tone: z.enum(OFFER_COPY_TONES),
})

export type OfferCopyInput = z.infer<typeof OfferCopySchema>

export const OfferCopyOutputSchema = z.object({
  headline: z.string().trim().min(2),
  subheadline: z.string().trim().min(2),
  bullets: z.array(z.string().trim().min(2)).length(3),
  cta: z.string().trim().min(1),
})

export type OfferCopyOutput = z.infer<typeof OfferCopyOutputSchema>
