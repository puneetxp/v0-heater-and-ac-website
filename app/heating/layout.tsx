import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Premium Heater Rentals | Oil Heaters on Rent",
    description:
        "Stay warm this winter with our premium oil heater rentals. Choose from 5, 7, 9, and 11-fin radiators with flexible monthly plans and free delivery in Delhi, Mumbai & more.",
    keywords: [
        "heater rental",
        "oil heater on rent Delhi",
        "radiator heater rental",
        "winter heating solutions",
    ],
    alternates: {
        canonical: "https://comfortrent-v0.puneetxp.com/heating",
    },
};

export default function HeatingLayout({
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
                "name": "Heating",
                "item": "https://comfortrent-v0.puneetxp.com/heating",
            },
        ],
    };

    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": "What types of heaters do you provide on rent?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text":
                        "We specialize in premium Oil-Filled Radiators (OFR) with 7, 9, and 11 fins, which are safer and more efficient than traditional heaters.",
                },
            },
            {
                "@type": "Question",
                "name": "Is maintenance included in the heater rental?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text":
                        "Yes, all our rental plans include professional installation and full maintenance support throughout the rental period.",
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
