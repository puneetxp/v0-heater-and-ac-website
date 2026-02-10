'use client'

import { useState, useMemo } from 'react'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ArrowLeft, Check, Flame } from 'lucide-react'
import Link from 'next/link'
import { findProductBySlug } from '@/lib/product-data'

export default function OilHeaterProductPage({ params }: { params: { slug: string } }) {
  // Find product from slug
  const productData = useMemo(() => findProductBySlug(params.slug, 'oil-heater'), [params.slug])

  // Fallback if product not found
  if (!productData) {
    return (
      <main className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Product Not Found</h1>
            <p className="text-gray-600 mb-6">The product you're looking for doesn't exist.</p>
            <Button asChild>
              <Link href="/heating/oil-heater">Back to Oil Heaters</Link>
            </Button>
          </div>
        </div>
        <Footer />
      </main>
    )
  }

  const [selectedVariant, setSelectedVariant] = useState(productData.capacity.split(' ')[0])
  const [selectedPlan, setSelectedPlan] = useState('monthly')

  const product = {
    name: productData.name,
    category: productData.category,
    basePrice: productData.basePrice,
    description: productData.description || 'Portable oil-filled radiator heater with thermostat control and multiple heat settings.',
    image: '/placeholder.svg?height=500&width=600',
    warranty: '1 year manufacturer warranty',
    slug: params.slug,
  }

  const variants = [
    { id: '7', name: '7 Fin', multiplier: 0.9, description: 'Compact for small rooms' },
    { id: '9', name: '9 Fin', multiplier: 1.0, description: 'Standard for medium rooms' },
    { id: '11', name: '11 Fin', multiplier: 1.2, description: 'Extended coverage for large rooms' },
  ]

  const plans = [
    { id: 'monthly', name: 'Monthly', months: 1, discount: 0 },
    { id: 'quarterly', name: 'Quarterly', months: 3, discount: 10 },
    { id: 'annual', name: 'Annual', months: 12, discount: 20 },
  ]

  const selectedVariantData = variants.find(v => v.id === selectedVariant)
  const selectedPlanData = plans.find(p => p.id === selectedPlan)

  const variantPrice = Math.round(product.basePrice * (selectedVariantData?.multiplier || 1))
  const discountedPrice = Math.round(variantPrice * (1 - (selectedPlanData?.discount || 0) / 100))
  const totalPrice = discountedPrice * (selectedPlanData?.months || 1)

  return (
    <main className="min-h-screen relative z-10 flex flex-col">
      <Header />
      
      <div className="flex-1 py-8 md:py-12 px-4 md:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <Link href="/heating/oil-heater" className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 mb-8 font-medium">
            <ArrowLeft className="w-4 h-4" />
            Back to Oil Heaters
          </Link>

          <div className="grid lg:grid-cols-2 gap-12 mb-16">
            <div className="flex items-center justify-center">
              <div className="w-full rounded-2xl overflow-hidden bg-gradient-to-br from-orange-100 to-yellow-100 aspect-square flex items-center justify-center">
                <Flame className="w-32 h-32 text-orange-600 opacity-20" />
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <Badge className="mb-3 bg-orange-600 text-white">Oil Heater</Badge>
                <h1 className="text-4xl md:text-5xl font-bold mb-3">{product.name}</h1>
                <p className="text-xl text-gray-600">{product.description}</p>
              </div>

              <Card className="border-2">
                <CardHeader>
                  <CardTitle>Select Capacity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3">
                    {variants.map(variant => (
                      <button
                        key={variant.id}
                        onClick={() => setSelectedVariant(variant.id)}
                        className={`p-4 rounded-lg border-2 transition-all text-left ${
                          selectedVariant === variant.id
                            ? 'border-orange-600 bg-orange-50'
                            : 'border-gray-200 hover:border-orange-300'
                        }`}
                      >
                        <div className="font-bold text-lg">{variant.name}</div>
                        <div className="text-sm text-gray-600 mt-1">₹{Math.round(product.basePrice * variant.multiplier)}/mo</div>
                        <div className="text-xs text-gray-500 mt-2">{variant.description}</div>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2">
                <CardHeader>
                  <CardTitle>Select Rental Plan</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {plans.map(plan => (
                    <button
                      key={plan.id}
                      onClick={() => setSelectedPlan(plan.id)}
                      className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                        selectedPlan === plan.id
                          ? 'border-orange-600 bg-orange-50'
                          : 'border-gray-200 hover:border-orange-300'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-bold">{plan.name}</div>
                          <div className="text-sm text-gray-600 mt-1">
                            ₹{Math.round(discountedPrice)}/month
                          </div>
                        </div>
                        {plan.discount > 0 && (
                          <Badge className="bg-green-600 text-white">Save {plan.discount}%</Badge>
                        )}
                      </div>
                    </button>
                  ))}
                </CardContent>
              </Card>

              <Card className="border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-yellow-50">
                <CardHeader>
                  <CardTitle>Total Cost</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-700">Monthly Rate:</span>
                    <span className="font-semibold">₹{variantPrice}</span>
                  </div>
                  {selectedPlanData?.discount ? (
                    <div className="flex justify-between text-green-600">
                      <span>Discount ({selectedPlanData.discount}%):</span>
                      <span>-₹{Math.round(variantPrice * selectedPlanData.discount / 100)}</span>
                    </div>
                  ) : null}
                  <div className="border-t pt-4 flex justify-between text-xl font-bold text-orange-600">
                    <span>Total for {selectedPlanData?.months} month{selectedPlanData?.months !== 1 ? 's' : ''}:</span>
                    <span>₹{totalPrice}</span>
                  </div>
                </CardContent>
              </Card>

              <Button asChild className="w-full h-12 bg-orange-600 hover:bg-orange-700 text-white text-lg">
                <Link href={`/booking/oil-heater?variant=${selectedVariant}&plan=${selectedPlan}`}>
                  Proceed to Booking
                </Link>
              </Button>
            </div>
          </div>

          <Tabs defaultValue="features" className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-3 mb-8">
              <TabsTrigger value="features">Features</TabsTrigger>
              <TabsTrigger value="specs">Specs</TabsTrigger>
              <TabsTrigger value="warranty">Warranty</TabsTrigger>
            </TabsList>

            <TabsContent value="features">
              <Card>
                <CardContent className="pt-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    {[
                      'Fast heating in minutes',
                      '24/7 customer support',
                      'Portable with wheels',
                      'Energy efficient operation',
                      'Safety tip-over protection',
                      'Multiple heat settings'
                    ].map((feature, i) => (
                      <div key={i} className="flex gap-3">
                        <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="specs">
              <Card>
                <CardContent className="pt-6">
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">Heating Capacity</h4>
                        <p className="text-gray-600">{selectedVariant} Fin Radiator</p>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Power Consumption</h4>
                        <p className="text-gray-600">1500W</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">Heat Settings</h4>
                        <p className="text-gray-600">3 Levels</p>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Warranty</h4>
                        <p className="text-gray-600">1 year manufacturer</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="warranty">
              <Card>
                <CardContent className="pt-6">
                  <p className="text-gray-700 leading-relaxed">{product.warranty}</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <Footer />
    </main>
  )
}
