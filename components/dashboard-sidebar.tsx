"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Wind, Home, Calendar, RefreshCw, FileText, CreditCard, User, Settings, LogOut } from "lucide-react"
import { cn } from "@/lib/utils"
import { useSupabaseClient } from "@/lib/hooks/use-supabase"
import { useRouter } from "next/navigation"

const menuItems = [
  { href: "/dashboard", icon: Home, label: "Dashboard" },
  { href: "/dashboard/bookings", icon: Calendar, label: "My Bookings" },
  { href: "/dashboard/subscriptions", icon: RefreshCw, label: "Subscriptions" },
  { href: "/dashboard/invoices", icon: FileText, label: "Invoices" },
  { href: "/dashboard/payments", icon: CreditCard, label: "Payments" },
  { href: "/dashboard/profile", icon: User, label: "Profile" },
  { href: "/dashboard/settings", icon: Settings, label: "Settings" },
]

export function DashboardSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = useSupabaseClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/")
    router.refresh()
  }

  return (
    <aside className="fixed inset-y-0 left-0 z-50 hidden w-64 border-r border-slate-200 bg-gradient-to-b from-white via-slate-50 to-slate-100 lg:block">
      <div className="flex h-full flex-col">
        {/* Logo Section */}
        <div className="flex h-16 items-center gap-3 border-b border-slate-200 px-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-cyan-600 shadow-md">
            <Wind className="h-5 w-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-bold text-slate-900">ComfortRent</span>
            <span className="text-xs font-medium text-slate-500">User Dashboard</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-4">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md"
                    : "text-slate-700 hover:bg-white hover:text-slate-900 hover:shadow-sm",
                )}
              >
                <Icon className={cn("h-5 w-5 transition-transform", isActive && "scale-110")} />
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Logout Section */}
        <div className="border-t border-slate-200 bg-slate-50 p-4">
          <button
            onClick={handleSignOut}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-700 transition-all duration-200 hover:bg-red-50 hover:text-red-600 hover:shadow-sm"
          >
            <LogOut className="h-5 w-5" />
            Sign Out
          </button>
        </div>
      </div>
    </aside>
  )
}
