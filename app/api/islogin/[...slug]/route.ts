import { NextRequest, NextResponse } from "next/server";
import { checkAdminAccess } from "@/lib/check-admin";
import { getActiveApiConfig } from "@/lib/api-config";

/**
 * Proxy route for Intax API calls with automatic book_id injection
 * Routes: /api/islogin/{model}
 *         /api/islogin/{model}/{id}
 *         /api/islogin/{model}/where
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string[] } }
) {
  try {
    await checkAdminAccess();

    const slug = params.slug;
    if (!slug || slug.length === 0) {
      return NextResponse.json(
        { error: "Invalid route" },
        { status: 400 }
      );
    }

    // Get the active API config with book_id
    const config = await getActiveApiConfig("intax");
    if (!config) {
      return NextResponse.json(
        { error: "Intax API not configured. Please set up API configuration." },
        { status: 500 }
      );
    }

    // Build the full Intax API URL with book_id
    const modelPath = slug.join("/");
    const intaxUrl = new URL(
      `https://intax.in/api/islogin/book/${config.book_id}/${modelPath}`
    );

    // Copy query parameters
    intaxUrl.search = req.nextUrl.search;

    // Forward the request to Intax API
    const response = await fetch(intaxUrl.toString(), {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${config.api_key}`,
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("[intax-proxy] Error from Intax API:", data);
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("[intax-proxy] GET error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { slug: string[] } }
) {
  try {
    await checkAdminAccess();

    const slug = params.slug;
    if (!slug || slug.length === 0) {
      return NextResponse.json(
        { error: "Invalid route" },
        { status: 400 }
      );
    }

    // Get the active API config with book_id
    const config = await getActiveApiConfig("intax");
    if (!config) {
      return NextResponse.json(
        { error: "Intax API not configured. Please set up API configuration." },
        { status: 500 }
      );
    }

    const body = await req.json();

    // Build the full Intax API URL with book_id
    const modelPath = slug.join("/");
    const intaxUrl = new URL(
      `https://intax.in/api/islogin/book/${config.book_id}/${modelPath}`
    );

    // Copy query parameters
    intaxUrl.search = req.nextUrl.search;

    // Forward the request to Intax API
    const response = await fetch(intaxUrl.toString(), {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${config.api_key}`,
        "Content-Type": "text/plain;charset=UTF-8",
        "Accept": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("[intax-proxy] Error from Intax API:", data);
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("[intax-proxy] POST error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { slug: string[] } }
) {
  try {
    await checkAdminAccess();

    const slug = params.slug;
    if (!slug || slug.length === 0) {
      return NextResponse.json(
        { error: "Invalid route" },
        { status: 400 }
      );
    }

    // Get the active API config with book_id
    const config = await getActiveApiConfig("intax");
    if (!config) {
      return NextResponse.json(
        { error: "Intax API not configured. Please set up API configuration." },
        { status: 500 }
      );
    }

    const body = await req.json();

    // Build the full Intax API URL with book_id
    const modelPath = slug.join("/");
    const intaxUrl = new URL(
      `https://intax.in/api/islogin/book/${config.book_id}/${modelPath}`
    );

    // Copy query parameters
    intaxUrl.search = req.nextUrl.search;

    // Forward the request to Intax API
    const response = await fetch(intaxUrl.toString(), {
      method: "PATCH",
      headers: {
        "Authorization": `Bearer ${config.api_key}`,
        "Content-Type": "text/plain;charset=UTF-8",
        "Accept": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("[intax-proxy] Error from Intax API:", data);
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("[intax-proxy] PATCH error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { slug: string[] } }
) {
  try {
    await checkAdminAccess();

    const slug = params.slug;
    if (!slug || slug.length === 0) {
      return NextResponse.json(
        { error: "Invalid route" },
        { status: 400 }
      );
    }

    // Get the active API config with book_id
    const config = await getActiveApiConfig("intax");
    if (!config) {
      return NextResponse.json(
        { error: "Intax API not configured. Please set up API configuration." },
        { status: 500 }
      );
    }

    // Build the full Intax API URL with book_id
    const modelPath = slug.join("/");
    const intaxUrl = new URL(
      `https://intax.in/api/islogin/book/${config.book_id}/${modelPath}`
    );

    // Copy query parameters
    intaxUrl.search = req.nextUrl.search;

    // Forward the request to Intax API
    const response = await fetch(intaxUrl.toString(), {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${config.api_key}`,
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("[intax-proxy] Error from Intax API:", data);
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("[intax-proxy] DELETE error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}
