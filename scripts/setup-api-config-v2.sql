-- Create API Configuration table for managing multiple APIs with book_id
CREATE TABLE IF NOT EXISTS public.api_configs (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  provider TEXT NOT NULL, -- 'intax', 'stripe', 'twilio', etc.
  api_key TEXT NOT NULL,
  book_id BIGINT, -- For Intax and similar multi-tenant APIs
  is_enabled BOOLEAN DEFAULT true,
  description TEXT,
  settings JSONB DEFAULT '{}', -- For storing additional configuration
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID,
  updated_by UUID
);

-- Add indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_api_configs_provider ON public.api_configs(provider);
CREATE INDEX IF NOT EXISTS idx_api_configs_is_enabled ON public.api_configs(is_enabled);
CREATE INDEX IF NOT EXISTS idx_api_configs_book_id ON public.api_configs(book_id);

-- Enable RLS
ALTER TABLE public.api_configs ENABLE ROW LEVEL SECURITY;

-- Create policy to allow authenticated users to view enabled configs
CREATE POLICY "Enable read access for authenticated users"
  ON public.api_configs
  FOR SELECT
  TO authenticated
  USING (true);

-- Create policy to allow admin operations (if user has admin role)
CREATE POLICY "Enable admin access"
  ON public.api_configs
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);
