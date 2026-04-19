import { NextRequest, NextResponse } from "next/server";
import { checkAdminAccess } from "@/lib/check-admin";
import { intaxClient } from "@/lib/intax/client";

export async function GET(req: NextRequest) {
  try {
    await checkAdminAccess();

    const { searchParams } = new URL(req.url);
    const limit = searchParams.get("limit") || "100";
    const offset = searchParams.get("offset") || "0";

    const invoices = await intaxClient.read("invoices", {
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    return NextResponse.json({ success: true, data: invoices });
  } catch (error) {
    console.error("[intax-invoices] Error:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Failed to fetch invoices" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await checkAdminAccess();

    const body = await req.json();
    const invoice = await intaxClient.create("invoices", body);

    return NextResponse.json({ success: true, data: invoice });
  } catch (error) {
    console.error("[intax-invoices] Error:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Failed to create invoice" },
      { status: 500 },
    );
  }
}
