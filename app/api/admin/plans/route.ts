import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { checkAdminAccess } from "@/lib/check-admin";

export async function POST(req: NextRequest) {
  try {
    // Check admin access
    await checkAdminAccess();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = await createClient();

  try {
    const body = await req.json();

    // Validate required fields
    const { name, season, description, base_price, pricing_per_unit, duration_months, start_month, end_month, discount_percentage } = body;

    if (!name || !season || !description || base_price === undefined || pricing_per_unit === undefined || duration_months === undefined || start_month === undefined || end_month === undefined) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create the plan
    const { data, error } = await supabase
      .from("seasonal_plans")
      .insert({
        name,
        season,
        description,
        base_price: parseFloat(base_price),
        pricing_per_unit: parseFloat(pricing_per_unit),
        discount_percentage: discount_percentage ? parseInt(discount_percentage) : 0,
        duration_months: parseInt(duration_months),
        start_month: parseInt(start_month),
        end_month: parseInt(end_month),
        is_active: true,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("Error creating plan:", error);
    return NextResponse.json(
      { error: "Failed to create plan" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  const supabase = await createClient();

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (id) {
      // Fetch single plan
      const { data, error } = await supabase
        .from("seasonal_plans")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 404 });
      }

      return NextResponse.json(data);
    } else {
      // Fetch all plans
      const { data, error } = await supabase
        .from("seasonal_plans")
        .select("*")
        .order("duration_months", { ascending: true });

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json(data);
    }
  } catch (error) {
    console.error("Error fetching plans:", error);
    return NextResponse.json(
      { error: "Failed to fetch plans" },
      { status: 500 }
    );
  }
}
