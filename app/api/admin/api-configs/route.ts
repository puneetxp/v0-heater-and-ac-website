import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { checkAdminAccess } from "@/lib/check-admin";
import type { ApiConfig } from "@/lib/types/api-config";

export async function GET(req: NextRequest) {
  try {
    await checkAdminAccess();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const provider = searchParams.get("provider");
    const enabled = searchParams.get("enabled");

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || "",
      process.env.SUPABASE_SERVICE_ROLE_KEY || "",
    );

    let query = supabase.from("api_configs").select("*");

    if (provider) {
      query = query.eq("provider", provider);
    }

    if (enabled === "true") {
      query = query.eq("enabled", true);
    } else if (enabled === "false") {
      query = query.eq("enabled", false);
    }

    const { data, error } = await query.order("created_at", { ascending: false });

    if (error) {
      console.error("[api-configs] Query error:", error);
      
      // If table doesn't exist, return helpful message
      if (error.code === 'PGRST116' || error.message?.includes('relation')) {
        return NextResponse.json(
          { 
            error: "API configurations table not initialized. Please contact administrator to run database migrations.",
            code: 'TABLE_NOT_FOUND'
          },
          { status: 503 },
        );
      }
      
      return NextResponse.json(
        { error: error.message },
        { status: 500 },
      );
    }

    return NextResponse.json(data || []);
  } catch (error) {
    console.error("[api-configs] Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
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
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || "",
      process.env.SUPABASE_SERVICE_ROLE_KEY || "",
    );

    const { data, error } = await supabase
      .from("api_configs")
      .insert([body])
      .select()
      .single();

    if (error) {
      console.error("[api-configs] Insert error:", error);
      
      if (error.code === 'PGRST116' || error.message?.includes('relation')) {
        return NextResponse.json(
          { 
            error: "API configurations table not initialized. Please contact administrator to run database migrations.",
            code: 'TABLE_NOT_FOUND'
          },
          { status: 503 },
        );
      }
      
      return NextResponse.json(
        { error: error.message },
        { status: 500 },
      );
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("[api-configs] Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    await checkAdminAccess();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { id, ...updates } = body;

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || "",
      process.env.SUPABASE_SERVICE_ROLE_KEY || "",
    );

    const { data, error } = await supabase
      .from("api_configs")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 },
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("[api-configs] Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
