import { checkAdminAccess } from "@/lib/check-admin"
import { createServerClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Trash2, Check, Sun, Snowflake, Calendar } from "lucide-react"
import { PlanFormDialog } from "@/components/admin/plan-form-dialog"

export default async function AdminPlansPage() {
  await checkAdminAccess()
  const supabase = await createServerClient()

  const { data: plans } = await supabase
    .from("seasonal_plans")
    .select("*")
    .order("duration_months", { ascending: true })

  const getSeasonIcon = (season: string) => {
    switch (season) {
      case "summer":
        return <Sun className="h-5 w-5" />
      case "winter":
        return <Snowflake className="h-5 w-5" />
      default:
        return <Calendar className="h-5 w-5" />
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

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Seasonal Plans Management</h1>
          <p className="text-slate-600 mt-1">Create and manage rental plans for different seasons with pricing</p>
        </div>
        <PlanFormDialog />
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans?.map((plan) => (
          <Card key={plan.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className={`h-2 bg-gradient-to-r ${getSeasonColor(plan.season)}`} />

            <CardHeader className="space-y-4">
              <div className="flex items-start justify-between">
                <div className={`p-2.5 rounded-lg bg-gradient-to-br ${getSeasonColor(plan.season)} text-white`}>
                  {getSeasonIcon(plan.season)}
                </div>
                <Badge variant={plan.is_active ? "default" : "secondary"}>
                  {plan.is_active ? "Active" : "Inactive"}
                </Badge>
              </div>

              <div>
                <CardTitle className="text-xl mb-2">{plan.name}</CardTitle>
                <p className="text-sm text-slate-600">{plan.description}</p>
              </div>

              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold">{plan.duration_months}</span>
                <span className="text-slate-600">months</span>
                {plan.discount_percentage > 0 && (
                  <Badge className="ml-auto bg-green-100 text-green-700">Save {plan.discount_percentage}%</Badge>
                )}
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-3 rounded-lg space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-600">Base Price:</span>
                  <span className="font-bold text-slate-900">₹{plan.base_price?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-600">Per Unit:</span>
                  <span className="font-bold text-slate-900">₹{plan.pricing_per_unit?.toLocaleString()}</span>
                </div>
              </div>

              {plan.start_month && plan.end_month && (
                <p className="text-xs text-slate-600">
                  Available: Month {plan.start_month} - {plan.end_month}
                </p>
              )}

              {plan.features && plan.features.length > 0 && (
                <ul className="space-y-2">
                  {plan.features.slice(0, 3).map((feature: string, index: number) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-slate-600">
                      <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                  {plan.features.length > 3 && (
                    <li className="text-sm text-slate-500">+{plan.features.length - 3} more features</li>
                  )}
                </ul>
              )}

              <div className="flex gap-2 pt-4">
                <PlanFormDialog planId={plan.id} isEdit />
                <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 bg-transparent">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
