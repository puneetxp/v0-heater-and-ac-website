import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Window AC Rental | Affordable Cooling | ComfortRent",
  description: "Rent budget-friendly window AC units from just ₹899/month. Easy installation, perfect for apartments. Professional setup included.",
  keywords: ["window AC rental", "window air conditioner", "affordable AC", "1 ton window AC", "apartment cooling"],
  alternates: {
    canonical: "https://comfortrent.com/cooling/window-ac",
  },
  openGraph: {
    type: "website",
    url: "https://comfortrent.com/cooling/window-ac",
    title: "Window AC Rental | Budget Cooling Solutions",
    description: "Affordable window AC rental starting at ₹899/month. Free installation & support.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
