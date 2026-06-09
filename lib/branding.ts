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
    supportEmail: "support@acrentservice.com",
    adminEmail: "admin@acrentservice.com",
    phone: "09220929373",
    alternatePhone: "+91-9220929373",
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
      street: "Plot No. 1409, Ardee City Gate Number 2 Rd",
      city: "Gurugram",
      state: "Haryana",
      postalCode: "122003",
      country: "IN",
    },
    phone: "09220929373",
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
  return BRANDING.contact.supportEmail
}

/**
 * Get phone number
 */
export function getPhoneNumber(): string {
  return BRANDING.contact.phone
}
