import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://jwdfuqknkpxokkcvopfz.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp3ZGZ1cWtua3B4b2trY3ZvcGZ6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NjE2Mzg0MywiZXhwIjoyMDgxNzM5ODQzfQ.zDBEF39Hhg1sTZYTW1KcFZo1MpreYyx-A89m2Br1hwI';

const supabase = createClient(supabaseUrl, supabaseKey);

async function clear() {
  console.log("Deleting seasonal_plans...");
  const { error: pErr } = await supabase.from('seasonal_plans').delete().neq('id', 0);
  if (pErr) {
    console.error("Plan err:", pErr);
  } else {
    console.log("Successfully deleted seasonal_plans");
  }
  
  console.log("Deleting products...");
  const { error: prErr } = await supabase.from('products').delete().neq('id', 0);
  if (prErr) {
    console.error("Product err:", prErr);
  } else {
    console.log("Successfully deleted products");
  }

  console.log("Cleanup complete!");
}

clear();
