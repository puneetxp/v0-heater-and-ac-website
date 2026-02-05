import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export async function checkAdminAccess() {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/admin/login")
  }

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

  if (profile?.role !== "admin") {
    redirect("/admin/login")
  }

  return { user, profile }
}
