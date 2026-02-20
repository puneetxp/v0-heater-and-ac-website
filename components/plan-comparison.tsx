'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Check, X } from 'lucide-react'

interface Plan {
  id: string
  name: string
  description: string
  durationMonths: number
  discountPercentage: number
  features: string[]
  isPopular?: boolean
  price?: number
}

interface PlanComparisonProps {
  plans: Plan[]
  onSelectPlan?: (planId: string) => void
}

export function PlanComparison({ plans, onSelectPlan }: PlanComparisonProps) {
  const allFeatures = Array.from(
    new Set(
      plans.reduce((acc, plan) => {
        return [...acc, ...(plan.features || [])]
      }, [] as string[])
    )
  )

  const sortedPlans = [...plans].sort((a, b) => a.durationMonths - b.durationMonths)

  return (
    <div className="w-full overflow-x-auto">
      <div className="inline-block min-w-full">
        {/* Header - Plan Names */}
        <div className="grid gap-4 mb-4" style={{ gridTemplateColumns: `200px repeat(${sortedPlans.length}, 1fr)` }}>
          <div />
          {sortedPlans.map((plan) => (
            <div key={plan.id} className="text-center">
              <h3 className="font-bold text-lg mb-1">{plan.name}</h3>
              <p className="text-sm text-muted-foreground">{plan.durationMonths} month{plan.durationMonths > 1 ? 's' : ''}</p>
            </div>
          ))}
        </div>

        {/* Price Row */}
        <div className="grid gap-4 mb-4 p-4 bg-muted/30 rounded-lg" style={{ gridTemplateColumns: `200px repeat(${sortedPlans.length}, 1fr)` }}>
          <div className="font-semibold">Price/Month</div>
          {sortedPlans.map((plan) => (
            <div key={plan.id} className="text-center">
              <div className="text-2xl font-bold text-primary">₹{plan.price?.toLocaleString() || '-'}</div>
              {plan.discountPercentage > 0 && (
                <Badge className="mt-2 bg-green-600 mx-auto">Save {plan.discountPercentage}%</Badge>
              )}
            </div>
          ))}
        </div>

        {/* Features Comparison */}
        <div className="space-y-2 mb-6">
          {allFeatures.map((feature) => (
            <div key={feature} className="grid gap-4 p-3 border-b border-border last:border-0" style={{ gridTemplateColumns: `200px repeat(${sortedPlans.length}, 1fr)` }}>
              <div className="text-sm font-medium text-muted-foreground">{feature}</div>
              {sortedPlans.map((plan) => (
                <div key={plan.id} className="text-center">
                  {plan.features?.includes(feature) ? (
                    <Check className="w-5 h-5 text-green-600 dark:text-green-400 mx-auto" />
                  ) : (
                    <X className="w-5 h-5 text-muted-foreground/30 mx-auto" />
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* CTA Row */}
        <div className="grid gap-4" style={{ gridTemplateColumns: `200px repeat(${sortedPlans.length}, 1fr)` }}>
          <div />
          {sortedPlans.map((plan) => (
            <div key={plan.id}>
              <Button
                onClick={() => onSelectPlan?.(plan.id)}
                className={`w-full ${plan.isPopular ? 'bg-primary text-white' : 'variant-outline'}`}
              >
                Select Plan
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
