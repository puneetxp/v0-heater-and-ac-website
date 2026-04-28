/**
 * Intax API TypeScript Interfaces
 * Generated from the generic application API documentation
 */

// Base interface for all API models
export interface APIBaseModel {
  id: number;
  created_at: string; // ISO 8601 string
  updated_at: string; // ISO 8601 string
  enable: number; // 1 or 0
  deleted_at: string | null;
}

// Generic response types
export type ApiGetResponse<T extends APIBaseModel> = T[];
export type ApiMutateResponse<T extends APIBaseModel> = T;

// ============================================
// Category & Service Management
// ============================================

export interface ApiCategory extends APIBaseModel {
  name: string;
  slug: string | null;
  status: string; // e.g. 'active'
  type: 'product' | 'service';
  photo_id: number | null;
  category_id: number | null;
  updated_by: number | null;
}

export interface ApiService extends APIBaseModel {
  name: string;
  category_id: number | null;
  service_category_id: number | null;
  product_id: number | null;
}

export interface ApiServicePlan extends APIBaseModel {
  name: string;
  service_id: number;
  book_id: number;
}

export interface ApiServicePlanPrice extends APIBaseModel {
  name: string;
  mrp: number;
  amount: number;
  day: number | null;
  month: number | null;
  gst_rate: number; // default 18
  end_date: string | null;
  service_plan_id: number;
}

export interface ApiServiceAttribute extends APIBaseModel {
  name: string;
  service_id: number;
}

export interface ApiServiceAttributeValue extends APIBaseModel {
  value: string;
  service_attribute_id: number;
}

// ============================================
// Products & E-Commerce
// ============================================

export interface ApiProduct extends APIBaseModel {
  name: string;
  head: string | null;
  short_description: string | null;
  description: string | null;
  price: number | null;
  slug: string | null;
  status: string; // e.g. 'active'
  brand_id: number | null;
  category_id: number | null;
  unit_id: number | null;
  photo_id: number | null;
  hsn_id: number | null;
  updated_by: number | null;
  book_id: number | null;
}

export interface ApiProductVersion extends APIBaseModel {
  version: string;
  product_id: number;
}

export interface ApiProductCompatible extends APIBaseModel {
  product_id: number;
  compatible_product_id: number;
}

export interface ApiValueProduct extends APIBaseModel {
  value: string;
  product_id: number;
  book_attribute_id: number;
}

export interface ApiBrand extends APIBaseModel {
  name: string;
  slug: string | null;
}

export interface ApiUnit extends APIBaseModel {
  name: string;
  symbol: string;
}

// ============================================
// CRM & Lead Management
// ============================================

export interface ApiLead extends APIBaseModel {
  name: string | null;
  phone: string | null;
  email: string | null;
  status: string; // default: 'new'
  notes: string | null;
  company: string | null;
  priority: string | null;
  source: string | null;
  last_contacted_at: string | null;
  assigned_to: number | null;
  book_id: number | null;
}

export interface ApiChatSession extends APIBaseModel {
  status: string; // default: 'open'
  channel: string; // default: 'whatsapp'
  channel_id: string | null; // Remote ID e.g., external WhatsApp phone mapping
  user_id: number | null; // Agent resolving it
  lead_id: number | null; // Bound CRM trace
  party_id: number | null;
  book_id: number | null;
}

export interface ApiChatMessage extends APIBaseModel {
  message: string;
  sender_type: string; // 'agent', 'lead', 'bot'
  remote_message_id: string | null;
  chat_session_id: number | null;
}

export interface ApiValueAsset extends APIBaseModel {
  name: string;
  category_asset_id: number;
  product_id: number;
}

export interface ApiApiKey extends APIBaseModel {
  name: string;
  key_value: string | null;
  provider: string; // 'whatsapp', 'custom', 'stripe', etc.
  metadata: string | null; // Extended JSON schema payload bridging API ids
  last_used_at: string | null;
  book_id: number | null;
}

// ============================================
// Purchasing, Sales, and Invoicing
// ============================================

export interface ApiInvoice extends APIBaseModel {
  invoice_number: string;
  amount: number;
  status: string;
  shipping_address: string | null;
  gst_rate: number;
  destination_state: string | null;
  book_id: number;
  account_id: number;
}

export interface ApiInvoiceItem extends APIBaseModel {
  invoice_id: number;
  product_id: number;
  quantity: number;
  price: number;
}

export interface ApiRecordStock extends APIBaseModel {
  unit: number; // Quantity acquired
  price: number; // Purchase cost
  purchase_mode: string; // e.g. 'cash'
  invoice_no: string | null; // Vendor invoice
  note: string | null;
  book_stock_id: number;
  account_id: number | null; // Supplier/Vendor
}

export interface ApiSaleStock extends APIBaseModel {
  price: number;
  book_id: number;
  product_id: number;
}

export interface ApiPayment extends APIBaseModel {
  amount: number;
  status: string;
  payment_method_id: number;
  invoice_id: number | null;
}

