"use client"

import type React from "react"
import { createContext, useContext, useMemo } from "react"
import { createBrowserClient } from "@/lib/supabase/client"

const SupabaseContext = createContext<ReturnType<typeof createBrowserClient> | null>(null)

export function SupabaseProvider({ children }: { children: React.ReactNode }) {
  const supabase = useMemo(() => {
    try {
      const client = createBrowserClient()
      if (client) {
        console.log("[v0] SupabaseProvider: Client available")
      } else {
        console.warn("[v0] SupabaseProvider: createBrowserClient returned null")
        console.warn("[v0] Check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in environment")
      }
      return client
    } catch (error) {
      console.error("[v0] SupabaseProvider initialization failed:", error)
      return null
    }
  }, [])

  return <SupabaseContext.Provider value={supabase}>{children}</SupabaseContext.Provider>
}

export function useSupabase() {
  const context = useContext(SupabaseContext)
  return context
}
