import { NextRequest, NextResponse } from "next/server";
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

    const { createAdminClient } = await import("@/lib/supabase/admin");
    const supabase = createAdminClient();

    if (!supabase) {
      return NextResponse.json({ error: "Admin client not available" }, { status: 500 });
    }

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

    // 1. Sync to Products table
    const { data: existingProduct, error: fetchError } = await supabase
      .from("products")
      .select("id")
      .eq("name", plan.name)
      .eq("category", category)
      .maybeSingle();

    if (fetchError) {
      console.error("[intax-sync] Product fetch error:", fetchError);
      throw new Error(`Failed to check existing product: ${fetchError.message}`);
    }

    if (existingProduct) {
      const { error: updateError } = await supabase
        .from("products")
        .update(productData)
        .eq("id", existingProduct.id);
      
      if (updateError) {
        console.error("[intax-sync] Product update error:", updateError);
        throw new Error(`Failed to update product: ${updateError.message}`);
      }
    } else {
      const { error: insertError } = await supabase
        .from("products")
        .insert({
          ...productData,
          created_at: new Date().toISOString(),
        });

      if (insertError) {
        console.error("[intax-sync] Product insert error:", insertError);
        throw new Error(`Failed to create product: ${insertError.message}`);
      }
    }

    // 2. Sync to Seasonal Plans table
    let season = "year_round";
    if (category === "oil_heater") season = "winter";
    else if (category === "split_ac" || category === "window_ac") season = "summer";

    const planData = {
      name: `${plan.name} - ${price.name || "Default"}`,
      season: season,
      description: `${service.name}: ${plan.name} (${price.name || "Standard"})`,
      base_price: Number(price.amount), // Ensure it's a number
      pricing_per_unit: Number(price.amount),
      duration_months: Number(price.month) || 1,
      discount_percentage: 0,
      is_active: plan.enable === 1,
      start_month: season === "winter" ? 10 : 4,
      end_month: season === "winter" ? 3 : 9,
    };

    const { data: existingPlan, error: planFetchError } = await supabase
      .from("seasonal_plans")
      .select("id")
      .eq("name", planData.name)
      .maybeSingle();

    if (planFetchError) {
      console.error("[intax-sync] Plan fetch error:", planFetchError);
    }

    if (existingPlan) {
      const { error: planUpdateError } = await supabase
        .from("seasonal_plans")
        .update(planData)
        .eq("id", existingPlan.id);
      
      if (planUpdateError) console.error("[intax-sync] Plan update error:", planUpdateError);
    } else {
      const { error: planInsertError } = await supabase
        .from("seasonal_plans")
        .insert(planData);
      
      if (planInsertError) console.error("[intax-sync] Plan insert error:", planInsertError);
    }

    return NextResponse.json({ 
      success: true, 
      action: "synced",
      target: "Products & Seasonal Plans"
    });

  } catch (error: any) {
    console.error("[intax-sync] Error:", error);
    return NextResponse.json({ 
      error: error.message || "Internal server error",
      details: error.details || null
    }, { status: 500 });
  }
}
