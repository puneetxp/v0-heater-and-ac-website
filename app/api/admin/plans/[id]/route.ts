import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { checkAdminAccess } from "@/lib/check-admin";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check admin access
    await checkAdminAccess();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const supabase = await createClient();

  try {
    const body = await req.json();

    // Validate required fields
    const { name, season, description, base_price, pricing_per_unit, duration_months, start_month, end_month, discount_percentage, is_active } = body;

    if (!name || !season || !description || base_price === undefined || pricing_per_unit === undefined || duration_months === undefined || start_month === undefined || end_month === undefined) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Update the plan
    const { data, error } = await supabase
      .from("seasonal_plans")
      .update({
        name,
        season,
        description,
        base_price: parseFloat(base_price),
        pricing_per_unit: parseFloat(pricing_per_unit),
        discount_percentage: discount_percentage ? parseInt(discount_percentage) : 0,
        duration_months: parseInt(duration_months),
        start_month: parseInt(start_month),
        end_month: parseInt(end_month),
        is_active: is_active !== undefined ? is_active : true,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error updating plan:", error);
    return NextResponse.json(
      { error: "Failed to update plan" },
      { status: 500 }
    );
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();

  try {
    const { data, error } = await supabase
      .from("seasonal_plans")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching plan:", error);
    return NextResponse.json(
      { error: "Failed to fetch plan" },
      { status: 500 }
    );
  }
}
