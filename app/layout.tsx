import type React from "react";
import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SupabaseProvider } from "./providers";
import { AnimatedBackground } from "@/components/animated-background";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "ComfortRent - AC & Heater Rentals | Premium Climate Control",
    template: "%s | ComfortRent",
  },
  description:
    "Low-cost AC and heater rental services in Delhi, Mumbai, Bangalore, and across India. Flexible monthly plans for window AC, split AC, and oil heaters. Professional installation & maintenance included.",
  generator: "Next.js",
  keywords: [
    "AC rental Delhi",
    "AC on rent Mumbai",
    "Split AC rental Bangalore",
    "Heater rental Hyderabad",
    "Oil heater on rent",
    "Window AC rental",
    "monthly AC rental plans",
    "appliance rentals India",
    "ComfortRent",
  ],
  authors: [{ name: "ComfortRent Team" }],
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
    url: "https://comfortrent-v0.puneetxp.com",
    siteName: "ComfortRent",
    title: "ComfortRent - High-Quality AC & Heater Rentals",
    description:
      "Affordable monthly rental plans for premium ACs and heaters. Free installation & prompt service included.",
    images: [
      {
        url: "https://comfortrent-v0.puneetxp.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "ComfortRent Climate Control Rentals",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Rent AC & Heaters at Best Prices - ComfortRent",
    description:
      "Premium appliance rentals with flexible plans and professional installation. Perfect for seasonal needs.",
    images: ["https://comfortrent-v0.puneetxp.com/twitter-image.jpg"],
  },
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  alternates: {
    canonical: "https://comfortrent-v0.puneetxp.com",
  },
  category: "Home Appliances",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Enhanced JSON-LD Schema
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": "https://comfortrent-v0.puneetxp.com",
    "name": "ComfortRent",
    "url": "https://comfortrent-v0.puneetxp.com",
    "logo": "https://comfortrent-v0.puneetxp.com/logo.png",
    "image": "https://comfortrent-v0.puneetxp.com/og-image.jpg",
    "telephone": "+91-888-888-8888",
    "description":
      "Professional AC and heater rental services across major Indian cities. We provide window AC, split AC, and premium oil heaters with free installation and maintenance.",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "New Delhi",
      "addressRegion": "Delhi",
      "postalCode": "110001",
      "addressCountry": "IN",
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "28.6139",
      "longitude": "77.2090",
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ],
      "opens": "09:00",
      "closes": "20:00",
    },
    "sameAs": [
      "https://www.facebook.com/comfortrent",
      "https://twitter.com/comfortrent",
      "https://www.instagram.com/comfortrent",
    ],
    "areaServed": ["Delhi", "Mumbai", "Bangalore", "Hyderabad", "Pune"],
    "priceRange": "₹799 - ₹2399",
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
        />
        <meta name="theme-color" content="#2563eb" />
      </head>
      <body className="font-sans antialiased relative">
        <AnimatedBackground />
        <SupabaseProvider>
          {children}
          <Analytics />
        </SupabaseProvider>
      </body>
    </html>
  );
}
