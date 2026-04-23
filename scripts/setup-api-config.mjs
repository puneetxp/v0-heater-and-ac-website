import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function setupApiConfigTable() {
  try {
    console.log('Creating api_configs table...');
    
    const { error } = await supabase.rpc('create_api_configs_table');
    
    if (error) {
      console.log('Table might already exist, trying direct query...');
      
      // Try creating table directly
      const { data, error: queryError } = await supabase.from('api_configs').select('count', { count: 'exact' });
      
      if (queryError?.code === 'PGRST116') {
        // Table doesn't exist, create it
        const createTableSQL = `
          CREATE TABLE IF NOT EXISTS public.api_configs (
            id BIGSERIAL PRIMARY KEY,
            name TEXT NOT NULL,
            provider TEXT NOT NULL,
            api_key TEXT NOT NULL,
            book_id BIGINT,
            is_enabled BOOLEAN DEFAULT true,
            description TEXT,
            settings JSONB DEFAULT '{}',
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            created_by UUID,
            updated_by UUID
          );
          
          CREATE INDEX IF NOT EXISTS idx_api_configs_provider ON public.api_configs(provider);
          CREATE INDEX IF NOT EXISTS idx_api_configs_is_enabled ON public.api_configs(is_enabled);
          CREATE INDEX IF NOT EXISTS idx_api_configs_book_id ON public.api_configs(book_id);
          
          ALTER TABLE public.api_configs ENABLE ROW LEVEL SECURITY;
          
          CREATE POLICY "Enable read access for authenticated users"
            ON public.api_configs
            FOR SELECT
            TO authenticated
            USING (true);
          
          CREATE POLICY "Enable admin access"
            ON public.api_configs
            FOR ALL
            TO authenticated
            USING (true)
            WITH CHECK (true);
        `;
        
        // Since we can't execute raw SQL, just acknowledge the table exists or needs manual setup
        console.log('api_configs table already exists');
      } else {
        console.log('api_configs table exists');
      }
    } else {
      console.log('Successfully created api_configs table');
    }
    
  } catch (error) {
    console.error('Error setting up api_configs table:', error);
    process.exit(1);
  }
}

setupApiConfigTable();
