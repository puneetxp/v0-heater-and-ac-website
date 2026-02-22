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
      title: "Product Not Found",
      description: "The product you're looking for doesn't exist.",
      robots: { index: false },
    };
  }

  const title = `${product.name} (${product.capacity}) for Rent`;
  const description =
    `Rent ${product.name} at just ₹${product.basePrice}/month. High-performance ${product.category} with professional installation, maintenance, and 24/7 support in major cities.`;
  const url =
    `https://comfortrent-v0.puneetxp.com/${params.category}/products/${params.slug}`;

  return {
    title,
    description,
    keywords: [
      product.name.toLowerCase(),
      product.category.toLowerCase(),
      `${product.capacity.toLowerCase()} rental India`,
      "low cost AC rental",
      "premium heater rental",
    ],
    alternates: {
      canonical: url,
    },
    openGraph: {
      url,
      title,
      description,
      siteName: "ComfortRent",
      type: "website",
      images: [
        {
          url: `https://comfortrent-v0.puneetxp.com${product.image}`,
          width: 800,
          height: 600,
          alt: product.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`https://comfortrent-v0.puneetxp.com${product.image}`],
    },
  };
}

export default async function ProductLayout(props: {
  children: React.ReactNode;
  params: Promise<{ category: string; slug: string }>;
}) {
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

  const schemaData = product
    ? {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": product.name,
      "image": `https://comfortrent-v0.puneetxp.com${product.image}`,
      "description":
        `Rent high-performance ${product.name} (${product.capacity}) with free installation and maintenance.`,
      "brand": {
        "@type": "Brand",
        "name": "ComfortRent",
      },
      "offers": {
        "@type": "Offer",
        "url":
          `https://comfortrent-v0.puneetxp.com/${params.category}/products/${params.slug}`,
        "priceCurrency": "INR",
        "price": product.basePrice,
        "availability": "https://schema.org/InStock",
      },
    }
    : null;

  return (
    <>
      {schemaData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
        />
      )}
      {props.children}
    </>
  );
}
