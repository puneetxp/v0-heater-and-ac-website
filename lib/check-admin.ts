import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { cookies } from "next/headers"

export async function checkAdminAccess() {
  const supabase = await createServerClient()
  const cookieStore = await cookies()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Check if this is a Supabase authenticated user
  if (user) {
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

    if (profile?.role === "admin") {
      return { user, profile }
    }
  }

  // Check for static admin session in cookies
  const adminSessionCookie = cookieStore.get("admin_session")
  if (adminSessionCookie) {
    try {
      const session = JSON.parse(adminSessionCookie.value)
      if (session.id === "static-admin" && session.role === "admin") {
        return {
          user: { id: "static-admin", email: session.email },
          profile: { role: "admin" },
        }
      }
    } catch (e) {
      console.error("[v0] Failed to parse admin session:", e)
    }
  }

  // Not authorized
  redirect("/admin/login")
}
