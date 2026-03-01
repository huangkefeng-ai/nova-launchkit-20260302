'use client'

import Link from 'next/link'
import { useMemo, useState, type FormEvent } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'

type AuthMode = 'sign-in' | 'sign-up'

type AuthFormProps = {
  mode: AuthMode
}

const copyByMode: Record<AuthMode, { title: string; subtitle: string; submitLabel: string; altHref: string; altText: string; altLinkLabel: string }> = {
  'sign-in': {
    title: 'Sign in',
    subtitle: 'Access your AI Offer Copy Studio workspace.',
    submitLabel: 'Sign in',
    altHref: '/sign-up',
    altText: 'Need an account?',
    altLinkLabel: 'Create one',
  },
  'sign-up': {
    title: 'Create account',
    subtitle: 'Start using AI Offer Copy Studio in minutes.',
    submitLabel: 'Sign up',
    altHref: '/sign-in',
    altText: 'Already have an account?',
    altLinkLabel: 'Sign in',
  },
}

function getSafeNextPath(rawValue: string | null) {
  if (!rawValue) return '/dashboard'
  if (!rawValue.startsWith('/')) return '/dashboard'
  if (rawValue.startsWith('//')) return '/dashboard'
  return rawValue
}

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const nextPath = useMemo(() => getSafeNextPath(searchParams.get('next')), [searchParams])
  const copy = copyByMode[mode]

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [info, setInfo] = useState<string | null>(null)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSubmitting(true)
    setError(null)
    setInfo(null)

    const supabase = createClient()

    try {
      if (mode === 'sign-in') {
        const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })
        if (signInError) throw signInError
        router.replace(nextPath)
        router.refresh()
        return
      }

      const { data, error: signUpError } = await supabase.auth.signUp({ email, password })
      if (signUpError) throw signUpError

      if (data.session) {
        router.replace(nextPath)
        router.refresh()
        return
      }

      setInfo('Account created. Check your email for a confirmation link, then sign in.')
    } catch (submitError) {
      const message = submitError instanceof Error ? submitError.message : 'Unable to authenticate right now.'
      setError(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 shadow-xl shadow-zinc-950/20">
      <h1 className="text-2xl font-semibold tracking-tight text-zinc-50">{copy.title}</h1>
      <p className="mt-1 text-sm text-zinc-300">{copy.subtitle}</p>

      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-zinc-200">Email</span>
          <input
            className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-zinc-100 outline-none ring-emerald-500/70 transition focus:ring-2"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-sm font-medium text-zinc-200">Password</span>
          <input
            className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-zinc-100 outline-none ring-emerald-500/70 transition focus:ring-2"
            type="password"
            autoComplete={mode === 'sign-in' ? 'current-password' : 'new-password'}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            minLength={8}
            required
          />
        </label>

        {error && (
          <p className="rounded-lg border border-rose-700/70 bg-rose-950/30 px-3 py-2 text-sm text-rose-200">
            {error}
          </p>
        )}

        {info && (
          <p className="rounded-lg border border-emerald-700/70 bg-emerald-950/20 px-3 py-2 text-sm text-emerald-200">
            {info}
          </p>
        )}

        <button
          className="w-full rounded-lg bg-emerald-500 px-4 py-2.5 font-medium text-zinc-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:bg-emerald-700"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Please wait...' : copy.submitLabel}
        </button>
      </form>

      <p className="mt-4 text-sm text-zinc-300">
        {copy.altText}{' '}
        <Link className="font-medium text-emerald-400 hover:text-emerald-300" href={copy.altHref}>
          {copy.altLinkLabel}
        </Link>
      </p>
    </section>
  )
}
