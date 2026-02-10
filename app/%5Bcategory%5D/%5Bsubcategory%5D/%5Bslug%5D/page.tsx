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
import { parseCategoryUrl } from '@/lib/product-routes'

interface Props {
  params: {
    category: string
    subcategory: string
    slug: string
  }
}

// Mock product database - would be fetched from DB in real app
const allProducts: Record<string, Record<string, any[]>> = {
  'cooling-window-ac': [
    { id: 1, name: 'Window AC - 1 Ton', category: 'Window AC', capacity: '1 Ton', price: 899, image: '/placeholder.svg?height=400&width=500', description: 'Energy efficient window AC perfect for small rooms' },
    { id: 2, name: 'Window AC - 1.5 Ton', category: 'Window AC', capacity: '1.5 Ton', price: 1199, image: '/placeholder.svg?height=400&width=500', description: 'Powerful cooling for medium-sized rooms' },
  ],
  'cooling-split-ac': [
    { id: 3, name: 'Split AC - 1 Ton', category: 'Split AC', capacity: '1 Ton', price: 1499, image: '/placeholder.svg?height=400&width=500', description: 'Premium inverter split AC with smart controls' },
    { id: 4, name: 'Split AC - 1.5 Ton', category: 'Split AC', capacity: '1.5 Ton', price: 1899, image: '/placeholder.svg?height=400&width=500', description: '5-star rated split AC with Wi-Fi control' },
    { id: 5, name: 'Split AC - 2 Ton', category: 'Split AC', capacity: '2 Ton', price: 2399, image: '/placeholder.svg?height=400&width=500', description: 'Heavy-duty split AC for large spaces' },
  ],
  'heating-oil-heater': [
    { id: 6, name: 'Oil Heater - 5 Fin', category: 'Oil Heater', capacity: '5 Fins', price: 599, image: '/placeholder.svg?height=400&width=500', description: 'Compact portable oil heater' },
    { id: 7, name: 'Oil Heater - 7 Fin', category: 'Oil Heater', capacity: '7 Fins', price: 799, image: '/placeholder.svg?height=400&width=500', description: 'Fast heating for medium rooms' },
    { id: 8, name: 'Oil Heater - 9 Fin', category: 'Oil Heater', capacity: '9 Fins', price: 999, image: '/placeholder.svg?height=400&width=500', description: 'Maximum coverage oil heater' },
    { id: 9, name: 'Oil Heater - 11 Fin', category: 'Oil Heater', capacity: '11 Fins', price: 1299, image: '/placeholder.svg?height=400&width=500', description: 'Large room coverage with remote control' },
  ],
}

function slugToKey(category: string, subcategory: string): string {
  return `${category}-${subcategory}`
}

function findProductBySlug(category: string, subcategory: string, slug: string) {
  const key = slugToKey(category, subcategory)
  const products = allProducts[key] || []
  
  // Find product that matches the slug
  return products.find(product => {
    const productSlug = `${product.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')}-${product.capacity.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')}`
    return productSlug === slug
  })
}

