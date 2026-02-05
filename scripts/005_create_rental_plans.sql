-- Create rental plans (bundles) table
CREATE TABLE IF NOT EXISTS public.rental_plans (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  duration_months INTEGER NOT NULL,
  discount_percentage DECIMAL(5, 2) DEFAULT 0,
  features TEXT[],
  is_popular BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.rental_plans ENABLE ROW LEVEL SECURITY;

-- Allow anyone to view active plans
CREATE POLICY "Anyone can view active rental plans" ON public.rental_plans FOR SELECT USING (is_active = TRUE);

-- Insert default rental plans
INSERT INTO public.rental_plans (name, description, duration_months, discount_percentage, features, is_popular) VALUES
  ('Basic Monthly', 'Perfect for short-term needs', 1, 0, ARRAY['Flexible cancellation', 'Free installation', '24/7 support', 'Maintenance included'], FALSE),
  ('Quarterly', 'Best value for 3 months', 3, 10, ARRAY['10% discount', 'Flexible cancellation', 'Free installation', '24/7 support', 'Priority maintenance', 'Free relocation once'], TRUE),
  ('Semi-Annual', 'Extended comfort at great value', 6, 15, ARRAY['15% discount', 'Flexible cancellation', 'Free installation', '24/7 support', 'Priority maintenance', 'Free relocation twice', 'Extended warranty'], FALSE),
  ('Annual', 'Maximum savings for long-term', 12, 20, ARRAY['20% discount', 'Flexible cancellation', 'Free installation', '24/7 priority support', 'Priority maintenance', 'Unlimited relocation', 'Extended warranty', 'Upgrade option'], FALSE);
