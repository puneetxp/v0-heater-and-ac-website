import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")
  const origin = requestUrl.origin

  if (code) {
    const supabase = await createClient()
    const { data: { session } } = await supabase.auth.exchangeCodeForSession(code)

    if (session?.user) {
      // Check if user has an active subscription/booking before redirecting to dashboard
      const { data: activeBookings } = await supabase
        .from("bookings")
        .select("id")
        .eq("user_id", session.user.id)
        .in("status", ["pending", "subscribed", "active"])
        .limit(1);

      if (activeBookings && activeBookings.length > 0) {
        return NextResponse.redirect(`${origin}/dashboard`)
      }
    }
  }

  return NextResponse.redirect(`${origin}/`)
}
