import { NextRequest, NextResponse } from "next/server";
import { checkAdminAccess } from "@/lib/check-admin";
import { intaxClient } from "@/lib/intax/client";

export async function GET(req: NextRequest) {
  try {
    await checkAdminAccess();

    const { searchParams } = new URL(req.url);
    const limit = searchParams.get("limit") || "100";
    const offset = searchParams.get("offset") || "0";

    const products = await intaxClient.read("products", {
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

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
    const product = await intaxClient.create("products", body);

    return NextResponse.json({ success: true, data: product });
  } catch (error) {
    console.error("[intax-products] Error:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Failed to create product" },
      { status: 500 },
    );
  }
}
