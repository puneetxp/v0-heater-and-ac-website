# Seasonal Plans - Data Model & Architecture

## Database Schema

### seasonal_plans Table

```sql
CREATE TABLE seasonal_plans (
  id              SERIAL PRIMARY KEY,
  name            TEXT NOT NULL,
  season          TEXT NOT NULL CHECK (season IN ('summer', 'winter', 'year_round', 'end_season')),
  description     TEXT,
  base_price      INTEGER DEFAULT 0,
  pricing_per_unit INTEGER DEFAULT 0,
  discount_percentage INTEGER DEFAULT 0,
  duration_months INTEGER NOT NULL,
  start_month     INTEGER CHECK (start_month BETWEEN 1 AND 12),
  end_month       INTEGER CHECK (end_month BETWEEN 1 AND 12),
  is_active       BOOLEAN DEFAULT true,
  valid_from      DATE,
  valid_until     DATE,
  features        JSONB DEFAULT '[]'::jsonb,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);
```

### Field Descriptions

| Field | Type | Constraints | Purpose |
|-------|------|-----------|---------|
| `id` | SERIAL | PRIMARY KEY | Unique identifier |
| `name` | TEXT | NOT NULL | Display name of plan |
| `season` | TEXT | NOT NULL, CHECK | Category: summer/winter/year_round/end_season |
| `description` | TEXT | - | Marketing description |
| `base_price` | INTEGER | DEFAULT 0 | Fixed base cost (₹) |
| `pricing_per_unit` | INTEGER | DEFAULT 0 | Cost per additional unit (₹) |
| `discount_percentage` | INTEGER | DEFAULT 0 | Discount % (0-100) |
| `duration_months` | INTEGER | NOT NULL | Plan validity in months |
| `start_month` | INTEGER | 1-12 | Month when plan starts (1=Jan) |
| `end_month` | INTEGER | 1-12 | Month when plan ends |
| `is_active` | BOOLEAN | DEFAULT true | Plan availability status |
| `valid_from` | DATE | - | Plan effective date |
| `valid_until` | DATE | - | Plan expiry date |
| `features` | JSONB | DEFAULT [] | Array of feature strings |
| `created_at` | TIMESTAMPTZ | AUTO | Record creation timestamp |
| `updated_at` | TIMESTAMPTZ | AUTO | Last update timestamp |

---

## Data Structure Examples

### Summer Plan
```json
{
  "id": 1,
  "name": "Summer Cool - 3 Months",
  "season": "summer",
  "description": "Beat the heat with our premium AC units for the entire summer season",
  "base_price": 5000,
  "pricing_per_unit": 1500,
  "discount_percentage": 15,
  "duration_months": 3,
  "start_month": 3,
  "end_month": 5,
  "is_active": true,
  "valid_from": "2025-03-01",
  "valid_until": "2025-05-31",
  "features": [
    "Free installation",
    "24/7 support",
    "Free maintenance",
    "Flexible upgrade"
  ],
  "created_at": "2025-01-01T10:00:00Z",
  "updated_at": "2025-01-15T14:30:00Z"
}
```

### Winter Plan
```json
{
  "id": 3,
  "name": "Winter Warm - 3 Months",
  "season": "winter",
  "description": "Stay cozy with our efficient heaters throughout the winter months",
  "base_price": 4000,
  "pricing_per_unit": 1200,
  "discount_percentage": 15,
  "duration_months": 3,
  "start_month": 10,
  "end_month": 12,
  "is_active": true,
  "valid_from": "2025-10-01",
  "valid_until": "2025-12-31",
  "features": [
    "Free installation",
    "24/7 support",
    "Free maintenance",
    "Energy efficient"
  ],
  "created_at": "2025-01-01T10:00:00Z",
  "updated_at": "2025-01-15T14:30:00Z"
}
```

### Year-Round Plan
```json
{
  "id": 5,
  "name": "Year-Round Premium - 12 Months",
  "season": "year_round",
  "description": "Ultimate comfort package with maximum savings",
  "base_price": 18000,
  "pricing_per_unit": 1200,
  "discount_percentage": 35,
  "duration_months": 12,
  "start_month": 1,
  "end_month": 12,
  "is_active": true,
  "valid_from": "2025-01-01",
  "valid_until": "2025-12-31",
  "features": [
    "Free installation",
    "24/7 priority support",
    "Free maintenance",
    "Free upgrades",
    "Swap anytime",
    "Extended warranty"
  ],
  "created_at": "2025-01-01T10:00:00Z",
  "updated_at": "2025-01-15T14:30:00Z"
}
```

---

## API Request/Response Schema

### POST /api/admin/plans - Create Plan

