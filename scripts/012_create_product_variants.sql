-- Create product variants table
CREATE TABLE IF NOT EXISTS public.product_variants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  sku TEXT UNIQUE,
  capacity TEXT,
  color TEXT,
  size TEXT,
  specifications JSONB,
  image_url TEXT,
  price_multiplier DECIMAL(5, 2) DEFAULT 1.0, -- Price relative to base product (1.0 = same price)
  available_quantity INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create product plans table (service plans/durations)
CREATE TABLE IF NOT EXISTS public.product_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  duration_months INTEGER NOT NULL,
  discount_percentage DECIMAL(5, 2) DEFAULT 0,
  includes_installation BOOLEAN DEFAULT TRUE,
  includes_maintenance BOOLEAN DEFAULT TRUE,
  includes_warranty BOOLEAN DEFAULT FALSE,
  warranty_months INTEGER,
  max_relocations INTEGER DEFAULT 0,
  features TEXT[],
  is_popular BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create product variant plans table (pricing for variant + plan combinations)
CREATE TABLE IF NOT EXISTS public.product_variant_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  variant_id UUID NOT NULL REFERENCES public.product_variants(id) ON DELETE CASCADE,
  plan_id UUID NOT NULL REFERENCES public.product_plans(id) ON DELETE CASCADE,
  base_price DECIMAL(10, 2) NOT NULL,
  final_price DECIMAL(10, 2) NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(variant_id, plan_id)
);

-- Enable RLS
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_variant_plans ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for product_variants
CREATE POLICY "Anyone can view active product variants" ON public.product_variants
  FOR SELECT USING (is_active = TRUE);

CREATE POLICY "Admins can manage product variants" ON public.product_variants
  FOR ALL USING (auth.jwt() ->> 'email' IN (SELECT email FROM public.profiles WHERE role = 'admin'));

-- Create RLS policies for product_plans
CREATE POLICY "Anyone can view active product plans" ON public.product_plans
  FOR SELECT USING (is_active = TRUE);

CREATE POLICY "Admins can manage product plans" ON public.product_plans
  FOR ALL USING (auth.jwt() ->> 'email' IN (SELECT email FROM public.profiles WHERE role = 'admin'));

-- Create RLS policies for product_variant_plans
CREATE POLICY "Anyone can view active variant plans" ON public.product_variant_plans
  FOR SELECT USING (is_active = TRUE);

CREATE POLICY "Admins can manage variant plans" ON public.product_variant_plans
  FOR ALL USING (auth.jwt() ->> 'email' IN (SELECT email FROM public.profiles WHERE role = 'admin'));

-- Create indexes for better query performance
CREATE INDEX idx_product_variants_product_id ON public.product_variants(product_id);
CREATE INDEX idx_product_plans_product_id ON public.product_plans(product_id);
CREATE INDEX idx_product_variant_plans_variant_id ON public.product_variant_plans(variant_id);
CREATE INDEX idx_product_variant_plans_plan_id ON public.product_variant_plans(plan_id);

-- Insert sample variants for Split AC (assuming product exists)
-- Insert sample plans for products
INSERT INTO public.product_plans (product_id, name, description, duration_months, discount_percentage, features, is_popular, display_order)
SELECT 
  id,
  'Monthly',
  'Rent month-to-month with no commitment',
  1,
  0,
  ARRAY['Free installation', 'Basic maintenance', '24/7 support'],
  FALSE,
  1
FROM public.products WHERE category = 'split_ac' LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO public.product_plans (product_id, name, description, duration_months, discount_percentage, features, is_popular, display_order)
SELECT 
  id,
  'Quarterly',
  'Best value for 3 months',
  3,
  10,
  ARRAY['10% discount', 'Free installation', 'Priority maintenance', '24/7 support', 'Free relocation once'],
  TRUE,
  2
FROM public.products WHERE category = 'split_ac' LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO public.product_plans (product_id, name, description, duration_months, discount_percentage, features, is_popular, display_order)
SELECT 
  id,
  'Annual',
  'Maximum savings for long-term use',
  12,
  20,
  ARRAY['20% discount', 'Free installation', 'Priority maintenance', '24/7 support', 'Unlimited relocation', 'Extended warranty'],
  FALSE,
  3
FROM public.products WHERE category = 'split_ac' LIMIT 1
ON CONFLICT DO NOTHING;
