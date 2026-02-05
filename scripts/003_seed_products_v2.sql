-- Updated seed data with actual product images and integer IDs
INSERT INTO public.products (name, category, capacity, description, features, price_per_day, price_per_month, deposit_amount, image_url, available_quantity, is_active) VALUES
-- Window ACs
('Window AC 1 Ton', 'window_ac', '1 Ton', 'Efficient cooling for small to medium rooms', ARRAY['Energy efficient', '3-star rating', 'Remote control', 'Auto restart'], 150.00, 3500.00, 2000.00, '/placeholder.svg?height=400&width=400', 10, TRUE),
('Window AC 1.5 Ton', 'window_ac', '1.5 Ton', 'Powerful cooling for larger rooms', ARRAY['High cooling capacity', '4-star rating', 'Turbo mode', 'Sleep mode'], 200.00, 4500.00, 2500.00, '/placeholder.svg?height=400&width=400', 8, TRUE),

-- Split ACs
('Split AC 1 Ton', 'split_ac', '1 Ton', 'Modern split AC with advanced features', ARRAY['Inverter technology', '5-star rating', 'Wi-Fi enabled', 'Auto clean'], 250.00, 5500.00, 3000.00, '/placeholder.svg?height=400&width=400', 15, TRUE),
('Split AC 1.5 Ton', 'split_ac', '1.5 Ton', 'Premium cooling with smart features', ARRAY['Dual inverter', '5-star rating', 'Voice control', 'PM 2.5 filter'], 300.00, 6500.00, 3500.00, '/placeholder.svg?height=400&width=400', 12, TRUE),
('Split AC 2 Ton', 'split_ac', '2 Ton', 'Heavy-duty cooling for large spaces', ARRAY['Triple inverter', '5-star rating', 'Fastest cooling', 'Anti-bacterial filter'], 350.00, 7500.00, 4000.00, '/placeholder.svg?height=400&width=400', 10, TRUE),

-- Oil Heaters
('Oil Heater 5 Fin', 'oil_heater', '5 Fin', 'Compact heating solution for small rooms', ARRAY['Adjustable thermostat', 'Safety tip-over switch', 'Castor wheels', '1000W power'], 80.00, 1800.00, 1000.00, '/placeholder.svg?height=400&width=400', 20, TRUE),
('Oil Heater 7 Fin', 'oil_heater', '7 Fin', 'Efficient heating for medium rooms', ARRAY['3 heat settings', 'Overheat protection', 'Easy mobility', '1500W power'], 100.00, 2200.00, 1200.00, '/placeholder.svg?height=400&width=400', 18, TRUE),
('Oil Heater 9 Fin', 'oil_heater', '9 Fin', 'Powerful heating for large spaces', ARRAY['Digital display', 'Timer function', 'Remote control', '2000W power'], 120.00, 2600.00, 1500.00, '/placeholder.svg?height=400&width=400', 15, TRUE),
('Oil Heater 11 Fin', 'oil_heater', '11 Fin', 'Maximum heating capacity', ARRAY['Smart thermostat', '24-hour timer', 'Turbo mode', '2500W power'], 150.00, 3200.00, 1800.00, '/placeholder.svg?height=400&width=400', 12, TRUE);
