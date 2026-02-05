import { createBrowserClient as createBrowserClientBase } from "@supabase/ssr"
import type { SupabaseClient } from "@supabase/supabase-js"

let client: SupabaseClient | undefined

export function createBrowserClient() {
  if (client) {
    return client
  }

  client = createBrowserClientBase(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

  return client
}

export const createClient = createBrowserClient
