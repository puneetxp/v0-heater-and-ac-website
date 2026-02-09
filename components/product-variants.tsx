'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Check, Info } from 'lucide-react'

interface Variant {
  id: string
  name: string
  capacity: string
  color?: string
  specifications: Record<string, string>
  priceMultiplier?: number
  image?: string
}

interface Plan {
  id: string
  name: string
  description: string
  durationMonths: number
  discountPercentage: number
  features: string[]
  isPopular?: boolean
  displayOrder: number
}

interface VariantPlan {
  variantId: string
  planId: string
  basePrice: number
  finalPrice: number
}

interface ProductVariantsProps {
  productId: string
  variants: Variant[]
  plans: Plan[]
  variantPlans: VariantPlan[]
  basePrice: number
  onVariantSelect?: (variantId: string) => void
  onPlanSelect?: (planId: string) => void
  onPriceChange?: (price: number) => void
}

export function ProductVariants({
  productId,
  variants,
  plans,
  variantPlans,
  basePrice,
  onVariantSelect,
  onPlanSelect,
  onPriceChange,
}: ProductVariantsProps) {
  const [selectedVariant, setSelectedVariant] = useState<string>(variants[0]?.id || '')
  const [selectedPlan, setSelectedPlan] = useState<string>(plans[0]?.id || '')

  const handleVariantSelect = (variantId: string) => {
    setSelectedVariant(variantId)
    onVariantSelect?.(variantId)
    updatePrice(variantId, selectedPlan)
  }

  const handlePlanSelect = (planId: string) => {
    setSelectedPlan(planId)
    onPlanSelect?.(planId)
    updatePrice(selectedVariant, planId)
  }

  const updatePrice = (variantId: string, planId: string) => {
    const variantPlan = variantPlans.find((vp) => vp.variantId === variantId && vp.planId === planId)
    if (variantPlan) {
      onPriceChange?.(variantPlan.finalPrice)
    }
  }

  const selectedVariantData = variants.find((v) => v.id === selectedVariant)
  const sortedPlans = [...plans].sort((a, b) => a.displayOrder - b.displayOrder)

  return (
    <div className="space-y-8">
      {/* Variants Section */}
      {variants.length > 0 && (
        <div className="space-y-4">
          <div>
            <h3 className="text-xl font-semibold mb-2">Choose Your Variant</h3>
            <p className="text-sm text-muted-foreground">Select the capacity and specifications you need</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {variants.map((variant) => (
              <Card
                key={variant.id}
                className={`cursor-pointer transition-all duration-300 ${
                  selectedVariant === variant.id
                    ? 'ring-2 ring-primary shadow-lg'
                    : 'hover:shadow-md border-border/50'
                }`}
                onClick={() => handleVariantSelect(variant.id)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{variant.name}</CardTitle>
                      <CardDescription className="text-sm">{variant.capacity}</CardDescription>
                    </div>
                    {selectedVariant === variant.id && (
                      <Badge className="bg-primary text-primary-foreground">
                        <Check className="w-3 h-3 mr-1" />
                        Selected
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {variant.image && (
                    <img
                      src={variant.image}
                      alt={variant.name}
                      className="w-full h-40 object-cover rounded-md"
                    />
                  )}
                  {variant.color && (
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-muted-foreground">Color:</span>
                      <div
                        className="w-6 h-6 rounded-full border-2 border-border"
                        style={{ backgroundColor: variant.color }}
                        title={variant.color}
                      />
                      <span>{variant.color}</span>
                    </div>
                  )}
                  {Object.keys(variant.specifications || {}).length > 0 && (
                    <div className="space-y-1 text-sm">
                      {Object.entries(variant.specifications).map(([key, value]) => (
                        <div key={key} className="flex justify-between text-xs">
                          <span className="text-muted-foreground capitalize">{key}:</span>
                          <span className="font-medium">{value}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Plans Section */}
      {sortedPlans.length > 0 && (
        <div className="space-y-4">
          <div>
            <h3 className="text-xl font-semibold mb-2">Select Your Plan</h3>
            <p className="text-sm text-muted-foreground">Choose the rental duration that works best for you</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sortedPlans.map((plan) => {
              const isSelected = selectedPlan === plan.id
              const variantPlan = variantPlans.find((vp) => vp.variantId === selectedVariant && vp.planId === plan.id)
              const finalPrice = variantPlan?.finalPrice || basePrice

              return (
                <Card
                  key={plan.id}
                  className={`relative cursor-pointer transition-all duration-300 overflow-hidden ${
                    isSelected
                      ? 'ring-2 ring-primary shadow-lg'
                      : 'hover:shadow-md border-border/50'
                  } ${plan.isPopular ? 'md:scale-105' : ''}`}
                  onClick={() => handlePlanSelect(plan.id)}
                >
                  {plan.isPopular && (
                    <div className="absolute top-0 right-0 bg-gradient-to-r from-primary to-primary/70 text-white px-3 py-1 text-xs font-semibold rounded-bl-lg">
                      Most Popular
                    </div>
                  )}

                  <CardHeader className={`pb-3 ${plan.isPopular ? 'pt-8' : ''}`}>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{plan.name}</CardTitle>
                        <CardDescription>{plan.durationMonths} month{plan.durationMonths > 1 ? 's' : ''}</CardDescription>
                      </div>
                      {isSelected && (
                        <Badge className="bg-primary text-primary-foreground">
                          <Check className="w-3 h-3 mr-1" />
                          Selected
                        </Badge>
                      )}
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Price Display */}
                    <div className="space-y-1">
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-primary">₹{finalPrice.toLocaleString()}</span>
                        <span className="text-sm text-muted-foreground">/month</span>
                      </div>
                      {plan.discountPercentage > 0 && (
                        <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                          Save {plan.discountPercentage}%
                        </Badge>
                      )}
                    </div>

                    {/* Plan Description */}
                    {plan.description && (
                      <p className="text-sm text-muted-foreground">{plan.description}</p>
                    )}

                    {/* Features List */}
                    {plan.features && plan.features.length > 0 && (
                      <div className="space-y-2">
                        <div className="text-xs font-semibold text-muted-foreground uppercase">Includes:</div>
                        <ul className="space-y-2">
                          {plan.features.map((feature, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm">
                              <Check className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Total Cost */}
                    <div className="pt-3 border-t border-border">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">Total for {plan.durationMonths} months:</span>
                        <span className="font-bold text-lg">₹{(finalPrice * plan.durationMonths).toLocaleString()}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      )}

      {/* Comparison View */}
      {sortedPlans.length > 1 && (
        <div className="mt-8 p-4 bg-muted/30 rounded-lg border border-border/50">
          <div className="flex items-start gap-2 mb-3">
            <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-sm">Comparison Tip</h4>
              <p className="text-xs text-muted-foreground mt-1">
                Compare total costs: our quarterly and annual plans offer better value with discounts and additional features.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
