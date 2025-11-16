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

// Category Types
export interface Category {
  id: number;
  parent_id: number;
  name: string;
  is_active: boolean;
  position: number;
  level: number;
  product_count?: number;
  children_data?: Category[];
  created_at?: string;
  updated_at?: string;
  path?: string;
  available_sort_by?: string[];
  include_in_menu?: boolean;
  custom_attributes?: CustomAttribute[];
}

export interface CategoryProduct {
  sku: string;
  position: number;
  category_id: string;
}

// CMS Types
export interface CmsPage {
  id?: number;
  identifier: string;
  title: string;
  page_layout?: string;
  meta_title?: string;
  meta_keywords?: string;
  meta_description?: string;
  content_heading?: string;
  content: string;
  creation_time?: string;
  update_time?: string;
  sort_order?: number;
  layout_update_xml?: string;
  custom_theme?: string;
  custom_root_template?: string;
  custom_layout_update_xml?: string;
  custom_theme_from?: string;
  custom_theme_to?: string;
  active: boolean;
  store_id?: number[];
}

export interface CmsBlock {
  id?: number;
  identifier: string;
  title: string;
  content: string;
  creation_time?: string;
  update_time?: string;
  active: boolean;
  store_id?: number[];
}

// Search Types
export interface SearchCriteria {
  searchCriteria: {
    filterGroups?: FilterGroup[];
    sortOrders?: SortOrder[];
    pageSize?: number;
    currentPage?: number;
  };
}

export interface FilterGroup {
  filters: Filter[];
}

export interface Filter {
  field: string;
  value: string;
  conditionType?: string;
}

export interface SortOrder {
  field: string;
  direction: 'ASC' | 'DESC';
}

export interface SearchResult<T> {
  items: T[];
  search_criteria: {
    filter_groups: FilterGroup[];
  };
  total_count: number;
}

// Invoice Types
export interface Invoice {
  entity_id?: number;
  store_id: number;
  base_grand_total: number;
  shipping_tax_amount?: number;
  tax_amount?: number;
  base_tax_amount?: number;
  store_to_order_rate?: number;
  base_shipping_tax_amount?: number;
  base_discount_amount?: number;
  base_to_order_rate?: number;
  grand_total: number;
  shipping_amount?: number;
  subtotal_incl_tax?: number;
  base_subtotal_incl_tax?: number;
  store_to_base_rate?: number;
  base_shipping_amount?: number;
  total_qty: number;
  base_to_global_rate?: number;
  subtotal: number;
  base_subtotal: number;
  discount_amount?: number;
  billing_address_id?: number;
  is_used_for_refund?: number;
  order_id: number;
  email_sent?: number;
  send_email?: number;
  can_void_flag?: number;
  state?: number;
  shipping_address_id?: number;
  store_currency_code?: string;
  transaction_id?: string;
  order_currency_code?: string;
  base_currency_code?: string;
  global_currency_code?: string;
  increment_id?: string;
  created_at?: string;
  updated_at?: string;
  discount_tax_compensation_amount?: number;
  base_discount_tax_compensation_amount?: number;
  shipping_discount_tax_compensation_amount?: number;
  base_shipping_discount_tax_compensation_amnt?: number;
  shipping_incl_tax?: number;
  base_shipping_incl_tax?: number;
  items: InvoiceItem[];
  comments?: InvoiceComment[];
}

export interface InvoiceItem {
  entity_id?: number;
  parent_id?: number;
  base_price: number;
  tax_amount?: number;
  base_row_total: number;
  discount_amount?: number;
  row_total: number;
  base_discount_amount?: number;
  price_incl_tax?: number;
  base_tax_amount?: number;
  base_price_incl_tax?: number;
  qty: number;
  base_cost?: number;
  price: number;
  base_row_total_incl_tax?: number;
  row_total_incl_tax?: number;
  product_id?: number;
  order_item_id: number;
  additional_data?: string;
  description?: string;
  sku: string;
  name: string;
}

export interface InvoiceComment {
  comment: string;
  is_customer_notified: number;
  is_visible_on_front: number;
}

// Shipment Types
export interface Shipment {
  entity_id?: number;
  store_id: number;
  total_weight?: number;
  total_qty: number;
  email_sent?: number;
  send_email?: number;
  order_id: number;
  customer_id?: number;
  shipping_address_id?: number;
  billing_address_id?: number;
  shipment_status?: number;
  increment_id?: string;
  created_at?: string;
  updated_at?: string;
  packages?: ShipmentPackage[];
  items: ShipmentItem[];
  tracks?: ShipmentTrack[];
  comments?: ShipmentComment[];
}

export interface ShipmentItem {
  entity_id?: number;
  parent_id?: number;
  row_total?: number;
  price?: number;
  weight?: number;
  qty: number;
  product_id?: number;
  order_item_id: number;
  additional_data?: string;
  description?: string;
  name?: string;
  sku: string;
}

export interface ShipmentTrack {
  entity_id?: number;
  parent_id?: number;
  weight?: number;
  qty?: number;
  order_id?: number;
  track_number: string;
  description?: string;
  title: string;
  carrier_code: string;
  created_at?: string;
  updated_at?: string;
}

export interface ShipmentPackage {
  package_id?: number;
}

export interface ShipmentComment {
  comment: string;
  is_customer_notified: number;
  is_visible_on_front: number;
}

