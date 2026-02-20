import { createBrowserClient as createBrowserClientBase } from "@supabase/ssr"
import type { SupabaseClient } from "@supabase/supabase-js"

let client: SupabaseClient | undefined | null = null

export function createBrowserClient() {
  // Return null if already checked and failed
  if (client === null) {
    return null
  }

  if (client) {
    return client
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // Return null if environment variables are not set
  if (!url || !key) {
    console.warn("[v0] Supabase environment variables are not configured")
    client = null
    return null
  }

  try {
    client = createBrowserClientBase(url, key) as SupabaseClient
    return client
  } catch (error) {
    console.warn("[v0] Failed to initialize Supabase client:", error)
    client = null
    return null
  }
}

export const createClient = createBrowserClient
