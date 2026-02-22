-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  capacity VARCHAR(100) NOT NULL,
  base_price INTEGER NOT NULL,
  image_url TEXT,
  description TEXT,
  features TEXT[] DEFAULT ARRAY[]::TEXT[],
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Create index on category and capacity for faster queries
CREATE INDEX IF NOT EXISTS products_category_idx ON products(category);
CREATE INDEX IF NOT EXISTS products_capacity_idx ON products(capacity);
CREATE INDEX IF NOT EXISTS products_slug_idx ON products(category, capacity);

-- Insert Window AC products
INSERT INTO products (name, category, capacity, base_price, image_url, features) VALUES
('Window AC - 1 Ton', 'Window AC', '1 Ton', 899, '/modern-white-window-air-conditioner-unit.jpg', 
 ARRAY['Energy Efficient', 'Quiet Operation', 'Remote Control', 'Compact Design', '5 Star Rating']),
('Window AC - 1.5 Ton', 'Window AC', '1.5 Ton', 1199, '/large-window-ac-air-conditioner-cooling.jpg',
 ARRAY['Powerful Cooling', 'Timer Function', 'Easy Installation', 'Dual Inverter', 'Sleep Mode']),
('Split AC - 1 Ton', 'Split AC', '1 Ton', 1499, '/modern-white-split-air-conditioner-indoor-unit.jpg',
 ARRAY['Inverter Technology', 'Sleep Mode', 'Auto Clean', 'WiFi Ready', 'Copper Coil']),
('Split AC - 1.5 Ton', 'Split AC', '1.5 Ton', 1899, '/premium-split-ac-with-display-panel.jpg',
 ARRAY['5-Star Rating', 'Smart Wi-Fi', 'Turbo Cooling', 'Nano Coating', 'Eco Mode']),
('Split AC - 2 Ton', 'Split AC', '2 Ton', 2399, '/heavy-duty-split-air-conditioner-unit.jpg',
 ARRAY['Heavy Duty', 'Dual Inverter', 'Air Purifier', '4D Airflow', 'Smart Diagnosis']),
('Oil Heater - 5 Fin', 'Oil Heater', '5 Fins', 599, '/5-fin-oil-filled-radiator-heater-portable.jpg',
 ARRAY['Portable', 'Thermostat Control', 'Safety Cut-off', 'Quiet Operation', 'Compact']),
('Oil Heater - 7 Fin', 'Oil Heater', '7 Fins', 799, '/7-fin-oil-heater-radiator-with-wheels.jpg',
 ARRAY['Fast Heating', '3 Heat Settings', 'Tip-Over Protection', 'Wheels with Lock', 'Eco Mode']),
('Oil Heater - 9 Fin', 'Oil Heater', '9 Fins', 999, '/9-fin-oil-filled-heater-with-digital-display.jpg',
 ARRAY['Maximum Heat', 'Digital Display', 'Timer Function', 'Remote Control Ready', 'Adjustable Thermostat']),
('Oil Heater - 11 Fin', 'Oil Heater', '11 Fins', 1299, '/11-fin-large-oil-radiator-heater-remote-control.jpg',
 ARRAY['Large Room Coverage', 'Eco Mode', 'Remote Control', 'LED Display', 'Safety Valve'])
ON CONFLICT DO NOTHING;

-- Create seasonal_plans table
CREATE TABLE IF NOT EXISTS seasonal_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  season VARCHAR(50) NOT NULL,
  description TEXT,
  discount_percentage INTEGER DEFAULT 0,
  duration_months INTEGER NOT NULL,
  features TEXT[] DEFAULT ARRAY[]::TEXT[],
  valid_from DATE,
  valid_until DATE,
  base_price INTEGER,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Insert seasonal plans
INSERT INTO seasonal_plans (name, season, description, discount_percentage, duration_months, features, valid_from, valid_until, base_price) VALUES
('Summer Comfort', 'summer', 'Perfect for hot summer months', 10, 3, 
 ARRAY['24/7 Customer Support', 'Free Installation', 'Emergency Service', 'Temperature Control'], 
 '2024-04-01', '2024-09-30', 1499),
('Winter Warmth', 'winter', 'Essential heating for cold season', 15, 4,
 ARRAY['24/7 Customer Support', 'Free Installation', 'Thermostat Control', 'Energy Efficient'],
 '2024-10-01', '2025-03-31', 899)
ON CONFLICT DO NOTHING;

-- Create bookings table for rental tracking
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id),
  customer_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(20) NOT NULL,
  rental_start_date DATE NOT NULL,
  rental_end_date DATE NOT NULL,
  rental_plan VARCHAR(50) NOT NULL,
  total_price INTEGER NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Create index for product bookings
CREATE INDEX IF NOT EXISTS bookings_product_idx ON bookings(product_id);
CREATE INDEX IF NOT EXISTS bookings_status_idx ON bookings(status);
