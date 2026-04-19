# Intax API Integration Setup Guide

## Quick Start

Your heater and AC rental website now has full Intax ERP integration with an easy-to-use admin dashboard.

## Prerequisites

1. **Intax API Key**: You should have an `INTAX_API` key from your Intax account
2. **Vercel Project**: Your site is hosted on Vercel

## Setup Steps

### 1. Add Environment Variable

Add your Intax API key to your Vercel project:

1. Go to your Vercel project settings
2. Navigate to **Settings** → **Environment Variables**
3. Add a new variable:
   - **Name**: `INTAX_API`
   - **Value**: Your Intax API key
4. Save and redeploy your project

### 2. Access Intax Dashboard

Once deployed, you can access the Intax integration from your admin panel:

1. Go to `/admin` (your admin portal)
2. Click **Intax Integration** in the sidebar
3. Browse Products, Invoices, and Orders

## Features

### Optional Fields Toggle

Each section (Products, Invoices, Orders) has an "Show Optional Fields" toggle that lets you:
- Hide empty fields for a cleaner view
- Choose which optional data to display
- Switch between essential and detailed views

### Available Sections

#### Products
- View all products from your Intax system
- Display product details, categories, pricing, and inventory
- Toggle optional fields like SKU, unit of measurement, etc.

#### Invoices
- View all invoices in your system
- Track payment status and amounts
- Display optional fields like payment terms, notes, etc.

#### Orders
- View all customer orders/rental bookings
- Track order status and delivery dates
- Display optional fields and custom notes

## API Routes

The integration includes backend API routes for fetching and creating data:

- `GET/POST /api/intax/products` - Products management
- `GET/POST /api/intax/invoices` - Invoice management
- `GET/POST /api/intax/orders` - Orders/bookings management

### Example Usage

```typescript
// Fetch products
const res = await fetch('/api/intax/products?limit=100&offset=0');
const { data: products } = await res.json();

// Create new invoice
const res = await fetch('/api/intax/invoices', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    invoice_number: 'INV-001',
    account_name: 'Customer Name',
    total_amount: 5000,
    status: 'draft'
  })
});
```

## Files Structure

```
lib/intax/
├── types.ts          # TypeScript interfaces for all API models
├── client.ts         # Low-level API client (generic CRUD operations)
├── services.ts       # High-level service functions for your business logic
└── index.ts          # Convenient exports

app/api/intax/
├── products/route.ts # Products API endpoints
├── invoices/route.ts # Invoices API endpoints
└── orders/route.ts   # Orders API endpoints

components/intax/
├── optional-fields-toggle.tsx  # Reusable toggle component
├── intax-products-view.tsx      # Products table view
├── intax-invoices-view.tsx      # Invoices table view
└── intax-orders-view.tsx        # Orders table view

app/admin/(authenticated)/
└── intax/page.tsx    # Main Intax dashboard page
```

## Supported Data Models

The integration supports 57 different Intax data models:

- **Products & Categories**: Complete product catalog management
- **Invoices & Billing**: Comprehensive billing and payment tracking
- **Orders & Bookings**: Order and rental booking management
- **Service Plans**: Rental pricing plans and rates
- **Inventory**: Stock levels and inventory tracking
- **Accounts**: Customer and vendor management
- **And 51 more...** See `lib/intax/types.ts` for complete list

## Advanced Usage

### Using the Service Functions

The `lib/intax/services.ts` file provides high-level functions:

```typescript
import {
  getProducts,
  getInvoices,
  getOrders,
  getServicePlans,
  createInvoice,
  // ... and many more
} from '@/lib/intax/services';

// Fetch products by category
const productsByCategory = await getProducts(products => 
  products.category === 'heaters'
);

// Create a new invoice
const newInvoice = await createInvoice({
  invoice_number: 'INV-002',
  account_name: 'John Doe',
  invoice_date: new Date().toISOString(),
  total_amount: 10000,
  status: 'draft'
});
```

### Using the Raw Client

For more complex queries, use the raw client:

```typescript
import { intaxClient } from '@/lib/intax/client';

// Read with filters
const products = await intaxClient.read('products', {
  limit: 50,
  offset: 0,
  // Add where clause if API supports it
});

// Create
const newProduct = await intaxClient.create('products', {
  name: 'New AC Unit',
  category: 'split-ac',
  price: 25000
});

// Update
const updated = await intaxClient.update('products', '123', {
  status: 'available'
});

// Delete
await intaxClient.delete('products', '123');
```

## Error Handling

All API calls include proper error handling. The components show user-friendly error messages and a retry button if something goes wrong.

```typescript
try {
  const res = await fetch('/api/intax/products');
  if (!res.ok) throw new Error('Failed to fetch');
  const data = await res.json();
} catch (err) {
  console.error('Error:', err.message);
  // Show error to user
}
```

## Environment Variables

Required environment variables:

- `INTAX_API` - Your Intax API key
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase URL (for admin auth)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anon key (for admin auth)

## Troubleshooting

### "Configuration Error: API key not found"
- Make sure `INTAX_API` is set in your Vercel environment variables
- Verify the key is correct
- Redeploy your project after adding the environment variable

### Data not showing
- Check the browser console for error messages
- Verify your Intax account has data in that section
- Use the "Refresh" button to retry loading

### Optional fields not appearing
- Click "Show Optional Fields" to expand the toggle
- Check the box next to fields you want to display
- Fields with no data will show a "-"

## Next Steps

1. **Sync your existing data** - Your products, invoices, and orders are already accessible
2. **Customize views** - Use optional field toggles to show only what you need
3. **Create new records** - Use the API to create products, invoices, and orders directly
4. **Integrate into pages** - Import components and services into other parts of your site

## Support

For issues or questions about the Intax integration:
1. Check the error messages in your browser console
2. Review the `INTAX_INTEGRATION.md` file for detailed documentation
3. Verify your API key and environment variables are correct
