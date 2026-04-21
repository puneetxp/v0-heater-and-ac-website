-- Create API Configuration table for managing multiple APIs with book_id
CREATE TABLE IF NOT EXISTS api_configs (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  provider TEXT NOT NULL, -- 'intax', 'stripe', 'twilio', etc.
  api_key TEXT NOT NULL,
  book_id BIGINT, -- For Intax and similar multi-tenant APIs
  is_enabled BOOLEAN DEFAULT true,
  description TEXT,
  settings JSONB DEFAULT '{}', -- For storing additional configuration
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS idx_api_configs_provider ON api_configs(provider);
CREATE INDEX IF NOT EXISTS idx_api_configs_is_enabled ON api_configs(is_enabled);
CREATE INDEX IF NOT EXISTS idx_api_configs_book_id ON api_configs(book_id);

-- Add RLS policies
ALTER TABLE api_configs ENABLE ROW LEVEL SECURITY;

-- Create policy for admins to view all configs
CREATE POLICY "Admins can view all api_configs"
  ON api_configs
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users WHERE admin_users.user_id = auth.uid()
    )
  );

-- Create policy for admins to manage api_configs
CREATE POLICY "Admins can manage api_configs"
  ON api_configs
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users WHERE admin_users.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users WHERE admin_users.user_id = auth.uid()
    )
  );
