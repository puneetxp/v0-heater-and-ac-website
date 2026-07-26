# Admin Security Fix

## Overview
This fix addresses the security vulnerability where admin credentials were hardcoded in the client-side code and stored in localStorage (accessible to JavaScript).

## Changes Made

### Security Improvements
1. **Removed hardcoded credentials** from client-side code (`app/admin/login/page.tsx`)
2. **Removed localStorage storage** - credentials are no longer stored client-side
3. **Implemented httpOnly cookies** - admin session is now stored in a secure, JavaScript-inaccessible cookie
4. **Server-side verification** - credentials are now verified on the server using environment variables
5. **Removed unused dependencies** - removed Supabase client-side auth from admin flow

### Files Modified
- `app/admin/login/page.tsx` - Removed hardcoded credentials, added server verification
- `app/api/auth/check-admin/route.ts` - Removed localStorage checks, simplified to httpOnly cookie verification
- `app/api/auth/verify-admin/route.ts` - NEW: Secure credential verification endpoint
- `components/admin-auth-provider.tsx` - Removed localStorage checks
- `lib/check-admin.ts` - Removed localStorage and Supabase auth checks

## Setup Required

### 1. Set Environment Variables
Add these to your Vercel project environment variables:

```
ADMIN_EMAIL=your-admin@email.com
ADMIN_PASSWORD=your-secure-password
```

**Important:**
- Use a strong, unique password (minimum 12 characters)
- Never commit these values to git
- Only admins should know these credentials

### 2. How It Works Now

**Login Flow:**
1. User enters email and password on `/admin/login`
2. Credentials are sent to `/api/auth/verify-admin` (server-side)
3. Server compares against `ADMIN_EMAIL` and `ADMIN_PASSWORD` environment variables
4. If valid, server creates a secure httpOnly cookie
5. User is redirected to admin dashboard
6. All subsequent requests include the httpOnly cookie automatically
7. Cookie is verified by `checkAdminAccess()` and `/api/auth/check-admin`

**Security Benefits:**
- ✅ Credentials never exposed in client-side code
- ✅ Credentials never stored in client-side storage (localStorage)
- ✅ httpOnly cookie cannot be accessed by JavaScript (prevents XSS attacks)
- ✅ Server controls authentication state
- ✅ Credentials stored only in environment variables

### 3. Testing

1. Deploy the changes with the environment variables set
2. Go to `/admin/login`
3. Enter your admin email and password
4. You should be redirected to the admin dashboard
5. Open browser DevTools → Application → Cookies
6. You'll see `admin_session` cookie marked as "HttpOnly" (no access from JavaScript)

### 4. Troubleshooting

**"Invalid credentials" error:**
- Verify `ADMIN_EMAIL` and `ADMIN_PASSWORD` are correctly set in environment variables
- Ensure the email matches exactly (case-insensitive but exact)
- Check for extra spaces in the values

**Still redirected to login:**
- Verify environment variables are deployed to Vercel
- Check server logs for errors
- Clear browser cookies and try again

## Migration Notes

If you had previously stored admin credentials elsewhere:
1. Remove any old admin credentials from the database
2. Set the new environment variables in Vercel
3. Test the login flow
4. Remove any client-side authentication code
