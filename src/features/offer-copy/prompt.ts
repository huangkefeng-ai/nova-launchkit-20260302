import type { OfferCopyInput } from './schema'

export function buildOfferCopyPrompt(input: OfferCopyInput) {
  return `你是 Nova LaunchKit 的 SaaS 增长文案专家。请根据输入生成中文营销文案。
产品: ${input.product}
目标用户: ${input.audience}
核心价值: ${input.valueProp}
语气: ${input.tone}

只输出 JSON: {"headline": string, "subheadline": string, "bullets": [string, string, string], "cta": string}`
}
