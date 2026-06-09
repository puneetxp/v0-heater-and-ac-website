import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, Snowflake, Sun, Calendar } from "lucide-react"
import { createServerClient } from "@/lib/supabase/server"
import { generateProductSlug } from "@/lib/utils"
import Link from "next/link"

interface SeasonalPlan {
  id: number
  name: string
  season: string
  description: string
  discount_percentage: number
  duration_months: number
  features: string[]
  valid_from: string
  valid_until: string
  base_price?: number
  start_month?: number
  end_month?: number
  products?: {
    id: string | number
    name: string
    category: string
    capacity: string
    image_url?: string
  } | null
}

export async function SeasonalPlans() {
  let plans: SeasonalPlan[] = []

  try {
    const supabase = await createServerClient()
    const { data } = await supabase
      .from("seasonal_plans")
      .select("*, products(*)")
      .eq("is_active", true)
      .order("duration_months", { ascending: true })

    if (data && data.length > 0) {
      // Show all active plans
      plans = data
    }
  } catch (error) {
    console.warn("[v0] Failed to fetch seasonal plans server-side:", error)
  }

  // Filter to only show summer and winter (remove year_round and end_season)
  const summerPlans = plans.filter((p) => p.season === "summer")
  const winterPlans = plans.filter((p) => p.season === "winter")

  const getSeasonIcon = (season: string) => {
    switch (season) {
      case "summer":
        return <Sun className="h-5 w-5" />
      case "winter":
        return <Snowflake className="h-5 w-5" />
      case "year_round":
        return <Calendar className="h-5 w-5" />
      default:
        return null
    }
  }

  const getSeasonColor = (season: string) => {
    switch (season) {
      case "summer":
        return "from-orange-500 to-amber-500"
      case "winter":
        return "from-blue-500 to-cyan-500"
      case "year_round":
        return "from-green-500 to-teal-500"
      case "end_season":
        return "from-purple-500 to-pink-500"
      default:
        return "from-gray-500 to-gray-600"
    }
  }

  const getQualityLevel = (plan: SeasonalPlan): "premium" | "excellent" | "great" => {
    const featureCount = plan.features?.length || 0
    const discountLevel = plan.discount_percentage || 0

    if (featureCount >= 6 && discountLevel >= 30) return "premium"
    if (featureCount >= 5 && discountLevel >= 25) return "excellent"
    return "great"
  }

  const getQualityBadge = (quality: string) => {
    switch (quality) {
      case "premium":
        return { color: "bg-gradient-to-r from-amber-500 to-yellow-500", label: "Premium Bundle" }
      case "excellent":
        return { color: "bg-gradient-to-r from-blue-500 to-cyan-500", label: "Excellent Value" }
      case "great":
        return { color: "bg-gradient-to-r from-green-500 to-emerald-500", label: "Great Deal" }
      default:
        return { color: "bg-gray-500", label: "Bundle" }
    }
  }

  const PlanCard = ({ plan }: { plan: SeasonalPlan }) => {
    const quality = getQualityLevel(plan)
    const qualityBadge = getQualityBadge(quality)

    return (
      <Card className="relative hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden group">
        {/* Gradient header bar */}
        <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${getSeasonColor(plan.season)}`} />

        {(plan.season === "end_season" || quality === "premium") && (
          <div className="absolute -top-3 w-full flex justify-center">
            {plan.season === "end_season" ? (
              <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg px-3 py-2.5 mt-2">
                Special Sale!
              </Badge>
            ) : (
              <Badge className={`${qualityBadge.color} text-white shadow-lg px-3 py-2.5 mt-2`}>
                {qualityBadge.label}
              </Badge>
            )}
          </div>
        )}

        <CardHeader className="space-y-4 pb-6">
          <div className="flex items-start justify-between">
            <div className={`p-2.5 rounded-xl bg-gradient-to-br ${getSeasonColor(plan.season)} text-white`}>
              {getSeasonIcon(plan.season)}
            </div>
            <div className="flex flex-col gap-2 items-end">
              {plan.discount_percentage > 0 && (
                <Badge className="bg-green-100 text-green-700 font-semibold text-xs px-2 py-1">
                  Save {plan.discount_percentage}%
                </Badge>
              )}
              {quality !== "premium" && plan.season !== "end_season" && (
                <Badge className={`${qualityBadge.color} text-white text-xs px-2 py-1`}>
                  {qualityBadge.label}
                </Badge>
              )}
            </div>
          </div>

          <div>
            <CardTitle className="text-xl font-bold mb-2">{plan.name}</CardTitle>
            <CardDescription className="text-sm">{plan.description}</CardDescription>
          </div>

          <div className="space-y-2 border-t pt-3">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-primary">₹{plan.base_price?.toLocaleString()}</span>
              <span className="text-muted-foreground font-medium">per month</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Duration: {plan.duration_months} month{plan.duration_months !== 1 ? "s" : ""}
            </p>
          </div>

          {plan.start_month && plan.end_month && (
            <p className="text-xs text-muted-foreground">
              Available: {new Date(2025, plan.start_month - 1).toLocaleDateString("en-US", { month: "short" })} -{" "}
              {new Date(2025, plan.end_month - 1).toLocaleDateString("en-US", { month: "short" })}
            </p>
          )}
        </CardHeader>

        <CardContent className="space-y-6">
          <ul className="space-y-3">
            {plan.features.map((feature, index) => (
              <li key={index} className="flex items-start gap-3 text-sm">
                <div className="mt-0.5 rounded-full bg-primary/10 p-0.5">
                  <Check className="h-4 w-4 text-primary" />
                </div>
                <span className="text-muted-foreground leading-relaxed">{feature}</span>
              </li>
            ))}
          </ul>

          {plan.products ? (
            <Button className="w-full group-hover:shadow-lg transition-shadow font-semibold" size="lg" asChild>
              <Link 
                href={`/${
                  plan.products.category.toLowerCase().includes("heater") || 
                  plan.products.category.toLowerCase().includes("oil")
                    ? "heating"
                    : "cooling"
                }/products/${generateProductSlug(plan.products.name)}?plan=${plan.id}`}
              >
                Choose Plan
              </Link>
            </Button>
          ) : (
            <Button className="w-full group-hover:shadow-lg transition-shadow font-semibold" size="lg">
              Choose Plan
            </Button>
          )}
        </CardContent>
      </Card>
    )
  }


  return (
    <section id="seasonal" className="py-20 md:py-28 lg:py-32 relative overflow-hidden scroll-mt-24 bg-gradient-to-b from-primary/5 to-transparent">
      {/* Enhanced Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-10 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/4 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center space-y-6 mb-14 md:mb-20">
          <Badge variant="secondary" className="text-sm px-4 py-1.5 inline-block">
            Seasonal Plans
          </Badge>
          <div className="space-y-3">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-balance">
              Save Big with{" "}
              <span className="bg-gradient-to-r from-primary via-primary/80 to-orange-500 bg-clip-text text-transparent">
                Seasonal Bundles
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
              Choose the perfect plan based on the season. Get the best rates with our seasonal bundles and end-of-season
              sales.
            </p>
          </div>
        </div>

        {/* Summer Section */}
        <div className="space-y-6 mb-16">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-orange-100">
              <Sun className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-slate-900">Summer Plans</h3>
              <p className="text-sm text-slate-600">Beat the heat with our cooling solutions</p>
            </div>
          </div>
          {summerPlans.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
              {summerPlans.filter(i => i.name != 'Monthly').map((plan) => (
                <PlanCard key={plan.id} plan={plan} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-slate-50 rounded-lg">
              <Sun className="h-12 w-12 text-yellow-300 mx-auto mb-4" />
              <p className="text-slate-600 font-medium">Summer plans coming soon!</p>
            </div>
          )}
        </div>

        {/* Winter Section */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-blue-100">
              <Snowflake className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-slate-900">Winter Plans</h3>
              <p className="text-sm text-slate-600">Stay cozy and warm all winter long</p>
            </div>
          </div>
          {winterPlans.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
              {winterPlans.filter(i => i.name != 'Monthly').map((plan) => (
                <PlanCard key={plan.id} plan={plan} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-slate-50 rounded-lg">
              <Snowflake className="h-12 w-12 text-blue-300 mx-auto mb-4" />
              <p className="text-slate-600 font-medium">Winter plans coming soon!</p>
            </div>
          )}
        </div>

        {/* Bottom Info */}
        <div className="mt-16 text-center space-y-4">
          <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
            All prices include 18% GST. Free installation and maintenance included with all plans. Cancel anytime with
            30 days notice.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Check className="h-3 w-3 text-primary" /> No hidden charges
            </span>
            <span className="flex items-center gap-1">
              <Check className="h-3 w-3 text-primary" /> GST invoice provided
            </span>
            <span className="flex items-center gap-1">
              <Check className="h-3 w-3 text-primary" /> Flexible payment options
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
