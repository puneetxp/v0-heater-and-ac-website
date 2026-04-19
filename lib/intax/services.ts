/**
 * Intax API Service Functions
 * High-level functions for common business operations
 */

import {
  intaxGetAll,
  intaxGetById,
  intaxCreate,
  intaxUpdate,
  intaxDelete,
  intaxWhere,
} from './client';
import type {
  ApiProduct,
  ApiCategory,
  ApiInvoice,
  ApiInvoiceItem,
  ApiOrder,
  ApiOrderItem,
  ApiServicePlan,
  ApiServicePlanPrice,
  ApiBookStock,
  ApiRecordStock,
  ApiAccount,
  ApiBook,
} from './types';

// ============================================
// Products & Categories
// ============================================

/**
 * Get all products
 */
export async function getAllProducts(): Promise<ApiProduct[]> {
  return intaxGetAll<ApiProduct>('product');
}

/**
 * Get product by ID
 */
export async function getProductById(id: number): Promise<ApiProduct | null> {
  return intaxGetById<ApiProduct>('product', id);
}

/**
 * Create new product
 */
export async function createProduct(
  product: Omit<ApiProduct, keyof import('./types').APIBaseModel>,
): Promise<ApiProduct | null> {
  return intaxCreate<ApiProduct>('product', product);
}

/**
 * Update product
 */
export async function updateProduct(
  id: number,
  updates: Partial<Omit<ApiProduct, keyof import('./types').APIBaseModel>>,
): Promise<ApiProduct | null> {
  return intaxUpdate<ApiProduct>('product', id, updates);
}

/**
 * Delete product
 */
export async function deleteProduct(id: number): Promise<ApiProduct | null> {
  return intaxDelete<ApiProduct>('product', id);
}

/**
 * Get products by category
 */
export async function getProductsByCategory(categoryId: number): Promise<ApiProduct[]> {
  return intaxWhere<ApiProduct>('product', { category_id: categoryId });
}

/**
 * Get all categories
 */
export async function getAllCategories(): Promise<ApiCategory[]> {
  return intaxGetAll<ApiCategory>('category');
}

/**
 * Get category by ID
 */
export async function getCategoryById(id: number): Promise<ApiCategory | null> {
  return intaxGetById<ApiCategory>('category', id);
}

// ============================================
// Invoices & Billing
// ============================================

/**
 * Get all invoices
 */
export async function getAllInvoices(): Promise<ApiInvoice[]> {
  return intaxGetAll<ApiInvoice>('invoice');
}

/**
 * Get invoice by ID
 */
export async function getInvoiceById(id: number): Promise<ApiInvoice | null> {
  return intaxGetById<ApiInvoice>('invoice', id);
}

/**
 * Create new invoice
 */
export async function createInvoice(
  invoice: Omit<ApiInvoice, keyof import('./types').APIBaseModel>,
): Promise<ApiInvoice | null> {
  return intaxCreate<ApiInvoice>('invoice', invoice);
}

/**
 * Update invoice
 */
export async function updateInvoice(
  id: number,
  updates: Partial<Omit<ApiInvoice, keyof import('./types').APIBaseModel>>,
): Promise<ApiInvoice | null> {
  return intaxUpdate<ApiInvoice>('invoice', id, updates);
}

/**
 * Get invoices by account (customer)
 */
export async function getInvoicesByAccount(accountId: number): Promise<ApiInvoice[]> {
  return intaxWhere<ApiInvoice>('invoice', { account_id: accountId });
}

/**
 * Get invoices by status
 */
export async function getInvoicesByStatus(status: string): Promise<ApiInvoice[]> {
  return intaxWhere<ApiInvoice>('invoice', { status });
}

/**
 * Create invoice item
 */
export async function createInvoiceItem(
  item: Omit<ApiInvoiceItem, keyof import('./types').APIBaseModel>,
): Promise<ApiInvoiceItem | null> {
  return intaxCreate<ApiInvoiceItem>('invoice_item', item);
}

// ============================================
// Orders & Bookings
// ============================================

/**
 * Get all orders
 */
export async function getAllOrders(): Promise<ApiOrder[]> {
  return intaxGetAll<ApiOrder>('order');
}

/**
 * Get order by ID
 */
export async function getOrderById(id: number): Promise<ApiOrder | null> {
  return intaxGetById<ApiOrder>('order', id);
}

/**
 * Create new order (rental booking)
 */
export async function createOrder(
  order: Omit<ApiOrder, keyof import('./types').APIBaseModel>,
): Promise<ApiOrder | null> {
  return intaxCreate<ApiOrder>('order', order);
}

/**
 * Update order
 */
export async function updateOrder(
  id: number,
  updates: Partial<Omit<ApiOrder, keyof import('./types').APIBaseModel>>,
): Promise<ApiOrder | null> {
  return intaxUpdate<ApiOrder>('order', id, updates);
}

/**
 * Get orders by account
 */
export async function getOrdersByAccount(accountId: number): Promise<ApiOrder[]> {
  return intaxWhere<ApiOrder>('order', { account_id: accountId });
}

