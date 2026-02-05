"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, Package, Calendar, Receipt, Users, Settings, LogOut, Shield, Tags } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useSupabaseClient } from "@/lib/hooks/use-supabase"
import { useRouter } from "next/navigation"

const navItems = [
  {
    title: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Products",
    href: "/admin/products",
    icon: Package,
  },
  {
    title: "Seasonal Plans",
    href: "/admin/plans",
    icon: Tags,
  },
  {
    title: "Bookings",
    href: "/admin/bookings",
    icon: Calendar,
  },
  {
    title: "Invoices",
    href: "/admin/invoices",
    icon: Receipt,
  },
  {
    title: "Users",
    href: "/admin/users",
    icon: Users,
  },
  {
    title: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
]

export function AdminSidebar() {
  const supabase = useSupabaseClient()
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/admin/login")
  }

  return (
    <div className="w-64 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 border-r border-slate-700 flex flex-col shadow-xl">
      {/* Logo Section */}
      <div className="h-16 flex items-center px-6 border-b border-slate-700">
        <div className="flex items-center gap-3 w-full">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
            <Shield className="h-5 w-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="font-bold text-white text-sm">Admin Portal</h1>
            <p className="text-xs text-slate-400">ComfortRent</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg"
                  : "text-slate-300 hover:bg-slate-700 hover:text-white hover:shadow-md",
              )}
            >
              <Icon className={cn("h-5 w-5 transition-transform", isActive && "scale-110")} />
              {item.title}
              {isActive && <div className="ml-auto w-1 h-5 bg-white rounded-full" />}
            </Link>
          )
        })}
      </nav>

      {/* Logout Section */}
      <div className="p-4 border-t border-slate-700 bg-slate-800/50">
        <button
          onClick={handleLogout}
          className="flex w-full items-center justify-start gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-300 transition-all duration-200 hover:bg-red-600/10 hover:text-red-400 hover:shadow-md"
        >
          <LogOut className="h-5 w-5" />
          Logout
        </button>
      </div>
    </div>
  )
}
