import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY"
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function setupBuckets() {
  try {
    console.log("Setting up storage buckets...");

    // Create product-images bucket
    const { data: buckets, error: listError } = await supabase.storage
      .listBuckets();

    if (listError) {
      console.error("Error listing buckets:", listError);
      process.exit(1);
    }

    const bucketExists = buckets.some((b) => b.name === "product-images");

    if (!bucketExists) {
      console.log("Creating product-images bucket...");
      const { error } = await supabase.storage.createBucket(
        "product-images",
        {
          public: true,
        }
      );

      if (error) {
        console.error("Error creating bucket:", error);
        process.exit(1);
      }

      console.log("✓ product-images bucket created successfully");
    } else {
      console.log("✓ product-images bucket already exists");
    }

    console.log("Storage setup complete!");
  } catch (error) {
    console.error("Unexpected error:", error);
    process.exit(1);
  }
}

setupBuckets();
