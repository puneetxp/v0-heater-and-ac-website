"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Wind, Menu, ShoppingBag } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/lib/contexts/cart-context"

import { useState, useEffect } from "react"
import { useSupabase } from "@/app/providers"
import { User } from "@supabase/supabase-js"

export function Header() {
  const { itemCount } = useCart();
  const supabase = useSupabase();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/30 bg-background/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="container mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="h-14 w-14 rounded-lg shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300 overflow-hidden border-2 border-primary/20">
              <img 
                src="/acrent-logo.jpg" 
                alt="ACRentService" 
                className="h-full w-full object-cover"
              />
            </div>
            <div className="hidden sm:block">
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">ACRentService</span>
              <p className="text-xs text-muted-foreground">Premium AC & Heater Rentals</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              href="/#products"
              className="text-sm font-semibold text-foreground/70 hover:text-primary px-3 py-2 rounded-md transition-all duration-300 hover:bg-primary/5"
            >
              Products
            </Link>
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
              href="/#seasonal"
              className="text-sm font-semibold text-foreground/70 hover:text-primary px-3 py-2 rounded-md transition-all duration-300 hover:bg-primary/5"
            >
              Seasonal Bundles
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

          <div className="flex items-center gap-4">
            <Link href="/cart" className="relative group p-2 rounded-full hover:bg-primary/5 transition-colors">
              <ShoppingBag className="h-6 w-6 text-foreground/70 group-hover:text-primary transition-colors" />
              {itemCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-[10px] bg-primary text-white border-2 border-background">
                  {itemCount}
                </Badge>
              )}
            </Link>

            {!loading && (
              <>
                {user ? (
                  <Button
                    asChild
                    variant="outline"
                    className="hidden md:inline-flex border-primary/30 hover:bg-primary/10 hover:border-primary/50 bg-transparent text-primary font-semibold transition-all duration-300"
                  >
                    <Link href="/dashboard">Dashboard</Link>
                  </Button>
                ) : (
                  <Button
                    asChild
                    variant="outline"
                    className="hidden md:inline-flex border-primary/30 hover:bg-primary/10 hover:border-primary/50 bg-transparent text-primary font-semibold transition-all duration-300"
                  >
                    <Link href="/auth/login">Sign In</Link>
                  </Button>
                )}
              </>
            )}

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="outline" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <nav className="flex flex-col gap-4 mt-8 px-6">
                  <Link href="/#products" className="text-base font-medium hover:text-primary transition-colors">
                    Products
                  </Link>
                  <Link href="/#seasonal" className="text-base font-medium hover:text-primary transition-colors">
                    Seasonal Bundles
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
                    {user ? (
                      <Button asChild className="w-full bg-primary hover:bg-primary/90">
                        <Link href="/dashboard">Dashboard</Link>
                      </Button>
                    ) : (
                      <Button asChild variant="outline" className="w-full bg-transparent">
                        <Link href="/auth/login">Sign In</Link>
                      </Button>
                    )}
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
