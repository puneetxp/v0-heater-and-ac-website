"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check for localStorage admin session first (client-side)
        const adminSession = localStorage.getItem("admin_session")
        if (adminSession) {
          try {
            const session = JSON.parse(adminSession)
            if (session.id === "static-admin" && session.role === "admin") {
              console.log("[v0] Auth verified via localStorage")
              setIsAuthenticated(true)
              setIsLoading(false)
              return
            }
          } catch (e) {
            console.error("[v0] Failed to parse admin session:", e)
            localStorage.removeItem("admin_session")
          }
        }

        // Check for server-side cookie via API
        const response = await fetch("/api/auth/check-admin", {
          method: "GET",
          credentials: "include", // Ensure cookies are sent
        })

        if (response.ok) {
          const data = await response.json()
          if (data.authenticated) {
            console.log("[v0] Auth verified via server cookie")
            setIsAuthenticated(true)
          } else {
            console.log("[v0] Server auth check failed: not authenticated")
            router.push("/admin/login")
          }
        } else {
          console.log("[v0] Server auth check failed: status", response.status)
          router.push("/admin/login")
        }
      } catch (error) {
        console.error("[v0] Auth check failed:", error)
        router.push("/admin/login")
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [router])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-muted-foreground">Loading...</div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return <>{children}</>
}