export default function ProductDetailPage({ params }: Props) {
  const { category, subcategory, slug } = params
  const [selectedVariant, setSelectedVariant] = useState('1.0')
  const [selectedPlan, setSelectedPlan] = useState('monthly')

  // Validate route
  const routeInfo = parseCategoryUrl(category, subcategory)
  
  if (!routeInfo) {
    return (
      <main className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
            <Button asChild>
              <Link href="/">Back to Home</Link>
            </Button>
          </div>
        </div>
        <Footer />
      </main>
    )
  }

  const product = findProductBySlug(category, subcategory, slug)

  if (!product) {
    return (
      <main className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
            <Button asChild>
              <Link href="/">Back to Home</Link>
            </Button>
          </div>
        </div>
        <Footer />
      </main>
    )
  }

  // Product data
  const basePrice = product.price
  const isCooling = category === 'cooling'

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

  const variantPrice = Math.round(basePrice * (selectedVariantData?.multiplier || 1))
  const monthlyPrice = variantPrice
  const discountedPrice = Math.round(monthlyPrice * (1 - (selectedPlanData?.discount || 0) / 100))
  const totalPrice = discountedPrice * (selectedPlanData?.months || 1)

  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: category.charAt(0).toUpperCase() + category.slice(1), href: `/${category}` },
    { label: subcategory.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '), href: `/${category}/${subcategory}` },
    { label: product.name, href: '#' },
  ]

  return (
    <main className="min-h-screen relative z-10 flex flex-col">
      <Header />
      
      <div className="flex-1 py-8 md:py-12 lg:py-16 px-4 md:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          {/* Breadcrumb Navigation */}
          <div className="mb-8 flex items-center gap-2 text-sm">
            {breadcrumbs.map((breadcrumb, index) => (
              <div key={index} className="flex items-center gap-2">
                {breadcrumb.href === '#' ? (
                  <span className="text-muted-foreground">{breadcrumb.label}</span>
                ) : (
                  <Link href={breadcrumb.href} className="text-primary hover:underline">
                    {breadcrumb.label}
                  </Link>
                )}
                {index < breadcrumbs.length - 1 && <span className="text-muted-foreground">/</span>}
              </div>
            ))}
          </div>

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
                <Badge className={`mb-3 ${isCooling ? 'bg-blue-600' : 'bg-orange-600'}`}>
                  {isCooling ? 'Air Conditioner' : 'Heater'}
                </Badge>
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
                            ? `border-${isCooling ? 'blue' : 'orange'}-600 ${isCooling ? 'bg-blue-50 dark:bg-blue-950' : 'bg-orange-50 dark:bg-orange-950'}`
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <div className="font-semibold">{variant.name}</div>
                        <div className="text-sm text-muted-foreground">₹{Math.round(basePrice * variant.multiplier)}/mo</div>
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
                          ? `border-${isCooling ? 'blue' : 'orange'}-600 ${isCooling ? 'bg-blue-50 dark:bg-blue-950' : 'bg-orange-50 dark:bg-orange-950'}`
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
              <Card className={`border-2 ${isCooling ? 'border-blue-600/20' : 'border-orange-600/20'}`}>
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
                  <div className={`border-t pt-3 flex justify-between text-lg ${isCooling ? 'text-blue-600' : 'text-orange-600'}`}>
                    <span className="font-bold">Total Cost:</span>
                    <span className="font-bold">₹{totalPrice}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button asChild className={`flex-1 ${isCooling ? 'bg-blue-600 hover:bg-blue-700' : 'bg-orange-600 hover:bg-orange-700'} h-12`} size="lg">
                  <Link href={`/booking/${product.id}?variant=${selectedVariant}&plan=${selectedPlan}`}>
                    Continue to Booking
                  </Link>
                </Button>
              </div>
            </div>
          </div>

          {/* Features & Specs */}
          <Tabs defaultValue="features" className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="features">Features</TabsTrigger>
              <TabsTrigger value="specs">Specifications</TabsTrigger>
            </TabsList>

            <TabsContent value="features" className="mt-6">
              <Card>
                <CardContent className="pt-6">
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <Check className={`w-5 h-5 ${isCooling ? 'text-blue-600' : 'text-orange-600'} flex-shrink-0 mt-0.5`} />
                      <span>Free professional installation included</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className={`w-5 h-5 ${isCooling ? 'text-blue-600' : 'text-orange-600'} flex-shrink-0 mt-0.5`} />
                      <span>24/7 customer support</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className={`w-5 h-5 ${isCooling ? 'text-blue-600' : 'text-orange-600'} flex-shrink-0 mt-0.5`} />
                      <span>Maintenance included</span>
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
                      <h4 className="font-semibold mb-2">Capacity</h4>
                      <p className="text-muted-foreground">{product.capacity}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Price</h4>
                      <p className="text-muted-foreground">₹{basePrice}/month</p>
                    </div>
                  </div>
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
