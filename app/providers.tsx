"use client"

import type React from "react"
import { createContext, useContext, useMemo } from "react"
import { createBrowserClient } from "@/lib/supabase/client"

const SupabaseContext = createContext<ReturnType<typeof createBrowserClient> | null>(null)

export function SupabaseProvider({ children }: { children: React.ReactNode }) {
  const supabase = useMemo(() => {
    try {
      return createBrowserClient()
    } catch (error) {
      console.warn("[v0] Supabase provider initialization failed:", error)
      return null
    }
  }, [])

  return <SupabaseContext.Provider value={supabase}>{children}</SupabaseContext.Provider>
}

export function useSupabase() {
  const context = useContext(SupabaseContext)
  return context
}
