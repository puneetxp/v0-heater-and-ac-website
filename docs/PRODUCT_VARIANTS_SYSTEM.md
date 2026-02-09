# Product Variants and Service Plans System

## Overview

This document describes the comprehensive product variants and service plans system implemented for the AC & Heater rental platform. The system allows customers to select different product capacities and rental durations with dynamic pricing.

## Components

### Frontend Components

#### 1. **ProductVariants** (`components/product-variants.tsx`)
The main component for displaying and selecting product variants and service plans.

**Features:**
- Grid display of product variants with specifications
- Service plan cards with pricing and features
- Dynamic price calculation based on variant and plan selection
- Popular plan highlight indicator
- Feature comparison with checkmarks
- Total cost calculation for selected duration

**Props:**
```typescript
interface ProductVariantsProps {
  productId: string
  variants: Variant[]
  plans: Plan[]
  variantPlans: VariantPlan[]
  basePrice: number
  onVariantSelect?: (variantId: string) => void
  onPlanSelect?: (planId: string) => void
  onPriceChange?: (price: number) => void
}
```

**Usage:**
```tsx
<ProductVariants
  productId={productId}
  variants={mockVariants}
  plans={mockPlans}
  variantPlans={mockVariantPlans}
  basePrice={product.price}
  onVariantSelect={(variantId) => console.log(variantId)}
  onPlanSelect={(planId) => console.log(planId)}
  onPriceChange={(price) => console.log(price)}
/>
```

#### 2. **AdminVariantManager** (`components/admin-variant-manager.tsx`)
Admin interface for managing product variants and service plans.

**Features:**
- Tabbed interface for variants and plans
- Add/Edit/Delete functionality for both
- Status indicators (Active/Inactive, Popular)
- Inline editing with save/cancel
- Quick management without page reloads

**Usage:**
```tsx
<AdminVariantManager
  productId={productId}
  variants={variants}
  plans={plans}
  onVariantAdd={(variant) => handleVariantAdd(variant)}
  onVariantEdit={(id, variant) => handleVariantEdit(id, variant)}
  onVariantDelete={(id) => handleVariantDelete(id)}
  onPlanAdd={(plan) => handlePlanAdd(plan)}
  onPlanEdit={(id, plan) => handlePlanEdit(id, plan)}
  onPlanDelete={(id) => handlePlanDelete(id)}
/>
```

#### 3. **PlanComparison** (`components/plan-comparison.tsx`)
Comparative view of all available plans in a table format.

**Features:**
- Table layout comparing all plans side-by-side
- Feature checklist showing included items per plan
- Price display with discount badges
- Select buttons for quick plan choice

#### 4. **VariantSelectorMobile** (`components/variant-selector-mobile.tsx`)
Responsive variant and plan selector optimized for mobile devices.

**Features:**
- Dropdown variant selector
- Grid plan selector
- Real-time price summary
- Order summary card
- Mobile-optimized spacing and touch targets

### Data Models

#### Variant
```typescript
interface Variant {
  id: string
  name: string
  capacity: string
  color?: string
  specifications: Record<string, string>
  priceMultiplier?: number
  image?: string
  isActive?: boolean
}
```

Example:
```typescript
{
  id: 'var-1',
  name: '1.5 Ton Inverter',
  capacity: '1.5 Ton',
  color: '#FFFFFF',
  specifications: {
    'energy_rating': '5 Star',
    'cooling_capacity': '1.5 Ton',
    'noise_level': '22 dB'
  },
  priceMultiplier: 1.15,
}
```

#### Plan
```typescript
interface Plan {
  id: string
  name: string
  description: string
  durationMonths: number
  discountPercentage: number
  features: string[]
  isPopular?: boolean
  displayOrder: number
}
```

Example:
```typescript
{
  id: 'plan-2',
  name: 'Quarterly',
  description: '3 months - Best value for short-term',
  durationMonths: 3,
  discountPercentage: 10,
  features: [
    'Free installation',
    'Priority maintenance',
    'One free relocation',
    'Extended warranty'
  ],
  isPopular: true,
  displayOrder: 2,
}
```

#### VariantPlan (Pricing)
```typescript
interface VariantPlan {
  variantId: string
  planId: string
  basePrice: number
  finalPrice: number
}
```

## Database Schema

### Tables to Create

