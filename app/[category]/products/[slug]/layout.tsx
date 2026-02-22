import type { Metadata } from "next";
import { allProducts } from "@/lib/product-data";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export const dynamicParams = true;

export async function generateStaticParams() {
  const params: Array<{ category: string; slug: string }> = [];

  const coolingProducts = [...allProducts.windowAC, ...allProducts.splitAC];
  for (const product of coolingProducts) {
    const slug = `${product.category.toLowerCase().replace(/\s+/g, "-")}-${
      product.capacity.toLowerCase().replace(/\s+/g, "-")
    }`;
    params.push({ category: "cooling", slug });
  }

  for (const product of allProducts.oilHeater) {
    const slug = `${product.category.toLowerCase().replace(/\s+/g, "-")}-${
      product.capacity.toLowerCase().replace(/\s+/g, "-")
    }`;
    params.push({ category: "heating", slug });
  }

  return params;
}

export async function generateMetadata(
  props: { params: Promise<{ category: string; slug: string }> },
): Promise<Metadata> {
  const params = await props.params;
  const categoryMap: Record<string, any[]> = {
    cooling: [...allProducts.windowAC, ...allProducts.splitAC],
    heating: [...allProducts.oilHeater],
  };

  const categoryProducts = categoryMap[params.category] || [];

  let product = null;
  for (const prod of categoryProducts) {
    const productSlug = `${prod.category.toLowerCase().replace(/\s+/g, "-")}-${
      prod.capacity
        .toLowerCase()
        .replace(/\s+/g, "-")
    }`;
    if (productSlug === params.slug) {
      product = prod;
      break;
    }
  }

  if (!product) {
    return {
      title: "Product Not Found | ComfortRent",
      description: "The product you're looking for doesn't exist.",
      robots: { index: false },
    };
  }

  const title = `${product.name} for Rent | ComfortRent`;
  const description =
    `Rent ${product.name} (${product.capacity}) at ₹${product.basePrice}/month. Professional installation included. 24/7 support available.`;
  const url =
    `https://comfortrent.com/${params.category}/products/${params.slug}`;

  return {
    title,
    description,
    keywords: [
      product.name.toLowerCase(),
      product.category.toLowerCase(),
      `${product.capacity.toLowerCase()} rental`,
      "AC rental",
      "heater rental",
    ],
    alternates: {
      canonical: url,
    },
    openGraph: {
      url,
      title,
      description,
      siteName: "ComfortRent",
      images: [
        {
          url: "https://comfortrent.com/product-og.png",
          width: 1200,
          height: 630,
          alt: product.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default function ProductLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
