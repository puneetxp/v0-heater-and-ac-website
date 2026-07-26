import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Calendar, 
  RefreshCw, 
  FileText, 
  TrendingUp, 
  ShoppingBag, 
  ArrowRight, 
  Truck, 
  CheckCircle2, 
  ChevronRight, 
  Wind, 
  Zap, 
  Heart,
  Clock,
  MapPin,
  CreditCard,
  User,
  ExternalLink,
  Package,
  Wrench
} from "lucide-react"
import Link from "next/link"

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  // Fetch customer profile details
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single()

  // Fetch dashboard stats
  const { data: bookings } = await supabase
    .from("bookings")
    .select("*, products(*)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  const { data: subscriptions } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", user.id)

  const { data: invoices } = await supabase
    .from("invoices")
    .select("*")
    .eq("user_id", user.id)
    .order("invoice_date", { ascending: false })

  // Fetch trending products for "Quick Rent" recommendations
  const { data: trendingProducts } = await supabase
    .from("products")
    .select("*")
    .eq("is_available", true)
    .limit(3)

  const activeBookings = bookings?.filter((b) => b.status === "active" || b.status === "confirmed").length || 0
  const activeSubscriptions = subscriptions?.filter((s) => s.status === "active").length || 0
  const pendingInvoices = invoices?.filter((i) => i.status === "pending").length || 0
  const totalSpent =
    invoices?.filter((i) => i.status === "paid").reduce((sum, i) => sum + Number.parseFloat(i.total_amount), 0) || 0

  const stats = [
    {
      title: "Active Rentals",
      value: activeBookings,
      description: "Appliances currently in use",
      icon: Package,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/20",
    },
    {
      title: "Recurring Subscriptions",
      value: activeSubscriptions,
      description: "Active billing plans",
      icon: RefreshCw,
      color: "text-teal-500",
      bgColor: "bg-teal-500/10",
      borderColor: "border-teal-500/20",
    },
    {
      title: "Pending Invoices",
      value: pendingInvoices,
      description: "Awaiting your payment",
      icon: Clock,
      color: "text-amber-500",
      bgColor: "bg-amber-500/10",
      borderColor: "border-amber-500/20",
    },
    {
      title: "Total Account Spent",
      value: `₹${totalSpent.toLocaleString("en-IN")}`,
      description: "Lifetime rental transactions",
      icon: CreditCard,
      color: "text-indigo-500",
      bgColor: "bg-indigo-500/10",
      borderColor: "border-indigo-500/20",
    },
  ]

  // Helper function to render a premium order tracking progress timeline
  const getBookingStatusStep = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return 1
      case "confirmed":
        return 2
      case "delivered":
      case "active":
        return 3
      default:
        return 3
    }
  }

  return (
    <div className="space-y-10 max-w-7xl mx-auto px-1 sm:px-2">
      {/* 🚀 1. VIP Welcome Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 text-white shadow-2xl p-6 sm:p-8">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/40 via-cyan-900/10 to-transparent pointer-events-none" />
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none hidden md:block">
          <Wind className="w-40 h-40 text-blue-400 animate-pulse" />
        </div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2.5">
              <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-black border-0 text-[10px] tracking-wider uppercase px-2.5 py-1">
                Active Member
              </Badge>
              <Badge className="bg-slate-800 border-slate-700 text-cyan-400 font-extrabold text-[10px] tracking-wider uppercase px-2.5 py-1">
                VIP RENTER
              </Badge>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
              Hello, {profile?.full_name || user.email?.split("@")[0] || "Valued Customer"}!
            </h1>
            <p className="text-slate-400 text-sm max-w-xl font-medium leading-relaxed">
              Welcome to your ACRentService hub. Manage active bookings, track deliveries, download tax invoices, and browse our seasonal products catalogs effortlessly.
            </p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            <Link href="/#products">
              <Button className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-extrabold rounded-xl shadow-lg shadow-blue-500/20 hover:shadow-cyan-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all border-0 gap-2 px-5 py-6 text-sm">
                <ShoppingBag className="w-4.5 h-4.5" />
                Browse Catalog
              </Button>
            </Link>
            <Link href="/dashboard/bookings">
              <Button variant="outline" className="bg-transparent border-slate-700 text-slate-200 font-bold hover:bg-slate-800 rounded-xl gap-2 px-5 py-6 text-sm">
                View My Rentals
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* 📊 2. Premium Analytics Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card 
              key={stat.title} 
              className={`relative overflow-hidden bg-white/70 backdrop-blur-md border ${stat.borderColor} shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 rounded-2xl`}
            >
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <CardTitle className="text-xs font-bold text-slate-400 uppercase tracking-widest">{stat.title}</CardTitle>
                <div className={`rounded-xl p-2.5 ${stat.bgColor}`}>
                  <Icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent className="space-y-1.5">
                <div className="text-3xl font-black text-slate-900 tracking-tight">{stat.value}</div>
                <p className="text-xs font-semibold text-slate-500">{stat.description}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* 📦 3. Visual Rental Tracking (Order Timelines) */}
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">Active & Pending Rentals</h3>
              <p className="text-sm text-slate-500 font-medium">Real-time delivery and installation progress</p>
            </div>
            <Link href="/dashboard/bookings">
              <Button variant="ghost" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 font-bold text-sm gap-1 px-3 py-1.5">
                Manage Bookings
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          {bookings && bookings.length > 0 ? (
            <div className="space-y-6">
              {bookings.slice(0, 3).map((booking) => {
                const step = getBookingStatusStep(booking.status)
                const productImg = booking.products?.image_url || "/heavy-duty-split-air-conditioner-unit.jpg"
                
                return (
                  <Card key={booking.id} className="bg-white border border-slate-100 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden">
                    <div className="p-6">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-50 pb-5 mb-5">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 rounded-xl border border-slate-100 overflow-hidden bg-slate-50 relative shrink-0">
                            <img 
                              src={productImg} 
                              alt={booking.products?.name || "Product"} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase">RENTAL ITEM</span>
                            <h4 className="font-extrabold text-slate-900 text-base">{booking.products?.name || "Premium Appliance"}</h4>
                            <p className="text-xs text-slate-500 font-medium">
                              Qty: {booking.quantity} • {booking.rental_type === "seasonal" ? "Seasonal Package" : "Custom Term"}
                            </p>
                          </div>
                        </div>

                        <div className="text-left sm:text-right">
                          <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase block mb-1">TOTAL AMOUNT</span>
                          <p className="text-base font-black text-slate-950">₹{Number(booking.total_amount).toLocaleString("en-IN")}</p>
                          <Badge 
                            className={`mt-1 font-bold text-[10px] tracking-wider border-0 uppercase px-2.5 py-0.5 ${
                              booking.status === "active"
                                ? "bg-emerald-500/10 text-emerald-600"
                                : booking.status === "confirmed"
                                  ? "bg-blue-500/10 text-blue-600"
                                  : "bg-amber-500/10 text-amber-600"
                            }`}
                          >
                            {booking.status}
                          </Badge>
                        </div>
                      </div>

                      {/* Visual Progress Steps Tracker */}
                      <div className="space-y-4">
                        <div className="flex items-center justify-between text-xs font-bold text-slate-400 px-1">
                          <span className={step >= 1 ? "text-slate-900" : ""}>Order Sent</span>
                          <span className={step >= 2 ? "text-slate-900" : ""}>Dispatch Prep</span>
                          <span className={step >= 3 ? "text-slate-900" : ""}>Installed & Active</span>
                        </div>
                        
                        <div className="relative h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full transition-all duration-500"
                            style={{ width: `${step === 1 ? 15 : step === 2 ? 50 : 100}%` }}
                          />
                        </div>

                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs font-semibold text-slate-500 pt-1">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                            <span>
                              Rental Period: {new Date(booking.start_date).toLocaleDateString("en-IN", { day: 'numeric', month: 'short' })} - {new Date(booking.end_date).toLocaleDateString("en-IN", { day: 'numeric', month: 'short', year: 'numeric' })}
                            </span>
                          </div>
                          
                          <Link href={`/booking/${booking.product_id}`}>
                            <Button variant="link" className="p-0 text-blue-600 font-bold hover:text-blue-700 h-auto gap-0.5">
                              View Rental Details
                              <ChevronRight className="w-3.5 h-3.5" />
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </Card>
                )
              })}
            </div>
          ) : (
            <Card className="border border-dashed border-slate-200 bg-slate-50/50 rounded-2xl p-10 text-center">
              <Package className="h-10 w-10 text-slate-400 mx-auto mb-3" />
              <p className="text-slate-900 font-extrabold text-base mb-1">No active rentals found</p>
              <p className="text-slate-500 text-xs max-w-sm mx-auto mb-5 font-medium leading-relaxed">
                Renting cooling and heating systems has never been easier. Pick a plan and enjoy worry-free installations.
              </p>
              <Link href="/#products">
                <Button size="sm" className="bg-primary hover:bg-primary/90 font-bold text-xs gap-1.5 px-4 rounded-xl shadow-md">
                  Rent Your First Unit
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </Link>
            </Card>
          )}
        </div>

        {/* 💳 4. Billing & Recent Transactions Card */}
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-black text-slate-900 tracking-tight">Recent Invoices</h3>
            <p className="text-sm text-slate-500 font-medium font-medium">Billing history and tax receipts</p>
          </div>

          <Card className="bg-white border border-slate-100 shadow-lg rounded-2xl overflow-hidden">
            <CardContent className="p-0">
              {invoices && invoices.length > 0 ? (
                <div className="divide-y divide-slate-100">
                  {invoices.slice(0, 5).map((invoice) => (
                    <div key={invoice.id} className="p-5 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-slate-400" />
                          <span className="font-extrabold text-slate-900 text-sm">{invoice.invoice_number}</span>
                        </div>
                        <p className="text-xs text-slate-500 font-medium">
                          Date: {new Date(invoice.invoice_date).toLocaleDateString("en-IN", { day: 'numeric', month: 'short', year: 'numeric' })}
                        </p>
                      </div>
                      
                      <div className="text-right space-y-1.5">
                        <p className="font-black text-slate-950 text-sm">₹{Number(invoice.total_amount).toLocaleString("en-IN")}</p>
                        <Badge 
                          className={`font-extrabold text-[9px] tracking-wider border-0 uppercase px-2 py-0.5 ${
                            invoice.status === "paid"
                              ? "bg-emerald-500/10 text-emerald-600"
                              : invoice.status === "pending"
                                ? "bg-amber-500/10 text-amber-600"
                                : "bg-rose-500/10 text-rose-600"
                          }`}
                        >
                          {invoice.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                  
                  <div className="p-4 bg-slate-50/50 border-t border-slate-100 text-center">
                    <Link href="/dashboard/invoices">
                      <Button variant="ghost" className="w-full text-slate-600 font-bold hover:text-slate-900 hover:bg-white text-xs gap-1">
                        View All Invoices
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Button>
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center text-slate-400">
                  <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-xs font-bold text-slate-500">No invoices generated yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 🚀 5. Premium Recommended Rentals Carousel / Quick Add */}
      {trendingProducts && trendingProducts.length > 0 && (
        <div className="space-y-6 pt-4">
          <div>
            <h3 className="text-xl font-black text-slate-900 tracking-tight">Need More Cooling or Heating?</h3>
            <p className="text-sm text-slate-500 font-medium">High-efficiency rentals, fully maintained with free installations</p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {trendingProducts.map((p) => (
              <Card key={p.id} className="group bg-white border border-slate-100 shadow-md hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden flex flex-col h-full">
                <div className="relative aspect-video overflow-hidden bg-slate-50 relative shrink-0">
                  <img 
                    src={p.image_url || "/heavy-duty-split-air-conditioner-unit.jpg"} 
                    alt={p.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3">
                    <Badge className="bg-slate-900/80 backdrop-blur-md text-white border-0 text-[10px] font-black uppercase px-2 py-0.5 tracking-wider">
                      {p.category.toUpperCase().replace(/_/g, " ")}
                    </Badge>
                  </div>
                </div>
                
                <CardContent className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-1.5">
                    <h4 className="font-extrabold text-slate-900 text-base">{p.name}</h4>
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed font-medium">{p.description}</p>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">RENTAL</span>
                      <p className="text-base font-black text-slate-950">₹{p.price_per_month}<span className="text-xs font-semibold text-slate-500">/mo</span></p>
                    </div>
                    
                    <Link href={`/booking/${p.id}`}>
                      <Button className="bg-slate-900 hover:bg-slate-800 text-white font-black text-xs px-3.5 py-4 rounded-xl gap-1 hover:gap-1.5 transition-all">
                        Rent Now
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
