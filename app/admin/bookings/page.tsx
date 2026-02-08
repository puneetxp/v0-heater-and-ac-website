import { checkAdminAccess } from "@/lib/check-admin"
import { createServerClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Phone, Mail } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function AdminBookingsPage() {
  await checkAdminAccess()
  const supabase = await createServerClient()

  const { data: bookings } = await supabase
    .from("bookings")
    .select("*, profiles(full_name, email, phone), products(name, category)")
    .order("created_at", { ascending: false })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-700"
      case "pending":
        return "bg-yellow-100 text-yellow-700"
      case "completed":
        return "bg-blue-100 text-blue-700"
      case "cancelled":
        return "bg-red-100 text-red-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Bookings Management</h1>
          <p className="text-slate-600 mt-1">View and manage all customer bookings</p>
        </div>
      </div>

      <div className="space-y-4">
        {bookings?.map((booking) => (
          <Card key={booking.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg">{booking.profiles?.full_name || "Unknown Customer"}</CardTitle>
                  <div className="flex items-center gap-4 text-sm text-slate-600">
                    <span className="flex items-center gap-1">
                      <Mail className="h-4 w-4" />
                      {booking.profiles?.email}
                    </span>
                    {booking.profiles?.phone && (
                      <span className="flex items-center gap-1">
                        <Phone className="h-4 w-4" />
                        {booking.profiles.phone}
                      </span>
                    )}
                  </div>
                </div>
                <Badge className={getStatusColor(booking.status)}>{booking.status}</Badge>
              </div>
            </CardHeader>

            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div>
                  <p className="text-sm text-slate-600 mb-1">Product</p>
                  <p className="font-semibold text-slate-900">{booking.products?.name}</p>
                  <p className="text-xs text-slate-500 capitalize">{booking.products?.category.replace("_", " ")}</p>
                </div>

                <div>
                  <p className="text-sm text-slate-600 mb-1">Duration</p>
                  <p className="font-semibold text-slate-900">{booking.rental_months} months</p>
                  <p className="text-xs text-slate-500">
                    {new Date(booking.start_date).toLocaleDateString()} -{" "}
                    {new Date(booking.end_date).toLocaleDateString()}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-slate-600 mb-1">Total Amount</p>
                  <p className="text-2xl font-bold text-slate-900">₹{booking.total_amount}</p>
                  <p className="text-xs text-slate-500">incl. GST</p>
                </div>

                <div>
                  <p className="text-sm text-slate-600 mb-1 flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    Delivery Address
                  </p>
                  <p className="text-sm text-slate-700">{booking.delivery_address}</p>
                </div>
              </div>

              <div className="flex gap-2 mt-6">
                <Button size="sm" variant="outline">
                  View Details
                </Button>
                <Button size="sm" variant="outline">
                  Update Status
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {(!bookings || bookings.length === 0) && (
          <Card>
            <CardContent className="py-12 text-center text-slate-500">No bookings found</CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
