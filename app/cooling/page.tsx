'use client'

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { Wind, Zap, Leaf, ArrowRight } from 'lucide-react'

export default function CoolingCategoryPage() {
  const subcategories = [
    {
      id: 'window-ac',
      name: 'Window AC Units',
      description: 'Compact and affordable cooling solutions perfect for single rooms and small spaces.',
      icon: Wind,
      href: '/cooling/window-ac',
      benefits: ['Easy installation', 'Space-saving', 'Budget-friendly', 'Perfect for apartments'],
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'from-blue-50 to-cyan-50',
    },
    {
      id: 'split-ac',
      name: 'Split AC Systems',
      description: 'Modern, efficient cooling with inverter technology and smart controls for comprehensive comfort.',
      icon: Zap,
      href: '/cooling/split-ac',
      benefits: ['Energy efficient', 'Ultra quiet', 'Smart Wi-Fi', 'Superior cooling'],
      color: 'from-cyan-500 to-blue-600',
      bgColor: 'from-cyan-50 to-blue-50',
    },
  ]

  return (
    <main className="min-h-screen flex flex-col bg-white">
      <Header />

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-50 via-blue-50 to-cyan-50 pt-12 md:pt-20 pb-12 md:pb-20 px-4 md:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <div className="max-w-3xl">
            <Badge className="mb-4 bg-blue-600 text-white px-4 py-1">Cooling Solutions</Badge>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Beat the Heat with Premium AC Rentals
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              Discover our premium collection of air conditioning units designed to keep you cool and comfortable. From compact window units to advanced split systems with smart controls, we have the perfect solution for your needs.
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
                        <Icon className="h-16 w-16 text-blue-300 opacity-20" />
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
                                <Leaf className="w-4 h-4 text-green-600 flex-shrink-0" />
                                <span className="text-sm">{benefit}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="mt-6 flex items-center gap-2 text-blue-600 font-semibold group-hover:gap-3 transition-all">
                          Browse {subcategory.name.split(' ')[0]}
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
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-3xl p-8 md:p-12 mb-20">
            <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">Why Choose Our Cooling Solutions?</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-blue-600 text-white mb-4">
                  <Zap className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Energy Efficient</h3>
                <p className="text-gray-600">5-star rated units that save up to 40% on electricity bills while delivering optimal cooling performance.</p>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-blue-600 text-white mb-4">
                  <Wind className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Professional Installation</h3>
                <p className="text-gray-600">Free expert installation and setup included with every rental for a hassle-free cooling experience.</p>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-blue-600 text-white mb-4">
                  <Leaf className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">24/7 Support</h3>
                <p className="text-gray-600">Round-the-clock customer support and emergency maintenance services available whenever you need us.</p>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center space-y-8">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Ready to Stay Cool?</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Choose from our wide range of air conditioning solutions with flexible rental plans starting from just ₹899/month.
              </p>
            </div>
            <div className="flex gap-4 justify-center flex-wrap">
              <Button asChild className="bg-blue-600 hover:bg-blue-700 h-12 px-8 text-base" size="lg">
                <Link href="/cooling/window-ac">Explore Window AC</Link>
              </Button>
              <Button asChild variant="outline" className="h-12 px-8 text-base border-2 border-gray-300" size="lg">
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
