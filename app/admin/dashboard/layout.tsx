import type React from "react"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { AdminHeader } from "@/components/admin/admin-header"
import { AdminAuthProvider } from "@/components/admin-auth-provider"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminAuthProvider>
      <div className="flex h-screen overflow-hidden bg-slate-50">
        <AdminSidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <AdminHeader />
          <main className="flex-1 overflow-y-auto p-6 md:p-8">{children}</main>
        </div>
      </div>
    </AdminAuthProvider>
  )
}
