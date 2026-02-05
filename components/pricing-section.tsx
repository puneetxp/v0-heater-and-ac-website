import { Check } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const plans = [
  {
    id: 1,
    name: "Basic Monthly",
    description: "Perfect for short-term needs",
    months: 1,
    discount: 0,
    popular: false,
    features: ["Flexible cancellation", "Free installation", "24/7 support", "Maintenance included"],
  },
  {
    id: 2,
    name: "Quarterly",
    description: "Best value for 3 months",
    months: 3,
    discount: 10,
    popular: true,
    features: [
      "10% discount",
      "Flexible cancellation",
      "Free installation",
      "24/7 support",
      "Priority maintenance",
      "Free relocation once",
    ],
  },
  {
    id: 3,
    name: "Semi-Annual",
    description: "Extended comfort at great value",
    months: 6,
    discount: 15,
    popular: false,
    features: [
      "15% discount",
      "Flexible cancellation",
      "Free installation",
      "24/7 support",
      "Priority maintenance",
      "Free relocation twice",
      "Extended warranty",
    ],
  },
  {
    id: 4,
    name: "Annual",
    description: "Maximum savings for long-term",
    months: 12,
    discount: 20,
    popular: false,
    features: [
      "20% discount",
      "Flexible cancellation",
      "Free installation",
      "24/7 priority support",
      "Priority maintenance",
      "Unlimited relocation",
      "Extended warranty",
      "Upgrade option",
    ],
  },
]

export function PricingSection() {
  return (
    <section className="py-16 md:py-20 lg:py-24">
      <div className="container mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center space-y-4 mb-12 md:mb-16">
          <Badge variant="secondary" className="text-sm px-4 py-1.5">
            Monthly Rental Plans
          </Badge>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-balance">
            Choose Your <span className="text-primary">Perfect Plan</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Flexible monthly rental plans with no long-term commitments. Save more with longer durations.
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className={`relative hover:shadow-lg transition-all duration-300 ${
                plan.popular ? "border-primary shadow-md scale-105 lg:scale-110" : "hover:border-primary/50"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground shadow-sm px-4 py-1">Most Popular</Badge>
                </div>
              )}

              <CardHeader className="text-center pb-8">
                <CardTitle className="text-xl font-bold">{plan.name}</CardTitle>
                <CardDescription className="text-sm">{plan.description}</CardDescription>

                <div className="mt-6">
                  <div className="flex items-baseline justify-center gap-2">
                    <span className="text-4xl font-bold">{plan.months}</span>
                    <span className="text-muted-foreground">{plan.months === 1 ? "month" : "months"}</span>
                  </div>
                  {plan.discount > 0 && (
                    <div className="mt-2">
                      <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100">
                        Save {plan.discount}%
                      </Badge>
                    </div>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3 text-sm">
                      <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  className={`w-full ${plan.popular ? "bg-primary hover:bg-primary/90" : ""}`}
                  variant={plan.popular ? "default" : "outline"}
                >
                  Select Plan
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bottom Info */}
        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground">
            All plans include GST. Cancel anytime with 30 days notice. Terms apply.
          </p>
        </div>
      </div>
    </section>
  )
}