**Request Body:**
```json
{
  "name": "string",              // Required: Plan display name
  "season": "string",            // Required: summer|winter|year_round|end_season
  "description": "string",       // Required: Marketing text
  "base_price": "string|number", // Required: Fixed base cost
  "pricing_per_unit": "string|number", // Required: Per-unit cost
  "discount_percentage": "string|number", // Optional: 0-100
  "duration_months": "string|number",    // Required: Plan duration
  "start_month": "string|number",        // Required: 1-12
  "end_month": "string|number"           // Required: 1-12
}
```

**Response (201 Created):**
```json
{
  "id": 1,
  "name": "Summer Cool - 3 Months",
  "season": "summer",
  "description": "Beat the heat with our premium AC units...",
  "base_price": 5000,
  "pricing_per_unit": 1500,
  "discount_percentage": 15,
  "duration_months": 3,
  "start_month": 3,
  "end_month": 5,
  "is_active": true,
  "created_at": "2025-01-15T14:30:00Z",
  "updated_at": "2025-01-15T14:30:00Z"
}
```

**Error Response (400):**
```json
{
  "error": "Missing required fields"
}
```

**Error Response (401):**
```json
{
  "error": "Unauthorized"
}
```

---

### PUT /api/admin/plans/[id] - Update Plan

**Request Body:** (Same as POST)
```json
{
  "name": "string",
  "season": "string",
  "description": "string",
  "base_price": "string|number",
  "pricing_per_unit": "string|number",
  "discount_percentage": "string|number",
  "duration_months": "string|number",
  "start_month": "string|number",
  "end_month": "string|number",
  "is_active": "boolean" // Optional
}
```

**Response (200 OK):**
```json
{
  "id": 1,
  "name": "Updated Plan Name",
  "season": "summer",
  ...
}
```

---

### GET /api/admin/plans - List All Plans

**Query Parameters:**
```
?id=1  // Optional: Fetch single plan
```

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "name": "Summer Cool - 3 Months",
    "season": "summer",
    ...
  },
  {
    "id": 2,
    "name": "Summer Cool - 6 Months",
    "season": "summer",
    ...
  },
  ...
]
```

---

### GET /api/admin/plans/[id] - Get Single Plan

**Response (200 OK):**
```json
{
  "id": 1,
  "name": "Summer Cool - 3 Months",
  "season": "summer",
  "description": "Beat the heat with our premium AC units for the entire summer season",
  "base_price": 5000,
  "pricing_per_unit": 1500,
  "discount_percentage": 15,
  "duration_months": 3,
  "start_month": 3,
  "end_month": 5,
  "is_active": true,
  "created_at": "2025-01-01T10:00:00Z",
  "updated_at": "2025-01-15T14:30:00Z"
}
```

**Error Response (404):**
```json
{
  "error": "Plan not found"
}
```

---

### DELETE /api/admin/plans/[id]/delete - Delete Plan

**Response (204 No Content)**

---

## Data Flow Diagram

```
┌─────────────────────────────────────────────────────────┐
│                  Admin Dashboard                        │
│         (AdminPlansPage - Server Component)             │
└─────────────────────────────────────────────────────────┘
                          │
                          ├─ GET /api/admin/plans
                          │  (Fetch all plans on page load)
                          │
                          ▼
                ┌─────────────────────┐
                │   Supabase DB       │
                │  seasonal_plans     │
                └─────────────────────┘

┌─────────────────────────────────────────────────────────┐
│              Plan Form Dialog                           │
│         (PlanFormDialog - Client Component)             │
└─────────────────────────────────────────────────────────┘
         │                                    │
    CREATE MODE                           EDIT MODE
         │                                    │
         ├─ Load empty form                  ├─ GET /api/admin/plans/[id]
         │  (Fresh state)                    │  (Load plan data)
         │                                    │
         └─ POST /api/admin/plans            └─ PUT /api/admin/plans/[id]
            (Create new plan)                  (Update plan)
            │                                  │
            ▼                                  ▼
         [Insert into DB]                  [Update in DB]
            │                                  │
            └─────────────────┬────────────────┘
                              │
                              ▼
                    [Refresh Dashboard]
                              │
                              ▼
              [Re-fetch all plans & re-render]
```

---

## Pricing Calculation Logic

### Frontend Formula
```javascript
const calculateTotalPrice = (plan, units = 1) => {
  const baseTotal = plan.base_price + (plan.pricing_per_unit * units);
  const discountAmount = baseTotal * (plan.discount_percentage / 100);
  return {
    baseTotal,
    discount: discountAmount,
    finalPrice: baseTotal - discountAmount,
    savingsPercent: plan.discount_percentage
  };
};

// Example
const plan = {
  base_price: 5000,
  pricing_per_unit: 1500,
  discount_percentage: 15
};