export interface ApiPaymentMethod extends APIBaseModel {
  name: string;
}

export interface ApiBill extends APIBaseModel {
  bill_number: string;
  amount: number;
  status: string;
  account_id: number;
  book_id: number;
}

// ============================================
// Inventory & Assets
// ============================================

export interface ApiBookStock extends APIBaseModel {
  allow: number; // 0 or 1
  price: number; // Stock-specific pricing
  unit_id: number | null;
  book_id: number;
  product_id: number;
  account_id: number; // Supplier mapping
}

export interface ApiBookAsset extends APIBaseModel {
  name: string;
  description: string | null;
  allow: number; // 0 or 1
  unit_id: number | null;
  book_id: number;
  product_id: number;
  account_id: number;
}

export interface ApiRecordAsset extends APIBaseModel {
  book_asset_id: number;
  quantity: number;
}

export interface ApiRecordAssetUse extends APIBaseModel {
  record_asset_id: number;
  usage_date: string;
}

export interface ApiConsumable extends APIBaseModel {
  name: string;
  category_id: number;
}

// ============================================
// Accounting & Business Books
// ============================================

export interface ApiBook extends APIBaseModel {
  name: string;
  status: string;
  book_detail_id: number | null;
}

export interface ApiBookDetail extends APIBaseModel {
  business_name: string;
  business_type: string;
  gstin: string | null;
  pan: string | null;
  address: string | null;
  state: string | null;
  book_id: number;
}

export interface ApiAccount extends APIBaseModel {
  name: string;
  account_type_id: number;
  status: string;
  book_id: number;
  email: string | null;
  phone: string | null;
  address: string | null;
}

export interface ApiAccountType extends APIBaseModel {
  name: string;
  slug: string;
}

export interface ApiAccountTypeCompany extends APIBaseModel {
  company_id: number;
  account_type_id: number;
}

export interface ApiAccountAttribute extends APIBaseModel {
  name: string;
}

export interface ApiAccountAttributeValue extends APIBaseModel {
  value: string;
  account_id: number;
  account_attribute_id: number;
}

export interface ApiBookAttribute extends APIBaseModel {
  name: string;
  book_id: number;
}

export interface ApiJournal extends APIBaseModel {
  journal_number: string;
  status: string;
  book_id: number;
}

export interface ApiJournalDetail extends APIBaseModel {
  account_id: number;
  debit: number;
  credit: number;
  journal_id: number;
}

export interface ApiTax {
  id: number;
  name: string;
  rate: number;
}

export interface ApiGstn extends APIBaseModel {
  gstin: string;
  account_id: number;
}

export interface ApiHsn extends APIBaseModel {
  code: string;
  description: string;
}

// ============================================
// Orders & Subscriptions
// ============================================

export interface ApiOrder extends APIBaseModel {
  order_number: string;
  status: string;
  account_id: number;
  book_id: number;
  total_amount: number;
}

export interface ApiOrderItem extends APIBaseModel {
  order_id: number;
  product_id: number;
  quantity: number;
  price: number;
}

export interface ApiSubscription extends APIBaseModel {
  subscription_number: string;
  status: string;
  account_id: number;
  service_plan_id: number;
  start_date: string;
  end_date: string | null;
}

export interface ApiClient extends APIBaseModel {
  name: string;
  email: string | null;
  phone: string | null;
  status: string;
}

export interface ApiCustomer extends APIBaseModel {
  name: string;
  email: string | null;
  phone: string | null;
  status: string;
  account_id: number;
}

export interface ApiParty extends APIBaseModel {
  name: string;
  party_type: string;
  status: string;
}

export interface ApiVendor extends APIBaseModel {
  name: string;
  email: string | null;
  phone: string | null;
  status: string;
  account_id: number;
}

// ============================================
// TV & Media Catalog
// ============================================

export interface ApiMovie extends APIBaseModel {
  name: string;
  duration: string | null;
  release_date: string | null;
  director: string | null;
  cast_members: string | null;
  product_id: number | null;
}

export interface ApiShow extends APIBaseModel {
  name: string;
  release_year: string | null;
  director: string | null;
  cast_members: string | null;
  product_id: number | null;
}

export interface ApiSeries extends APIBaseModel {
  name: string;
  season_number: number | null;
  release_year: string | null;
  show_id: number | null;
  product_id: number | null;
}

export interface ApiEpisode extends APIBaseModel {
  name: string;
  episode_number: number | null;
  duration: string | null;
  release_date: string | null;
  show_id: number | null;
  series_id: number | null;
  product_id: number | null;
}

export interface ApiMediaSource extends APIBaseModel {
  name: string;
  platform: string | null;
  url: string | null;
  quality: string; // default: 'HD'
  movie_id: number | null;
  show_id: number | null;
  series_id: number | null;
  episode_id: number | null;
}

export interface ApiPhoto extends APIBaseModel {
  url: string;
  alt_text: string | null;
  uploaded_by: number;
}

// ============================================
// System & Access Control
// ============================================

