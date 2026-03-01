export function requiredEnv(name: string, value: string | undefined) {
  if (!value) throw new Error(`ENV_MISSING:${name}`)
  return value
}

export const clientEnv = {
  get supabaseUrl() {
    return requiredEnv('NEXT_PUBLIC_SUPABASE_URL', process.env.NEXT_PUBLIC_SUPABASE_URL)
  },
  get supabaseAnonKey() {
    return requiredEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
  },
}
