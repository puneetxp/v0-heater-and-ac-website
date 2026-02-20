import { Button } from "@/components/ui/button"
import { ArrowRight, Snowflake, Wind, Flame } from "lucide-react"

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-blue-50/50 via-white to-white dark:from-blue-950/20 dark:via-background dark:to-background">
      {/* Decorative blobs with animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200/30 dark:bg-blue-900/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-200/30 dark:bg-cyan-900/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-orange-200/20 dark:bg-orange-900/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="container relative mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
        <div className="py-20 md:py-28 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Content */}
            <div className="space-y-8 animate-fadeIn" style={{ animationFillMode: 'both' }}>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-medium" style={{ animationFillMode: 'both' }}>
                <Snowflake className="h-4 w-4" />
                Monthly Rentals Available
              </div>

              <div className="space-y-6">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight text-balance leading-tight">
                  Stay{" "}
                  <span className="bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400 bg-clip-text text-transparent">
                    Comfortable
                  </span>
                  <br />
                  All Year Round
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground text-pretty max-w-lg leading-relaxed">
                  Premium AC and heater rentals with flexible monthly plans. No commitment, just comfort delivered to
                  your doorstep.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Button
                  size="lg"
                  className="bg-primary hover:bg-primary/95 text-white shadow-xl shadow-primary/20 text-base h-12 px-8 font-semibold transition-all duration-300 hover:shadow-primary/40 hover:scale-105"
                >
                  Browse Products
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button size="lg" variant="outline" className="text-base h-12 px-8 border border-primary/30 hover:border-primary/60 bg-transparent transition-all duration-300 font-semibold text-primary hover:bg-primary/5">
                  View Plans
                </Button>
              </div>

              {/* Stats */}
              <div className="flex gap-8 pt-4">
                <div className="hover:text-primary transition-colors duration-300 cursor-default">
                  <div className="text-3xl font-bold text-primary">1000+</div>
                  <div className="text-sm text-muted-foreground">Happy Customers</div>
                </div>
                <div className="hover:text-primary transition-colors duration-300 cursor-default">
                  <div className="text-3xl font-bold text-primary">50+</div>
                  <div className="text-sm text-muted-foreground">Products</div>
                </div>
                <div className="hover:text-primary transition-colors duration-300 cursor-default">
                  <div className="text-3xl font-bold text-primary">24/7</div>
                  <div className="text-sm text-muted-foreground">Support</div>
                </div>
              </div>
            </div>

            {/* Right Content - Image */}
            <div className="relative">
              <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border border-border/50 hover:shadow-3xl transition-all duration-500">
                <img
                  src="/modern-air-conditioner-and-heater-in-luxury-home-i.jpg"
                  alt="Premium AC and heater units"
                  className="w-full h-full object-cover"
                />
                {/* Floating cards with animation */}
                <div className="absolute top-6 right-6 bg-white/98 dark:bg-slate-900/95 backdrop-blur-xl rounded-xl p-5 shadow-xl hover:shadow-2xl transition-all duration-300 animate-bounce border border-primary/10" style={{ animationDelay: '0s', animationDuration: '3s' }}>
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-full bg-primary/15 flex items-center justify-center">
                      <Wind className="h-7 w-7 text-primary animate-spin" style={{ animationDuration: '4s' }} />
                    </div>
                    <div>
                      <div className="font-bold text-sm text-foreground">Split AC</div>
                      <div className="text-xs text-muted-foreground font-semibold">₹1,499/month</div>
                    </div>
                  </div>
                </div>

                <div className="absolute bottom-6 left-6 bg-white/98 dark:bg-slate-900/95 backdrop-blur-xl rounded-xl p-5 shadow-xl hover:shadow-2xl transition-all duration-300 animate-bounce border border-accent/10" style={{ animationDelay: '0.5s', animationDuration: '3s' }}>
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-full bg-accent/15 flex items-center justify-center">
                      <Flame className="h-7 w-7 text-accent animate-pulse" />
                    </div>
                    <div>
                      <div className="font-bold text-sm text-foreground">Oil Heater</div>
                      <div className="text-xs text-muted-foreground font-semibold">₹899/month</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
