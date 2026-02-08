import { checkAdminAccess } from "@/lib/check-admin"
import { createServerClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, Users, Calendar, Package, TrendingUp, TrendingDown } from "lucide-react"

export default async function AdminDashboardPage() {
  await checkAdminAccess()
  const supabase = await createServerClient()

  // Fetch statistics
  const { count: totalUsers } = await supabase.from("profiles").select("*", { count: "exact", head: true })

  const { count: totalBookings } = await supabase.from("bookings").select("*", { count: "exact", head: true })

  const { count: activeBookings } = await supabase
    .from("bookings")
    .select("*", { count: "exact", head: true })
    .eq("status", "active")

  const { count: totalProducts } = await supabase.from("products").select("*", { count: "exact", head: true })

  const { data: recentBookings } = await supabase
    .from("bookings")
    .select("*, profiles(full_name, email)")
    .order("created_at", { ascending: false })
    .limit(5)

  const stats = [
    {
      title: "Total Revenue",
      value: "₹1,24,500",
      change: "+12.5%",
      trend: "up" as const,
      icon: DollarSign,
      color: "from-green-500 to-emerald-500",
    },
    {
      title: "Total Users",
      value: totalUsers?.toString() || "0",
      change: "+5.2%",
      trend: "up" as const,
      icon: Users,
      color: "from-blue-500 to-cyan-500",
    },
    {
      title: "Active Bookings",
      value: activeBookings?.toString() || "0",
      change: "+8.1%",
      trend: "up" as const,
      icon: Calendar,
      color: "from-orange-500 to-amber-500",
    },
    {
      title: "Total Products",
      value: totalProducts?.toString() || "0",
      change: "0%",
      trend: "neutral" as const,
      icon: Package,
      color: "from-purple-500 to-pink-500",
    },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Dashboard Overview</h1>
        <p className="text-slate-600 mt-1">Welcome back! Here's what's happening with your rental business.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          const TrendIcon = stat.trend === "up" ? TrendingUp : stat.trend === "down" ? TrendingDown : null

          return (
            <Card key={stat.title} className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">{stat.title}</CardTitle>
                <div className={`p-2.5 rounded-lg bg-gradient-to-br ${stat.color}`}>
                  <Icon className="h-4 w-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-slate-900">{stat.value}</div>
                {TrendIcon && (
                  <div className="flex items-center gap-1 mt-2 text-sm">
                    <TrendIcon className={`h-4 w-4 ${stat.trend === "up" ? "text-green-600" : "text-red-600"}`} />
                    <span className={stat.trend === "up" ? "text-green-600" : "text-red-600"}>{stat.change}</span>
                    <span className="text-slate-500">from last month</span>
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Recent Bookings */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Bookings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentBookings?.map((booking) => (
              <div key={booking.id} className="flex items-center justify-between p-4 rounded-lg bg-slate-50">
                <div>
                  <p className="font-medium text-slate-900">{booking.profiles?.full_name || "Unknown"}</p>
                  <p className="text-sm text-slate-500">{booking.profiles?.email}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-slate-900">₹{booking.total_amount}</p>
                  <p className="text-sm text-slate-500 capitalize">{booking.status}</p>
                </div>
              </div>
            ))}

            {(!recentBookings || recentBookings.length === 0) && (
              <p className="text-center text-slate-500 py-8">No bookings yet</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
