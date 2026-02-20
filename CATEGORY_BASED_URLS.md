# Category-Based URL Structure Documentation

## Overview

The website now implements a hierarchical, SEO-friendly URL structure based on product categories and subcategories instead of generic product IDs. This improves discoverability, navigation, and search engine optimization (SEO).

## URL Hierarchy

### Old Structure (Generic)
```
/product/[id]
Example: /product/3
```

### New Structure (Category-Based)
```
/[category]/[subcategory]/[slug]
Example: /cooling/split-ac/split-ac-1-ton
```

## Category Structure

### Cooling Products
- **Category:** `cooling`
- **Subcategories:**
  - `window-ac` → Window AC units
  - `split-ac` → Split AC systems

### Heating Products
- **Category:** `heating`
- **Subcategories:**
  - `oil-heater` → Oil heater units

## Complete URL Examples

### Category Landing Pages
| Page | URL | Purpose |
|------|-----|---------|
| Cooling Category | `/cooling` | Browse all cooling products |
| Heating Category | `/heating` | Browse all heating products |

### Subcategory Pages
| Product Type | URL | Purpose |
|--------------|-----|---------|
| Window AC Units | `/cooling/window-ac` | Browse window AC products |
| Split AC Systems | `/cooling/split-ac` | Browse split AC products |
| Oil Heaters | `/heating/oil-heater` | Browse oil heater products |

### Product Detail Pages
| Product | URL | ID |
|---------|-----|-----|
| Window AC 1 Ton | `/cooling/window-ac/window-ac-1-ton` | 1 |
| Window AC 1.5 Ton | `/cooling/window-ac/window-ac-1-5-ton` | 2 |
| Split AC 1 Ton | `/cooling/split-ac/split-ac-1-ton` | 3 |
| Split AC 1.5 Ton | `/cooling/split-ac/split-ac-1-5-ton` | 4 |
| Split AC 2 Ton | `/cooling/split-ac/split-ac-2-ton` | 5 |
| Oil Heater 5 Fin | `/heating/oil-heater/oil-heater-5-fin` | 6 |
| Oil Heater 7 Fin | `/heating/oil-heater/oil-heater-7-fin` | 7 |
| Oil Heater 9 Fin | `/heating/oil-heater/oil-heater-9-fin` | 8 |
| Oil Heater 11 Fin | `/heating/oil-heater/oil-heater-11-fin` | 9 |

## Navigation Hierarchy

```
Home (/)
├── Cooling (/cooling)
│   ├── Window AC (/cooling/window-ac)
│   │   └── Individual Products (/cooling/window-ac/[slug])
│   └── Split AC (/cooling/split-ac)
│       └── Individual Products (/cooling/split-ac/[slug])
└── Heating (/heating)
    └── Oil Heater (/heating/oil-heater)
        └── Individual Products (/heating/oil-heater/[slug])
```

## File Structure

```
app/
├── cooling/
│   ├── page.tsx                    # /cooling
│   ├── window-ac/
│   │   └── page.tsx               # /cooling/window-ac
│   └── split-ac/
│       └── page.tsx               # /cooling/split-ac
├── heating/
│   ├── page.tsx                    # /heating
│   └── oil-heater/
│       └── page.tsx               # /heating/oil-heater
└── [category]/
    └── [subcategory]/
        └── [slug]/
            └── page.tsx           # /[category]/[subcategory]/[slug]

lib/
└── product-routes.ts              # URL generation utilities
```

## Implementation Details

### URL Generation Function

```typescript
generateProductUrl(productId, productCategory, productName, capacity)
// Example: generateProductUrl(3, 'Split AC', 'Split AC - 1 Ton', '1 Ton')
// Output: '/cooling/split-ac/split-ac-1-ton'
```

### Slug Creation

Slugs are generated from product name and capacity:
- Convert to lowercase
- Replace spaces with hyphens
- Remove special characters
- Format: `[name]-[capacity]`

