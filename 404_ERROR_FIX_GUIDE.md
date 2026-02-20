# 404 Error Fix & Testing Guide

## Problem Analysis

The 404 errors were caused by a mismatch between:
1. **Generated URLs** from product cards: `/heating/oil-heater/oil-heater-7-fins`
2. **Available Products**: Only 7 Fin, 9 Fin, 11 Fin products existed
3. **Route Handlers**: Dynamic routes existed but weren't properly matching products to slugs

## Solution Implemented

### 1. Centralized Product Database (`/lib/product-data.ts`)
- All products are now in one place: `allProducts` object
- Organized by category: `windowAC`, `splitAC`, `oilHeater`
- Each product has consistent structure with id, name, category, capacity, price, description, features

### 2. Product Matching Function
- `findProductBySlug()`: Matches URL slug to actual product data
- Automatically converts product name + capacity to slug format
- Returns product data or null if not found

### 3. Updated Dynamic Routes
Routes now:
- Import `findProductBySlug` utility
- Look up product by slug from URL
- Display actual product data instead of generic placeholders
- Show "Product Not Found" page if slug doesn't match any product

## URL Structure & Product Mapping

### Window AC Products
```
URL: /cooling/window-ac/window-ac-1-ton
Product: "Window AC - 1 Ton" (id: 1, capacity: "1 Ton")

URL: /cooling/window-ac/window-ac-1-5-ton
Product: "Window AC - 1.5 Ton" (id: 2, capacity: "1.5 Ton")
```

### Split AC Products
```
URL: /cooling/split-ac/split-ac-1-ton
Product: "Split AC - 1 Ton" (id: 3, capacity: "1 Ton")

URL: /cooling/split-ac/split-ac-1-5-ton
Product: "Split AC - 1.5 Ton" (id: 4, capacity: "1.5 Ton")

URL: /cooling/split-ac/split-ac-2-ton
Product: "Split AC - 2 Ton" (id: 5, capacity: "2 Ton")
```

### Oil Heater Products
```
URL: /heating/oil-heater/oil-heater-7-fins
Product: "Oil Heater - 7 Fin" (id: 6, capacity: "7 Fins")

URL: /heating/oil-heater/oil-heater-9-fins
Product: "Oil Heater - 9 Fin" (id: 7, capacity: "9 Fins")

URL: /heating/oil-heater/oil-heater-11-fins
Product: "Oil Heater - 11 Fin" (id: 8, capacity: "11 Fins")
```

## Testing Checklist

### Homepage Links
- [ ] Click "Window AC - 1 Ton" → should load `/cooling/window-ac/window-ac-1-ton`
- [ ] Click "Window AC - 1.5 Ton" → should load `/cooling/window-ac/window-ac-1-5-ton`
- [ ] Click "Split AC - 1 Ton" → should load `/cooling/split-ac/split-ac-1-ton`
- [ ] Click "Split AC - 1.5 Ton" → should load `/cooling/split-ac/split-ac-1-5-ton`
- [ ] Click "Split AC - 2 Ton" → should load `/cooling/split-ac/split-ac-2-ton`
- [ ] Click "Oil Heater - 7 Fin" → should load `/heating/oil-heater/oil-heater-7-fins`
- [ ] Click "Oil Heater - 9 Fin" → should load `/heating/oil-heater/oil-heater-9-fins`
- [ ] Click "Oil Heater - 11 Fin" → should load `/heating/oil-heater/oil-heater-11-fins`

### Category Pages
- [ ] `/cooling` → displays all cooling subcategories
- [ ] `/cooling/window-ac` → displays window AC products with correct links
- [ ] `/cooling/split-ac` → displays split AC products with correct links
- [ ] `/heating` → displays all heating subcategories
- [ ] `/heating/oil-heater` → displays oil heater products with correct links

### Product Detail Pages
- [ ] Visit each product URL manually (test URLs from above)
- [ ] Product name should match the capacity
- [ ] Price should be correct
- [ ] Features should load
- [ ] Variant selector should work
- [ ] Plan selector should work
- [ ] Total price calculation should be correct

### Edge Cases
- [ ] Try invalid URLs like `/cooling/split-ac/invalid-product` → should show "Product Not Found"
- [ ] Try `/cooling/split-ac/split-ac-3-ton` (non-existent size) → should show "Product Not Found"
- [ ] Back button from product page should return to category page

## Debugging Steps If 404 Still Occurs

### 1. Check Browser Console
Open DevTools (F12) → Console tab and look for errors

### 2. Verify Product Data
Check if product exists in `/lib/product-data.ts`:
```typescript
console.log("[v0] URL params.slug:", params.slug)
console.log("[v0] Found product:", productData)
```

### 3. Verify URL Format
ProductCard generates URLs like:
```
/cooling/window-ac/window-ac-1-ton
/cooling/split-ac/split-ac-1-5-ton
/heating/oil-heater/oil-heater-7-fins
```

Check the pattern: `{category}/{subcategory}/{category-slug}-{capacity-slug}`

### 4. Check Dynamic Route File
Verify the route file exists:
- `/app/cooling/window-ac/[slug]/page.tsx` ✓
- `/app/cooling/split-ac/[slug]/page.tsx` ✓
- `/app/heating/oil-heater/[slug]/page.tsx` ✓

### 5. Common Issues
- **Misspelled capacity**: "Fins" vs "Fin" - check `product-data.ts`
- **Missing hyphens**: Spaces should be converted to hyphens in URLs
- **Case sensitivity**: URLs are lowercase, products can be mixed case
- **Duplicate hyphens**: URL should never have `--` or `---`

## Adding New Products

When adding a new product:

1. Add to `/lib/product-data.ts` in correct category array
2. Ensure consistent naming:
   - Product name: "Category - Capacity" format
   - Capacity: Include unit (e.g., "7 Fins", "1 Ton")
3. Run through testing checklist above

Example:
```typescript
{
  id: 9,
  name: 'Split AC - 3 Ton',
  category: 'Split AC',
  capacity: '3 Ton',
  price: 2899,
  description: 'Description here',
  features: ['Feature 1', 'Feature 2'],
  basePrice: 2899,
}
```

The URL will automatically be generated as: `/cooling/split-ac/split-ac-3-ton`
