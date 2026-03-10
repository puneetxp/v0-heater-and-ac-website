import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { BookingForm } from "@/components/booking-form"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { AlertCircle, Home } from "lucide-react"

export default async function BookingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  // Get product details
  const { data: product, error: productError } = await supabase.from("products").select("*").eq("id", id).single()

  if (productError || !product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50">
        <Header />
        <main className="container mx-auto max-w-2xl px-4 py-12 md:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center rounded-lg border-2 border-red-200 bg-red-50 p-8 text-center">
            <AlertCircle className="h-12 w-12 text-red-600 mb-4" />
            <h1 className="text-2xl font-bold text-red-900 mb-2">Product Not Found</h1>
            <p className="text-red-700 mb-6">
              The product you're trying to book (ID: {id}) doesn't exist or has been removed.
            </p>
            <Link href="/">
              <Button className="gap-2">
                <Home className="h-4 w-4" />
                Return to Home
              </Button>
            </Link>
          </div>
        </main>
      </div>
    )
  }

  // Check if user is logged in
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Get user profile if logged in
  let profile = null
  if (user) {
    const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single()
    profile = data
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50">
      <Header />
      <main className="container mx-auto max-w-5xl px-4 py-12 md:px-6 lg:px-8">
        <BookingForm product={product} user={user} profile={profile} />
      </main>
    </div>
  )
}
