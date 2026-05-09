import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Check, Snowflake, Sun, Calendar } from "lucide-react"
import { createServerClient } from "@/lib/supabase/server"

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
}

export async function SeasonalPlans() {
  let plans: SeasonalPlan[] = []

  try {
    const supabase = await createServerClient()
    const { data } = await supabase
      .from("seasonal_plans")
      .select("*")
      .eq("is_active", true)
      .order("duration_months", { ascending: true })

    if (data && data.length > 0) {
      // Show all active plans
      plans = data
    }
  } catch (error) {
    console.warn("[v0] Failed to fetch seasonal plans server-side:", error)
  }

  // Always render the section - even with empty state
  // This ensures the #seasonal anchor always exists for navigation

  // Add sample data if no plans found (for demonstration)
  if (plans.length === 0) {
    plans = [
      {
        id: 1,
        name: "Summer Cool Bundle",
        season: "summer",
        description: "Stay cool during hot summers with our premium cooling solution",
        discount_percentage: 15,
        duration_months: 3,
        features: ["Professional Installation", "24/7 Support", "Free Maintenance", "Flexible Upgrades"],
        valid_from: "2025-03-01",
        valid_until: "2025-05-31",
        base_price: 5000,
        start_month: 3,
        end_month: 5,
      },
      {
        id: 2,
        name: "Winter Warm Bundle",
        season: "winter",
        description: "Stay warm and cozy throughout the winter season",
        discount_percentage: 15,
        duration_months: 3,
        features: ["Professional Installation", "24/7 Support", "Free Maintenance", "Energy Efficiency"],
        valid_from: "2025-10-01",
        valid_until: "2025-12-31",
        base_price: 4000,
        start_month: 10,
        end_month: 12,
      },
      {
        id: 3,
        name: "Year-Round Premium",
        season: "year_round",
        description: "Complete comfort all year long with our premium package",
        discount_percentage: 35,
        duration_months: 12,
        features: ["Installation", "Priority Support", "Regular Maintenance", "Free Upgrades", "Swap Anytime", "Extended Warranty"],
        valid_from: "2025-01-01",
        valid_until: "2025-12-31",
        base_price: 18000,
        start_month: 1,
        end_month: 12,
      },
    ]
  }

  const summerPlans = plans.filter((p) => p.season === "summer")
  const winterPlans = plans.filter((p) => p.season === "winter")
  const yearRoundPlans = plans.filter((p) => p.season === "year_round")
  const endSeasonPlans = plans.filter((p) => p.season === "end_season")

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

        <Button className="w-full group-hover:shadow-lg transition-shadow" size="lg">
          Choose Plan
        </Button>
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

        {/* Seasonal Tabs */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-4 mb-12 h-auto p-1">
            <TabsTrigger value="all" className="flex items-center gap-2 py-3">
              <Calendar className="h-4 w-4" />
              <span className="hidden sm:inline">All Plans</span>
              <span className="sm:hidden">All</span>
            </TabsTrigger>
            <TabsTrigger value="summer" className="flex items-center gap-2 py-3">
              <Sun className="h-4 w-4" />
              <span className="hidden sm:inline">Summer</span>
              <span className="sm:hidden">Summer</span>
            </TabsTrigger>
            <TabsTrigger value="winter" className="flex items-center gap-2 py-3">
              <Snowflake className="h-4 w-4" />
              <span className="hidden sm:inline">Winter</span>
              <span className="sm:hidden">Winter</span>
            </TabsTrigger>
            <TabsTrigger value="year-round" className="flex items-center gap-2 py-3">
              <Calendar className="h-4 w-4" />
              <span className="hidden sm:inline">Year-Round</span>
              <span className="sm:hidden">Year</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-0">
            {plans.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                {plans.map((plan) => (
                  <PlanCard key={plan.id} plan={plan} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Calendar className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-600 font-medium">No seasonal bundles available at the moment</p>
                <p className="text-sm text-slate-500 mt-2">Check back soon for our seasonal offers!</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="summer" className="mt-0">
            {summerPlans.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                {summerPlans.map((plan) => (
                  <PlanCard key={plan.id} plan={plan} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Sun className="h-12 w-12 text-yellow-300 mx-auto mb-4" />
                <p className="text-slate-600 font-medium">No summer bundles available</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="winter" className="mt-0">
            {winterPlans.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                {winterPlans.map((plan) => (
                  <PlanCard key={plan.id} plan={plan} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Snowflake className="h-12 w-12 text-blue-300 mx-auto mb-4" />
                <p className="text-slate-600 font-medium">No winter bundles available</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="year-round" className="mt-0">
            {yearRoundPlans.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                {yearRoundPlans.map((plan) => (
                  <PlanCard key={plan.id} plan={plan} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Calendar className="h-12 w-12 text-green-300 mx-auto mb-4" />
                <p className="text-slate-600 font-medium">No year-round bundles available</p>
              </div>
            )}
          </TabsContent>
        </Tabs>

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
