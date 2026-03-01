import { Suspense } from 'react'
import { AuthForm } from '@/features/auth/components/auth-form'

export default function SignInPage() {
  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-16 text-zinc-100">
      <div className="mx-auto flex w-full max-w-5xl flex-col items-center justify-center gap-8 md:flex-row md:items-start">
        <div className="max-w-md space-y-3">
          <p className="text-sm uppercase tracking-[0.2em] text-emerald-400">Nova LaunchKit</p>
          <h2 className="text-3xl font-semibold tracking-tight">Authentication Foundation</h2>
          <p className="text-zinc-300">
            Phase-2 auth foundation is now wired with Supabase SSR and protected dashboard routing.
          </p>
        </div>

        <Suspense fallback={<div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 text-zinc-300">Loading form...</div>}>
          <AuthForm mode="sign-in" />
        </Suspense>
      </div>
    </main>
  )
}
