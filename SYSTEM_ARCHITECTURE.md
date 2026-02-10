# Unified Product System Architecture

## Overview
All product pages now run through a **single unified route** at `/product/[slug]`, eliminating redundancy and making the system maintainable and scalable.

## How It Works

### 1. **Centralized Product Database** (`/lib/product-data.ts`)
All 8 products are stored in one location:
```
- Window AC: 2 products (1T, 1.5T)
- Split AC: 3 products (1T, 1.5T, 2T)  
- Oil Heater: 3 products (7F, 9F, 11F)
```

### 2. **Unified Product Route** (`/app/product/[slug]/page.tsx`)
**Single page handles ALL products** dynamically:
- Automatically detects product type (cooling vs heating)
- Applies correct color scheme and icon based on category
- Fetches product data from the centralized database
- Generates back links to appropriate category pages
- Shows "Product Not Found" if slug doesn't match any product

### 3. **URL Structure**
All product URLs follow the same pattern:
```
/product/{category}-{capacity}

Examples:
/product/window-ac-1-ton
/product/split-ac-1-5-ton
/product/oil-heater-7-fins
```

### 4. **Link Generation Flow**
```
ProductCard/SubcategoryPage 
    ↓
generateCleanUrl() 
    ↓
/product/{slug}
    ↓
UnifiedProductPage finds product
    ↓
Renders with product-specific data & styling
```

## Key Benefits

✅ **Single Source of Truth**: All product data in `/lib/product-data.ts`
✅ **Reduced Complexity**: One product page template instead of 3+
✅ **Easy Maintenance**: Add new products just by updating the data file
✅ **Flexible Styling**: Same page adapts appearance based on product category
✅ **Scalable**: Add new categories without creating new routes
✅ **Better URL Structure**: Clean, semantic URLs for SEO

## File Structure

```
/app/product/[slug]/page.tsx          ← Unified product page (handles all)
/lib/product-data.ts                   ← Centralized product database
/components/product-card.tsx           ← Links to /product route
/app/cooling/window-ac/page.tsx        ← Category listing only
/app/cooling/split-ac/page.tsx         ← Category listing only
/app/heating/oil-heater/page.tsx       ← Category listing only
```

## Product Data Schema

```typescript
{
  id: number
  name: string                    // "Split AC - 1.5 Ton"
  category: string                // "Split AC"
  capacity: string                // "1.5 Ton"
  price: number                   // 1899
  description: string             // Product description
  features: string[]              // Array of features
  basePrice: number              // Base rental price
}
```

## How to Add a New Product

1. Open `/lib/product-data.ts`
2. Add to appropriate category array:
```typescript
{
  id: 9,
  name: 'Split AC - 3 Ton',
  category: 'Split AC',
  capacity: '3 Ton',
  price: 2899,
  description: '...',
  features: [...],
  basePrice: 2899,
}
```
3. The system automatically generates the URL slug: `/product/split-ac-3-ton`
4. Product appears on category pages and links work instantly!

## Customization

The unified product page adapts based on product type:

- **Color Scheme**: Blue for cooling, Orange for heating
- **Icon**: Wind for AC, Flame for heaters, Zap for electricity
- **Back Link**: Routes to appropriate category page
- **Pricing**: Uses product's basePrice property
- **Features**: Displays from product features array

To customize appearance for different product types, modify the detection logic in `/app/product/[slug]/page.tsx`:
```typescript
const isCooling = productData.category.includes('AC')
const isOilHeater = productData.category.includes('Oil')
```

## Testing URLs

All these URLs now work and route to the same unified page:
- ✅ `/product/window-ac-1-ton`
- ✅ `/product/window-ac-1-5-ton`
- ✅ `/product/split-ac-1-ton`
- ✅ `/product/split-ac-1-5-ton`
- ✅ `/product/split-ac-2-ton`
- ✅ `/product/oil-heater-7-fins`
- ✅ `/product/oil-heater-9-fins`
- ✅ `/product/oil-heater-11-fins`

Any URL not matching a product slug shows: "Product Not Found"
