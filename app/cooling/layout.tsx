import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Premium AC Rentals | Window & Split ACs on Rent",
    description:
        "Beat the heat with our premium air conditioner rentals. High-efficiency Window and Split AC units available with free installation and maintenance. Rent AC starting at ₹1299/month in Delhi NCR.",
    keywords: [
        "AC rental",
        "Window AC on rent",
        "Split AC rental Delhi",
        "inverter AC for rent",
        "summer cooling solutions",
    ],
    alternates: {
        canonical: "https://comfortrent-v0.puneetxp.com/cooling",
    },
};

export default function CoolingLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://comfortrent-v0.puneetxp.com",
            },
            {
                "@type": "ListItem",
                "position": 2,
                "name": "Cooling",
                "item": "https://comfortrent-v0.puneetxp.com/cooling",
            },
        ],
    };

    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": "How quickly can you install the rental AC?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text":
                        "Most installations are completed within 24-48 hours of booking confirmation.",
                },
            },
            {
                "@type": "Question",
                "name": "What is the minimum rental period for an AC?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text":
                        "Our minimum rental period is typically one month, with significant discounts for 3, 6, and 12-month durations.",
                },
            },
        ],
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(breadcrumbSchema),
                }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />
            {children}
        </>
    );
}
