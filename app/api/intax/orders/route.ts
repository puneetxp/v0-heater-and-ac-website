import { NextRequest, NextResponse } from "next/server";
import { checkAdminAccess } from "@/lib/check-admin";
import { intaxGetAll, intaxCreate } from "@/lib/intax/client";
import type { ApiOrder } from "@/lib/intax/types";

export async function GET(req: NextRequest) {
  try {
    await checkAdminAccess();

    const orders = await intaxGetAll<ApiOrder>("orders");

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
    const order = await intaxCreate<ApiOrder>("orders", body);

    return NextResponse.json({ success: true, data: order });
  } catch (error) {
    console.error("[intax-orders] Error:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Failed to create order" },
      { status: 500 },
    );
  }
}
