import { type NextRequest, NextResponse } from "next/server"

export function middleware(request: NextRequest) {
  // Check if accessing admin routes
  if (request.nextUrl.pathname.startsWith("/admin/dashboard")) {
    // Check for admin session cookie or auth
    const adminSession = request.cookies.get("admin_session")

    // If no session, check Supabase auth would happen in the checkAdminAccess function
    // This middleware just allows the request to proceed to the layout which will check
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"],
}
