import { MetadataRoute } from "next";
import { allProducts } from "@/lib/product-data";

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = "https://comfortrent-v0.puneetxp.com";

    // Static routes
    const routes = [
        "",
        "/heating",
        "/cooling",
        "/admin",
        "/dashboard",
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: "daily" as const,
        priority: route === "" ? 1 : 0.8,
    }));

    // Product routes
    const coolingProducts = [...allProducts.windowAC, ...allProducts.splitAC];
    const heatingProducts = [...allProducts.oilHeater];

    const coolingUrls = coolingProducts.map((product) => {
        const slug = `${product.category.toLowerCase().replace(/\s+/g, "-")}-${
            product.capacity.toLowerCase().replace(/\s+/g, "-")
        }`;
        return {
            url: `${baseUrl}/cooling/products/${slug}`,
            lastModified: new Date(),
            changeFrequency: "weekly" as const,
            priority: 0.6,
        };
    });

    const heatingUrls = heatingProducts.map((product) => {
        const slug = `${product.category.toLowerCase().replace(/\s+/g, "-")}-${
            product.capacity.toLowerCase().replace(/\s+/g, "-")
        }`;
        return {
            url: `${baseUrl}/heating/products/${slug}`,
            lastModified: new Date(),
            changeFrequency: "weekly" as const,
            priority: 0.6,
        };
    });

    return [...routes, ...coolingUrls, ...heatingUrls];
}
