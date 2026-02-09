import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ProductVariants } from '@/components/product-variants'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ArrowLeft, Share2, Heart } from 'lucide-react'
import Link from 'next/link'

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  // Get product details
  const { data: product, error: productError } = await supabase.from('products').select('*').eq('id', id).single()

  if (productError || !product) {
    redirect('/')
  }

  // Get product variants (for now using mock data, will integrate with DB)
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
      image: product.image,
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
      image: product.image,
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
      image: product.image,
    },
  ]

  // Get product plans (for now using mock data, will integrate with DB)
  const mockPlans = [
    {
      id: 'plan-1',
      name: 'Monthly',
      description: 'Flexible month-to-month rental',
      durationMonths: 1,
      discountPercentage: 0,
      includesInstallation: true,
      includesMaintenance: true,
      includesWarranty: false,
      maxRelocations: 0,
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
      includesInstallation: true,
      includesMaintenance: true,
      includesWarranty: true,
      warrantyMonths: 3,
      maxRelocations: 1,
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
      includesInstallation: true,
      includesMaintenance: true,
      includesWarranty: true,
      warrantyMonths: 12,
      maxRelocations: 3,
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

  // Mock variant-plan pricing
  const mockVariantPlans = mockVariants.flatMap((variant) =>
    mockPlans.map((plan) => ({
      variantId: variant.id,
      planId: plan.id,
      basePrice: product.price * (variant.priceMultiplier || 1),
      finalPrice: Math.round(product.price * (variant.priceMultiplier || 1) * (1 - plan.discountPercentage / 100)),
    }))
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 dark:from-slate-950 dark:via-blue-950 dark:to-cyan-950">
      <Header />
      
      <main className="container mx-auto max-w-6xl px-4 py-8 md:px-6 lg:px-8">
        {/* Breadcrumb & Header */}
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
                      <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* CTA Button */}
            <Button size="lg" className="w-full" asChild>
              <Link href={`/booking/${id}`}>Proceed to Booking</Link>
            </Button>
          </div>
        </div>

        {/* Variants and Plans Section */}
        <Card className="border-2">
          <CardHeader>
            <CardTitle>Customize Your Rental</CardTitle>
            <CardDescription>
              Select your preferred capacity and choose the rental duration that works best for you
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ProductVariants
              productId={id}
              variants={mockVariants}
              plans={mockPlans}
              variantPlans={mockVariantPlans}
              basePrice={product.price}
            />
          </CardContent>
        </Card>

        {/* Specifications and Reviews */}
        <Tabs defaultValue="specs" className="mt-12">
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
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <div className="text-sm font-medium text-muted-foreground">Model</div>
                      <div className="text-lg font-semibold">{product.name}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-muted-foreground">Category</div>
                      <div className="text-lg font-semibold capitalize">{product.category}</div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <div className="text-sm font-medium text-muted-foreground">Availability</div>
                      <div className="text-lg font-semibold">In Stock</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-muted-foreground">Warranty</div>
                      <div className="text-lg font-semibold">Varies by plan</div>
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
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Monthly Plan</h4>
                    <p className="text-sm text-muted-foreground">Basic maintenance covered. 24/7 support available.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Quarterly Plan</h4>
                    <p className="text-sm text-muted-foreground">3-month extended warranty. Priority maintenance. One free relocation included.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Annual Plan</h4>
                    <p className="text-sm text-muted-foreground">Full 12-month extended warranty. Premium maintenance. Up to 3 free relocations. Annual servicing included.</p>
                  </div>
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
                <p className="text-muted-foreground">Reviews will be displayed here. Coming soon!</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  )
}
