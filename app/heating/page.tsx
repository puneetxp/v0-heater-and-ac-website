'use client'

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { Flame, Zap, Leaf } from 'lucide-react'

export default function HeatingCategoryPage() {
  const subcategories = [
    {
      id: 'oil-heater',
      name: 'Oil Heaters',
      description: 'Reliable and efficient oil-filled radiator heaters that provide consistent warmth and comfort during cold winters.',
      icon: Flame,
      href: '/heating/oil-heater',
      benefits: ['Fast heating', 'Energy efficient', 'Portable', 'Safety features'],
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
              <Flame className="w-8 h-8 text-orange-600" />
              <Badge className="bg-orange-600">Heating Solutions</Badge>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Heating Systems</h1>
            <p className="text-xl text-muted-foreground max-w-2xl">
              Stay warm and cozy during winter with our premium heating solutions. Choose from portable oil heaters with various sizes to match your heating needs perfectly.
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
                      <Icon className="w-8 h-8 text-orange-600" />
                      <Badge className="bg-orange-100 text-orange-700">Popular</Badge>
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
                            <Leaf className="w-4 h-4 text-orange-600 flex-shrink-0" />
                            <span>{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <Button asChild className="w-full bg-orange-600 hover:bg-orange-700" size="lg">
                      <Link href={subcategory.href}>
                        Browse {subcategory.name}
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Why Choose Our Heaters */}
          <div className="bg-orange-50 dark:bg-orange-950/20 rounded-2xl p-8 md:p-12 mb-16">
            <h2 className="text-3xl font-bold mb-8">Why Choose Our Heating Solutions?</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-3">Quick Heating</h3>
                <p className="text-muted-foreground">Fast-acting heaters that warm up your space in minutes, providing instant comfort when you need it.</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-3">Safety First</h3>
                <p className="text-muted-foreground">Advanced safety features including tip-over protection and auto shut-off for your peace of mind.</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-3">Portable Design</h3>
                <p className="text-muted-foreground">Easy to move between rooms with wheels, making it flexible for your changing heating needs.</p>
              </div>
            </div>
          </div>

          {/* Heater Sizes */}
          <div className="bg-muted/50 rounded-2xl p-8 md:p-12 mb-16">
            <h2 className="text-3xl font-bold mb-8">Choose the Right Size for Your Space</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { name: '5 Fin', space: 'Small rooms (up to 100 sq ft)', price: '₹599' },
                { name: '7 Fin', space: 'Medium rooms (100-200 sq ft)', price: '₹799' },
                { name: '9 Fin', space: 'Large rooms (200-300 sq ft)', price: '₹999' },
                { name: '11 Fin', space: 'Extra-large spaces (300+ sq ft)', price: '₹1,299' },
              ].map((size, index) => (
                <Card key={index} className="text-center">
                  <CardContent className="pt-6 space-y-3">
                    <h3 className="text-lg font-semibold">{size.name}</h3>
                    <p className="text-sm text-muted-foreground">{size.space}</p>
                    <p className="text-2xl font-bold text-orange-600">{size.price}/mo</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="text-center space-y-6">
            <h2 className="text-3xl font-bold">Stay Warm This Winter</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Rent a high-quality oil heater with flexible plans and enjoy warm, comfortable winters without the commitment of buying.
            </p>
            <Button asChild className="bg-orange-600 hover:bg-orange-700" size="lg">
              <Link href="/heating/oil-heater">Browse Oil Heaters</Link>
            </Button>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
