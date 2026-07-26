# Unified Login System - Setup Guide

## Overview

The application now uses a **single unified login system** that automatically detects admin users from the Supabase database. There is no longer a separate admin login page.

## How It Works

1. **User logs in** via `/auth/login` with their email and password
2. **System checks** if the user exists in the `admin_users` table
3. **If admin**: User is logged in and can see an "Admin" button in their dashboard
4. **If regular user**: User is logged in normally with access to their rental dashboard

## Setup Steps

### 1. Create the Database Table

Run the migration in your Supabase SQL Editor:

```sql
-- Location: supabase/migrations/20250630000002_create_admin_users.sql
-- Copy and paste this migration into Supabase → SQL Editor and click Run
```

### 2. Create Your First Admin Account

**Option A: Via UI (Easiest)**
1. Go to `/admin/login`
2. Click "Create first admin account"
3. Enter email and password
4. Account will be created in `admin_users` table with bcrypt-hashed password

**Option B: Manual Database Entry**
1. Use bcryptjs to hash your password:
   ```bash
   npm install -g @node-red/bcryptjs
   # or in Node REPL:
   # const bcrypt = require('bcryptjs');
   # bcrypt.hashSync('your-password', 10)
   ```
2. Insert directly into Supabase:
   ```sql
   INSERT INTO admin_users (email, password_hash, is_active) 
   VALUES ('your-email@example.com', 'bcrypt-hash-here', true);
   ```

### 3. Login as Admin

1. Go to `/auth/login`
2. Enter your admin email and password
3. You'll be redirected to admin dashboard at `/admin/dashboard`
4. The "Admin" button appears in the top right of your user dashboard

## Security Features

✅ **No hardcoded credentials** - All credentials stored in database with bcrypt hashing  
✅ **No localStorage exposure** - Admin session stored in secure httpOnly cookies  
✅ **Database-backed** - Admin role managed through Supabase `admin_users` table  
✅ **Active/Inactive control** - Admins can be deactivated via `is_active` flag  
✅ **Automatic role detection** - System checks database after every login  

## API Endpoints

### Verify Admin Credentials
```
POST /api/auth/verify-admin
Body: { email: string, password: string }
Response: { authenticated: true }
```

### Initialize First Admin
```
POST /api/auth/init-admin
Body: { email: string, password: string }
Response: { success: true, message: string }
```

## Regular User Flow

1. User visits `/auth/login`
2. User enters email and password
3. System verifies against Supabase Auth
4. System checks if user is in `admin_users` table
5. If **not admin**: Redirected to `/dashboard` (regular user dashboard)
6. Regular users see their bookings, subscriptions, and invoices

## Admin User Flow

1. User visits `/auth/login`
2. User enters email and password
3. System verifies against Supabase Auth
4. System checks if user is in `admin_users` table and `is_active = true`
5. If **is admin**: httpOnly session cookie set
6. User redirected to `/admin/dashboard`
7. Admin sees "Admin" button in dashboard top right for quick access

## Database Schema

### admin_users Table
```sql
- id (UUID, Primary Key)
- email (VARCHAR, Unique)
- password_hash (VARCHAR) -- bcrypt hashed
- is_active (BOOLEAN, default: true)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

## Troubleshooting

**"Admin Account Does Not Exist"**
- Check that the `admin_users` table was created successfully
- Verify the email matches exactly (case-sensitive in some systems)
- Confirm `is_active` is set to `true`

**"Password Does Not Match"**
- Make sure password is at least 6 characters
- Ensure bcrypt hash is properly generated if manually inserting

**"Admin Portal Not Showing"**
- Refresh the page to trigger admin check
- Verify you're logged in as an admin user
- Check browser console for errors

## Environment Variables

The system uses Supabase credentials from your connected integration:
- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

No additional environment variables needed for admin authentication.

## Deactivating Admins

To temporarily disable admin access:

```sql
UPDATE admin_users 
SET is_active = false 
WHERE email = 'admin@example.com';
```

The user can still log in normally, but won't have admin privileges.

## Next Steps

1. ✅ Run the migration in Supabase
2. ✅ Create your first admin account via `/admin/login`
3. ✅ Log in with your admin credentials
4. ✅ Access admin dashboard at `/admin/dashboard`
5. ✅ Remove old `/admin/login` hardcoded credentials documentation
