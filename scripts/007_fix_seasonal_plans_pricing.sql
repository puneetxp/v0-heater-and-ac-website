-- Add pricing fields to seasonal_plans
ALTER TABLE seasonal_plans 
ADD COLUMN IF NOT EXISTS base_price INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS pricing_per_unit INTEGER DEFAULT 0;

-- Add month range fields
ALTER TABLE seasonal_plans
ADD COLUMN IF NOT EXISTS start_month INTEGER CHECK (start_month BETWEEN 1 AND 12),
ADD COLUMN IF NOT EXISTS end_month INTEGER CHECK (end_month BETWEEN 1 AND 12);

-- Update seasonal plans with pricing and month ranges
UPDATE seasonal_plans SET base_price = 5000, pricing_per_unit = 1500, start_month = 3, end_month = 5 WHERE season = 'summer' AND name LIKE '%3 Months%';
UPDATE seasonal_plans SET base_price = 4000, pricing_per_unit = 1200, start_month = 10, end_month = 12 WHERE season = 'winter' AND name LIKE '%3 Months%';
UPDATE seasonal_plans SET base_price = 10000, pricing_per_unit = 1300, start_month = 1, end_month = 12 WHERE season = 'year_round' AND name LIKE '%6 Months%';
UPDATE seasonal_plans SET base_price = 18000, pricing_per_unit = 1200, start_month = 1, end_month = 12 WHERE season = 'year_round' AND name LIKE '%12 Months%';
UPDATE seasonal_plans SET base_price = 3500, pricing_per_unit = 1400, start_month = 8, end_month = 9 WHERE season = 'end_season' AND name LIKE '%Summer%';
UPDATE seasonal_plans SET base_price = 3000, pricing_per_unit = 1100, start_month = 2, end_month = 3 WHERE season = 'end_season' AND name LIKE '%Winter%';
