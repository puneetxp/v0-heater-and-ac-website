import { createBrowserClient as createBrowserClientBase } from "@supabase/ssr"
import type { SupabaseClient } from "@supabase/supabase-js"

let client: SupabaseClient | undefined | null = undefined

export function createBrowserClient() {
  // Return cached client if it already exists
  if (client !== undefined) {
    return client
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // Return null if environment variables are not set
  if (!url || !key) {
    console.warn("[v0] Supabase environment variables are not configured")
    console.warn("[v0] NEXT_PUBLIC_SUPABASE_URL:", url ? "set" : "missing")
    console.warn("[v0] NEXT_PUBLIC_SUPABASE_ANON_KEY:", key ? "set" : "missing")
    client = null
    return null
  }

  try {
    console.log("[v0] Initializing Supabase client with URL:", url.substring(0, 20) + "...")
    client = createBrowserClientBase(url, key) as SupabaseClient
    console.log("[v0] Supabase client initialized successfully")
    return client
  } catch (error) {
    console.error("[v0] Failed to initialize Supabase client:", error)
    client = null
    return null
  }
}

export const createClient = createBrowserClient
