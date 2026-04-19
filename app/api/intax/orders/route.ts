import { NextRequest, NextResponse } from "next/server";
import { checkAdminAccess } from "@/lib/check-admin";
import { intaxClient } from "@/lib/intax/client";

export async function GET(req: NextRequest) {
  try {
    await checkAdminAccess();

    const { searchParams } = new URL(req.url);
    const limit = searchParams.get("limit") || "100";
    const offset = searchParams.get("offset") || "0";

    const orders = await intaxClient.read("orders", {
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    return NextResponse.json({ success: true, data: orders });
  } catch (error) {
    console.error("[intax-orders] Error:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Failed to fetch orders" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await checkAdminAccess();

    const body = await req.json();
    const order = await intaxClient.create("orders", body);

    return NextResponse.json({ success: true, data: order });
  } catch (error) {
    console.error("[intax-orders] Error:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Failed to create order" },
      { status: 500 },
    );
  }
}
