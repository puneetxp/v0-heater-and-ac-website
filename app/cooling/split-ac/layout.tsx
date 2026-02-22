import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Split AC Rental | Energy Efficient Air Conditioning | ComfortRent",
  description: "Rent inverter split AC units from ₹1,499/month. 5-star energy efficient, silent operation, smart Wi-Fi control. Professional installation included.",
  keywords: ["split AC rental", "inverter AC rental", "split air conditioner", "1 ton AC", "1.5 ton AC", "2 ton AC"],
  alternates: {
    canonical: "https://comfortrent.com/cooling/split-ac",
  },
  openGraph: {
    type: "website",
    url: "https://comfortrent.com/cooling/split-ac",
    title: "Split AC Rental | Premium Cooling Solutions",
    description: "Energy-efficient split AC systems from ₹1,499/month. Free installation & 24/7 support.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
