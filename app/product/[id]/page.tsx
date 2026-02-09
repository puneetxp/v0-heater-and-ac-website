'use client'

import { useState } from 'react'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ArrowLeft, Check } from 'lucide-react'
import Link from 'next/link'

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const productId = params.id
  const [selectedVariant, setSelectedVariant] = useState('1.0')
  const [selectedPlan, setSelectedPlan] = useState('monthly')

  // Mock product data
  const product = {
    name: 'Split AC Unit',
    category: 'Air Conditioner',
    basePrice: 1499,
    description: 'Premium energy-efficient inverter split AC with smart temperature control.',
    image: '/placeholder.svg?height=400&width=500',
    warranty: '5 years on compressor, 2 years on parts',
  }

  const variants = [
    { id: '1.0', name: '1.0 Ton', multiplier: 1.0 },
    { id: '1.5', name: '1.5 Ton', multiplier: 1.2 },
    { id: '2.0', name: '2.0 Ton', multiplier: 1.4 },
  ]

  const plans = [
    { id: 'monthly', name: 'Monthly', months: 1, discount: 0 },
    { id: 'quarterly', name: 'Quarterly (3 months)', months: 3, discount: 10 },
    { id: 'annual', name: 'Annual (12 months)', months: 12, discount: 20 },
  ]

  const selectedVariantData = variants.find(v => v.id === selectedVariant)
  const selectedPlanData = plans.find(p => p.id === selectedPlan)

  const variantPrice = Math.round(product.basePrice * (selectedVariantData?.multiplier || 1))
  const monthlyPrice = variantPrice
  const discountedPrice = Math.round(monthlyPrice * (1 - (selectedPlanData?.discount || 0) / 100))
  const totalPrice = discountedPrice * (selectedPlanData?.months || 1)

  return (
    <main className="min-h-screen relative z-10 flex flex-col">
      <Header />
      
      <div className="flex-1 py-8 md:py-12 lg:py-16 px-4 md:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          {/* Back Button */}
          <Link href="/" className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-8">
            <ArrowLeft className="w-4 h-4" />
            Back to Products
          </Link>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 mb-12">
            {/* Product Image */}
            <div className="relative">
              <div className="rounded-2xl overflow-hidden bg-muted/30 aspect-square">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Product Info & Selection */}
            <div className="space-y-6">
              <div>
                <Badge className="mb-3 bg-blue-600">Air Conditioner</Badge>
                <h1 className="text-4xl font-bold mb-2">{product.name}</h1>
                <p className="text-lg text-muted-foreground">{product.description}</p>
              </div>

              {/* Variant Selection */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Select Capacity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-3">
                    {variants.map(variant => (
                      <button
                        key={variant.id}
                        onClick={() => setSelectedVariant(variant.id)}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          selectedVariant === variant.id
                            ? 'border-blue-600 bg-blue-50 dark:bg-blue-950'
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <div className="font-semibold">{variant.name}</div>
                        <div className="text-sm text-muted-foreground">₹{Math.round(product.basePrice * variant.multiplier)}/mo</div>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Plan Selection */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Select Plan</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {plans.map(plan => (
                    <button
                      key={plan.id}
                      onClick={() => setSelectedPlan(plan.id)}
                      className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                        selectedPlan === plan.id
                          ? 'border-blue-600 bg-blue-50 dark:bg-blue-950'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <div className="font-semibold">{plan.name}</div>
                          <div className="text-sm text-muted-foreground">
                            ₹{discountedPrice}/month
                          </div>
                        </div>
                        {plan.discount > 0 && (
                          <Badge className="bg-green-600">Save {plan.discount}%</Badge>
                        )}
                      </div>
                    </button>
                  ))}
                </CardContent>
              </Card>

              {/* Price Summary */}
              <Card className="border-2 border-primary/20">
                <CardHeader>
                  <CardTitle>Price Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Monthly Rate:</span>
                    <span className="font-semibold">₹{monthlyPrice}</span>
                  </div>
                  {selectedPlanData?.discount ? (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Discount ({selectedPlanData.discount}%):</span>
                      <span className="font-semibold text-green-600">
                        -₹{Math.round(monthlyPrice * selectedPlanData.discount / 100)}
                      </span>
                    </div>
                  ) : null}
                  <div className="border-t pt-3 flex justify-between">
                    <span className="font-semibold">Duration:</span>
                    <span>{selectedPlanData?.months} month{selectedPlanData?.months !== 1 ? 's' : ''}</span>
                  </div>
                  <div className="border-t pt-3 flex justify-between text-lg">
                    <span className="font-bold">Total Cost:</span>
                    <span className="font-bold text-blue-600">₹{totalPrice}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button asChild className="flex-1 bg-blue-600 hover:bg-blue-700 h-12" size="lg">
                  <Link href={`/booking/${productId}?variant=${selectedVariant}&plan=${selectedPlan}`}>
                    Continue to Booking
                  </Link>
                </Button>
              </div>
            </div>
          </div>

          {/* Features & Warranty */}
          <Tabs defaultValue="features" className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-3">
              <TabsTrigger value="features">Features</TabsTrigger>
              <TabsTrigger value="specs">Specifications</TabsTrigger>
              <TabsTrigger value="warranty">Warranty</TabsTrigger>
            </TabsList>

            <TabsContent value="features" className="mt-6">
              <Card>
                <CardContent className="pt-6">
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Free professional installation included</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>24/7 customer support</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Maintenance included</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Flexible relocation options</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="specs" className="mt-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-2">Cooling Capacity</h4>
                      <p className="text-muted-foreground">{selectedVariant} Ton</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Energy Rating</h4>
                      <p className="text-muted-foreground">5 Star Inverter</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Noise Level</h4>
                      <p className="text-muted-foreground">22 dB</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Warranty</h4>
                      <p className="text-muted-foreground">5 years compressor</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="warranty" className="mt-6">
              <Card>
                <CardContent className="pt-6">
                  <p className="text-muted-foreground">{product.warranty}</p>
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
