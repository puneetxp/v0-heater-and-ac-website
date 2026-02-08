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
    <main className="min-h-screen relative">
      <Snowflakes />
      <Header />
      <div className="space-y-16 md:space-y-24 lg:space-y-32">
        <Hero />
        <ProductGrid />
        <SeasonalPlans />
        <Features />
        <HowItWorks />
      </div>
      <Footer />
    </main>
  )
}
