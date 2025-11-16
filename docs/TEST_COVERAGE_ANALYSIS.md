# Magento 2 REST API Test Coverage Analysis

## Executive Summary

This document provides a comprehensive analysis of the current test coverage for Magento 2 REST API endpoints and outlines a strategic plan for expanding test coverage to include critical e-commerce functionality.

**Current Coverage:** ~25% of critical API endpoints
**Target Coverage:** ~85% of critical API endpoints
**Priority Level:** High - Missing critical business functionality tests

---

## Table of Contents

1. [Current Test Coverage](#current-test-coverage)
2. [Coverage Gaps Analysis](#coverage-gaps-analysis)
3. [Recommended Test Suites](#recommended-test-suites)
4. [Implementation Priority](#implementation-priority)
5. [API Endpoint Reference](#api-endpoint-reference)

---

## Current Test Coverage

### ✅ Fully Covered Areas

#### Customer Management (`src/tests/customer/customer.test.ts`)
- ✓ Customer registration with address
- ✓ Authentication (login/token generation)
- ✓ Profile retrieval and updates
- ✓ Address management
- ✓ Duplicate email validation
- ✓ Field validation
- ✓ Authentication error handling

#### Product Management (`src/tests/product/product.test.ts`)
- ✓ Simple product creation
- ✓ Virtual product creation
- ✓ Product retrieval by SKU
- ✓ Product search with filters
- ✓ Product updates (price, stock, status)
- ✓ Product deletion
- ✓ Batch product operations
- ✓ Duplicate SKU validation
- ✓ Required field validation

#### Order Placement (`src/tests/order/order.test.ts`)
- ✓ Shopping cart creation and management
- ✓ Add/update/remove cart items
- ✓ Cart totals calculation
- ✓ Billing address setup
- ✓ Shipping method estimation
- ✓ Payment method selection
- ✓ Order placement
- ✓ Order verification
- ✓ Guest checkout flow

---

## Coverage Gaps Analysis

### 🔴 Critical Gaps (High Priority)

These gaps represent essential e-commerce functionality that should be tested:

1. **Catalog Management**
   - Categories (CRUD operations)
   - Product-category associations
   - Product attributes
   - Attribute sets
   - Product media/images

2. **Search & Filtering**
   - Product search API
   - Advanced filtering
   - Sorting capabilities
   - Pagination

3. **Sales Operations**
   - Invoice creation and management
   - Shipment tracking
   - Credit memos/refunds
   - Order status updates (cancel, hold, unhold)

4. **Pricing & Promotions**
   - Cart price rules (coupons)
   - Catalog price rules
   - Tier pricing
   - Special prices
   - Group prices

5. **Inventory Management**
   - Multi-source inventory (MSI)
   - Stock management
   - Source assignment
   - Salable quantity tracking

### 🟡 Moderate Gaps (Medium Priority)

Important functionality for enterprise deployments:

6. **CMS Content**
   - CMS pages (CRUD)
   - CMS blocks (CRUD)
   - Content widgets

7. **Customer Advanced Features**
   - Customer groups
   - Customer segments (Commerce only)
   - Wishlist management
   - Recently viewed products

8. **Tax Configuration**
   - Tax rates
   - Tax rules
   - Tax classes

9. **Store Configuration**
   - Store views
   - Websites
   - Store groups
   - Configuration settings

### 🟢 Low Priority Gaps

Nice-to-have for comprehensive coverage:

10. **Product Types**
    - Configurable products
    - Bundled products
    - Grouped products
    - Downloadable products

11. **Advanced Features**
    - Bulk operations API
    - Async operations
    - Import/Export
    - Product reviews & ratings

---

## Recommended Test Suites

### Suite 1: Catalog & Categories
**File:** `src/tests/catalog/category.test.ts`

```
Test Scenarios:
├── Category CRUD Operations
│   ├── Create root category
│   ├── Create subcategory
│   ├── Update category (name, status, position)
│   ├── Move category to different parent
│   ├── Delete category
│   └── Validation tests
│
├── Product-Category Associations
│   ├── Assign products to category
│   ├── Remove products from category
│   ├── Update product positions in category
│   └── Bulk category assignment
│
└── Category Retrieval
    ├── Get category by ID
    ├── Get category tree
    ├── Get products in category
    └── Category search with filters

API Endpoints:
- POST   /V1/categories
- GET    /V1/categories/:categoryId
- PUT    /V1/categories/:categoryId
- DELETE /V1/categories/:categoryId
- GET    /V1/categories/list
- POST   /V1/categories/:categoryId/products
```

### Suite 2: Product Search & Filtering
**File:** `src/tests/catalog/search.test.ts`

```
Test Scenarios:
├── Basic Search
│   ├── Search by product name
│   ├── Search by SKU
│   ├── Search by description
│   └── Empty search results
│
├── Advanced Filtering
│   ├── Filter by price range
│   ├── Filter by category
│   ├── Filter by status
│   ├── Filter by visibility
│   ├── Multiple filter groups (AND/OR logic)
│   └── Custom attribute filters
│
├── Sorting & Pagination
│   ├── Sort by name, price, created_at
│   ├── Ascending/descending order
│   ├── Page size limits
│   └── Current page navigation
│
└── Complex Queries
    ├── Combined filters with sorting
    ├── Nested filter groups
    └── Performance with large result sets

API Endpoints:
- GET /V1/products (with searchCriteria parameters)
- GET /V1/search (product search)
```

### Suite 3: CMS Content Management
**File:** `src/tests/cms/cms.test.ts`

```
Test Scenarios:
├── CMS Pages
│   ├── Create page with content
│   ├── Update page content & metadata
│   ├── Get page by ID
│   ├── Search pages
│   ├── Enable/disable page
│   ├── Delete page
│   └── Validation tests (required fields)
│
├── CMS Blocks
│   ├── Create block
│   ├── Update block content
│   ├── Get block by ID
│   ├── Search blocks
│   ├── Enable/disable block
│   ├── Delete block
│   └── Validation tests
│
└── Store-Specific Content
    ├── Assign content to store views
    └── Multi-store content retrieval

API Endpoints:
- POST   /V1/cmsPage
- GET    /V1/cmsPage/:pageId
- PUT    /V1/cmsPage/:pageId
- DELETE /V1/cmsPage/:pageId
- POST   /V1/cmsBlock
- GET    /V1/cmsBlock/:blockId
- PUT    /V1/cmsBlock/:blockId
- DELETE /V1/cmsBlock/:blockId
```

### Suite 4: Cart Promotions & Coupons
**File:** `src/tests/cart/coupons.test.ts`

```
Test Scenarios:
├── Coupon Management
│   ├── Apply coupon code to cart
│   ├── Verify discount calculation
│   ├── Remove coupon from cart
│   ├── Invalid coupon handling
│   ├── Expired coupon handling
│   └── Multiple coupon restrictions
│
├── Cart Price Rules (Admin)
│   ├── Create percentage discount rule
│   ├── Create fixed amount discount rule
│   ├── Create buy X get Y free rule
│   ├── Set rule conditions (cart amount, product attributes)
│   ├── Set rule date range
│   ├── Enable/disable rule
│   └── Delete rule
│
└── Price Validation
    ├── Verify subtotal with discount
    ├── Verify grand total calculation
    ├── Multiple rules interaction
    └── Tax calculation with discounts

API Endpoints:
- PUT    /V1/carts/:cartId/coupons/:couponCode
- GET    /V1/carts/:cartId/coupons
- DELETE /V1/carts/:cartId/coupons
- POST   /V1/salesRules (admin)
- PUT    /V1/salesRules/:ruleId (admin)
- DELETE /V1/salesRules/:ruleId (admin)
```

### Suite 5: Order Fulfillment
**File:** `src/tests/sales/fulfillment.test.ts`

```
Test Scenarios:
├── Invoice Management
│   ├── Create invoice for order
│   ├── Partial invoice (subset of items)
│   ├── Capture payment
│   ├── Get invoice by ID
│   ├── Search invoices
│   └── Invoice comments
│
├── Shipment Management
│   ├── Create shipment for order
│   ├── Partial shipment
│   ├── Add tracking information
│   ├── Update tracking info
│   ├── Get shipment by ID
│   ├── Search shipments
│   └── Shipment comments
│
├── Credit Memos (Refunds)
│   ├── Create credit memo for full order
│   ├── Partial refund (specific items)
│   ├── Refund with adjustment fees
│   ├── Return to stock option
│   ├── Get credit memo by ID
│   └── Search credit memos
│
└── Order Status Management
    ├── Cancel order
    ├── Hold order
    ├── Unhold order
    ├── Add order comments
    └── Update order status

API Endpoints:
- POST /V1/invoice/:orderId
- POST /V1/invoice/:id/capture
- GET  /V1/invoices/:id
- POST /V1/shipment
- POST /V1/shipment/:id/track
- GET  /V1/shipment/:id
- POST /V1/creditmemo
- GET  /V1/creditmemo/:id
- POST /V1/orders/:id/cancel
- POST /V1/orders/:id/hold
- POST /V1/orders/:id/unhold
```

### Suite 6: Inventory Management (MSI)
**File:** `src/tests/inventory/inventory.test.ts`

```
Test Scenarios:
├── Source Management
│   ├── Create inventory source
│   ├── Update source details
│   ├── Enable/disable source
│   ├── Get source by code
│   ├── Search sources
│   └── Delete source
│
├── Stock Management
│   ├── Create stock
│   ├── Assign sources to stock
│   ├── Update stock configuration
│   ├── Get stock by ID
│   └── Delete stock
│
├── Source Items
│   ├── Assign product to source with quantity
│   ├── Update source item quantity
│   ├── Bulk source item updates
│   ├── Get source items for product
│   └── Get source items for source
│
└── Salable Quantity
    ├── Get product salable quantity
    ├── Check stock status
    ├── Reserve quantity (during checkout)
    └── Release reservation

API Endpoints:
- POST   /V1/inventory/sources
- GET    /V1/inventory/sources/:sourceCode
- PUT    /V1/inventory/sources/:sourceCode
- DELETE /V1/inventory/sources/:sourceCode
- POST   /V1/inventory/stocks
- GET    /V1/inventory/stocks/:stockId
- POST   /V1/inventory/source-items
- GET    /V1/inventory/get-product-salable-quantity/:sku/:stockId
```

### Suite 7: Product Attributes
**File:** `src/tests/catalog/attributes.test.ts`

```
Test Scenarios:
├── Attribute CRUD
│   ├── Create text attribute
│   ├── Create dropdown attribute with options
│   ├── Create price attribute
│   ├── Create boolean attribute
│   ├── Update attribute properties
│   ├── Get attribute by code
│   ├── Search attributes
│   └── Delete attribute
│
├── Attribute Sets
│   ├── Create attribute set
│   ├── Add attributes to set
│   ├── Remove attributes from set
│   ├── Update set name
│   └── Delete attribute set
│
└── Attribute Options
    ├── Add option to attribute
    ├── Update option label
    ├── Reorder options
    └── Delete option

API Endpoints:
- POST   /V1/products/attributes
- GET    /V1/products/attributes/:attributeCode
- PUT    /V1/products/attributes/:attributeCode
- DELETE /V1/products/attributes/:attributeCode
- POST   /V1/products/attribute-sets/sets
- GET    /V1/products/attribute-sets/:attributeSetId
```

### Suite 8: Customer Groups & Advanced Features
**File:** `src/tests/customer/customer-groups.test.ts`

```
Test Scenarios:
├── Customer Groups
│   ├── Create customer group
│   ├── Update group (name, tax class)
│   ├── Assign customer to group
│   ├── Get group by ID
│   ├── Search groups
│   └── Delete group
│
└── Group Pricing
    ├── Set group-specific prices
    ├── Verify pricing for different groups
    └── Tier pricing by group

API Endpoints:
- POST   /V1/customerGroups
- GET    /V1/customerGroups/:id
- PUT    /V1/customerGroups/:id
- DELETE /V1/customerGroups/:id
- GET    /V1/customerGroups/search
```

---

## Implementation Priority

### Phase 1: Critical Business Functionality (Weeks 1-2)
1. **Cart Promotions & Coupons** - Essential for marketing campaigns
2. **Order Fulfillment** - Critical for operations
3. **Product Search & Filtering** - Core customer experience

### Phase 2: Catalog Management (Weeks 3-4)
4. **Catalog & Categories** - Foundation for product organization
5. **Product Attributes** - Required for detailed product data
6. **Inventory Management** - Essential for stock accuracy

### Phase 3: Content & Configuration (Weeks 5-6)
7. **CMS Content Management** - Important for content-driven sites
8. **Customer Groups** - Required for B2B scenarios

---

## API Endpoint Reference

### Complete Endpoint Coverage Matrix

| Module | Endpoint | Method | Current Coverage | Priority |
|--------|----------|--------|------------------|----------|
| **Customer** | `/V1/customers` | POST | ✅ | - |
| | `/V1/customers/:id` | GET/PUT | ✅ | - |
| | `/V1/customers/me` | GET/PUT | ✅ | - |
| | `/V1/integration/customer/token` | POST | ✅ | - |
| | `/V1/customerGroups` | POST/GET/PUT/DELETE | ❌ | High |
| **Product** | `/V1/products` | POST/GET | ✅ | - |
| | `/V1/products/:sku` | GET/PUT/DELETE | ✅ | - |
| | `/V1/products/attributes` | POST/GET/PUT/DELETE | ❌ | Medium |
| | `/V1/products/:sku/media` | POST/GET/PUT/DELETE | ❌ | Medium |
| **Category** | `/V1/categories` | POST/GET/PUT/DELETE | ❌ | High |
| | `/V1/categories/:id/products` | POST | ❌ | High |
| **Cart** | `/V1/carts/mine` | POST/GET | ✅ | - |
| | `/V1/carts/mine/items` | POST/GET/PUT/DELETE | ✅ | - |
| | `/V1/carts/:id/coupons` | PUT/GET/DELETE | ❌ | High |
| | `/V1/guest-carts` | POST | ✅ | - |
| **Order** | `/V1/orders` | GET | ⚠️ Partial | - |
| | `/V1/orders/:id` | GET | ✅ | - |
| | `/V1/orders/:id/cancel` | POST | ❌ | High |
| | `/V1/orders/:id/hold` | POST | ❌ | Medium |
| **Invoice** | `/V1/invoice/:orderId` | POST | ❌ | High |
| | `/V1/invoice/:id/capture` | POST | ❌ | High |
| | `/V1/invoices/:id` | GET | ❌ | High |
| **Shipment** | `/V1/shipment` | POST | ❌ | High |
| | `/V1/shipment/:id/track` | POST | ❌ | High |
| | `/V1/shipment/:id` | GET | ❌ | Medium |
| **Credit Memo** | `/V1/creditmemo` | POST | ❌ | High |
| | `/V1/creditmemo/:id` | GET/PUT | ❌ | Medium |
| **CMS** | `/V1/cmsPage` | POST/GET/PUT/DELETE | ❌ | Medium |
| | `/V1/cmsBlock` | POST/GET/PUT/DELETE | ❌ | Medium |
| **Inventory** | `/V1/inventory/sources` | POST/GET/PUT/DELETE | ❌ | Medium |
| | `/V1/inventory/stocks` | POST/GET/PUT/DELETE | ❌ | Medium |
| | `/V1/inventory/source-items` | POST/GET | ❌ | Medium |
| **Search** | `/V1/search` | GET | ❌ | High |
| **Tax** | `/V1/taxRates` | POST/GET/PUT/DELETE | ❌ | Low |
| | `/V1/taxRules` | POST/GET/PUT/DELETE | ❌ | Low |

---

## Test Data Management

### Data Generators Needed

Current generators:
- ✅ `CustomerDataGenerator`
- ✅ `ProductDataGenerator`

Recommended new generators:
- ❌ `CategoryDataGenerator`
- ❌ `CmsDataGenerator`
- ❌ `CouponDataGenerator`
- ❌ `AttributeDataGenerator`
- ❌ `InventoryDataGenerator`

---

## Testing Best Practices

### Recommendations for New Tests

1. **Test Isolation**
   - Each test suite should create its own test data
   - Clean up test data in `after` hooks
   - Use unique identifiers (timestamps, UUIDs)

2. **Error Handling**
   - Test both success and failure scenarios
   - Validate error messages and status codes
   - Test edge cases and boundary conditions

3. **Authentication**
   - Use appropriate tokens (admin vs customer)
   - Test permission boundaries
   - Verify unauthorized access is blocked

4. **Data Validation**
   - Verify response structure matches types
   - Check all required fields are returned
   - Validate computed fields (totals, etc.)

5. **Performance**
   - Use timeouts appropriately
   - Test batch operations where available
   - Monitor API response times

6. **Reusability**
   - Extract common test helpers
   - Use data generators for consistency
   - Share setup code across related tests

---

## Metrics & Goals

### Coverage Targets

- **Current State**: 3 test suites, ~50 test cases
- **Phase 1 Target**: 6 test suites, ~120 test cases (+70 tests)
- **Phase 2 Target**: 9 test suites, ~200 test cases (+80 tests)
- **Phase 3 Target**: 11 test suites, ~250 test cases (+50 tests)

### Success Criteria

- [ ] All critical business flows have automated tests
- [ ] Minimum 80% coverage of commonly-used API endpoints
- [ ] All tests pass against standard Magento 2.4.x installation
- [ ] Test execution time < 5 minutes for full suite
- [ ] Clear documentation for each test suite
- [ ] Reusable data generators for all major entities

---

## Related Documentation

- [Adobe Commerce REST API Reference](https://developer.adobe.com/commerce/webapi/rest/reference/)
- [REST API Overview](https://developer.adobe.com/commerce/webapi/rest/)
- [Getting Started Guide](https://developer.adobe.com/commerce/webapi/get-started/)
- [REST Endpoint List](https://r-martins.github.io/m1docs/guides/v2.4/rest/list.html)

---

*Last Updated: 2025-11-15*
*Version: 1.0*
