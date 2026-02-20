# SEO-Optimized URL Structure Documentation

## Overview
This document describes the clean, hierarchical URL structure implemented to prevent 404 errors and improve SEO performance.

## URL Hierarchy

### Main Category Pages
- **Cooling**: `/cooling` - Main category page for all cooling solutions
- **Heating**: `/heating` - Main category page for all heating solutions

### Subcategory Pages
- **Window AC**: `/cooling/window-ac` - Window AC product listing
- **Split AC**: `/cooling/split-ac` - Split AC product listing
- **Oil Heater**: `/heating/oil-heater` - Oil heater product listing

### Dynamic Product Pages
Product pages use clean, slug-based URLs with the format:
- `/[category]/[subcategory]/[slug]`

#### Examples:
```
/cooling/window-ac/window-ac-1-ton
/cooling/window-ac/window-ac-1-5-ton
/cooling/split-ac/split-ac-1-ton
/cooling/split-ac/split-ac-1-5-ton
/cooling/split-ac/split-ac-2-ton
/heating/oil-heater/oil-heater-7-fin
/heating/oil-heater/oil-heater-9-fin
/heating/oil-heater/oil-heater-11-fin
```

## URL Slug Generation

### Slug Creation Rules
The `createSlug()` function in `/lib/product-routes.ts` follows these rules:

1. **Removes Category Suffix**: Strips "AC" and "Heater" from product names
   - "Split AC" → "split"
   - "Window AC" → "window"
   - "Oil Heater" → "oil"

2. **Converts to Lowercase**: All letters converted to lowercase
   - "Split AC" → "split-ac"

3. **Replaces Spaces with Hyphens**: Spaces become hyphens
   - "1 Ton" → "1-ton"

4. **Removes Special Characters**: Only alphanumeric and hyphens remain
   - "1.5 Ton" → "1-5-ton"

5. **Avoids Redundancy**: Prevents duplicate segments in slugs
   - Product: "Split AC", Capacity: "Split AC - 1 Ton"
   - Result: `split-ac-1-ton` (not `split-ac-split-ac-1-ton`)

### Example Slug Generation
```typescript
createSlug("Split AC Unit", "1.5 Ton")
// Output: "split-ac-1-5-ton"

createSlug("Window AC", "1 Ton")
// Output: "window-ac-1-ton"

createSlug("Oil Heater", "9 Fin")
// Output: "oil-heater-9-fin"
```

## Route Implementation

### Dynamic Route Files
Each subcategory has a dynamic route handler:

```
app/cooling/window-ac/[slug]/page.tsx
app/cooling/split-ac/[slug]/page.tsx
app/heating/oil-heater/[slug]/page.tsx
```

These files use Next.js dynamic route parameters to render product pages based on the slug.

## Link Generation

### ProductCard Component
The `ProductCard` component automatically generates SEO-friendly URLs:

```typescript
const detailsUrl = generateProductUrl(
  product.id,
  product.category,
  product.name,
  product.capacity
)

// Usage in link
<Link href={detailsUrl}>View Details</Link>
```

### Subcategory Pages
Subcategory pages generate dynamic links for each product:

```typescript
// Split AC page example
<Link href={`/cooling/split-ac/split-ac-${product.capacity.replace(/\s+/g, '-').toLowerCase()}`}>
  View Details
</Link>
```

## Benefits of This Structure

### 1. **SEO Optimization**
- Keywords in URL (cooling, split-ac, 1-ton)
- Clear hierarchy helps search engines understand content structure
- Clean URLs improve click-through rates in search results

### 2. **User-Friendly**
- URLs describe exactly what users will see
- Easy to remember and share
- Predictable navigation structure

### 3. **404 Prevention**
- Dynamic routes accept any slug and render products
- No broken links from misconfigured routing
- Flexible for adding new products

### 4. **Maintainability**
- Centralized slug generation in `product-routes.ts`
- Changes to slug logic apply everywhere automatically
- Type-safe routing with TypeScript

## Testing URL Structure

### Valid URLs
```
https://domain.com/cooling
https://domain.com/cooling/split-ac
https://domain.com/cooling/split-ac/split-ac-1-ton
https://domain.com/cooling/split-ac/split-ac-1-5-ton
https://domain.com/cooling/window-ac/window-ac-1-ton
https://domain.com/heating
https://domain.com/heating/oil-heater
https://domain.com/heating/oil-heater/oil-heater-9-fin
```

All the above URLs will load correctly without 404 errors.

## Future Scaling

### Adding New Products
To add a new product:

1. Update product data in the subcategory page
2. Add entry to `categoryMap` in `product-routes.ts` if new category
3. Links are automatically generated based on product name and capacity

### Adding New Categories
To add a new category:

1. Create new category folder: `/app/[category]/`
2. Create subcategory folder: `/app/[category]/[subcategory]/`
3. Add dynamic route: `/app/[category]/[subcategory]/[slug]/page.tsx`
4. Update `categoryMap` in `product-routes.ts`

## Backward Compatibility

All old product URLs have been migrated to the new structure:
- `/product/1` → `/cooling/window-ac/window-ac-1-ton`
- `/product/3` → `/cooling/split-ac/split-ac-1-ton`
- `/product/6` → `/heating/oil-heater/oil-heater-9-fin`

Existing links will continue to work through the new routing system.
