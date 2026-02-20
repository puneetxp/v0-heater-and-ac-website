import { Shield, Wrench, Clock, CreditCard } from "lucide-react"

const features = [
  {
    icon: Shield,
    title: "Quality Assured",
    description: "All units are regularly serviced and maintained to ensure optimal performance.",
    color: "primary",
  },
  {
    icon: Wrench,
    title: "Free Installation",
    description: "Professional installation and setup included with every rental at no extra cost.",
    color: "secondary",
  },
  {
    icon: Clock,
    title: "24/7 Support",
    description: "Round-the-clock customer support and emergency maintenance services available.",
    color: "accent",
  },
  {
    icon: CreditCard,
    title: "Flexible Plans",
    description: "Choose from monthly, quarterly, or annual rental plans that suit your needs.",
    color: "primary",
  },
]

export function Features() {
  return (
    <section
      id="features"
      className="py-16 md:py-24 lg:py-32 bg-gradient-to-br from-primary/5 via-background to-accent/5 relative overflow-hidden px-4 md:px-6 lg:px-8"
    >
      <div className="absolute top-20 right-10 w-72 h-72 gradient-accent rounded-full blur-3xl opacity-10" />
      <div className="absolute bottom-20 left-10 w-72 h-72 gradient-secondary rounded-full blur-3xl opacity-10" />

      <div className="container mx-auto max-w-7xl relative z-10">
        <div className="text-center space-y-4 mb-12 md:mb-16 lg:mb-20">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            Why Choose{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">ComfortRent</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-balance">
            We make renting climate control equipment simple, affordable, and hassle-free.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon
            const colorClass =
              feature.color === "primary"
                ? "from-primary/10 to-accent/10"
                : feature.color === "secondary"
                  ? "from-secondary/10 to-accent/10"
                  : "from-accent/10 to-primary/10"
            const iconColorClass =
              feature.color === "primary"
                ? "text-primary"
                : feature.color === "secondary"
                  ? "text-secondary"
                  : "text-accent"
            const iconBgClass =
              feature.color === "primary"
                ? "gradient-primary"
                : feature.color === "secondary"
                  ? "gradient-secondary"
                  : "gradient-accent"

            return (
              <div
                key={index}
                className={`flex flex-col items-center text-center space-y-5 p-8 rounded-2xl bg-gradient-to-br ${colorClass} border border-primary/15 hover:border-primary/40 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group bg-white/40 dark:bg-white/5 backdrop-blur-sm`}
              >
                <div
                  className={`flex h-20 w-20 items-center justify-center rounded-2xl ${iconBgClass} shadow-xl group-hover:scale-125 transition-all duration-300 group-hover:shadow-2xl`}
                >
                  <Icon className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-lg font-bold text-foreground">{feature.title}</h3>
                <p className="text-muted-foreground text-balance leading-relaxed text-sm">{feature.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
