'use client'

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { Wind, Zap, Leaf } from 'lucide-react'

export default function CoolingCategoryPage() {
  const subcategories = [
    {
      id: 'window-ac',
      name: 'Window AC Units',
      description: 'Compact and affordable cooling solutions perfect for single rooms and small spaces.',
      icon: Wind,
      href: '/cooling/window-ac',
      benefits: ['Easy installation', 'Space-saving', 'Affordable', 'Perfect for apartments'],
    },
    {
      id: 'split-ac',
      name: 'Split AC Systems',
      description: 'Modern, efficient cooling with inverter technology and smart controls for comprehensive comfort.',
      icon: Zap,
      href: '/cooling/split-ac',
      benefits: ['Energy efficient', 'Whisper quiet', 'Smart controls', 'Superior cooling'],
    },
  ]

  return (
    <main className="min-h-screen flex flex-col">
      <Header />

      <div className="flex-1 py-12 md:py-16 lg:py-20 px-4 md:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          {/* Header */}
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-4">
              <Wind className="w-8 h-8 text-blue-600" />
              <Badge className="bg-blue-600">Cooling Solutions</Badge>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Air Conditioning & Cooling</h1>
            <p className="text-xl text-muted-foreground max-w-2xl">
              Discover our premium collection of air conditioning units designed to keep you cool and comfortable all year round. From compact window units to advanced split systems, we have the perfect solution for your needs.
            </p>
          </div>

          {/* Subcategories Grid */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {subcategories.map(subcategory => {
              const Icon = subcategory.icon
              return (
                <Card key={subcategory.id} className="hover:shadow-lg transition-all duration-300 flex flex-col">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-4">
                      <Icon className="w-8 h-8 text-blue-600" />
                      <Badge className="bg-blue-100 text-blue-700">Popular</Badge>
                    </div>
                    <CardTitle className="text-2xl">{subcategory.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1 space-y-6">
                    <p className="text-muted-foreground">{subcategory.description}</p>
                    
                    <div>
                      <h4 className="font-semibold mb-3">Key Benefits:</h4>
                      <ul className="space-y-2">
                        {subcategory.benefits.map((benefit, index) => (
                          <li key={index} className="flex items-center gap-2 text-sm">
                            <Leaf className="w-4 h-4 text-green-600 flex-shrink-0" />
                            <span>{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <Button asChild className="w-full bg-blue-600 hover:bg-blue-700" size="lg">
                      <Link href={subcategory.href}>
                        Browse {subcategory.name.split(' ')[0]}
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Why Choose Our AC Units */}
          <div className="bg-blue-50 dark:bg-blue-950/20 rounded-2xl p-8 md:p-12 mb-16">
            <h2 className="text-3xl font-bold mb-8">Why Choose Our Cooling Solutions?</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-3">Energy Efficient</h3>
                <p className="text-muted-foreground">5-star rated units that save on electricity bills while maintaining optimal cooling performance.</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-3">Professional Installation</h3>
                <p className="text-muted-foreground">Free expert installation and setup included with every rental for hassle-free comfort.</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-3">24/7 Support</h3>
                <p className="text-muted-foreground">Round-the-clock customer support and emergency maintenance services available anytime.</p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center space-y-6">
            <h2 className="text-3xl font-bold">Ready to Stay Cool?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Choose from our wide range of air conditioning solutions with flexible rental plans starting from just ₹899/month.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Button asChild className="bg-blue-600 hover:bg-blue-700" size="lg">
                <Link href="/cooling/window-ac">Explore Window AC</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/cooling/split-ac">Explore Split AC</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
