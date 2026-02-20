'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ChevronDown, Check } from 'lucide-react'

interface Variant {
  id: string
  name: string
  capacity: string
  priceMultiplier?: number
}

interface Plan {
  id: string
  name: string
  durationMonths: number
  discountPercentage: number
  isPopular?: boolean
}

interface VariantSelectorMobileProps {
  variants: Variant[]
  plans: Plan[]
  basePrice: number
  onSelect?: (variantId: string, planId: string) => void
}

export function VariantSelectorMobile({
  variants,
  plans,
  basePrice,
  onSelect,
}: VariantSelectorMobileProps) {
  const [expandedVariant, setExpandedVariant] = useState<string | null>(null)
  const [selectedVariant, setSelectedVariant] = useState<string>(variants[0]?.id || '')
  const [selectedPlan, setSelectedPlan] = useState<string>(plans[0]?.id || '')

  const handleVariantSelect = (variantId: string) => {
    setSelectedVariant(variantId)
    setExpandedVariant(null)
  }

  const handlePlanSelect = (planId: string) => {
    setSelectedPlan(planId)
    onSelect?.(selectedVariant, planId)
  }

  const selectedVariantData = variants.find((v) => v.id === selectedVariant)
  const selectedPlanData = plans.find((p) => p.id === selectedPlan)
  const finalPrice = selectedPlanData
    ? Math.round(basePrice * (selectedVariantData?.priceMultiplier || 1) * (1 - (selectedPlanData.discountPercentage || 0) / 100))
    : basePrice

  return (
    <div className="space-y-6">
      {/* Variant Selector */}
      <div className="space-y-2">
        <label className="text-sm font-semibold">Select Capacity</label>
        <div className="relative">
          <Button
            variant="outline"
            className="w-full justify-between"
            onClick={() =>
              setExpandedVariant(expandedVariant ? null : 'variants')
            }
          >
            <span>{selectedVariantData?.name || 'Select variant'}</span>
            <ChevronDown
              className={`w-4 h-4 transition-transform ${
                expandedVariant === 'variants' ? 'rotate-180' : ''
              }`}
            />
          </Button>

          {expandedVariant === 'variants' && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-900 border border-border rounded-lg shadow-lg z-50">
              {variants.map((variant) => (
                <button
                  key={variant.id}
                  className="w-full px-4 py-3 text-left hover:bg-muted transition-colors border-b border-border last:border-0 flex items-center justify-between"
                  onClick={() => handleVariantSelect(variant.id)}
                >
                  <div>
                    <div className="font-medium">{variant.name}</div>
                    <div className="text-xs text-muted-foreground">{variant.capacity}</div>
                  </div>
                  {selectedVariant === variant.id && (
                    <Check className="w-5 h-5 text-primary" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Plan Selector */}
      <div className="space-y-2">
        <label className="text-sm font-semibold">Select Duration</label>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className={`cursor-pointer transition-all ${
                selectedPlan === plan.id
                  ? 'ring-2 ring-primary shadow-md'
                  : 'hover:shadow-sm'
              }`}
              onClick={() => handlePlanSelect(plan.id)}
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">{plan.name}</CardTitle>
                <CardDescription className="text-xs">
                  {plan.durationMonths}m
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-3">
                <div className="space-y-1">
                  {plan.isPopular && (
                    <Badge className="block text-center text-xs bg-amber-600 w-full">
                      Popular
                    </Badge>
                  )}
                  {plan.discountPercentage > 0 && (
                    <Badge
                      variant="secondary"
                      className="block text-center text-xs bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 w-full"
                    >
                      Save {plan.discountPercentage}%
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Price Summary */}
      <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Order Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Variant:</span>
            <span className="font-medium">{selectedVariantData?.name}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Plan:</span>
            <span className="font-medium">{selectedPlanData?.name}</span>
          </div>
          <div className="border-t border-border/50 pt-2 mt-2 flex justify-between">
            <span className="font-semibold">Monthly Rate:</span>
            <span className="text-2xl font-bold text-primary">₹{finalPrice.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Total for {selectedPlanData?.durationMonths} months:</span>
            <span className="font-medium">₹{(finalPrice * (selectedPlanData?.durationMonths || 1)).toLocaleString()}</span>
          </div>
        </CardContent>
      </Card>

      {/* CTA */}
      <Button className="w-full" size="lg">
        Proceed to Booking
      </Button>
    </div>
  )
}