export interface ApiUser extends APIBaseModel {
  name: string;
  email: string;
  phone: string | null;
  google_id: string | null;
  facebook_id: string | null;
  password: string | null;
  password_reset_token: string | null;
  password_reset_expires_at: string | null;
  telegram_id: string | null;
  status: string;
}

export interface ApiRole extends APIBaseModel {
  name: string;
  slug: string;
}

export interface ApiActiveRole extends APIBaseModel {
  user_id: number;
  role_id: number;
}

export interface ApiPasskey extends APIBaseModel {
  user_id: number;
  public_key: string;
  credential_id: string;
}

// ============================================
// Type Unions & Helpers
// ============================================

export type AllAPIModels =
  | ApiCategory
  | ApiService
  | ApiServicePlan
  | ApiServicePlanPrice
  | ApiProduct
  | ApiProductVersion
  | ApiBrand
  | ApiUnit
  | ApiInvoice
  | ApiInvoiceItem
  | ApiRecordStock
  | ApiSaleStock
  | ApiPayment
  | ApiBookStock
  | ApiBookAsset
  | ApiRecordAsset
  | ApiConsumable
  | ApiBook
  | ApiBookDetail
  | ApiAccount
  | ApiAccountType
  | ApiOrder
  | ApiOrderItem
  | ApiSubscription
  | ApiMovie
  | ApiShow
  | ApiSeries
  | ApiEpisode
  | ApiMediaSource
  | ApiPhoto
  | ApiUser
  | ApiRole
  | ApiApiKey
  | ApiChatSession
  | ApiChatMessage
  | ApiValueAsset
  | ApiAdminUser
  | ApiApiConfig
  | ApiBooking
  | ApiDemoLogin
  | ApiProfile
  | ApiRentalPlan
  | ApiSeasonalPlan;

export interface ApiAdminUser extends APIBaseModel {
  email: string;
  username: string;
  is_active: boolean;
}

export interface ApiApiConfig extends APIBaseModel {
  name: string;
  provider: string;
  api_key: string;
  book_id: number | null;
  is_enabled: boolean;
  description: string | null;
  settings: any;
  created_by: string | null;
  updated_by: string | null;
}

export interface ApiBooking extends APIBaseModel {
  user_id: string;
  product_id: number;
  start_date: string;
  end_date: string;
  rental_type: string;
  quantity: number;
  status: string;
  subtotal: number;
  gst_amount: number;
  total_amount: number;
  deposit_amount: number;
  delivery_address: string;
  delivery_city: string;
  delivery_state: string;
  delivery_pincode: string;
  notes: string | null;
  plan_id: number | null;
}

export interface ApiDemoLogin extends APIBaseModel {
  username: string;
  email: string;
  user_type: string;
}

export interface ApiProfile extends APIBaseModel {
  full_name: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  pincode: string | null;
  gst_number: string | null;
  company_name: string | null;
  role: string;
}

export interface ApiRentalPlan extends APIBaseModel {
  name: string;
  description: string | null;
  duration_months: number;
  discount_percentage: number;
  features: string[] | null;
  is_popular: boolean;
  is_active: boolean;
}

export interface ApiSeasonalPlan extends APIBaseModel {
  name: string;
  season: string;
  description: string | null;
  discount_percentage: number;
  duration_months: number;
  is_active: boolean;
  valid_from: string | null;
  valid_until: string | null;
  features: any;
  base_price: number;
  pricing_per_unit: number;
  start_month: number | null;
  end_month: number | null;
  product_id: number | null;
}

export type ModelNames =
  | 'account'
  | 'account_type'
  | 'account_type_company'
  | 'account_attribute'
  | 'account_attribute_value'
  | 'chat_session'
  | 'chat_message'
  | 'bill'
  | 'invoice'
  | 'invoice_item'
  | 'payment'
  | 'payment_method'
  | 'book'
  | 'book_detail'
  | 'book_attribute'
  | 'book_asset'
  | 'book_stock'
  | 'journal'
  | 'journal_detail'
  | 'gstn'
  | 'hsn'
  | 'product'
  | 'product_version'
  | 'product_compatible'
  | 'value_product'
  | 'value_asset'
  | 'category'
  | 'category_product'
  | 'category_asset'
  | 'brand'
  | 'unit'
  | 'consumable'
  | 'service'
  | 'service_plan'
  | 'service_plan_price'
  | 'service_attribute'
  | 'service_attribute_value'
  | 'subscription'
  | 'client'
  | 'customer'
  | 'party'
  | 'vendor'
  | 'order'
  | 'order_item'
  | 'record_asset'
  | 'record_asset_use'
  | 'record_stock'
  | 'sale_stock'
  | 'media_source'
  | 'movie'
  | 'series'
  | 'show'
  | 'episode'
  | 'photo'
  | 'user'
  | 'role'
  | 'active_role'
  | 'api_key'
  | 'lead'
  | 'passkey'
  | 'admin_user'
  | 'api_config'
  | 'booking'
  | 'demo_login'
  | 'profile'
  | 'rental_plan'
  | 'seasonal_plan';
