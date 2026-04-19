import { NextRequest, NextResponse } from "next/server";
import { intaxGetAll, intaxCreate } from "@/lib/intax/client";
import type { ApiChatSession } from "@/lib/intax/types";
import { checkAdminAccess } from "@/lib/check-admin";

export async function GET(req: NextRequest) {
    try {
        await checkAdminAccess();
    } catch {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const sessions = await intaxGetAll<ApiChatSession>("chat_session");
        return NextResponse.json(sessions);
    } catch (error: any) {
        console.error("[intax-chat] Error fetching chat sessions:", error);
        return NextResponse.json(
            { error: error.message || "Failed to fetch chat sessions" },
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
        const session = await intaxCreate<ApiChatSession>("chat_session", body);
        return NextResponse.json(session, { status: 201 });
    } catch (error: any) {
        console.error("[intax-chat] Error creating chat session:", error);
        return NextResponse.json(
            { error: error.message || "Failed to create chat session" },
            { status: 500 },
        );
    }
}
