'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { z } from 'zod'
import { OFFER_COPY_TONES, OfferCopyOutputSchema, OfferCopySchema, type OfferCopyInput } from '@/features/offer-copy/schema'

const ApiErrorSchema = z.object({
  errorCode: z.string(),
  message: z.string(),
  requestId: z.string(),
})

const OfferCopyResponseSchema = z.object({
  requestId: z.string(),
  output: OfferCopyOutputSchema,
})

const HistoryItemSchema = z.object({
  id: z.string(),
  created_at: z.string(),
  output: z.object({ headline: z.string().optional() }).passthrough().nullable().optional(),
})

const HistoryResponseSchema = z.object({
  requestId: z.string(),
  items: z.array(HistoryItemSchema),
  total: z.number(),
  hasMore: z.boolean(),
})

type HistoryItem = z.infer<typeof HistoryItemSchema>

type ErrorState = {
  message: string
  requestId?: string
} | null

function formatDate(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return value
  }

  return new Intl.DateTimeFormat('zh-CN', {
    dateStyle: 'medium',
    timeStyle: 'short',
    hour12: false,
  }).format(date)
}

export function OfferCopyDashboardPanel() {
  const [form, setForm] = useState<OfferCopyInput>({
    product: '',
    audience: '',
    valueProp: '',
    tone: OFFER_COPY_TONES[0],
  })
  const [result, setResult] = useState<z.infer<typeof OfferCopyResponseSchema> | null>(null)
  const [submitError, setSubmitError] = useState<ErrorState>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [history, setHistory] = useState<HistoryItem[]>([])
  const [historyError, setHistoryError] = useState<ErrorState>(null)
  const [historyRequestId, setHistoryRequestId] = useState<string | null>(null)
  const [isLoadingHistory, setIsLoadingHistory] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const historyUrl = useMemo(() => '/api/history?limit=12&offset=0', [])

  const loadHistory = useCallback(async () => {
    setIsLoadingHistory(true)
    setHistoryError(null)

    let body: unknown = null
    try {
      const response = await fetch(historyUrl, {
        method: 'GET',
        cache: 'no-store',
      })

      try {
        body = await response.json()
      } catch {
        body = null
      }

      if (!response.ok) {
        const parsedError = ApiErrorSchema.safeParse(body)
        if (parsedError.success) {
          setHistoryError({
            message: parsedError.data.message,
            requestId: parsedError.data.requestId,
          })
        } else {
          setHistoryError({ message: '加载历史失败，请稍后再试。' })
        }
        setHistory([])
        return
      }

      const parsedResponse = HistoryResponseSchema.safeParse(body)
      if (!parsedResponse.success) {
        setHistoryError({ message: '历史数据格式错误。' })
        setHistory([])
        return
      }

      setHistory(parsedResponse.data.items)
      setHistoryRequestId(parsedResponse.data.requestId)
    } catch {
      setHistoryError({ message: '加载历史失败，请检查网络连接。' })
      setHistory([])
    } finally {
      setIsLoadingHistory(false)
    }
  }, [historyUrl])

  useEffect(() => {
    void loadHistory()
  }, [loadHistory])

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitError(null)

    const parsedInput = OfferCopySchema.safeParse(form)
    if (!parsedInput.success) {
      setSubmitError({ message: '请完整填写输入项，并确保每项至少 2 个字符。' })
      return
    }

    setIsSubmitting(true)
    let body: unknown = null

    try {
      const response = await fetch('/api/ai/offer-copy', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(parsedInput.data),
      })

      try {
        body = await response.json()
      } catch {
        body = null
      }

      if (!response.ok) {
        const parsedError = ApiErrorSchema.safeParse(body)
        if (parsedError.success) {
          setSubmitError({
            message: parsedError.data.message,
            requestId: parsedError.data.requestId,
          })
        } else {
          setSubmitError({ message: '生成失败，请稍后重试。' })
        }
        return
      }

      const parsedResponse = OfferCopyResponseSchema.safeParse(body)
      if (!parsedResponse.success) {
        setSubmitError({ message: '生成结果格式错误。' })
        return
      }

      setResult(parsedResponse.data)
      await loadHistory()
    } catch {
      setSubmitError({ message: '生成失败，请检查网络连接。' })
    } finally {
      setIsSubmitting(false)
    }
  }

  async function onDelete(id: string) {
    setDeletingId(id)
    setHistoryError(null)

    let body: unknown = null
    try {
      const response = await fetch(`/api/history/${id}`, {
        method: 'DELETE',
      })

      try {
        body = await response.json()
      } catch {
        body = null
      }

      if (!response.ok) {
        const parsedError = ApiErrorSchema.safeParse(body)
        if (parsedError.success) {
          setHistoryError({
            message: parsedError.data.message,
            requestId: parsedError.data.requestId,
          })
        } else {
          setHistoryError({ message: '删除失败，请稍后再试。' })
        }
        return
      }

      setHistory((current) => current.filter((item) => item.id !== id))
    } catch {
      setHistoryError({ message: '删除失败，请检查网络连接。' })
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <section className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
        <h2 className="text-xl font-semibold">Offer Copy 生成</h2>
        <p className="mt-2 text-sm text-zinc-300">每次生成将消耗 1 点积分，失败会自动回滚。</p>

        <form className="mt-5 space-y-4" onSubmit={onSubmit}>
          <label className="flex flex-col gap-1 text-sm text-zinc-200">
            产品
            <input
              className="rounded-lg border border-zinc-700 bg-zinc-950/80 px-3 py-2 text-zinc-100 outline-none transition focus:border-emerald-500"
              name="product"
              onChange={(event) => setForm((current) => ({ ...current, product: event.target.value }))}
              placeholder="例如：Nova LaunchKit"
              value={form.product}
            />
          </label>

          <label className="flex flex-col gap-1 text-sm text-zinc-200">
            目标受众
            <input
              className="rounded-lg border border-zinc-700 bg-zinc-950/80 px-3 py-2 text-zinc-100 outline-none transition focus:border-emerald-500"
              name="audience"
              onChange={(event) => setForm((current) => ({ ...current, audience: event.target.value }))}
              placeholder="例如：独立开发者"
              value={form.audience}
            />
          </label>

          <label className="flex flex-col gap-1 text-sm text-zinc-200">
            核心价值
            <textarea
              className="min-h-24 rounded-lg border border-zinc-700 bg-zinc-950/80 px-3 py-2 text-zinc-100 outline-none transition focus:border-emerald-500"
              name="valueProp"
              onChange={(event) => setForm((current) => ({ ...current, valueProp: event.target.value }))}
              placeholder="例如：一周内完成可上线的 SaaS MVP"
              value={form.valueProp}
            />
          </label>

          <label className="flex flex-col gap-1 text-sm text-zinc-200">
            语气
            <select
              className="rounded-lg border border-zinc-700 bg-zinc-950/80 px-3 py-2 text-zinc-100 outline-none transition focus:border-emerald-500"
              name="tone"
              onChange={(event) =>
                setForm((current) => ({ ...current, tone: event.target.value as OfferCopyInput['tone'] }))
              }
              value={form.tone}
            >
              {OFFER_COPY_TONES.map((tone) => (
                <option key={tone} value={tone}>
                  {tone}
                </option>
              ))}
            </select>
          </label>

          <button
            className="w-full rounded-lg bg-emerald-500 px-4 py-2 font-medium text-emerald-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:bg-emerald-800 disabled:text-zinc-300"
            disabled={isSubmitting}
            type="submit"
          >
            {isSubmitting ? '生成中...' : '生成 Offer Copy'}
          </button>
        </form>

        {submitError ? (
          <div className="mt-4 rounded-lg border border-red-500/50 bg-red-500/10 p-3 text-sm text-red-100">
            <p>{submitError.message}</p>
            {submitError.requestId ? <p className="mt-1 text-xs">requestId: {submitError.requestId}</p> : null}
          </div>
        ) : null}
      </section>

      <section className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
        <h2 className="text-xl font-semibold">生成结果</h2>

        {!result ? (
          <p className="mt-3 text-sm text-zinc-400">提交表单后将在此显示 headline、subheadline、bullets 和 CTA。</p>
        ) : (
          <article className="mt-4 space-y-4 rounded-xl border border-zinc-700 bg-zinc-950/70 p-4">
            <div className="text-xs text-zinc-400">requestId: {result.requestId}</div>
            <div>
              <p className="text-xs uppercase tracking-wider text-zinc-400">Headline</p>
              <p className="mt-1 text-lg font-semibold text-zinc-100">{result.output.headline}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-zinc-400">Subheadline</p>
              <p className="mt-1 text-zinc-200">{result.output.subheadline}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-zinc-400">Bullets</p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-zinc-200">
                {result.output.bullets.map((bullet, index) => (
                  <li key={`${bullet}-${index}`}>{bullet}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-zinc-400">CTA</p>
              <p className="mt-1 font-medium text-emerald-300">{result.output.cta}</p>
            </div>
          </article>
        )}
      </section>

      <section className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 lg:col-span-2">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl font-semibold">最近生成历史</h2>
          <button
            className="rounded-lg border border-zinc-700 px-3 py-1.5 text-sm text-zinc-200 transition hover:border-zinc-500 hover:bg-zinc-800"
            disabled={isLoadingHistory}
            onClick={() => void loadHistory()}
            type="button"
          >
            {isLoadingHistory ? '刷新中...' : '刷新'}
          </button>
        </div>

        {historyRequestId ? <p className="mt-2 text-xs text-zinc-400">requestId: {historyRequestId}</p> : null}

        {historyError ? (
          <div className="mt-4 rounded-lg border border-red-500/50 bg-red-500/10 p-3 text-sm text-red-100">
            <p>{historyError.message}</p>
            {historyError.requestId ? <p className="mt-1 text-xs">requestId: {historyError.requestId}</p> : null}
          </div>
        ) : null}

        {isLoadingHistory ? (
          <p className="mt-4 text-sm text-zinc-400">正在加载历史...</p>
        ) : history.length === 0 ? (
          <p className="mt-4 text-sm text-zinc-400">暂无历史记录。</p>
        ) : (
          <div className="mt-4 space-y-3">
            {history.map((item) => (
              <article
                className="flex flex-col gap-3 rounded-xl border border-zinc-800 bg-zinc-950/60 p-4 md:flex-row md:items-center md:justify-between"
                key={item.id}
              >
                <div>
                  <p className="text-sm text-zinc-200">{item.output?.headline || '（无可用标题）'}</p>
                  <p className="mt-1 text-xs text-zinc-400">{formatDate(item.created_at)}</p>
                </div>
                <button
                  className="rounded-lg border border-red-500/40 px-3 py-1.5 text-sm text-red-200 transition hover:border-red-400 hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-60"
                  disabled={deletingId === item.id}
                  onClick={() => void onDelete(item.id)}
                  type="button"
                >
                  {deletingId === item.id ? '删除中...' : '删除'}
                </button>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