// Credit Memo Types
export interface CreditMemo {
  entity_id?: number;
  store_id: number;
  adjustment_positive?: number;
  base_shipping_tax_amount?: number;
  store_to_order_rate?: number;
  base_discount_amount?: number;
  base_to_order_rate?: number;
  grand_total: number;
  base_adjustment_negative?: number;
  base_subtotal_incl_tax?: number;
  shipping_amount?: number;
  subtotal_incl_tax?: number;
  adjustment_negative?: number;
  base_shipping_amount?: number;
  store_to_base_rate?: number;
  base_to_global_rate?: number;
  base_adjustment?: number;
  base_subtotal?: number;
  discount_amount?: number;
  subtotal: number;
  adjustment?: number;
  base_grand_total: number;
  base_adjustment_positive?: number;
  base_tax_amount?: number;
  shipping_tax_amount?: number;
  tax_amount?: number;
  order_id: number;
  email_sent?: number;
  send_email?: number;
  creditmemo_status?: number;
  state?: number;
  shipping_address_id?: number;
  billing_address_id?: number;
  invoice_id?: number;
  store_currency_code?: string;
  order_currency_code?: string;
  base_currency_code?: string;
  global_currency_code?: string;
  transaction_id?: string;
  increment_id?: string;
  created_at?: string;
  updated_at?: string;
  discount_tax_compensation_amount?: number;
  base_discount_tax_compensation_amount?: number;
  shipping_discount_tax_compensation_amount?: number;
  base_shipping_discount_tax_compensation_amnt?: number;
  shipping_incl_tax?: number;
  base_shipping_incl_tax?: number;
  items: CreditMemoItem[];
  comments?: CreditMemoComment[];
}

export interface CreditMemoItem {
  entity_id?: number;
  parent_id?: number;
  base_price: number;
  tax_amount?: number;
  base_row_total: number;
  discount_amount?: number;
  row_total: number;
  base_discount_amount?: number;
  price_incl_tax?: number;
  base_tax_amount?: number;
  base_price_incl_tax?: number;
  qty: number;
  base_cost?: number;
  price: number;
  base_row_total_incl_tax?: number;
  row_total_incl_tax?: number;
  product_id?: number;
  order_item_id: number;
  additional_data?: string;
  description?: string;
  sku: string;
  name?: string;
}

export interface CreditMemoComment {
  comment: string;
  is_customer_notified: number;
  is_visible_on_front: number;
}

// Coupon & Sales Rule Types
export interface SalesRule {
  rule_id?: number;
  name: string;
  description?: string;
  from_date?: string;
  to_date?: string;
  uses_per_customer?: number;
  is_active: boolean;
  stop_rules_processing?: boolean;
  is_advanced?: boolean;
  product_ids?: string;
  sort_order?: number;
  simple_action: string;
  discount_amount: number;
  discount_qty?: number;
  discount_step?: number;
  apply_to_shipping?: boolean;
  times_used?: number;
  is_rss?: boolean;
  coupon_type: string;
  use_auto_generation?: boolean;
  uses_per_coupon?: number;
  simple_free_shipping?: string;
  store_labels?: Array<{ store_id: number; store_label: string }>;
  website_ids?: number[];
  customer_group_ids?: number[];
  coupon_code?: string;
}

export interface Coupon {
  coupon_id?: number;
  rule_id: number;
  code: string;
  usage_limit?: number;
  usage_per_customer?: number;
  times_used?: number;
  expiration_date?: string;
  is_primary?: boolean;
  created_at?: string;
  type?: number;
}

// Inventory/Stock Types
export interface InventorySource {
  source_code: string;
  name: string;
  enabled?: boolean;
  description?: string;
  latitude?: number;
  longitude?: number;
  country_id?: string;
  region_id?: number;
  region?: string;
  city?: string;
  street?: string;
  postcode?: string;
  contact_name?: string;
  email?: string;
  phone?: string;
  fax?: string;
  use_default_carrier_config?: boolean;
  carrier_links?: unknown[];
}

export interface InventoryStock {
  stock_id?: number;
  name: string;
  extension_attributes?: {
    sales_channels?: SalesChannel[];
  };
}

export interface SalesChannel {
  type: string;
  code: string;
}

export interface SourceItem {
  sku: string;
  source_code: string;
  quantity: number;
  status: number;
}

export interface StockSourceLink {
  stock_id: number;
  source_code: string;
  priority: number;
}

// Product Attribute Types
export interface ProductAttribute {
  attribute_id?: number;
  attribute_code: string;
  frontend_input: string;
  entity_type_id?: string;
  is_required: boolean;
  options?: AttributeOption[];
  is_user_defined?: boolean;
  default_frontend_label: string;
  frontend_labels?: AttributeLabel[];
  backend_type?: string;
  is_unique?: boolean;
  validation_rules?: unknown[];
  is_visible?: boolean;
  scope?: string;
  is_searchable?: boolean;
  is_filterable?: boolean;
  is_comparable?: boolean;
  is_visible_on_front?: boolean;
  is_html_allowed_on_front?: boolean;
  is_used_for_price_rules?: boolean;
  is_filterable_in_search?: boolean;
  used_in_product_listing?: boolean;
  used_for_sort_by?: boolean;
  apply_to?: string[];
  position?: number;
}

export interface AttributeOption {
  label: string;
  value: string | number;
  sort_order?: number;
}

export interface AttributeLabel {
  store_id: number;
  label: string;
}

export interface AttributeSet {
  attribute_set_id?: number;
  attribute_set_name: string;
  sort_order?: number;
  entity_type_id?: number;
}

// Customer Group Types
export interface CustomerGroup {
  id?: number;
  code: string;
  tax_class_id: number;
  tax_class_name?: string;
  extension_attributes?: {
    exclude_website_ids?: number[];
  };
}
