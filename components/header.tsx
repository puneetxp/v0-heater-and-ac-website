import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Wind, Menu } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-sm group-hover:shadow-md transition-shadow">
              <Wind className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-primary">ComfortRent</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/cooling"
              className="text-sm font-medium text-foreground hover:text-primary transition-colors"
            >
              Cooling
            </Link>
            <Link
              href="/heating"
              className="text-sm font-medium text-foreground hover:text-primary transition-colors"
            >
              Heating
            </Link>
            <Link
              href="/#features"
              className="text-sm font-medium text-foreground hover:text-primary transition-colors"
            >
              Features
            </Link>
            <Link
              href="/#how-it-works"
              className="text-sm font-medium text-foreground hover:text-primary transition-colors"
            >
              How It Works
            </Link>
            <Link
              href="/admin/login"
              className="text-sm font-medium text-foreground hover:text-primary transition-colors"
            >
              Admin
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Button
              asChild
              variant="outline"
              className="hidden md:inline-flex border-primary/20 hover:bg-primary/5 hover:border-primary/30 bg-transparent"
            >
              <Link href="/auth/login">Sign In</Link>
            </Button>
            <Button asChild className="hidden md:inline-flex bg-primary hover:bg-primary/90 shadow-sm">
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
