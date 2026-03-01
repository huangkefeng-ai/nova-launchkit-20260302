import { createClient } from '@supabase/supabase-js'
import { clientEnv, requiredEnv } from '@/lib/env'

export function createServiceRoleSupabase() {
  const serviceRoleKey = requiredEnv('SUPABASE_SERVICE_ROLE_KEY', process.env.SUPABASE_SERVICE_ROLE_KEY)
  return createClient(clientEnv.supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
}
