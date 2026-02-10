import type React from "react"
import type { Metadata } from "next"
import { Analytics } from "@vercel/analytics/next"
import { SupabaseProvider } from "./providers"
import { AnimatedBackground } from "@/components/animated-background"
import "./globals.css"

export const metadata: Metadata = {
  title: "ComfortRent - AC & Heater Rentals | Affordable Climate Control",
  description:
    "Premium AC and heater rental services with flexible monthly plans. Choose from window AC, split AC, and oil heaters. Professional installation included. Rent AC & heaters starting at ₹899/month.",
  generator: "Next.js",
  keywords: ["AC rental", "heater rental", "window AC", "split AC", "oil heater", "climate control rental"],
  authors: [{ name: "ComfortRent" }],
  creator: "ComfortRent",
  publisher: "ComfortRent",
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
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://comfortrent.com",
    siteName: "ComfortRent",
    title: "ComfortRent - Premium AC & Heater Rentals",
    description: "Affordable climate control solutions with flexible rental plans. Professional installation & 24/7 support.",
    images: [
      {
        url: "https://comfortrent.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "ComfortRent - AC & Heater Rentals",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ComfortRent - AC & Heater Rentals",
    description: "Premium climate control rentals with professional installation.",
    images: ["https://comfortrent.com/twitter-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  alternates: {
    canonical: "https://comfortrent.com",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
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
