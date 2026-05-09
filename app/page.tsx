import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { ProductGrid } from "@/components/product-grid"
import { SeasonalPlans } from "@/components/seasonal-plans"
import { Features } from "@/components/features"
import { HowItWorks } from "@/components/how-it-works"
import { Footer } from "@/components/footer"
import { Snowflakes } from "@/components/snowflakes"

export default function Home() {
  return (
    <main className="min-h-screen relative z-10">
      <Snowflakes />
      <Header />
      <div className="space-y-0 md:space-y-0 lg:space-y-0">
        <Hero />
        <div className="px-4 md:px-6 lg:px-8 py-8 md:py-12">
          <ProductGrid />
        </div>
        <SeasonalPlans />
        <div className="px-4 md:px-6 lg:px-8 py-8 md:py-12">
          <Features />
        </div>
        <div className="px-4 md:px-6 lg:px-8 py-8 md:py-12">
          <HowItWorks />
        </div>
      </div>
      <Footer />
    </main>
  )
}
