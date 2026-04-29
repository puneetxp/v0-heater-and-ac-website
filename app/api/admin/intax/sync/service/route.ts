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
    } else if (serviceNameLower.includes("window ac") || (serviceNameLower.includes("window") && serviceNameLower.includes("air conditioner"))) {
      category = "window_ac";
    } else if (serviceNameLower.includes("split ac") || (serviceNameLower.includes("split") && serviceNameLower.includes("air conditioner"))) {
      category = "split_ac";
    } else if (serviceNameLower.includes("ac") || serviceNameLower.includes("air conditioner") || serviceNameLower.includes("cooling")) {
      category = "split_ac"; // Default AC to split
    }

    // Determine the base product name based on Intax service name to match existing DB
    let baseName = service.name;
    if (serviceNameLower.includes("window air conditioner")) {
      baseName = "Window AC";
    } else if (serviceNameLower.includes("split air conditioner")) {
      baseName = "Split AC";
    } else if (serviceNameLower.includes("oil filled room heater")) {
      baseName = "Oil Heater";
    }

    // Ensure capacity casing matches existing DB (e.g. "9 fin" -> "9 Fin")
    let capacityName = plan.name;
    if (capacityName.toLowerCase().includes("fin")) {
      capacityName = capacityName.replace(/fin/i, "Fin");
    }

    // Prepare product data
    const productName = `${baseName} ${capacityName}`.trim();
    const monthlyPrice = Number(price.amount);
    const dailyPrice = price.day && price.day > 0 ? Number(price.amount) / price.day : Math.round(monthlyPrice / 30);

    const productData = {
      name: productName,
      category: category,
      capacity: capacityName,
      price_per_month: monthlyPrice,
      price_per_day: dailyPrice,
      is_available: plan.enable === 1,
      updated_at: new Date().toISOString(),
    };

    // 1. Sync to Products table
    let productId: number | null = null;
    
    const { data: existingProduct, error: fetchError } = await supabase
      .from("products")
      .select("id")
      .eq("name", productName)
      .eq("category", category)
      .maybeSingle();

    if (fetchError) {
      console.error("[intax-sync] Product fetch error:", fetchError);
      throw new Error(`Failed to check existing product: ${fetchError.message}`);
    }

    if (existingProduct) {
      productId = existingProduct.id;
      const { error: updateError } = await supabase
        .from("products")
        .update(productData)
        .eq("id", productId);
      
      if (updateError) {
        console.error("[intax-sync] Product update error:", updateError);
        throw new Error(`Failed to update product: ${updateError.message}`);
      }
    } else {
      const { data: newProduct, error: insertError } = await supabase
        .from("products")
        .insert({
          ...productData,
          created_at: new Date().toISOString(),
        })
        .select("id")
        .single();

      if (insertError) {
        console.error("[intax-sync] Product insert error:", insertError);
        throw new Error(`Failed to create product: ${insertError.message}`);
      }
      productId = newProduct.id;
    }

    // 2. Sync to Seasonal Plans table
    let season = "year_round";
    if (category === "oil_heater") season = "winter";
    else if (category === "split_ac" || category === "window_ac") season = "summer";

    const planName = price.name || "Standard Plan";

    const planData = {
      name: planName,
      season: season,
      description: `${service.name} ${plan.name} - ${planName}`,
      base_price: Number(price.amount),
      pricing_per_unit: Number(price.amount),
      duration_months: Number(price.month) || (price.day ? price.day / 30 : 1),
      discount_percentage: 0,
      is_active: plan.enable === 1 && price.enable !== 0,
      start_month: season === "winter" ? 10 : 4,
      end_month: season === "winter" ? 3 : 9,
      product_id: productId, // Link to the product
      valid_until: price.end_date || null,
      intax_service_plan_price_id: price.id, // Map back to ERP for subscription sync
    };

    const { data: existingPlan, error: planFetchError } = await supabase
      .from("seasonal_plans")
      .select("id")
      .eq("name", planData.name)
      .eq("product_id", productId)
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
