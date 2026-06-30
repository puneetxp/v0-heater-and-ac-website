# Newsletter Subscription Setup Guide

## Overview
The newsletter subscription feature allows users to subscribe to your newsletter through the footer form. Their email addresses are stored in Supabase and you can manage them from your database.

## Setup Steps

### 1. Create the Newsletter Table in Supabase

You have two options:

#### Option A: Using Supabase SQL Editor (Recommended)
1. Go to your Supabase project dashboard
2. Click on "SQL Editor" in the left sidebar
3. Click "New Query"
4. Copy and paste the contents of `/scripts/create-newsletter-table.sql`
5. Click "Run"

#### Option B: Using Supabase CLI
```bash
# Navigate to your project
cd /vercel/share/v0-project

# Run the migration
psql $POSTGRES_URL -f scripts/create-newsletter-table.sql
```

### 2. Verify the Setup

After creating the table:
1. Go to Supabase Dashboard → "Table Editor"
2. Look for the `newsletter_subscribers` table
3. It should have columns: `id`, `email`, `subscribed_at`, `created_at`, `updated_at`

## How It Works

### Frontend Flow:
1. User enters email in footer form
2. Clicks "Subscribe" button
3. Form validates the email format
4. Sends POST request to `/api/newsletter/subscribe`
5. Shows loading state while processing
6. Displays success or error message via toast notification

### Backend Flow:
1. API receives email in POST request
2. Validates email format
3. Checks if email already exists in database
4. If new: Inserts into `newsletter_subscribers` table
5. Returns success/error response

### Database:
- Emails are stored in lowercase for consistency
- `subscribed_at` records when user subscribed
- Unique constraint prevents duplicate subscriptions
- Indexes optimize email lookups and sorting

## File Structure

```
components/
  └── newsletter-form.tsx          # Form component with state management

app/api/
  └── newsletter/
      └── subscribe/
          └── route.ts              # API endpoint handler

scripts/
  └── create-newsletter-table.sql   # Database migration
```

## Features

✅ Email validation  
✅ Duplicate subscription prevention  
✅ Real-time loading states  
✅ Toast notifications (success/error)  
✅ Responsive form design  
✅ Database persistence  

## Managing Subscribers

### View Subscribers:
1. Go to Supabase Dashboard
2. Click "Table Editor"
3. Select `newsletter_subscribers` table
4. Browse all subscribed emails

### Export Subscribers:
1. In Supabase, right-click the table
2. Select "Export as CSV"
3. Download subscriber list

### Query via SQL:
```sql
-- Get all subscribers
SELECT email, subscribed_at FROM newsletter_subscribers ORDER BY subscribed_at DESC;

-- Count total subscribers
SELECT COUNT(*) FROM newsletter_subscribers;

-- Find subscribers from last 7 days
SELECT * FROM newsletter_subscribers 
WHERE subscribed_at >= NOW() - INTERVAL '7 days'
ORDER BY subscribed_at DESC;
```

## Testing

1. Open your website
2. Scroll to the footer
3. Enter your email in the newsletter form
4. Click "Subscribe"
5. You should see a success message
6. Check Supabase table to confirm email was saved
7. Try subscribing with the same email again - you should see "already subscribed" message

## Troubleshooting

**Issue: "Database connection failed"**
- Check Supabase env vars are set in your project settings
- Verify `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are correct

**Issue: "Invalid email address"**
- Email format validation failed
- Make sure email contains @ symbol

**Issue: Email not saving to database**
- Verify `newsletter_subscribers` table exists
- Check table permissions in Supabase RLS settings
- Run the migration script again

## Next Steps

After setup, you can:
1. Create an admin page to view subscribers
2. Set up email campaigns with your subscribers
3. Add unsubscribe functionality
4. Send confirmation emails
5. Track subscription metrics