const result = calculateTotalPrice(plan, 2);
// Output:
// {
//   baseTotal: 8000,
//   discount: 1200,
//   finalPrice: 6800,
//   savingsPercent: 15
// }
```

---

## Season Categories Mapping

```
SEASON TYPE          | MONTHS      | TYPICAL USE     | DISCOUNT
─────────────────────┼─────────────┼─────────────────┼──────────
summer               | 3-5 (Mar)   | AC cooling      | 15-20%
winter               | 10-12 (Oct) | Heating        | 15-20%
year_round           | 1-12 (Full) | Both AC+Heat   | 25-35%
end_season           | Variable    | Clearance      | 30%+
```

---

## Data Validation Rules

### Frontend Validation (Browser)
```javascript
const validatePlan = (formData) => {
  const errors = {};

  // Required fields
  if (!formData.name?.trim()) errors.name = "Plan name required";
  if (!formData.season) errors.season = "Season required";
  if (!formData.description?.trim()) errors.description = "Description required";

  // Numeric fields
  if (!formData.base_price || isNaN(formData.base_price)) 
    errors.base_price = "Valid price required";
  if (!formData.pricing_per_unit || isNaN(formData.pricing_per_unit)) 
    errors.pricing_per_unit = "Valid price required";

  // Duration
  if (!formData.duration_months || formData.duration_months < 1)
    errors.duration_months = "Duration must be at least 1 month";

  // Months
  const start = parseInt(formData.start_month);
  const end = parseInt(formData.end_month);
  
  if (start < 1 || start > 12) errors.start_month = "Month must be 1-12";
  if (end < 1 || end > 12) errors.end_month = "Month must be 1-12";

  // Discount
  const discount = parseInt(formData.discount_percentage) || 0;
  if (discount < 0 || discount > 100) 
    errors.discount_percentage = "Discount must be 0-100%";

  return errors;
};
```

### Backend Validation (Server)
- All required fields present
- Type validation for numeric fields
- Month range validation (1-12)
- Season enum validation
- Admin authentication check

---

## Database Relationships

### Related Tables

```
seasonal_plans (1)
    ├─ plan_products (*)
    │   └─ references products table
    └─ bookings (*)
        └─ customers can book plans

profiles (admin)
    └─ has permission to CRUD seasonal_plans
```

### Query Examples

```sql
-- Get all active plans
SELECT * FROM seasonal_plans WHERE is_active = true;

-- Get plans for a specific season
SELECT * FROM seasonal_plans WHERE season = 'summer';

-- Get plans available in a specific month
SELECT * FROM seasonal_plans 
WHERE start_month <= 5 AND end_month >= 5;

-- Get plans with most discount
SELECT * FROM seasonal_plans 
ORDER BY discount_percentage DESC;

-- Count plans by season
SELECT season, COUNT(*) as count 
FROM seasonal_plans 
GROUP BY season;
```

---

## Performance Considerations

### Indexing Strategy
```sql
-- Recommended indexes
CREATE INDEX idx_seasonal_plans_season 
  ON seasonal_plans(season);

CREATE INDEX idx_seasonal_plans_is_active 
  ON seasonal_plans(is_active);

CREATE INDEX idx_seasonal_plans_months 
  ON seasonal_plans(start_month, end_month);
```

### Query Optimization
- Server-side filtering by season reduces payload
- Sorting done in database, not client
- Use pagination for large result sets
- Cache seasonal grouping on dashboard load

### Caching Strategy
- Plans rarely change (cache 1 hour)
- Invalidate cache on CREATE/UPDATE/DELETE
- Client-side caching via SWR with revalidation

---

## Type Definitions (TypeScript)

```typescript
interface SeasonalPlan {
  id: number;
  name: string;
  season: 'summer' | 'winter' | 'year_round' | 'end_season';
  description: string;
  base_price: number;
  pricing_per_unit: number;
  discount_percentage: number;
  duration_months: number;
  start_month: number;
  end_month: number;
  is_active: boolean;
  valid_from?: string;
  valid_until?: string;
  features?: string[];
  created_at: string;
  updated_at: string;
}

interface CreatePlanRequest {
  name: string;
  season: string;
  description: string;
  base_price: number | string;
  pricing_per_unit: number | string;
  discount_percentage?: number | string;
  duration_months: number | string;
  start_month: number | string;
  end_month: number | string;
}

interface PlanResponse {
  data?: SeasonalPlan;
  error?: string;
}
```

---

## Security Notes

### Authentication
- ✅ All POST/PUT/DELETE require admin role
- ✅ GET endpoints public (active plans only)
- ✅ JWT token validation on server

### Data Protection
- ✅ SQL injection prevention via parameterized queries
- ✅ Input validation on all endpoints
- ✅ Row-level security (RLS) policies in Supabase

### Audit Trail
- ✅ created_at and updated_at timestamps
- ✅ is_active flag for soft deletes
- ✅ All changes logged to audit table (optional)
