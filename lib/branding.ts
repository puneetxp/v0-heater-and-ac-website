/**
 * ACRentService Branding Configuration
 * Centralized configuration for brand name, domain, and contact information
 */

export const BRANDING = {
  // Brand Name
  name: "ACRentService",
  displayName: "ACRent Service",
  tagline: "Premium AC & Heater Rentals",

  // Domain and URLs
  domain: "acrentservice.com",
  baseUrl: "https://acrentservice.com",
  
  // Contact Information
  contact: {
    email: "hello@acrentservice.com",
    adminEmail: "admin@acrentservice.com",
    phone: "+91 98765 43210",
  },

  // Social Media
  social: {
    facebook: "https://www.facebook.com/acrentservice",
    twitter: "https://twitter.com/acrentservice",
    instagram: "https://www.instagram.com/acrentservice",
  },

  // SEO and Meta
  seo: {
    title: "ACRentService - AC & Heater Rentals | Premium Climate Control",
    description:
      "Low-cost AC and heater rental services in Delhi, Mumbai, Bangalore, and across India. Flexible monthly plans for window AC, split AC, and oil heaters. Professional installation & maintenance included.",
    keywords: [
      "AC rental Delhi",
      "AC on rent Mumbai",
      "Split AC rental Bangalore",
      "Heater rental Hyderabad",
      "Oil heater on rent",
      "Window AC rental",
      "monthly AC rental plans",
      "appliance rentals India",
      "ACRentService",
    ],
  },

  // Business Information
  business: {
    name: "ACRentService",
    type: "LocalBusiness",
    address: {
      street: "123 Business District",
      city: "New Delhi",
      state: "Delhi",
      postalCode: "110001",
      country: "IN",
    },
    phone: "+91-888-888-8888",
    operatingHours: {
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      opens: "09:00",
      closes: "20:00",
    },
    priceRange: "₹799 - ₹2399",
    areaServed: ["Delhi", "Mumbai", "Bangalore", "Hyderabad", "Pune"],
  },

  // OG Image URLs
  images: {
    og: "https://acrentservice.com/og-image.jpg",
    twitter: "https://acrentservice.com/twitter-image.jpg",
    logo: "https://acrentservice.com/logo.png",
  },
}

/**
 * Get full branded URL
 */
export function getBrandedUrl(path: string = ""): string {
  return `${BRANDING.baseUrl}${path}`
}

/**
 * Get contact email for admin operations
 */
export function getAdminEmail(): string {
  return BRANDING.contact.adminEmail
}

/**
 * Get customer support email
 */
export function getSupportEmail(): string {
  return BRANDING.contact.email
}

/**
 * Get phone number
 */
export function getPhoneNumber(): string {
  return BRANDING.contact.phone
}
