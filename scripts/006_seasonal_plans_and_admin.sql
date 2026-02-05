-- Add admin role to profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin'));

-- Create seasonal_plans table
CREATE TABLE IF NOT EXISTS seasonal_plans (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  season TEXT NOT NULL CHECK (season IN ('summer', 'winter', 'year_round', 'end_season')),
  description TEXT,
  discount_percentage INTEGER DEFAULT 0,
  duration_months INTEGER NOT NULL,
  is_active BOOLEAN DEFAULT true,
  valid_from DATE,
  valid_until DATE,
  features JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create plan_products junction table (for bundles)
CREATE TABLE IF NOT EXISTS plan_products (
  id SERIAL PRIMARY KEY,
  plan_id INTEGER REFERENCES seasonal_plans(id) ON DELETE CASCADE,
  product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(plan_id, product_id)
);

-- Add season field to products
ALTER TABLE products ADD COLUMN IF NOT EXISTS season TEXT CHECK (season IN ('summer', 'winter', 'year_round'));

-- Add plan_id to bookings
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS plan_id INTEGER REFERENCES seasonal_plans(id);

-- Enable RLS
ALTER TABLE seasonal_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE plan_products ENABLE ROW LEVEL SECURITY;

-- Policies for seasonal_plans (everyone can read, only admins can modify)
CREATE POLICY "Anyone can view active plans" ON seasonal_plans
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage plans" ON seasonal_plans
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Policies for plan_products
CREATE POLICY "Anyone can view plan products" ON plan_products
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage plan products" ON plan_products
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Update products with seasons
UPDATE products SET season = 'summer' WHERE category = 'window_ac' OR category = 'split_ac';
UPDATE products SET season = 'winter' WHERE category = 'oil_heater';

-- Insert seasonal plans
INSERT INTO seasonal_plans (name, season, description, discount_percentage, duration_months, valid_from, valid_until, features) VALUES
  ('Summer Cool - 3 Months', 'summer', 'Beat the heat with our premium AC units for the entire summer season', 15, 3, '2025-03-01', '2025-05-31', '["Free installation", "24/7 support", "Free maintenance", "Flexible upgrade"]'),
  ('Winter Warm - 3 Months', 'winter', 'Stay cozy with our efficient heaters throughout the winter months', 15, 3, '2025-10-01', '2025-12-31', '["Free installation", "24/7 support", "Free maintenance", "Energy efficient"]'),
  ('Year-Round Comfort - 6 Months', 'year_round', 'Complete comfort solution with both AC and heater options', 25, 6, '2025-01-01', '2025-12-31', '["Free installation", "24/7 support", "Free maintenance", "Priority service", "Swap option"]'),
  ('Year-Round Premium - 12 Months', 'year_round', 'Ultimate comfort package with maximum savings', 35, 12, '2025-01-01', '2025-12-31', '["Free installation", "24/7 priority support", "Free maintenance", "Free upgrades", "Swap anytime", "Extended warranty"]'),
  ('End Season Sale - Summer', 'end_season', 'Special discounted rates as summer ends', 30, 2, '2025-08-01', '2025-09-30', '["Free installation", "Special pricing", "Flexible terms"]'),
  ('End Season Sale - Winter', 'end_season', 'Special discounted rates as winter ends', 30, 2, '2025-02-01', '2025-03-31', '["Free installation", "Special pricing", "Flexible terms"]');

-- Create admin user trigger function
CREATE OR REPLACE FUNCTION create_admin_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Make first user admin (or check by email)
  IF NEW.email = 'admin@comfortrent.com' THEN
    NEW.role = 'admin';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to set admin role
CREATE TRIGGER set_admin_role
  BEFORE INSERT ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION create_admin_user();
