'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Share2, Heart, Check } from 'lucide-react'
import Link from 'next/link'

interface ProductDetailClientProps {
  productId: string
}

export function ProductDetailClient({ productId }: ProductDetailClientProps) {
  const [product, setProduct] = useState<any>(null)
  const [selectedVariant, setSelectedVariant] = useState<string>('var-1')
  const [selectedPlan, setSelectedPlan] = useState<string>('plan-2')
  const [loading, setLoading] = useState(true)

  // Mock product data
  const mockProduct = {
    id: productId,
    name: 'Split AC Unit - Premium Series',
    category: 'Split AC',
    price: 1499,
    description: 'Energy-efficient inverter split AC with smart temperature control and whisper-quiet operation.',
    image: '/placeholder.svg?height=500&width=500',
  }

  const mockVariants = [
    {
      id: 'var-1',
      name: '1.0 Ton Inverter',
      capacity: '1.0 Ton',
      color: '#FFFFFF',
      specifications: {
        'energy_rating': '5 Star',
        'cooling_capacity': '1.0 Ton',
        'noise_level': '22 dB',
      },
      priceMultiplier: 1.0,
      image: mockProduct.image,
    },
    {
      id: 'var-2',
      name: '1.5 Ton Inverter',
      capacity: '1.5 Ton',
      color: '#FFFFFF',
      specifications: {
        'energy_rating': '5 Star',
        'cooling_capacity': '1.5 Ton',
        'noise_level': '22 dB',
      },
      priceMultiplier: 1.15,
      image: mockProduct.image,
    },
    {
      id: 'var-3',
      name: '2.0 Ton Inverter',
      capacity: '2.0 Ton',
      color: '#FFFFFF',
      specifications: {
        'energy_rating': '5 Star',
        'cooling_capacity': '2.0 Ton',
        'noise_level': '23 dB',
      },
      priceMultiplier: 1.3,
      image: mockProduct.image,
    },
  ]

  const mockPlans = [
    {
      id: 'plan-1',
      name: 'Monthly',
      description: 'Flexible month-to-month rental',
      durationMonths: 1,
      discountPercentage: 0,
      features: [
        'Free professional installation',
        'Basic maintenance and support',
        '24/7 customer support',
        'No long-term commitment',
      ],
      isPopular: false,
      displayOrder: 1,
    },
    {
      id: 'plan-2',
      name: 'Quarterly',
      description: '3 months - Best value for short-term',
      durationMonths: 3,
      discountPercentage: 10,
      features: [
        'Free professional installation',
        'Priority maintenance and support',
        '24/7 customer support',
        'One free relocation',
        '3-month extended warranty',
      ],
      isPopular: true,
      displayOrder: 2,
    },
    {
      id: 'plan-3',
      name: 'Annual',
      description: '12 months - Maximum savings',
      durationMonths: 12,
      discountPercentage: 20,
      features: [
        'Free professional installation',
        'Premium maintenance and support',
        '24/7 priority customer support',
        'Up to 3 free relocations',
        'Full 12-month extended warranty',
        'Free annual servicing',
      ],
      isPopular: false,
      displayOrder: 3,
    },
  ]

  useEffect(() => {
    setProduct(mockProduct)
    setLoading(false)
  }, [])

  if (loading) {
    return <div className="container mx-auto py-8">Loading...</div>
  }

  const currentVariant = mockVariants.find(v => v.id === selectedVariant)
  const currentPlan = mockPlans.find(p => p.id === selectedPlan)
  const variantPrice = Math.round(product.price * (currentVariant?.priceMultiplier || 1))
  const finalPrice = Math.round(variantPrice * (1 - (currentPlan?.discountPercentage || 0) / 100))

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8 md:px-6 lg:px-8">
      {/* Breadcrumb */}
      <div className="flex items-center justify-between mb-8">
        <Link href="/#products" className="inline-flex items-center gap-2 text-primary hover:underline">
          <ArrowLeft className="w-4 h-4" />
          Back to Products
        </Link>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
          <Button variant="outline" size="sm">
            <Heart className="w-4 h-4 mr-2" />
            Save
          </Button>
        </div>
      </div>

      {/* Product Header */}
      <div className="grid lg:grid-cols-2 gap-8 mb-12">
        {/* Product Image */}
        <div className="space-y-4">
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-muted shadow-lg">
            <img
              src={product.image || '/placeholder.svg?height=500&width=500'}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="grid grid-cols-4 gap-2">
            {[1, 2, 3, 4].map((i) => (
              <button
                key={i}
                className="aspect-square rounded-lg border-2 border-border hover:border-primary transition-colors overflow-hidden"
              >
                <img
                  src={product.image || '/placeholder.svg?height=100&width=100'}
                  alt={`View ${i}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-3">
              {product.category}
            </div>
            <h1 className="text-4xl font-bold mb-2">{product.name}</h1>
            <p className="text-lg text-muted-foreground">{product.description}</p>
          </div>

          {/* Base Price */}
          <div className="p-6 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
            <div className="text-sm text-muted-foreground mb-1">Starting Price</div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-primary">₹{product.price?.toLocaleString()}</span>
              <span className="text-muted-foreground">/month</span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">Prices vary by capacity and plan duration</p>
          </div>

          {/* Key Features */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Key Features</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {['Energy efficient technology', 'Whisper-quiet operation', 'Smart temperature control', 'Easy installation'].map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-sm">
                    <Check className="w-4 h-4 text-primary" />
                    {feature}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* CTA Button */}
          <Button size="lg" className="w-full" asChild>
            <Link href={`/booking/${productId}`}>Proceed to Booking</Link>
          </Button>
        </div>
      </div>

      {/* Variants and Plans Section */}
      <Card className="border-2 mb-12">
        <CardHeader>
          <CardTitle>Customize Your Rental</CardTitle>
          <CardDescription>
            Select your preferred capacity and choose the rental duration that works best for you
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Variants Selection */}
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-4">Select Capacity</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {mockVariants.map((variant) => (
                  <button
                    key={variant.id}
                    onClick={() => setSelectedVariant(variant.id)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      selectedVariant === variant.id
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <div className="font-semibold text-left">{variant.name}</div>
                    <div className="text-sm text-muted-foreground text-left">{variant.capacity}</div>
                    <div className="text-sm mt-2 text-left">₹{Math.round(product.price * variant.priceMultiplier).toLocaleString()}/month</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Plans Selection */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Select Rental Plan</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {mockPlans.map((plan) => (
                  <button
                    key={plan.id}
                    onClick={() => setSelectedPlan(plan.id)}
                    className={`p-4 rounded-lg border-2 transition-all text-left ${
                      selectedPlan === plan.id
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-semibold">{plan.name}</div>
                      {plan.isPopular && <Badge className="bg-green-600">Popular</Badge>}
                    </div>
                    <div className="text-sm text-muted-foreground">{plan.description}</div>
                    <div className="text-sm mt-2 font-semibold">
                      {plan.discountPercentage > 0 && (
                        <span className="text-green-600">{plan.discountPercentage}% OFF • </span>
                      )}
                      ₹{finalPrice.toLocaleString()}/month
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Price Summary */}
            <div className="bg-muted/50 p-6 rounded-lg border">
              <div className="flex justify-between items-center mb-4">
                <span className="text-muted-foreground">Base Price ({currentVariant?.capacity}):</span>
                <span className="font-semibold">₹{variantPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center mb-4 pb-4 border-b">
                <span className="text-muted-foreground">Duration: {currentPlan?.durationMonths} month(s)</span>
              </div>
              {currentPlan?.discountPercentage > 0 && (
                <div className="flex justify-between items-center mb-4 text-green-600">
                  <span>Discount ({currentPlan?.discountPercentage}%):</span>
                  <span>-₹{Math.round(variantPrice * currentPlan.discountPercentage / 100).toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between items-center text-xl font-bold">
                <span>Monthly Price:</span>
                <span className="text-primary">₹{finalPrice.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Specifications and Reviews */}
      <Tabs defaultValue="specs" className="mb-12">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="specs">Specifications</TabsTrigger>
          <TabsTrigger value="warranty">Warranty & Support</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
        </TabsList>

        <TabsContent value="specs" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Product Specifications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-4">Selected Variant: {currentVariant?.name}</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    {Object.entries(currentVariant?.specifications || {}).map(([key, value]) => (
                      <div key={key}>
                        <div className="text-sm font-medium text-muted-foreground capitalize">{key.replace(/_/g, ' ')}</div>
                        <div className="text-lg font-semibold">{value as string}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="warranty" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Warranty & Support Coverage</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {mockPlans.map((plan) => (
                  <div key={plan.id} className={`p-4 rounded-lg ${selectedPlan === plan.id ? 'bg-primary/5 border border-primary' : 'bg-muted/30'}`}>
                    <h4 className="font-semibold mb-2">{plan.name} Plan</h4>
                    <ul className="space-y-2">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-sm">
                          <Check className="w-4 h-4 text-primary" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reviews" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Customer Reviews</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Reviews coming soon!</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
