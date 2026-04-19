# Intax API Integration Guide

This document explains how to use the Intax API integration in your heater and AC rental application.

## Setup

### 1. Environment Variables

Add your Intax API key to your Vercel project:

1. Go to your Vercel project settings
2. Add the environment variable: `INTAX_API`
3. Set the value to your Intax API key

```bash
INTAX_API=your_api_key_here
```

### 2. File Structure

The integration is organized in `/lib/intax/`:

- **`types.ts`** - TypeScript interfaces for all Intax API models
- **`client.ts`** - Low-level API client for making HTTP requests
- **`services.ts`** - High-level service functions for common operations
- **`index.ts`** - Main export file

## Usage

### Basic Usage

Import services directly from the intax library:

```typescript
import {
  getAllProducts,
  getProductById,
  createInvoice,
  getAllOrders,
} from '@/lib/intax';
```

### Products & Categories

```typescript
import {
  getAllProducts,
  getProductById,
  getProductsByCategory,
  createProduct,
  updateProduct,
  deleteProduct,
  getAllCategories,
  getCategoryById,
} from '@/lib/intax';

// Get all products
const products = await getAllProducts();

// Get product by ID
const product = await getProductById(1);

// Get products in a category
const categoryProducts = await getProductsByCategory(5);

// Create a new product
const newProduct = await createProduct({
  name: 'Oil Heater 1500W',
  description: 'Powerful heating solution',
  price: 4999,
  category_id: 1,
  status: 'active',
});

// Update a product
const updated = await updateProduct(1, {
  price: 5499,
  name: 'Oil Heater 1500W - Updated',
});

// Delete a product
await deleteProduct(1);

// Get all categories
const categories = await getAllCategories();
```

### Invoices & Billing

```typescript
import {
  getAllInvoices,
  getInvoiceById,
  createInvoice,
  getInvoicesByAccount,
  getInvoicesByStatus,
  createInvoiceItem,
} from '@/lib/intax';

// Get all invoices
const invoices = await getAllInvoices();

// Get invoice by ID
const invoice = await getInvoiceById(42);

// Create new invoice
const newInvoice = await createInvoice({
  invoice_number: 'INV-2024-001',
  amount: 12000,
  status: 'pending',
  gst_rate: 18,
  book_id: 1,
  account_id: 5,
});

// Get invoices for a customer
const customerInvoices = await getInvoicesByAccount(5);

// Get invoices by status
const paidInvoices = await getInvoicesByStatus('paid');

// Add item to invoice
const item = await createInvoiceItem({
  invoice_id: 42,
  product_id: 1,
  quantity: 2,
  price: 5000,
});
```

### Orders & Bookings

```typescript
import {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrder,
  getOrdersByAccount,
  getOrdersByStatus,
  createOrderItem,
} from '@/lib/intax';

// Get all orders
const orders = await getAllOrders();

// Create new rental booking
const booking = await createOrder({
  order_number: 'ORD-2024-100',
  status: 'pending',
  account_id: 5,
  book_id: 1,
  total_amount: 15000,
});

// Update order status
const updated = await updateOrder(42, {
  status: 'confirmed',
});

// Get orders for a customer
const customerOrders = await getOrdersByAccount(5);

// Get orders by status
const activeOrders = await getOrdersByStatus('active');

// Add item to order
const item = await createOrderItem({
  order_id: 42,
  product_id: 1,
  quantity: 1,
  price: 5000,
});
```

### Service Plans (Rental Plans)

```typescript
import {
  getAllServicePlans,
  getServicePlanById,
  createServicePlan,
  getServicePlanPrices,
  createServicePlanPrice,
} from '@/lib/intax';

// Get all service plans
const plans = await getAllServicePlans();

// Create a new rental plan
const plan = await createServicePlan({
  name: 'Monthly Heater Plan',
  service_id: 1,
  book_id: 1,
});

// Get pricing for a plan
const prices = await getServicePlanPrices(1);

// Create a daily rate
const dailyRate = await createServicePlanPrice({
  name: 'Daily Rate',
  mrp: 500,
  amount: 450,
  day: 1,
  gst_rate: 18,
  service_plan_id: 1,
});

// Create a monthly rate
const monthlyRate = await createServicePlanPrice({
  name: 'Monthly Rate',
  mrp: 12000,
  amount: 10000,
  month: 1,
  gst_rate: 18,
  service_plan_id: 1,
});
```

### Inventory & Stock Management

```typescript
import {
  getAllBookStocks,
  getBookStockById,
  getStockByProduct,
  createRecordStock,
  updateBookStock,
} from '@/lib/intax';

// Get all inventory
const stocks = await getAllBookStocks();

// Get stock for a product
const productStock = await getStockByProduct(1);

// Record purchase (incoming stock)
const purchase = await createRecordStock({
  unit: 10,
  price: 4000,
  purchase_mode: 'bank_transfer',
  invoice_no: 'VENDOR-001',
  book_stock_id: 1,
  account_id: 3, // Supplier/Vendor ID
});

// Update stock quantity
const updated = await updateBookStock(1, {
  price: 4500,
  allow: 1,
});
```

### Accounts (Customers & Vendors)

