import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { createServerClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    
    // 1. Check for server-side static cookie
    const adminSession = cookieStore.get("admin_session")
    if (adminSession) {
      try {
        const session = JSON.parse(adminSession.value)
        if (session.id === "static-admin" && session.role === "admin") {
          return NextResponse.json({ authenticated: true })
        }
      } catch (e) {
        console.error("[v0] Failed to parse admin session cookie:", e)
      }
    }

    // 2. Check for Supabase session
    try {
      const supabase = await createServerClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single()

        if (profile?.role === "admin") {
          return NextResponse.json({ authenticated: true })
        }
      }
    } catch (supabaseError) {
      console.error("[v0] Supabase auth check failed in API:", supabaseError)
    }

    return NextResponse.json({ authenticated: false }, { status: 401 })
  } catch (error) {
    console.error("[v0] Global error in check-admin API:", error)
    return NextResponse.json({ error: "Auth check failed" }, { status: 500 })
  }
}
