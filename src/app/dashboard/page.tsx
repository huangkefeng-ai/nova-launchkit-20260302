import { LogOut, ShieldCheck, Sparkles } from 'lucide-react'
import { redirect } from 'next/navigation'
import { OfferCopyDashboardPanel } from '@/features/offer-copy/components/offer-copy-dashboard-panel'
import { createServerSupabase } from '@/utils/supabase/server'

export default async function DashboardPage() {
  const supabase = await createServerSupabase()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect('/sign-in?next=/dashboard')
  }

  async function signOutAction() {
    'use server'

    const actionSupabase = await createServerSupabase()
    await actionSupabase.auth.signOut()
    redirect('/sign-in')
  }

  return (
    <main className="min-h-screen bg-zinc-950 px-4 py-8 text-zinc-100 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <header className="relative overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900/70 p-6 shadow-2xl shadow-zinc-950/35 sm:p-8">
          <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-cyan-500/15 blur-3xl" />

          <div className="relative flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs uppercase tracking-[0.24em] text-cyan-300">Nova LaunchKit · 控制台</p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">AI Offer Copy Studio</h1>
              <p className="mt-3 text-sm text-zinc-300 sm:text-base">
                当前登录账号：<span className="font-medium text-zinc-100">{session.user.email}</span>
              </p>
            </div>

            <form action={signOutAction}>
              <button
                className="inline-flex items-center gap-2 rounded-lg border border-zinc-700 px-4 py-2.5 text-sm font-medium text-zinc-100 transition hover:border-zinc-500 hover:bg-zinc-800"
                type="submit"
              >
                <LogOut className="h-4 w-4" />
                退出登录
              </button>
            </form>
          </div>

          <div className="relative mt-6 grid gap-3 sm:grid-cols-3">
            <StatusItem icon={ShieldCheck} label="会话状态" value="已安全连接" />
            <StatusItem icon={Sparkles} label="单次消耗" value="1 积分 / 生成" />
            <StatusItem icon={Sparkles} label="历史追踪" value="最近 12 条" />
          </div>
        </header>

        <OfferCopyDashboardPanel />
      </div>
    </main>
  )
}

function StatusItem({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Sparkles
  label: string
  value: string
}) {
  return (
    <div className="rounded-xl border border-zinc-800/90 bg-zinc-950/50 p-4">
      <p className="inline-flex items-center gap-2 text-xs text-zinc-400">
        <Icon className="h-3.5 w-3.5 text-emerald-300" />
        {label}
      </p>
      <p className="mt-1 text-sm font-medium text-zinc-100">{value}</p>
    </div>
  )
}
