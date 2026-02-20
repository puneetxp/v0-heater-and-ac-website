'use client'

import { useState } from 'react'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ArrowLeft, Check, Flame, Zap } from 'lucide-react'
import Link from 'next/link'

export default function OilHeaterProductPage() {
  const [selectedCapacity, setSelectedCapacity] = useState('9')
  const [selectedPlan, setSelectedPlan] = useState('monthly')

  const product = {
    name: 'Oil Heater',
    category: 'Oil Heater',
    basePrice: 899,
    description: 'Portable oil-filled electric heater with thermostat control, perfect for personal heating in any room.',
    warranty: '1 year comprehensive warranty on all parts',
  }

  const capacities = [
    { id: '7', name: '7 Fin', multiplier: 1.0, description: 'Compact, ideal for small rooms' },
    { id: '9', name: '9 Fin', multiplier: 1.15, description: 'Perfect for medium rooms' },
    { id: '11', name: '11 Fin', multiplier: 1.3, description: 'Great for larger spaces' },
  ]

  const plans = [
    { id: 'monthly', name: 'Monthly', months: 1, discount: 0 },
    { id: 'quarterly', name: 'Quarterly', months: 3, discount: 8 },
    { id: 'annual', name: 'Annual', months: 12, discount: 15 },
  ]

  const selectedCapacityData = capacities.find(c => c.id === selectedCapacity)
  const selectedPlanData = plans.find(p => p.id === selectedPlan)

  const capacityPrice = Math.round(product.basePrice * (selectedCapacityData?.multiplier || 1))
  const discountedPrice = Math.round(capacityPrice * (1 - (selectedPlanData?.discount || 0) / 100))
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
            {/* Product Image */}
            <div className="flex items-center justify-center">
              <div className="w-full rounded-2xl overflow-hidden bg-gradient-to-br from-orange-100 to-yellow-100 aspect-square flex items-center justify-center">
                <div className="text-6xl"><Flame className="w-32 h-32 text-orange-600 opacity-20" /></div>
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <Badge className="mb-3 bg-orange-600 text-white">Oil Heater</Badge>
                <h1 className="text-4xl md:text-5xl font-bold mb-3">{product.name}</h1>
                <p className="text-xl text-gray-600">{product.description}</p>
              </div>

              {/* Capacity Selection */}
              <Card className="border-2">
                <CardHeader>
                  <CardTitle>Select Capacity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-3">
                    {capacities.map(capacity => (
                      <button
                        key={capacity.id}
                        onClick={() => setSelectedCapacity(capacity.id)}
                        className={`p-4 rounded-lg border-2 transition-all text-left ${
                          selectedCapacity === capacity.id
                            ? 'border-orange-600 bg-orange-50'
                            : 'border-gray-200 hover:border-orange-300'
                        }`}
                      >
                        <div className="font-bold text-lg">{capacity.name}</div>
                        <div className="text-sm text-gray-600 mt-1">₹{Math.round(product.basePrice * capacity.multiplier)}/mo</div>
                        <div className="text-xs text-gray-500 mt-2">{capacity.description}</div>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Plan Selection */}
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

              {/* Price Summary */}
              <Card className="border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-yellow-50">
                <CardHeader>
                  <CardTitle>Total Cost</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-700">Monthly Rate:</span>
                    <span className="font-semibold">₹{capacityPrice}</span>
                  </div>
                  {selectedPlanData?.discount ? (
                    <div className="flex justify-between text-green-600">
                      <span>Discount ({selectedPlanData.discount}%):</span>
                      <span>-₹{Math.round(capacityPrice * selectedPlanData.discount / 100)}</span>
                    </div>
                  ) : null}
                  <div className="border-t pt-4 flex justify-between text-xl font-bold text-orange-600">
                    <span>Total for {selectedPlanData?.months} month{selectedPlanData?.months !== 1 ? 's' : ''}:</span>
                    <span>₹{totalPrice}</span>
                  </div>
                </CardContent>
              </Card>

              <Button asChild className="w-full h-12 bg-orange-600 hover:bg-orange-700 text-white text-lg">
                <Link href={`/booking/oil-heater?capacity=${selectedCapacity}&plan=${selectedPlan}`}>
                  Proceed to Booking
                </Link>
              </Button>
            </div>
          </div>

          {/* Features & Specs */}
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
                      'Adjustable thermostat control',
                      'Portable and lightweight',
                      'Quiet operation (< 60dB)',
                      'Tip-over safety switch',
                      'Energy efficient heating',
                      'Easy to move between rooms'
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
                        <h4 className="font-semibold mb-2">Capacity</h4>
                        <p className="text-gray-600">{selectedCapacity} Fin</p>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Power</h4>
                        <p className="text-gray-600">1500W - 2000W</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">Heating Range</h4>
                        <p className="text-gray-600">Room heating up to 150-250 sq ft</p>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Warranty</h4>
                        <p className="text-gray-600">1 year comprehensive</p>
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
