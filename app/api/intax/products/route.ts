import { NextRequest, NextResponse } from "next/server";
import { checkAdminAccess } from "@/lib/check-admin";
import { intaxGetAll, intaxCreate } from "@/lib/intax/client";
import type { ApiProduct } from "@/lib/intax/types";

export async function GET(req: NextRequest) {
  try {
    await checkAdminAccess();

    const products = await intaxGetAll<ApiProduct>("products");

    return NextResponse.json({ success: true, data: products });
  } catch (error) {
    console.error("[intax-products] Error:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Failed to fetch products" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await checkAdminAccess();

    const body = await req.json();
    const product = await intaxCreate<ApiProduct>("products", body);

    return NextResponse.json({ success: true, data: product });
  } catch (error) {
    console.error("[intax-products] Error:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Failed to create product" },
      { status: 500 },
    );
  }
}
