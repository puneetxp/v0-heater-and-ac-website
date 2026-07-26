# Admin Portal Setup Guide

This guide explains how to set up the admin portal with database-backed authentication.

## What's Changed

The admin authentication system has been completely secured:

- ✅ **Database-backed credentials** - Admin accounts stored in `admin_users` table in Supabase
- ✅ **No hardcoded credentials** - All sensitive data removed from code
- ✅ **Bcrypt password hashing** - Passwords are securely hashed before storage
- ✅ **Secure httpOnly cookies** - Session tokens cannot be accessed by JavaScript
- ✅ **First admin auto-creation** - The first user to sign up becomes an admin

## Setup Steps

### 1. Create the Admin Database Table

Run the migration in your Supabase dashboard:

1. Go to **Supabase Dashboard** → **SQL Editor**
2. Create a new query and copy-paste the contents of:
   ```
   supabase/migrations/20250630000002_create_admin_users.sql
   ```
3. Click **Run** to execute the migration

This creates the `admin_users` table with:
- `id` - UUID primary key
- `email` - Unique email address
- `password_hash` - Bcrypt hashed password (never stored in plain text)
- `is_active` - Boolean to enable/disable accounts
- `created_at` - Timestamp of account creation
- `updated_at` - Auto-updated timestamp

### 2. Create Your First Admin Account

1. Navigate to `/admin/login` on your website
2. Click **"Create first admin account"** button
3. Enter your email and a secure password (min 6 characters)
4. Click **"Create Admin Account"**
5. You'll be automatically logged in and redirected to the admin dashboard

### 3. Additional Admin Users (After First Admin)

To add more admin users to the database directly:

1. Go to **Supabase Dashboard** → **SQL Editor**
2. Execute an INSERT query with bcrypt-hashed password:

```sql
-- First, generate a bcrypt hash in your Node.js/terminal:
-- npm install -g bcryptjs
-- node -e "const bcrypt = require('bcryptjs'); console.log(bcrypt.hashSync('your-password', 10))"

INSERT INTO admin_users (email, password_hash, is_active)
VALUES ('admin2@example.com', '$2a$10$...', true);
```

Or use this SQL function approach:
```sql
-- Insert admin via Supabase SQL (password needs to be hashed first)
INSERT INTO admin_users (email, password_hash, is_active)
VALUES ('admin2@example.com', crypt('password123', gen_salt('bf')), true);
```

## Security Features

### Password Hashing
- Uses **bcryptjs** with 10 salt rounds
- Passwords are never stored in plain text
- Hashes cannot be reversed to get original password

### Session Management
- Sessions stored in **secure httpOnly cookies**
- Cookies cannot be accessed by client-side JavaScript
- Cannot be stolen via XSS attacks
- Auto-expires after 24 hours

### Database Access
- Uses Supabase **Service Role Key** (server-side only)
- Never exposed to client-side code
- Row Level Security (RLS) policies prevent unauthorized access
- First admin creation only works when no admins exist

## Logging In

1. Navigate to `/admin/login`
2. Enter your registered admin email
3. Enter your password
4. Click **"Sign In as Admin"**

If login is successful:
- A secure session cookie is set
- You're redirected to `/admin/dashboard`
- Your session persists for 24 hours

## Logout

When logged in to admin portal:
1. Look for the logout button (usually in the header/navigation)
2. Click it to clear your session cookie
3. You'll be redirected to the login page

## Troubleshooting

### "Invalid credentials" error
- Double-check your email and password
- Ensure the admin account exists in the database
- Check that `is_active` is set to `true`

### "Admin user already exists" when creating first admin
- The first admin already exists in the database
- Use the login form instead
- If you forgot the password, you can update it directly in Supabase

### Can't access admin dashboard
- Ensure your session cookie is set (check browser DevTools → Application → Cookies)
- Try logging out and logging back in
- Clear browser cache and try again

## Environment Variables Required

Make sure these are set in your Supabase project:
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY` - Your Supabase service role key (server-side only)

These should already be configured if your Supabase integration is set up.

## Related Files

- `app/api/auth/init-admin/route.ts` - Creates first admin user
- `app/api/auth/verify-admin/route.ts` - Verifies admin credentials
- `app/api/auth/check-admin/route.ts` - Checks if user is authenticated
- `app/admin/login/page.tsx` - Admin login page with first-admin creation
- `supabase/migrations/20250630000002_create_admin_users.sql` - Database schema
