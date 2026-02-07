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
        // Check for localStorage admin session (works in preview)
        const adminSession = localStorage.getItem("admin_session")
        if (adminSession) {
          try {
            const session = JSON.parse(adminSession)
            if (session.id === "static-admin" && session.role === "admin") {
              setIsAuthenticated(true)
              setIsLoading(false)
              return
            }
          } catch (e) {
            console.error("[v0] Failed to parse admin session:", e)
          }
        }

        // Check for server-side cookie (try to fetch a protected endpoint)
        const response = await fetch("/api/auth/check-admin", {
          method: "GET",
        })

        if (response.ok) {
          setIsAuthenticated(true)
        } else {
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