Examples:
- "Split AC - 1 Ton" → `split-ac-1-ton`
- "Window AC - 1.5 Ton" → `window-ac-1-5-ton`
- "Oil Heater - 5 Fin" → `oil-heater-5-fin`

### Breadcrumb Navigation

All product detail pages include automatic breadcrumb navigation:
```
Home / Cooling / Split AC / Split AC - 1 Ton
```

Breadcrumbs are generated based on URL parameters and provide clear navigation paths.

## SEO Benefits

1. **Semantic URLs**: URLs clearly describe product categories and types
2. **Keyword Optimization**: Category and product names are in the URL, improving keyword relevance
3. **Navigation Clarity**: Users understand the product hierarchy from the URL
4. **Link Sharing**: More descriptive URLs are easier to share and remember
5. **Internal Linking**: Category structure facilitates logical internal linking
6. **Search Visibility**: Better URL structure improves search engine crawlability

## Dynamic Route Implementation

The main product detail page uses Next.js dynamic routing:

```typescript
// File: app/[category]/[subcategory]/[slug]/page.tsx
// Handles all product detail pages
export default function ProductDetailPage({ params }: Props) {
  const { category, subcategory, slug } = params
  // Route validation and product lookup
}
```

This single dynamic route handles:
- All cooling products (window AC, split AC)
- All heating products (oil heaters)
- Automatic validation of category and subcategory
- Graceful error handling for invalid routes

## Component Updates

### ProductCard Component
- Now generates SEO-friendly URLs using `generateProductUrl()`
- Links point to category-based URLs instead of generic `/product/[id]`
- Maintains backward compatibility with booking flow

### Header Navigation
- Updated with category links: `/cooling` and `/heating`
- Easy navigation to category landing pages
- Clear visual hierarchy

## Migration Notes

- Old `/product/[id]` routes are replaced with category-based structure
- No database changes required (mock data used for demo)
- Product IDs are retained internally for booking functionality
- All links in product cards automatically generate correct URLs

## Backward Compatibility

To maintain backward compatibility with bookings:
- Product ID is still passed to booking routes: `/booking/[id]`
- Query parameters preserve variant and plan selections
- Category-based URLs only affect product discovery and detail pages

Example booking flow:
```
/cooling/split-ac/split-ac-1-ton 
  (View Details)
    ↓
/booking/3?variant=1.0&plan=monthly
  (Select plan and continue)
```

## URL Validation

The system validates URLs to ensure:
- Valid category (cooling, heating)
- Valid subcategory (window-ac, split-ac, oil-heater)
- Category-subcategory combination is valid
- Product slug matches an existing product

Invalid routes return a "Product Not Found" page with link to home.

## Analytics Tracking

The new URL structure provides better analytics:
- Categories can be tracked separately
- Product type conversions are clearer
- Traffic patterns by category are visible
- Popular subcategories are identifiable

## Future Enhancements

1. **Additional Categories**: Easy to add new categories (e.g., portable AC, inverters)
2. **Product Variants**: Could extend to include color/model variants in URL
3. **Filtering**: Add query parameters for filtering within categories
4. **Sorting**: Support URL-based sorting (e.g., `/cooling/split-ac?sort=price`)
5. **Reviews/Ratings**: Separate routes for product reviews (e.g., `/cooling/split-ac/split-ac-1-ton/reviews`)

## Testing the URLs

1. **Homepage**: Visit `/` - links to category pages
2. **Category Pages**: 
   - `/cooling` - Shows window AC and split AC options
   - `/heating` - Shows oil heater options
3. **Subcategory Pages**:
   - `/cooling/window-ac` - Lists window AC products
   - `/cooling/split-ac` - Lists split AC products
   - `/heating/oil-heater` - Lists oil heater products
4. **Product Pages**: Click "View Details" on any product to see the category-based URL

## Technical Stack

- **Framework**: Next.js 15+ with App Router
- **Routing**: Dynamic catch-all routes with validation
- **Utilities**: Custom `product-routes.ts` for URL generation
- **Components**: Updated to use new URL generation
- **Navigation**: Header with category links
