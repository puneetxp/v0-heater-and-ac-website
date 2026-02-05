-- Seed initial products
INSERT INTO public.products (name, category, capacity, description, features, price_per_day, price_per_month, deposit_amount, image_url, available_quantity) VALUES
-- Window ACs
('Window AC 1 Ton', 'window_ac', '1 Ton', 'Efficient cooling for small rooms', ARRAY['Energy efficient', 'Low noise', 'Remote control'], 150.00, 3000.00, 2000.00, '/placeholder.svg?height=300&width=400', 10),
('Window AC 1.5 Ton', 'window_ac', '1.5 Ton', 'Perfect for medium-sized rooms', ARRAY['Energy efficient', 'Auto-restart', 'Sleep mode'], 200.00, 4000.00, 2500.00, '/placeholder.svg?height=300&width=400', 8),

-- Split ACs
('Split AC 1 Ton', 'split_ac', '1 Ton', 'Modern split AC for elegant spaces', ARRAY['Inverter technology', 'Smart control', 'Air purifier'], 250.00, 5000.00, 3000.00, '/placeholder.svg?height=300&width=400', 12),
('Split AC 1.5 Ton', 'split_ac', '1.5 Ton', 'High-performance cooling solution', ARRAY['5-star rating', 'Wi-Fi enabled', 'Turbo mode'], 300.00, 6000.00, 3500.00, '/placeholder.svg?height=300&width=400', 10),
('Split AC 2 Ton', 'split_ac', '2 Ton', 'Heavy-duty cooling for large rooms', ARRAY['Dual inverter', 'Voice control', 'Auto clean'], 400.00, 8000.00, 4500.00, '/placeholder.svg?height=300&width=400', 6),

-- Oil Heaters
('Oil Heater 5 Fin', 'oil_heater', '5 Fin', 'Compact heater for personal spaces', ARRAY['Adjustable thermostat', 'Overheat protection', 'Silent operation'], 80.00, 1500.00, 800.00, '/placeholder.svg?height=300&width=400', 15),
('Oil Heater 7 Fin', 'oil_heater', '7 Fin', 'Ideal for small to medium rooms', ARRAY['3 heat settings', 'Tip-over switch', 'Castor wheels'], 100.00, 2000.00, 1000.00, '/placeholder.svg?height=300&width=400', 12),
('Oil Heater 9 Fin', 'oil_heater', '9 Fin', 'Powerful heating for larger spaces', ARRAY['Digital display', 'Timer function', 'Safety cutoff'], 120.00, 2500.00, 1200.00, '/placeholder.svg?height=300&width=400', 10),
('Oil Heater 11 Fin', 'oil_heater', '11 Fin', 'Maximum heating capacity', ARRAY['Remote control', 'Eco mode', 'Child lock'], 150.00, 3000.00, 1500.00, '/placeholder.svg?height=300&width=400', 8);
