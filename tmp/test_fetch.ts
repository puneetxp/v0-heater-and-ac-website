import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://jwdfuqknkpxokkcvopfz.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp3ZGZ1cWtua3B4b2trY3ZvcGZ6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NjE2Mzg0MywiZXhwIjoyMDgxNzM5ODQzfQ.zDBEF39Hhg1sTZYTW1KcFZo1MpreYyx-A89m2Br1hwI';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

function generateProductSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // Remove non-word chars except space and dash
    .replace(/[\s_]+/g, "-")  // Replace spaces and underscores with dash
    .replace(/-+/g, "-");     // Replace multiple dashes with single dash
}

async function testFetch() {
    const { data: products, error } = await supabase
        .from("products")
        .select("*")
        .in("category", ["oil_heater"]);
        
    console.log("Products count:", products?.length);
    console.log("Error:", error);
    
    if (products) {
        products.forEach(p => {
            console.log("Product:", p.name, "Slug:", generateProductSlug(p.name), "ID:", p.id);
        });
    }
}

testFetch();
