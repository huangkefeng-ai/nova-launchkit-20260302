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
    <main className="min-h-screen bg-zinc-950 px-6 py-10 text-zinc-100">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        <header className="flex flex-col gap-4 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-emerald-400">Dashboard</p>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight">AI Offer Copy Studio</h1>
            <p className="mt-2 text-zinc-300">
              Signed in as <span className="font-medium text-zinc-100">{session.user.email}</span>
            </p>
          </div>

          <form action={signOutAction}>
            <button
              className="rounded-lg border border-zinc-700 px-4 py-2 text-sm font-medium text-zinc-100 transition hover:border-zinc-500 hover:bg-zinc-800"
              type="submit"
            >
              Sign out
            </button>
          </form>
        </header>

        <OfferCopyDashboardPanel />
      </div>
    </main>
  )
}
