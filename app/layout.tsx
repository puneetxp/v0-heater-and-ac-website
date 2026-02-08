import type React from "react"
import type { Metadata } from "next"
import { Analytics } from "@vercel/analytics/next"
import { SupabaseProvider } from "./providers"
import { AnimatedBackground } from "@/components/animated-background"
import "./globals.css"

export const metadata: Metadata = {
  title: "ComfortRent - AC & Heater Rentals",
  description:
    "Premium AC and heater rental services. Choose from window AC, split AC, and oil heaters with various capacities.",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased relative">
        <AnimatedBackground />
        <SupabaseProvider>
          {children}
          <Analytics />
        </SupabaseProvider>
      </body>
    </html>
  )
}
