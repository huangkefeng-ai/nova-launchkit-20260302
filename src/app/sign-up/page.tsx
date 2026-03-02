import { Suspense } from 'react'
import { AuthForm } from '@/features/auth/components/auth-form'

export default function SignUpPage() {
  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-16 text-zinc-100">
      <div className="mx-auto flex w-full max-w-5xl flex-col items-center justify-center gap-8 md:flex-row md:items-start">
        <div className="max-w-md space-y-3">
          <p className="text-sm uppercase tracking-[0.2em] text-emerald-400">Nova LaunchKit</p>
          <h2 className="text-3xl font-semibold tracking-tight">创建你的 Nova 工作区</h2>
          <p className="text-zinc-300">注册后立即进入 Dashboard，开始使用 AI Offer Copy Studio。</p>
        </div>

        <Suspense
          fallback={<div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 text-zinc-300">表单加载中...</div>}
        >
          <AuthForm mode="sign-up" />
        </Suspense>
      </div>
    </main>
  )
}
