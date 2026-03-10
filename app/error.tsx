"use client"

import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { AlertTriangle, RotateCcw, Home } from "lucide-react"
import { useEffect } from "react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to console for debugging
    console.error("[v0] Error occurred:", error.message)
  }, [error])

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-teal-50">
      <Header />
      <main className="flex-1 container mx-auto max-w-2xl px-4 py-12 md:px-6 lg:px-8 flex items-center justify-center">
        <div className="w-full text-center">
          {/* Error Icon */}
          <div className="mb-8 flex justify-center">
            <div className="p-6 rounded-full bg-yellow-100">
              <AlertTriangle className="w-16 h-16 text-yellow-600" />
            </div>
          </div>

          {/* Error Content */}
          <div className="rounded-lg border-2 border-yellow-200 bg-yellow-50 p-8">
            <h1 className="text-3xl font-bold text-yellow-900 mb-3">Something went wrong</h1>
            <p className="text-yellow-700 text-lg mb-2">
              {error?.message || "An unexpected error occurred while loading this page."}
            </p>
            {error?.digest && (
              <p className="text-xs text-yellow-600 font-mono mt-4 bg-white/50 p-2 rounded">
                Error ID: {error.digest}
              </p>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Button onClick={reset} className="gap-2 bg-yellow-600 hover:bg-yellow-700">
                <RotateCcw className="h-4 w-4" />
                Try Again
              </Button>
              <Button asChild variant="outline" className="gap-2">
                <Link href="/">
                  <Home className="h-4 w-4" />
                  Return to Home
                </Link>
              </Button>
            </div>
          </div>

          {/* Help Text */}
          <div className="mt-12 text-center text-gray-600">
            <p className="mb-4">If the problem persists, please:</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center text-sm">
              <a href="/#contact" className="text-primary hover:underline font-medium">
                Contact Support
              </a>
              <Link href="/" className="text-primary hover:underline font-medium">
                Go to Homepage
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
