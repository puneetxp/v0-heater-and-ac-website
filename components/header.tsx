import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Wind, Menu } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/30 bg-background/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="container mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary shadow-lg group-hover:shadow-xl group-hover:scale-105 transition-all duration-300">
              <Wind className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">ComfortRent</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              href="/cooling"
              className="text-sm font-semibold text-foreground/70 hover:text-primary px-3 py-2 rounded-md transition-all duration-300 hover:bg-primary/5"
            >
              Cooling
            </Link>
            <Link
              href="/heating"
              className="text-sm font-semibold text-foreground/70 hover:text-primary px-3 py-2 rounded-md transition-all duration-300 hover:bg-primary/5"
            >
              Heating
            </Link>
            <Link
              href="/#features"
              className="text-sm font-semibold text-foreground/70 hover:text-primary px-3 py-2 rounded-md transition-all duration-300 hover:bg-primary/5"
            >
              Features
            </Link>
            <Link
              href="/#how-it-works"
              className="text-sm font-semibold text-foreground/70 hover:text-primary px-3 py-2 rounded-md transition-all duration-300 hover:bg-primary/5"
            >
              How It Works
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            <Button
              asChild
              variant="outline"
              className="hidden md:inline-flex border-primary/30 hover:bg-primary/10 hover:border-primary/50 bg-transparent text-primary font-semibold transition-all duration-300"
            >
              <Link href="/auth/login">Sign In</Link>
            </Button>
            <Button asChild className="hidden md:inline-flex bg-primary hover:bg-primary/95 shadow-lg font-semibold transition-all duration-300 hover:shadow-primary/30 hover:shadow-lg">
              <Link href="/auth/sign-up">Get Started</Link>
            </Button>

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="outline" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <nav className="flex flex-col gap-4 mt-8">
                  <Link href="/#products" className="text-base font-medium hover:text-primary transition-colors">
                    Products
                  </Link>
                  <Link href="/#features" className="text-base font-medium hover:text-primary transition-colors">
                    Features
                  </Link>
                  <Link href="/#how-it-works" className="text-base font-medium hover:text-primary transition-colors">
                    How It Works
                  </Link>
                  <Link href="/#contact" className="text-base font-medium hover:text-primary transition-colors">
                    Contact
                  </Link>
                  <Link href="/admin/login" className="text-base font-medium hover:text-primary transition-colors">
                    Admin
                  </Link>
                  <div className="flex flex-col gap-3 mt-6">
                    <Button asChild variant="outline" className="w-full bg-transparent">
                      <Link href="/auth/login">Sign In</Link>
                    </Button>
                    <Button asChild className="w-full bg-primary hover:bg-primary/90">
                      <Link href="/auth/sign-up">Get Started</Link>
                    </Button>
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}
