import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { AlertCircle, Home } from "lucide-react"

export const metadata = {
  title: "Page Not Found - Heater & AC Rentals",
  description: "The page you're looking for doesn't exist.",
}

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-teal-50">
      <Header />
      <main className="flex-1 container mx-auto max-w-2xl px-4 py-12 md:px-6 lg:px-8 flex items-center justify-center">
        <div className="w-full text-center">
          {/* Error Icon */}
          <div className="mb-8 flex justify-center">
            <div className="p-6 rounded-full bg-red-100">
              <AlertCircle className="w-16 h-16 text-red-600" />
            </div>
          </div>

          {/* Error Content */}
          <div className="rounded-lg border-2 border-red-200 bg-red-50 p-8">
            <h1 className="text-4xl font-bold text-red-900 mb-3">404</h1>
            <h2 className="text-2xl font-semibold text-red-900 mb-4">Page Not Found</h2>
            <p className="text-red-700 text-lg mb-8">
              Sorry, the page you're looking for doesn't exist or has been moved.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild className="gap-2">
                <Link href="/">
                  <Home className="h-4 w-4" />
                  Return to Home
                </Link>
              </Button>
              <Button asChild variant="outline" className="gap-2">
                <Link href="/cooling">
                  Browse Products
                </Link>
              </Button>
            </div>
          </div>

          {/* Helpful Links */}
          <div className="mt-12 text-center text-gray-600">
            <p className="mb-4 text-sm">Looking for something specific?</p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center text-sm">
              <Link href="/cooling" className="text-primary hover:underline font-medium">
                Cooling Products
              </Link>
              <Link href="/heating" className="text-primary hover:underline font-medium">
                Heating Products
              </Link>
              <Link href="/#contact" className="text-primary hover:underline font-medium">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