/**
 * Get orders by status
 */
export async function getOrdersByStatus(status: string): Promise<ApiOrder[]> {
  return intaxWhere<ApiOrder>('order', { status });
}

/**
 * Create order item
 */
export async function createOrderItem(
  item: Omit<ApiOrderItem, keyof import('./types').APIBaseModel>,
): Promise<ApiOrderItem | null> {
  return intaxCreate<ApiOrderItem>('order_item', item);
}

// ============================================
// Service Plans (for Rental Pricing)
// ============================================

/**
 * Get all service plans
 */
export async function getAllServicePlans(): Promise<ApiServicePlan[]> {
  return intaxGetAll<ApiServicePlan>('service_plan');
}

/**
 * Get service plan by ID
 */
export async function getServicePlanById(id: number): Promise<ApiServicePlan | null> {
  return intaxGetById<ApiServicePlan>('service_plan', id);
}

/**
 * Create new service plan (rental plan)
 */
export async function createServicePlan(
  plan: Omit<ApiServicePlan, keyof import('./types').APIBaseModel>,
): Promise<ApiServicePlan | null> {
  return intaxCreate<ApiServicePlan>('service_plan', plan);
}

/**
 * Get service plan prices
 */
export async function getServicePlanPrices(
  servicePlanId: number,
): Promise<ApiServicePlanPrice[]> {
  return intaxWhere<ApiServicePlanPrice>('service_plan_price', {
    service_plan_id: servicePlanId,
  });
}

/**
 * Create service plan price (e.g., daily, monthly rates)
 */
export async function createServicePlanPrice(
  price: Omit<ApiServicePlanPrice, keyof import('./types').APIBaseModel>,
): Promise<ApiServicePlanPrice | null> {
  return intaxCreate<ApiServicePlanPrice>('service_plan_price', price);
}

// ============================================
// Inventory & Stock Management
// ============================================

/**
 * Get all book stocks (inventory)
 */
export async function getAllBookStocks(): Promise<ApiBookStock[]> {
  return intaxGetAll<ApiBookStock>('book_stock');
}

/**
 * Get book stock by ID
 */
export async function getBookStockById(id: number): Promise<ApiBookStock | null> {
  return intaxGetById<ApiBookStock>('book_stock', id);
}

/**
 * Get stock for a specific product
 */
export async function getStockByProduct(productId: number): Promise<ApiBookStock[]> {
  return intaxWhere<ApiBookStock>('book_stock', { product_id: productId });
}

/**
 * Create stock record (when purchasing inventory)
 */
export async function createRecordStock(
  stock: Omit<ApiRecordStock, keyof import('./types').APIBaseModel>,
): Promise<ApiRecordStock | null> {
  return intaxCreate<ApiRecordStock>('record_stock', stock);
}

/**
 * Update book stock (inventory level)
 */
export async function updateBookStock(
  id: number,
  updates: Partial<Omit<ApiBookStock, keyof import('./types').APIBaseModel>>,
): Promise<ApiBookStock | null> {
  return intaxUpdate<ApiBookStock>('book_stock', id, updates);
}

// ============================================
// Accounts (Customers & Vendors)
// ============================================

/**
 * Get all accounts
 */
export async function getAllAccounts(): Promise<ApiAccount[]> {
  return intaxGetAll<ApiAccount>('account');
}

/**
 * Get account by ID
 */
export async function getAccountById(id: number): Promise<ApiAccount | null> {
  return intaxGetById<ApiAccount>('account', id);
}

/**
 * Create new account (customer or vendor)
 */
export async function createAccount(
  account: Omit<ApiAccount, keyof import('./types').APIBaseModel>,
): Promise<ApiAccount | null> {
  return intaxCreate<ApiAccount>('account', account);
}

/**
 * Update account
 */
export async function updateAccount(
  id: number,
  updates: Partial<Omit<ApiAccount, keyof import('./types').APIBaseModel>>,
): Promise<ApiAccount | null> {
  return intaxUpdate<ApiAccount>('account', id, updates);
}

/**
 * Get active accounts
 */
export async function getActiveAccounts(): Promise<ApiAccount[]> {
  return intaxWhere<ApiAccount>('account', { status: 'active' });
}

// ============================================
// Books (Business/Store Management)
// ============================================

/**
 * Get all books
 */
export async function getAllBooks(): Promise<ApiBook[]> {
  return intaxGetAll<ApiBook>('book');
}

/**
 * Get book by ID
 */
export async function getBookById(id: number): Promise<ApiBook | null> {
  return intaxGetById<ApiBook>('book', id);
}

/**
 * Create new book
 */
export async function createBook(
  book: Omit<ApiBook, keyof import('./types').APIBaseModel>,
): Promise<ApiBook | null> {
  return intaxCreate<ApiBook>('book', book);
}

/**
 * Update book
 */
export async function updateBook(
  id: number,
  updates: Partial<Omit<ApiBook, keyof import('./types').APIBaseModel>>,
): Promise<ApiBook | null> {
  return intaxUpdate<ApiBook>('book', id, updates);
}
