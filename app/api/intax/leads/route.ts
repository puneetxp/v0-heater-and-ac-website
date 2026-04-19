import { NextRequest, NextResponse } from "next/server";
import { intaxGetAll, intaxCreate } from "@/lib/intax/client";
import type { ApiLead } from "@/lib/intax/types";
import { checkAdminAccess } from "@/lib/check-admin";

export async function GET(req: NextRequest) {
    try {
        await checkAdminAccess();
    } catch {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const leads = await intaxGetAll<ApiLead>("lead");
        return NextResponse.json(leads);
    } catch (error: any) {
        console.error("[intax-leads] Error fetching leads:", error);
        return NextResponse.json(
            { error: error.message || "Failed to fetch leads" },
            { status: 500 },
        );
    }
}

export async function POST(req: NextRequest) {
    try {
        await checkAdminAccess();
    } catch {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await req.json();
        const lead = await intaxCreate<ApiLead>("lead", body);
        return NextResponse.json(lead, { status: 201 });
    } catch (error: any) {
        console.error("[intax-leads] Error creating lead:", error);
        return NextResponse.json(
            { error: error.message || "Failed to create lead" },
            { status: 500 },
        );
    }
}
