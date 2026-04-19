import { NextRequest, NextResponse } from "next/server";
import { checkAdminAccess } from "@/lib/check-admin";
import { intaxGetAll, intaxCreate } from "@/lib/intax/client";
import type { ApiInvoice } from "@/lib/intax/types";

export async function GET(req: NextRequest) {
  try {
    await checkAdminAccess();

    const invoices = await intaxGetAll<ApiInvoice>("invoices");

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
    const invoice = await intaxCreate<ApiInvoice>("invoices", body);

    return NextResponse.json({ success: true, data: invoice });
  } catch (error) {
    console.error("[intax-invoices] Error:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Failed to create invoice" },
      { status: 500 },
    );
  }
}
