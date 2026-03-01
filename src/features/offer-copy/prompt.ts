import type { OfferCopyInput } from './schema'

export function buildOfferCopyPrompt(input: OfferCopyInput) {
  return `你是SaaS增长文案专家。根据输入生成中文营销文案。\n产品:${input.product}\n目标用户:${input.audience}\n核心价值:${input.valueProp}\n语气:${input.tone}\n\n输出JSON: {headline, subheadline, bullets:[3], cta}`
}
