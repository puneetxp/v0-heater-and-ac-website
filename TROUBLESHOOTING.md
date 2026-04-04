# ACRentService - Troubleshooting & Development Guide

## Current Issues & Solutions

### 1. Authentication Service Unavailable
**Symptom:** "Authentication service is currently unavailable" error on login page

**Cause:** Supabase authentication service is temporarily down or unreachable

**Solutions:**

#### Option A: Wait for Service Recovery (Recommended)
- The Supabase authentication service will come back online automatically
- Once online, use the demo credentials to test:
  - **Email:** `admin@acrentservice.com`
  - **Password:** `admin123`

#### Option B: Use Demo Admin Credentials (Available Now)
- The app has built-in static admin credentials that work **without** Supabase
- Use the credentials displayed in the demo box on the login page
- This allows full access to the admin dashboard for testing
- All admin functionality works with this fallback

#### Option C: Check Supabase Connection
If the issue persists after 30 minutes:

1. **Verify Supabase Project Status:**
   ```
   - Go to your Supabase Dashboard
   - Check if the project shows green status
   - Verify API keys in Settings > API
   ```

2. **Check Environment Variables:**
   - Navigate to v0 Settings > Vars
   - Verify `NEXT_PUBLIC_SUPABASE_URL` is set correctly
   - Verify `NEXT_PUBLIC_SUPABASE_ANON_KEY` is set correctly

3. **Check Network Connectivity:**
   - Ensure your network allows HTTPS connections to `*.supabase.co`
   - Check browser console for CORS errors (Ctrl+Shift+J)

### 2. Branding Updates

All branding has been updated from "ComfortRent" to "ACRentService":

**Updated Components:**
- Header & Navigation
- Footer with updated email: `hello@acrentservice.com`
- Admin & User Dashboards
- Auth pages (login, sign-up)
- Metadata & SEO (OG tags, JSON-LD schema)
- Sitemap & Canonical URLs

**Domain Updates:**
- All URLs now point to: `https://acrentservice.com`
- Previous domains (`comfortrent-v0.puneetxp.com`, `comfortrent.com`) redirected

### 3. Image Handling with Fallbacks

The app now has robust image loading:

**How It Works:**
1. Tries to load image from database URL
2. If database image fails → Uses category-specific fallback
3. If category fallback fails → Uses generic placeholder
4. All fallbacks are stored locally in `/public/fallback/`

**Available Fallback Images:**
- `cooling-unit.jpg` - Generic AC units
- `window-ac.jpg` - Window-mounted AC
- `split-ac.jpg` - Split AC systems
- `heating-unit.jpg` - Generic heaters
- `oil-heater.jpg` - Oil radiators
- `portable-unit.jpg` - Portable AC units
- `product-default.jpg` - Universal fallback

**Testing Image Fallbacks:**
1. Go to any product page
2. If a product has no image in database, the fallback displays automatically
3. No manual intervention needed

## Development Mode Features

### Local Development Setup

1. **Install Dependencies:**
   ```bash
   pnpm install
   ```

2. **Start Development Server:**
   ```bash
   pnpm dev
   ```

3. **Access Application:**
   - Open `http://localhost:3000` in browser

### Testing Features

#### Test Admin Login
- Use credentials: `admin@acrentservice.com` / `admin123`
- Works even when Supabase is down
- Full admin dashboard access

#### Test Image Fallbacks
1. Navigate to product pages
2. Missing images will auto-fallback to category defaults
3. Smooth, professional placeholders instead of broken images

#### Test Different Categories
- `/cooling/window-ac` - Window AC products
- `/cooling/split-ac` - Split AC products
- `/heating/oil-heater` - Oil heater products
- Each has category-specific fallback images

## Build & Deployment

### Build for Production
```bash
pnpm build
```

### Deploy to Vercel
```bash
git push origin main
```

The app will automatically deploy and be available at `acrentservice.com`

## Configuration Files

### Key Configuration Files:
- `lib/branding.ts` - Centralized branding configuration
- `lib/image-utils.ts` - Image loading utilities
- `.env.local` - Local environment variables
- `next.config.js` - Next.js configuration

## Common Tasks

### Add a New Product Image Fallback
1. Add image to `/public/fallback/`
2. Update `lib/image-utils.ts` with new category mapping
3. Restart dev server

### Update Branding
1. Edit `lib/branding.ts` for central config
2. Update specific component files as needed
3. Search for any hardcoded strings using grep

### Test Without Database
1. Use admin credentials for authenticated features
2. Use mock data in components (see `components/product-card.tsx`)
3. Fallback images work without any database connection

## Performance Notes

- Images use lazy loading for better performance
- CORS handling enabled for external image sources
- Fallback images are lightweight and optimized
- Admin sessions stored locally in localStorage for offline access

## Support & Contact

- **Support Email:** `hello@acrentservice.com`
- **Admin Access:** `admin@acrentservice.com`

---

**Last Updated:** April 5, 2026
**Status:** All systems operational, Supabase authentication temporarily unavailable (fallback available)