Once the database is ready, create these tables:

```sql
-- Product Variants
CREATE TABLE product_variants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
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

-- Product Plans
CREATE TABLE product_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
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

-- Variant-Plan Pricing
CREATE TABLE product_variant_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  variant_id UUID NOT NULL REFERENCES product_variants(id) ON DELETE CASCADE,
  plan_id UUID NOT NULL REFERENCES product_plans(id) ON DELETE CASCADE,
  base_price DECIMAL(10, 2) NOT NULL,
  final_price DECIMAL(10, 2) NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(variant_id, plan_id)
);

-- Create Indexes
CREATE INDEX idx_product_variants_product_id ON product_variants(product_id);
CREATE INDEX idx_product_plans_product_id ON product_plans(product_id);
CREATE INDEX idx_product_variant_plans_variant_id ON product_variant_plans(variant_id);
CREATE INDEX idx_product_variant_plans_plan_id ON product_variant_plans(plan_id);
```

## Pages

### Product Detail Page
**Route:** `/product/[id]`
**File:** `app/product/[id]/page.tsx`

Displays:
- Product information and images
- ProductVariants component for selection
- Product specifications
- Warranty and support information
- Customer reviews (placeholder)

### Admin Variant Management
**Route:** `/admin/products/[id]/variants`
**File:** `app/admin/products/[id]/variants/page.tsx`

Allows admins to:
- Add new product variants
- Edit existing variants
- Delete variants
- Add new service plans
- Edit existing plans
- Delete plans
- Set popular plan indicator
- Configure discount percentages

## Integration Steps

### 1. Database Setup
Execute the SQL schema migration to create the three new tables with proper relationships and indexes.

### 2. API Routes
Create API routes for variant and plan management:
- `POST /api/products/[id]/variants` - Create variant
- `GET /api/products/[id]/variants` - List variants
- `PUT /api/products/[id]/variants/[variantId]` - Update variant
- `DELETE /api/products/[id]/variants/[variantId]` - Delete variant
- `POST /api/products/[id]/plans` - Create plan
- `GET /api/products/[id]/plans` - List plans
- `PUT /api/products/[id]/plans/[planId]` - Update plan
- `DELETE /api/products/[id]/plans/[planId]` - Delete plan

### 3. Supabase Integration
Connect components to real database data using Supabase client:
```typescript
const { data: variants } = await supabase
  .from('product_variants')
  .select('*')
  .eq('product_id', productId)
  .eq('is_active', true)
```

### 4. Booking Form Integration
Update booking form to capture and use:
- Selected variant ID
- Selected plan ID
- Calculated final price
- Plan features and duration

## Design Features

### Responsive Layout
- **Mobile:** Dropdown selectors, stacked cards, compact spacing
- **Tablet:** 2-column layout for variants, grid plans
- **Desktop:** 3-column layout for variants, side-by-side comparison

### Visual Hierarchy
- Selected items highlighted with rings and shadows
- Popular plans scaled and marked
- Color-coded badges for status (Active, Popular, Savings)
- Clear pricing with discount indication

### User Experience
- Instant price updates on selection
- Feature comparison at a glance
- Total cost calculation visible
- Clear distinction between products and plans
- Smooth transitions and hover states

## Future Enhancements

1. **Inventory Management:** Track available quantities per variant
2. **Dynamic Pricing:** Rules-based pricing based on season, demand, etc.
3. **Variant Images:** Multiple images per variant with gallery view
4. **Bundle Plans:** Combine multiple variants at discounted rates
5. **Loyalty Programs:** Special pricing for repeat customers
6. **Bulk Discounts:** Custom pricing for corporate rentals

## Testing

Mock data is provided in the components for testing. Replace with real database queries after integration.

Example mock data used:
```typescript
const mockVariants = [
  { id: 'var-1', name: '1.0 Ton', capacity: '1.0 Ton', ... },
  { id: 'var-2', name: '1.5 Ton', capacity: '1.5 Ton', ... }
]

const mockPlans = [
  { id: 'plan-1', name: 'Monthly', durationMonths: 1, ... },
  { id: 'plan-2', name: 'Quarterly', durationMonths: 3, ... }
]
```

## Support

For questions or issues with the variant and plan system, refer to:
- Component prop interfaces for valid data structures
- Mock data examples in page files
- Admin manager component for management UI patterns
