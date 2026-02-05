"use client"

import { Search, Calendar, Truck, ThumbsUp, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const steps = [
  {
    icon: Search,
    title: "Browse Products",
    description: "Explore our range of ACs and heaters to find the perfect fit for your space.",
    gradient: "gradient-primary",
    bgGradient: "from-primary/5 via-primary/10 to-primary/5",
  },
  {
    icon: Calendar,
    title: "Select Your Plan",
    description: "Choose a rental period that works for you - monthly, quarterly, or yearly.",
    gradient: "gradient-accent",
    bgGradient: "from-accent/5 via-accent/10 to-accent/5",
  },
  {
    icon: Truck,
    title: "We Deliver & Install",
    description: "Our team brings the unit to your location and handles professional installation.",
    gradient: "gradient-secondary",
    bgGradient: "from-secondary/5 via-secondary/10 to-secondary/5",
  },
  {
    icon: ThumbsUp,
    title: "Enjoy Comfort",
    description: "Relax in perfect temperature with 24/7 support whenever you need it.",
    gradient: "gradient-primary",
    bgGradient: "from-primary/5 via-primary/10 to-primary/5",
  },
]

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="py-20 md:py-28 lg:py-36 bg-gradient-to-b from-background via-muted/20 to-background relative overflow-hidden px-4 md:px-6 lg:px-8"
    >
      <div className="absolute top-0 left-1/4 w-96 h-96 gradient-primary rounded-full blur-3xl opacity-5 animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 gradient-accent rounded-full blur-3xl opacity-5 animate-pulse delay-1000" />

      <div className="container mx-auto max-w-7xl relative z-10">
        <div className="text-center space-y-6 mb-16 md:mb-20 lg:mb-24">
          <div className="inline-block px-4 py-2 bg-primary/10 rounded-full mb-4">
            <p className="text-sm font-semibold text-primary">Simple Process</p>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
            How It{" "}
            <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
              Works
            </span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto text-balance leading-relaxed">
            Get started in four simple steps. It's quick, easy, and completely hassle-free. No hidden charges, no
            complicated contracts.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6 relative mb-16">
          <div className="hidden lg:block absolute top-[4.5rem] left-[12.5%] right-[12.5%] h-0.5">
            <div className="w-full h-full bg-gradient-to-r from-primary via-accent to-secondary opacity-20 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent animate-shimmer" />
            </div>
          </div>

          {steps.map((step, index) => {
            const Icon = step.icon
            return (
              <div key={index} className="relative flex flex-col items-center group">
                <div className="absolute -top-3 -left-3 z-20 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-background to-muted border-4 border-primary shadow-lg">
                  <span className="text-lg font-bold bg-gradient-to-br from-primary to-accent bg-clip-text text-transparent">
                    {index + 1}
                  </span>
                </div>

                <div
                  className={`relative w-full h-full rounded-3xl bg-gradient-to-br ${step.bgGradient} p-8 border-2 border-muted hover:border-primary/30 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 overflow-visible`}
                >
                  <div className="absolute inset-0 bg-grid-pattern opacity-5" />

                  <div className="relative z-10 flex flex-col items-center text-center space-y-5">
                    <div
                      className={`flex h-20 w-20 items-center justify-center rounded-2xl ${step.gradient} relative shadow-xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}
                    >
                      <Icon className="h-10 w-10 text-white relative z-10" />
                      <div className="absolute inset-0 rounded-2xl bg-white/20 blur-xl group-hover:blur-2xl transition-all" />
                    </div>

                    <h3 className="text-xl md:text-2xl font-bold tracking-tight">{step.title}</h3>
                    <p className="text-muted-foreground text-balance leading-relaxed text-sm md:text-base">
                      {step.description}
                    </p>
                  </div>

                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute -right-6 top-1/2 -translate-y-1/2 z-30">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-background border-2 border-primary/20 shadow-md">
                        <ArrowRight className="h-5 w-5 text-primary" />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        <div className="text-center space-y-6 mt-16 p-8 md:p-12 rounded-3xl bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/5 border-2 border-muted">
          <h3 className="text-2xl md:text-3xl font-bold">Ready to Get Started?</h3>
          <p className="text-muted-foreground max-w-2xl mx-auto text-balance">
            Browse our products and start enjoying perfect climate control today. No commitment required.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/#products">
              <Button
                size="lg"
                className="gradient-primary text-white shadow-xl hover:shadow-2xl hover:scale-105 transition-all text-lg px-8 py-6"
              >
                Browse Products
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/auth/sign-up">
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 hover:bg-primary/5 bg-transparent">
                Create Account
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 3s infinite;
        }
        .bg-grid-pattern {
          background-image: 
            linear-gradient(to right, currentColor 1px, transparent 1px),
            linear-gradient(to bottom, currentColor 1px, transparent 1px);
          background-size: 20px 20px;
        }
        .delay-1000 {
          animation-delay: 1s;
        }
      `}</style>
    </section>
  )
}
