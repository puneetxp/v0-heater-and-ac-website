import Link from "next/link"
import { Wind, Mail, Phone, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function Footer() {
  return (
    <footer id="contact" className="border-t bg-muted/30">
      <div className="container mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
        <div className="py-12 md:py-16">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-12">
            {/* Brand */}
            <div className="space-y-4">
              <Link href="/" className="flex items-center gap-3 group">
                <div className="h-12 w-12 rounded-lg shadow-md overflow-hidden border border-primary/5 group-hover:shadow-lg transition-shadow">
                  <img 
                    src="/acrent-logo-v2.jpg" 
                    alt="ACRentService" 
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <span className="text-xl font-bold text-primary block">ACRentService</span>
                  <span className="text-xs text-muted-foreground">Rentals & Services</span>
                </div>
              </Link>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
                Your trusted partner for AC and heater rentals. Comfort delivered to your doorstep.
              </p>
            </div>

            {/* Products */}
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground">Products</h3>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                    Window AC
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                    Split AC
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                    Oil Heaters
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                    All Products
                  </Link>
                </li>
              </ul>
            </div>

            {/* Company */}
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground">Company</h3>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                    FAQs
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact - matching reference design */}
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground">Get in Touch</h3>
              <ul className="space-y-3">
                <li>
                  <a
                    href="tel:+919220929373"
                    className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors group"
                  >
                    <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/15 transition-colors flex-shrink-0">
                      <Phone className="h-4 w-4 text-primary" />
                    </div>
                    <span>09220929373</span>
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:support@acrentservice.com"
                    className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors group"
                  >
                    <div className="h-9 w-9 rounded-lg bg-secondary/10 flex items-center justify-center group-hover:bg-secondary/15 transition-colors flex-shrink-0">
                      <Mail className="h-4 w-4 text-secondary" />
                    </div>
                    <span>support@acrentservice.com</span>
                  </a>
                </li>
                <li>
                  <div className="flex items-start gap-3 text-sm text-muted-foreground">
                    <div className="h-9 w-9 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                      <MapPin className="h-4 w-4 text-accent" />
                    </div>
                    <span>Plot No. 1409, Ardee City Gate Number 2 Rd, Sarswati Kunj II, Ardee City, Sector 52, Gurugram, Haryana 122003</span>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* Newsletter */}
          <div className="border-t pt-8 mb-8">
            <div className="max-w-md space-y-4">
              <h3 className="font-semibold text-foreground">Subscribe to our newsletter</h3>
              <p className="text-sm text-muted-foreground">Get updates on new products and exclusive offers.</p>
              <div className="flex gap-2">
                <Input type="email" placeholder="Enter your email" className="flex-1" />
                <Button className="bg-primary hover:bg-primary/90">Subscribe</Button>
              </div>
            </div>
          </div>

          {/* Bottom */}
          <div className="border-t pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
            <p>&copy; 2025 ACRentService. All rights reserved.</p>
            <div className="flex gap-6">
              <Link href="#" className="hover:text-foreground transition-colors">
                Privacy Policy
              </Link>
              <Link href="#" className="hover:text-foreground transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
