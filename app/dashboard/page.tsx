import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, RefreshCw, FileText, TrendingUp } from "lucide-react"

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  // Fetch dashboard stats
  const { data: bookings } = await supabase.from("bookings").select("*").eq("user_id", user.id)

  const { data: subscriptions } = await supabase.from("subscriptions").select("*").eq("user_id", user.id)

  const { data: invoices } = await supabase.from("invoices").select("*").eq("user_id", user.id)

  const activeBookings = bookings?.filter((b) => b.status === "active" || b.status === "confirmed").length || 0
  const activeSubscriptions = subscriptions?.filter((s) => s.status === "active").length || 0
  const pendingInvoices = invoices?.filter((i) => i.status === "pending").length || 0
  const totalSpent =
    invoices?.filter((i) => i.status === "paid").reduce((sum, i) => sum + Number.parseFloat(i.total_amount), 0) || 0

  const stats = [
    {
      title: "Active Bookings",
      value: activeBookings,
      icon: Calendar,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Active Subscriptions",
      value: activeSubscriptions,
      icon: RefreshCw,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Pending Invoices",
      value: pendingInvoices,
      icon: FileText,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      title: "Total Spent",
      value: `₹${totalSpent.toFixed(2)}`,
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Welcome back!</h2>
        <p className="text-muted-foreground">Here's an overview of your rentals and account</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                <div className={cn("rounded-lg p-2", stat.bgColor)}>
                  <Icon className={cn("h-5 w-5", stat.color)} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            {bookings && bookings.length > 0 ? (
              <div className="space-y-4">
                {bookings.slice(0, 5).map((booking) => (
                  <div key={booking.id} className="flex items-center justify-between border-b pb-3 last:border-0">
                    <div>
                      <p className="font-medium">Booking #{booking.id.slice(0, 8)}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(booking.start_date).toLocaleDateString()} -{" "}
                        {new Date(booking.end_date).toLocaleDateString()}
                      </p>
                    </div>
                    <span
                      className={cn(
                        "rounded-full px-3 py-1 text-xs font-medium",
                        booking.status === "active"
                          ? "bg-green-100 text-green-700"
                          : booking.status === "confirmed"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-gray-100 text-gray-700",
                      )}
                    >
                      {booking.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">No bookings yet</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Invoices</CardTitle>
          </CardHeader>
          <CardContent>
            {invoices && invoices.length > 0 ? (
              <div className="space-y-4">
                {invoices.slice(0, 5).map((invoice) => (
                  <div key={invoice.id} className="flex items-center justify-between border-b pb-3 last:border-0">
                    <div>
                      <p className="font-medium">{invoice.invoice_number}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(invoice.invoice_date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">₹{Number.parseFloat(invoice.total_amount).toFixed(2)}</p>
                      <span
                        className={cn(
                          "text-xs",
                          invoice.status === "paid"
                            ? "text-green-600"
                            : invoice.status === "pending"
                              ? "text-orange-600"
                              : "text-red-600",
                        )}
                      >
                        {invoice.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">No invoices yet</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function cn(...classes: (string | undefined)[]) {
  return classes.filter(Boolean).join(" ")
}
