# ACRentService Branding & Image Handling Guide

## Branding Updates

All branding references have been updated from "ComfortRent" to "ACRentService" across the entire application.

### Key Changes

- **Brand Name**: ComfortRent → ACRentService
- **Domain**: comfortrent-v0.puneetxp.com / comfortrent.com → **acrentservice.com**
- **Contact Email**: hello@comfortrent.com → **hello@acrentservice.com**
- **Admin Email**: admin@comfortrent.com → **admin@acrentservice.com**
- **Copyright**: ComfortRent © → **ACRentService ©**

### Files Updated

**Header/Footer/Navigation:**
- `components/header.tsx` - Logo and brand name
- `components/footer.tsx` - Brand name, email, and copyright
- `components/features.tsx` - Feature section branding
- `components/dashboard-header.tsx` - Dashboard branding
- `components/dashboard-sidebar.tsx` - Sidebar branding
- `components/admin/admin-sidebar.tsx` - Admin panel branding

**Authentication & Admin:**
- `app/auth/login/page.tsx` - Admin credentials email
- `app/admin/login/page.tsx` - Admin login credentials
- `app/admin/(authenticated)/settings/page.tsx` - Company info defaults

**Metadata & SEO:**
- `app/layout.tsx` - Meta tags, OpenGraph, Twitter cards, JSON-LD schema
- `app/layout.backup.tsx` - Backup layout metadata
- `app/sitemap.ts` - Sitemap base URL
- `app/cooling/layout.tsx` - Cooling category canonical URL and schema
- `app/heating/layout.tsx` - Heating category canonical URL and schema

**Centralized Configuration:**
- `lib/branding.ts` - Single source of truth for all branding information

## Image Handling Enhancement

### Overview

The rent image functionality has been significantly improved with robust fallback mechanisms. When product images from the database are unavailable or fail to load, the system gracefully falls back to high-quality category-specific images.

### Architecture

#### Image Utility Functions (`lib/image-utils.ts`)

```typescript
// Get fallback image URL based on product category
getFallbackImageUrl(category: string): string

// Generate Supabase storage image URL with error handling
getStorageImageUrl(bucket: string, path: string, fallbackCategory?: string): string

// Handle image load errors with fallback
handleImageError(event: React.SyntheticEvent<HTMLImageElement>, fallbackUrl: string): void

// Preload and verify image accessibility
preloadImage(url: string): Promise<boolean>

// Get best available image from multiple options
getBestImageUrl(primaryUrl: string, fallbackUrls: string[], finalFallback: string): Promise<string>
```

#### Product Card Component (`components/product-card.tsx`)

Enhanced with:
- State-based image error detection
- Automatic fallback to category-specific placeholder images
- Lazy loading for performance
- Cross-origin handling for CORS prevention
- Graceful degradation when no image data is available

```typescript
const [imageError, setImageError] = useState(false);

<img
  src={
    imageError || !product.image || product.image.trim() === ""
      ? getFallbackImageUrl(product.category)
      : product.image
  }
  onError={() => setImageError(true)}
  loading="lazy"
  crossOrigin="anonymous"
/>
```

### Fallback Images

Category-specific fallback images are stored in `/public/fallback/`:

1. **cooling-unit.jpg** - Generic AC unit
   - Used for: General cooling products
   - Style: Modern white AC with blue accents

2. **window-ac.jpg** - Window mounted AC
   - Used for: Window AC category
   - Style: Side view of window-mounted unit

3. **split-ac.jpg** - Split AC indoor unit
   - Used for: Split AC category
   - Style: Wall-mounted indoor unit

4. **heating-unit.jpg** - Generic heating appliance
   - Used for: General heating products
   - Style: Modern home heating device

5. **oil-heater.jpg** - Oil radiator heater
   - Used for: Oil heater category
   - Style: Portable oil-filled radiator

6. **portable-unit.jpg** - Portable cooling unit
   - Used for: Portable AC systems
   - Style: Mobile AC unit with wheels

7. **product-default.jpg** - Universal fallback
   - Used for: Unknown categories or general fallback
   - Style: Clean professional product placeholder

### Image Loading Flow

```
User views product card
    ↓
Check if image URL exists in database
    ↓
    ├─ YES: Load database image
    │    ↓
    │    ├─ Load success → Display image
    │    │
    │    └─ Load fails → onError triggered
    │         ↓
    │         Load category-specific fallback
    │         ↓
    │         Display fallback image
    │
    └─ NO: Use category-specific fallback
         ↓
         Display fallback image
```

### Image Error Handling

The system implements multiple layers of error handling:

1. **Database Level**: Check if image_url is null/empty
2. **Component Level**: State management to track load failures
3. **onError Handler**: Gracefully transition to fallback on load failure
4. **Lazy Loading**: Improves perceived performance
5. **CORS Handling**: Cross-origin attribute prevents CORS issues

### Usage Example

```typescript
// In ProductCard component
import { getFallbackImageUrl } from "@/lib/image-utils";

<img
  src={imageError ? getFallbackImageUrl("split-ac") : product.image}
  alt={product.name}
  onError={() => setImageError(true)}
  loading="lazy"
  crossOrigin="anonymous"
/>
```

### Best Practices

1. **Always provide alt text** - Improves accessibility and SEO
2. **Use lazy loading** - Better performance on pages with many images
3. **Handle CORS** - Set crossOrigin="anonymous" for external images
4. **Graceful degradation** - Fallback images ensure consistent UX
5. **Category-specific fallbacks** - Use relevant placeholder images for each category

## Configuration

### Branding Configuration (`lib/branding.ts`)

Use this centralized configuration for any branding-related information:

```typescript
import { BRANDING, getBrandedUrl, getAdminEmail, getSupportEmail } from "@/lib/branding";

// Use brand name
BRANDING.name // "ACRentService"

// Use branded URLs
getBrandedUrl("/products") // "https://acrentservice.com/products"

// Use contact emails
getAdminEmail() // "admin@acrentservice.com"
getSupportEmail() // "hello@acrentservice.com"
```

## Migration Notes

### For Developers

If you need to:
- **Add new branding text**: Update `lib/branding.ts` first, then use it in components
- **Add new pages**: Use `getBrandedUrl()` for canonical URLs and metadata
- **Handle images**: Import utilities from `lib/image-utils.ts` and handle errors gracefully
- **Update emails**: Reference `BRANDING.contact` instead of hardcoding

### For Content Managers

If you need to:
- **Change contact email**: Update `BRANDING.contact.email` in `lib/branding.ts`
- **Update company info**: Edit `BRANDING.business` in `lib/branding.ts`
- **Change social links**: Update `BRANDING.social` in `lib/branding.ts`

## Testing Image Handling

To test fallback functionality:

1. **Delete database image**: Remove image_url from a product
2. **Load product card**: Should display category-specific fallback
3. **Invalid URL**: Use a broken image URL
4. **Wait for error**: onError handler should trigger fallback

All scenarios should show appropriate fallback images with no blank spaces or broken image icons.

## Future Enhancements

- Image optimization pipeline with WebP support
- CDN integration for faster image delivery
- Image caching strategies
- Batch image upload for admin
- AI-generated product images as enhanced fallbacks
