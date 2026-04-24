import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { checkAdminAccess } from "@/lib/check-admin";

export async function POST(req: NextRequest) {
  try {
    await checkAdminAccess();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { service, plan, price } = await req.json();

    if (!service || !plan || !price) {
      return NextResponse.json({ error: "Missing required data" }, { status: 400 });
    }

    const supabase = await createClient();

    // Map Intax data to website product schema
    // We use a combination of service name and plan name as a unique identifier if possible,
    // or just use the name and upsert.
    
    // Determine category based on Intax service name
    let category = "default";
    const serviceNameLower = service.name.toLowerCase();
    if (serviceNameLower.includes("heater") || serviceNameLower.includes("heating")) {
      category = "oil_heater";
    } else if (serviceNameLower.includes("window ac")) {
      category = "window_ac";
    } else if (serviceNameLower.includes("split ac")) {
      category = "split_ac";
    } else if (serviceNameLower.includes("ac") || serviceNameLower.includes("cooling")) {
      category = "split_ac"; // Default AC to split
    }

    // Prepare product data
    const productData = {
      name: plan.name,
      category: category,
      price_per_month: price.amount,
      is_available: plan.enable === 1,
      description: `${service.name} - ${price.name || "Standard Plan"}`,
      updated_at: new Date().toISOString(),
    };

    // Upsert by name and category (or if you have a specific column for intax_id, use that)
    // For now, we'll try to find by name first
    const { data: existing } = await supabase
      .from("products")
      .select("id")
      .eq("name", plan.name)
      .eq("category", category)
      .single();

    let result;
    if (existing) {
      result = await supabase
        .from("products")
        .update(productData)
        .eq("id", existing.id)
        .select()
        .single();
    } else {
      result = await supabase
        .from("products")
        .insert({
          ...productData,
          id: `intax_${plan.id}`, // Custom string ID or let UUID handle it? 
          // If the table uses UUID, this will fail. Let's see the schema.
          created_at: new Date().toISOString(),
        })
        .select()
        .single();
    }

    if (result.error) {
      console.error("[intax-sync] DB Error:", result.error);
      return NextResponse.json({ error: result.error.message }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      product: result.data,
      action: existing ? "updated" : "created"
    });

  } catch (error: any) {
    console.error("[intax-sync] Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
