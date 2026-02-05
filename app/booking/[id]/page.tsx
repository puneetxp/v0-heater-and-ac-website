import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { BookingForm } from "@/components/booking-form"
import { Header } from "@/components/header"

export default async function BookingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  // Get product details
  const { data: product, error: productError } = await supabase.from("products").select("*").eq("id", id).single()

  if (productError || !product) {
    redirect("/")
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
