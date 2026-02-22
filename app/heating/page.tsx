'use client'

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { Flame, Zap, Leaf, ArrowRight } from 'lucide-react'

export default function HeatingCategoryPage() {
  const subcategories = [
    {
      id: 'oil-heater',
      name: 'Oil Heaters',
      description: 'Reliable and efficient oil-filled radiator heaters that provide consistent warmth and comfort during cold winters.',
      icon: Flame,
      href: '/heating/oil-heater',
      benefits: ['Fast heating', 'Energy efficient', 'Portable', 'Safety features'],
      color: 'from-orange-500 to-yellow-500',
      bgColor: 'from-orange-50 to-yellow-50',
    },
  ]

  return (
    <main className="min-h-screen flex flex-col bg-white">
      <Header />

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-orange-50 via-orange-50 to-red-50 pt-12 md:pt-20 pb-12 md:pb-20 px-4 md:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <div className="max-w-3xl">
            <Badge className="mb-4 bg-orange-600 text-white px-4 py-1">Heating Solutions</Badge>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Stay Warm & Cozy All Winter
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              Stay warm and cozy with our premium heating solutions. Choose from reliable oil heaters with various sizes to match your heating needs perfectly.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 py-16 md:py-20 px-4 md:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          {/* Subcategories Grid */}
          <div className="grid md:grid-cols-2 gap-8 mb-20">
            {subcategories.map(subcategory => {
              const Icon = subcategory.icon
              return (
                <div key={subcategory.id} className="group">
                  <Link href={subcategory.href}>
                    <Card className="hover:shadow-2xl transition-all duration-300 flex flex-col overflow-hidden cursor-pointer border-0 h-full bg-white rounded-2xl shadow-lg">
                      {/* Header Background */}
                      <div className={`h-32 bg-gradient-to-br ${subcategory.bgColor} flex items-center justify-center relative overflow-hidden`}>
                        <Icon className="h-16 w-16 text-orange-300 opacity-20" />
                      </div>
                      
                      <CardContent className="p-6 flex-1 flex flex-col">
                        <div className="mb-4">
                          <h3 className="text-2xl font-bold text-gray-900 mb-2">{subcategory.name}</h3>
                          <p className="text-gray-600">{subcategory.description}</p>
                        </div>
                        
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 mb-3">Key Benefits:</h4>
                          <ul className="space-y-2">
                            {subcategory.benefits.map((benefit, index) => (
                              <li key={index} className="flex items-center gap-2 text-gray-700">
                                <Leaf className="w-4 h-4 text-orange-600 flex-shrink-0" />
                                <span className="text-sm">{benefit}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="mt-6 flex items-center gap-2 text-orange-600 font-semibold group-hover:gap-3 transition-all">
                          Browse {subcategory.name}
                          <ArrowRight className="h-4 w-4" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </div>
              )
            })}
          </div>

          {/* Why Choose Section */}
          <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-3xl p-8 md:p-12 mb-20">
            <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">Why Choose Our Heating Solutions?</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-orange-600 text-white mb-4">
                  <Flame className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Quick Heating</h3>
                <p className="text-gray-600">Fast-acting heaters that warm up your space in minutes, providing instant comfort when you need it most.</p>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-orange-600 text-white mb-4">
                  <Zap className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Safety First</h3>
                <p className="text-gray-600">Advanced safety features including tip-over protection and auto shut-off for your complete peace of mind.</p>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-orange-600 text-white mb-4">
                  <Leaf className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Portable Design</h3>
                <p className="text-gray-600">Easy to move between rooms with wheels, making heating flexible for your changing seasonal needs.</p>
              </div>
            </div>
          </div>

          {/* Heater Sizes */}
          <div className="mb-20">
            <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">Choose the Right Size for Your Space</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { name: '7 Fin', space: 'Medium rooms (100-200 sq ft)', price: '₹799' },
                { name: '9 Fin', space: 'Large rooms (200-300 sq ft)', price: '₹999' },
                { name: '11 Fin', space: 'Extra-large spaces (300+ sq ft)', price: '₹1,299' },
              ].map((size, index) => (
                <Card key={index} className="text-center border-0 shadow-lg hover:shadow-xl transition-all rounded-2xl">
                  <CardContent className="pt-8 pb-8 space-y-4">
                    <h3 className="text-2xl font-bold text-gray-900">{size.name}</h3>
                    <p className="text-sm text-gray-600">{size.space}</p>
                    <div className="pt-4 border-t">
                      <p className="text-3xl font-bold text-orange-600">{size.price}</p>
                      <p className="text-xs text-gray-500 mt-1">/month</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center space-y-8">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Stay Warm This Winter</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Rent a high-quality oil heater with flexible plans and enjoy warm, comfortable winters without the commitment of buying.
              </p>
            </div>
            <Button asChild className="bg-orange-600 hover:bg-orange-700 h-12 px-8 text-base" size="lg">
              <Link href="/heating/oil-heater">Browse Oil Heaters</Link>
            </Button>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