```typescript
import {
  getAllAccounts,
  getAccountById,
  createAccount,
  updateAccount,
  getActiveAccounts,
} from '@/lib/intax';

// Get all accounts
const accounts = await getAllAccounts();

// Get account by ID
const account = await getAccountById(5);

// Create new customer account
const customer = await createAccount({
  name: 'Raj Kumar',
  email: 'raj@example.com',
  phone: '9876543210',
  status: 'active',
  book_id: 1,
  account_type_id: 2, // Customer type
});

// Create vendor/supplier account
const vendor = await createAccount({
  name: 'Heating Equipment Co.',
  email: 'sales@heating.com',
  phone: '9876543211',
  status: 'active',
  book_id: 1,
  account_type_id: 3, // Vendor type
});

// Update account
const updated = await updateAccount(5, {
  email: 'raj.new@example.com',
  phone: '9876543220',
});

// Get all active customers
const activeCustomers = await getActiveAccounts();
```

### Books (Business/Store Management)

```typescript
import {
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
} from '@/lib/intax';

// Get all books
const books = await getAllBooks();

// Create new business book
const book = await createBook({
  name: 'Main Store',
  status: 'active',
  book_detail_id: 1,
});

// Update book
const updated = await updateBook(1, {
  name: 'Main Store - Renamed',
  status: 'active',
});
```

## Advanced Usage

### Generic CRUD Operations

For operations not covered by the service functions, use the generic client functions:

```typescript
import {
  intaxGetAll,
  intaxGetById,
  intaxCreate,
  intaxUpdate,
  intaxDelete,
  intaxWhere,
} from '@/lib/intax';

// Get all records of any model
const users = await intaxGetAll('user');
const roles = await intaxGetAll('role');

// Get single record
const user = await intaxGetById('user', 1);

// Create record
const newUser = await intaxCreate('user', {
  name: 'John Doe',
  email: 'john@example.com',
});

// Update record
const updated = await intaxUpdate('user', 1, {
  email: 'john.new@example.com',
});

// Delete record (soft delete)
const deleted = await intaxDelete('user', 1);

// Filter records
const users = await intaxWhere('user', {
  status: 'active',
  book_id: 1,
});
```

## Available Models

The API supports 57 models. Here are the most relevant for your rental business:

### Core Business Models
- `product` - Heaters, AC units, etc.
- `category` - Product categories
- `invoice` - Customer bills
- `order` - Rental bookings
- `account` - Customers and vendors

### Operational Models
- `book` - Store/business management
- `service_plan` - Rental plans and pricing
- `service_plan_price` - Daily/weekly/monthly rates
- `book_stock` - Inventory levels
- `record_stock` - Purchase records

### Support Models
- `payment` - Payment records
- `order_item` - Items in orders
- `invoice_item` - Items in invoices
- `unit` - Measurement units
- `brand` - Product brands

See `lib/intax/types.ts` for complete type definitions of all available models.

## Error Handling

All functions return `null` on error and log details to the console:

```typescript
const product = await getProductById(999);
if (!product) {
  console.log('Product not found or error occurred');
}
```

For production, implement proper error handling:

```typescript
try {
  const products = await getAllProducts();
  if (!products || products.length === 0) {
    console.warn('No products found');
  }
} catch (error) {
  console.error('Failed to fetch products:', error);
  // Show user-friendly error message
}
```

## TypeScript Support

Full TypeScript support with interfaces for all models:

```typescript
import type {
  ApiProduct,
  ApiInvoice,
  ApiOrder,
  ApiServicePlan,
  ApiBookStock,
  ApiAccount,
} from '@/lib/intax';

// Strongly typed
const products: ApiProduct[] = await getAllProducts();
const invoice: ApiInvoice | null = await getInvoiceById(1);
```

## Best Practices

1. **Check API Configuration**
   ```typescript
   import { isIntaxConfigured } from '@/lib/intax';
   
   if (!isIntaxConfigured()) {
     console.error('Intax API is not configured');
   }
   ```

2. **Cache Results**
   Use SWR or React Query to cache API responses and avoid repeated requests.

3. **Error Handling**
   Always check for null returns and implement proper error handling in your UI.

4. **Rate Limiting**
   Be mindful of API rate limits. Batch operations when possible.

5. **Logging**
   Check console logs (prefixed with `[intax]`) for debugging API issues.

## Common Operations

### Complete Rental Workflow

```typescript
// 1. Create customer
const customer = await createAccount({
  name: 'Customer Name',
  email: 'customer@example.com',
  phone: '9876543210',
  status: 'active',
  book_id: 1,
  account_type_id: 2,
});

// 2. Create rental order
const order = await createOrder({
  order_number: `ORD-${Date.now()}`,
  status: 'pending',
  account_id: customer.id,
  book_id: 1,
  total_amount: 5000,
});

// 3. Add product to order
const orderItem = await createOrderItem({
  order_id: order.id,
  product_id: 1, // Heater or AC unit
  quantity: 1,
  price: 5000,
});

// 4. Create invoice
const invoice = await createInvoice({
  invoice_number: `INV-${Date.now()}`,
  amount: 5000,
  status: 'pending',
  gst_rate: 18,
  book_id: 1,
  account_id: customer.id,
});

// 5. Record payment
import { intaxCreate } from '@/lib/intax';
const payment = await intaxCreate('payment', {
  amount: 5900, // Including GST
  status: 'completed',
  payment_method_id: 1, // Check/Cash/Online
  invoice_id: invoice.id,
});
```

## Support

For API documentation and support, refer to the official Intax API documentation at `https://intax.in/api`.
