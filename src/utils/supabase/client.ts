import { createBrowserClient } from '@supabase/ssr'
import { clientEnv } from '@/lib/env'

let instance: ReturnType<typeof createBrowserClient> | null = null

export function createClient() {
  if (instance) return instance
  instance = createBrowserClient(clientEnv.supabaseUrl, clientEnv.supabaseAnonKey)
  return instance
}
