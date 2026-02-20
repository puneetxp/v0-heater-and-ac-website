-- Create product variants table
CREATE TABLE IF NOT EXISTS public.product_variants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  sku TEXT,
  capacity TEXT,
  color TEXT,
  specifications JSONB,
  image_url TEXT,
  price_multiplier DECIMAL(5, 2) DEFAULT 1.0,
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
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_product_variants_product_id ON public.product_variants(product_id);
CREATE INDEX idx_product_plans_product_id ON public.product_plans(product_id);
CREATE INDEX idx_product_variant_plans_variant_id ON public.product_variant_plans(variant_id);
CREATE INDEX idx_product_variant_plans_plan_id ON public.product_variant_plans(plan_id);
