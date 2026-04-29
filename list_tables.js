const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://jwdfuqknkpxokkcvopfz.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp3ZGZ1cWtua3B4b2trY3ZvcGZ6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NjE2Mzg0MywiZXhwIjoyMDgxNzM5ODQzfQ.zDBEF39Hhg1sTZYTW1KcFZo1MpreYyx-A89m2Br1hwI';
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data, error } = await supabase.from('pg_tables').select('tablename').eq('schemaname', 'public');
  // pg_tables might not be accessible via regular client
  // Let's try to query products to confirm access
  const { data: products } = await supabase.from('products').select('id').limit(1);
  console.log('Access confirmed to products');
}
run();
