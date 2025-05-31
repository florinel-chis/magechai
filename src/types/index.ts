export interface CustomerRegistration {
  customer: {
    email: string;
    firstname: string;
    lastname: string;
    addresses?: Address[];
    custom_attributes?: CustomAttribute[];
  };
  password: string;
}

export interface Customer {
  id: number;
  group_id: number;
  default_billing?: string;
  default_shipping?: string;
  created_at: string;
  updated_at: string;
  created_in: string;
  email: string;
  firstname: string;
  lastname: string;
  store_id: number;
  website_id: number;
  addresses?: Address[];
  disable_auto_group_change: number;
  custom_attributes?: CustomAttribute[];
}

export interface Address {
  customer_id?: number;
  region?: Region;
  region_id?: number;
  country_id: string;
  street: string[];
  telephone: string;
  postcode: string;
  city: string;
  firstname: string;
  lastname: string;
  default_shipping?: boolean;
  default_billing?: boolean;
  email?: string;
}

export interface Region {
  region_code: string;
  region: string;
  region_id: number;
}

export interface CustomAttribute {
  attribute_code: string;
  value: string | number | boolean;
}

export interface LoginResponse {
  token: string;
}

export interface Product {
  id?: number;
  sku: string;
  name: string;
  attribute_set_id: number;
  price: number;
  status: number;
  visibility: number;
  type_id: string;
  weight?: number;
  extension_attributes?: {
    stock_item?: StockItem;
    category_links?: CategoryLink[];
    configurable_product_options?: ConfigurableProductOption[];
  };
  product_links?: ProductLink[];
  media_gallery_entries?: MediaGalleryEntry[];
  tier_prices?: TierPrice[];
  custom_attributes?: CustomAttribute[];
}

export interface ConfigurableProductOption {
  attribute_id: string;
  label: string;
  position: number;
  is_use_default: boolean;
  values: Array<{ value_index: number }>;
}

export interface StockItem {
  qty: number;
  is_in_stock: boolean;
  manage_stock?: boolean;
  use_config_manage_stock?: boolean;
  min_qty?: number;
  use_config_min_qty?: boolean;
  min_sale_qty?: number;
  use_config_min_sale_qty?: boolean;
  max_sale_qty?: number;
  use_config_max_sale_qty?: boolean;
  is_qty_decimal?: boolean;
  backorders?: number;
  use_config_backorders?: boolean;
  notify_stock_qty?: number;
  use_config_notify_stock_qty?: boolean;
}

export interface CategoryLink {
  position?: number;
  category_id: number;
}

export interface ProductLink {
  sku: string;
  link_type: string;
  linked_product_sku: string;
  linked_product_type: string;
  position: number;
}

export interface MediaGalleryEntry {
  media_type: string;
  label: string;
  position: number;
  disabled: boolean;
  types: string[];
  content?: {
    base64_encoded_data: string;
    type: string;
    name: string;
  };
}

export interface TierPrice {
  customer_group_id: number;
  qty: number;
  value: number;
}

export interface CartItem {
  sku: string;
  qty: number;
  quote_id?: string;
}

export interface Cart {
  id: number;
  created_at: string;
  updated_at: string;
  is_active: boolean;
  is_virtual: boolean;
  items: CartItemDetail[];
  items_count: number;
  items_qty: number;
  customer: CartCustomer;
  billing_address?: Address;
  currency: Currency;
  customer_is_guest: boolean;
  customer_note_notify: boolean;
  customer_tax_class_id: number;
  store_id: number;
  extension_attributes?: CartExtensionAttributes;
}

export interface CartItemResponse {
  item_id: number;
  sku: string;
  qty: number;
  name: string;
  price: number;
  product_type: string;
  quote_id: string;
}

export interface CartItemDetail {
  item_id: number;
  sku: string;
  qty: number;
  name: string;
  price: number;
  product_type: string;
  quote_id: string;
}

export interface CartCustomer {
  email?: string;
  firstname?: string;
  lastname?: string;
}

export interface CartExtensionAttributes {
  shipping_assignments?: unknown[];
}

export interface Currency {
  global_currency_code: string;
  base_currency_code: string;
  store_currency_code: string;
  quote_currency_code: string;
  store_to_base_rate: number;
  store_to_quote_rate: number;
  base_to_global_rate: number;
  base_to_quote_rate: number;
}

export interface ShippingMethod {
  carrier_code: string;
  method_code: string;
  carrier_title: string;
  method_title: string;
  amount: number;
  base_amount: number;
  available: boolean;
  error_message?: string;
  price_excl_tax: number;
  price_incl_tax: number;
}

export interface PaymentMethod {
  code: string;
  title: string;
}

export interface Order {
  entity_id: number;
  increment_id: string;
  state: string;
  status: string;
  created_at: string;
  updated_at: string;
  grand_total: number;
  base_grand_total: number;
  items: OrderItem[];
  billing_address: Address;
  payment: Payment;
  shipping_description: string;
  shipping_amount: number;
  customer_email: string;
  customer_firstname: string;
  customer_lastname: string;
  customer_is_guest: number;
  store_id: number;
}

export interface OrderItem {
  item_id: number;
  order_id: number;
  created_at: string;
  updated_at: string;
  product_id: number;
  product_type: string;
  sku: string;
  name: string;
  qty_ordered: number;
  price: number;
  base_price: number;
  row_total: number;
  base_row_total: number;
}

export interface Payment {
  method: string;
  additional_information?: string[];
}

export interface ShippingInformationResponse {
  payment_methods: PaymentMethod[];
  totals: CartTotals;
}

export interface CartTotals {
  grand_total: number;
  base_grand_total: number;
  subtotal: number;
  base_subtotal: number;
  discount_amount: number;
  base_discount_amount: number;
  shipping_amount: number;
  base_shipping_amount: number;
  tax_amount: number;
  base_tax_amount: number;
}

export interface ApiError {
  message: string;
  errors?: Array<{
    message: string;
    parameters?: Record<string, unknown>;
  }>;
  code?: number;
  parameters?: Record<string, unknown>;
  trace?: string;
}

export interface ApiErrorResponse {
  response: {
    status: number;
    data: ApiError;
  };
}
