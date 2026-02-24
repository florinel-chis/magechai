# Test Scenarios Index

Comprehensive index of all REST API test scenarios in the magechai framework, organized by domain.

## Overview

- **Total test files:** 9
- **Total test scenarios:** ~58
- **Domains covered:** Customer, Product, Category, Order/Cart, Store Configuration

---

## Customer Domain

### `src/tests/customer/customer.test.ts` (11 tests)

| # | Scenario | Endpoint | Method | Auth |
|---|----------|----------|--------|------|
| 1 | Create a new customer account | `/customers` | POST | None |
| 2 | Reject duplicate email registration | `/customers` | POST | None |
| 3 | Validate required fields | `/customers` | POST | None |
| 4 | Reject weak passwords | `/customers` | POST | None |
| 5 | Login with valid credentials | `/integration/customer/token` | POST | None |
| 6 | Reject invalid credentials | `/integration/customer/token` | POST | None |
| 7 | Reject non-existent user | `/integration/customer/token` | POST | None |
| 8 | Retrieve customer profile | `/customers/me` | GET | Customer |
| 9 | Update customer profile | `/customers/me` | PUT | Customer |
| 10 | Require authentication for profile access | `/customers/me` | GET | None (expected 401) |
| 11 | Add a new address | `/customers/me` | PUT | Customer |

### `src/tests/customer/customer-admin.test.ts` (6 tests)

| # | Scenario | Endpoint | Method | Auth |
|---|----------|----------|--------|------|
| 1 | Search customers with searchCriteria | `/customers/search` | GET | Admin |
| 2 | Get customer by ID | `/customers/{id}` | GET | Admin |
| 3 | Return 404 for non-existent customer ID | `/customers/999999999` | GET | Admin |
| 4 | Update customer via admin endpoint | `/customers/{id}` | PUT | Admin |
| 5 | Delete customer via admin endpoint | `/customers/{id}` | DELETE | Admin |
| 6 | Verify deleted customer returns 404 | `/customers/{id}` | GET | Admin |

### `src/tests/customer/customer-token.test.ts` (3 tests)

| # | Scenario | Endpoint | Method | Auth |
|---|----------|----------|--------|------|
| 1 | Revoke customer token (logout) | `/integration/customer/revoke-customer-token` | POST | Customer |
| 2 | Reject requests with revoked token | `/customers/me` | GET | Revoked token |
| 3 | Allow re-login after token revocation | `/integration/customer/token` | POST | None |

---

## Product Domain

### `src/tests/product/product.test.ts` (15 tests)

| # | Scenario | Endpoint | Method | Auth |
|---|----------|----------|--------|------|
| 1 | Create a simple product | `/products` | POST | Admin |
| 2 | Reject duplicate SKU | `/products` | POST | Admin |
| 3 | Create a virtual product | `/products` | POST | Admin |
| 4 | Validate required fields | `/products` | POST | Admin |
| 5 | Get product by SKU | `/products/{sku}` | GET | Admin |
| 6 | Search products | `/products` | GET | Admin |
| 7 | Handle non-existent product | `/products/NON_EXISTENT_SKU` | GET | Admin |
| 8 | Search products with sorting and pagination | `/products` | GET | Admin |
| 9 | List product attributes | `/products/attributes` | GET | Admin |
| 10 | Update product price | `/products/{sku}` | PUT | Admin |
| 11 | Update product stock | `/products/{sku}` | PUT | Admin |
| 12 | Disable product | `/products/{sku}` | PUT | Admin |
| 13 | Delete product by SKU | `/products/{sku}` | DELETE | Admin |
| 14 | Verify product is deleted | `/products/{sku}` | GET | Admin |
| 15 | Create multiple products (batch) | `/products` | POST | Admin |

---

## Category Domain

### `src/tests/category/category.test.ts` (6 tests)

| # | Scenario | Endpoint | Method | Auth |
|---|----------|----------|--------|------|
| 1 | Create a new category | `/categories` | POST | Admin |
| 2 | Create a subcategory | `/categories` | POST | Admin |
| 3 | Get category by ID | `/categories/{id}` | GET | Admin |
| 4 | Get category tree | `/categories` | GET | Admin |
| 5 | Update category name and status | `/categories/{id}` | PUT | Admin |
| 6 | Delete category | `/categories/{id}` | DELETE | Admin |

---

## Order Domain

### `src/tests/order/order.test.ts` (14 tests)

| # | Scenario | Endpoint | Method | Auth |
|---|----------|----------|--------|------|
| 1 | Create a new cart for customer | `/carts/mine` | POST | Customer |
| 2 | Add product to cart | `/carts/mine/items` | POST | Customer |
| 3 | Get cart totals | `/carts/mine` | GET | Customer |
| 4 | Update cart item quantity | `/carts/mine/items/{id}` | PUT | Customer |
| 5 | Set billing address | `/carts/mine/billing-address` | POST | Customer |
| 6 | Estimate shipping methods | `/carts/mine/estimate-shipping-methods` | POST | Customer |
| 7 | Set shipping information | `/carts/mine/shipping-information` | POST | Customer |
| 8 | Get available payment methods | `/carts/mine/payment-methods` | GET | Customer |
| 9 | Place order | `/carts/mine/payment-information` | PUT | Customer |
| 10 | Retrieve order details (admin) | `/orders/{id}` | GET | Admin |
| 11 | Verify order items | `/orders/{id}` | GET | Admin |
| 12 | Create guest cart | `/guest-carts` | POST | None |
| 13 | Add product to guest cart | `/guest-carts/{id}/items` | POST | None |
| 14 | Complete guest checkout | Multiple guest-cart endpoints | Multiple | None |

### `src/tests/order/order-management.test.ts` (6 tests)

| # | Scenario | Endpoint | Method | Auth |
|---|----------|----------|--------|------|
| 1 | Search orders with searchCriteria | `/orders` | GET | Admin |
| 2 | Add comment to order | `/orders/{id}/comments` | POST | Admin |
| 3 | Retrieve order comments | `/orders/{id}/comments` | GET | Admin |
| 4 | Create invoice for order | `/order/{id}/invoice` | POST | Admin |
| 5 | Retrieve invoice details | `/invoices/{id}` | GET | Admin |
| 6 | Create shipment for order | `/order/{id}/ship` | POST | Admin |

### `src/tests/order/cart-operations.test.ts` (4 tests)

| # | Scenario | Endpoint | Method | Auth |
|---|----------|----------|--------|------|
| 1 | Remove item from cart | `/carts/mine/items/{id}` | DELETE | Customer |
| 2 | Verify empty cart after removal | `/carts/mine` | GET | Customer |
| 3 | Reject invalid coupon code | `/carts/mine/coupons/INVALID` | PUT | Customer |
| 4 | Get current coupon (none applied) | `/carts/mine/coupons` | GET | Customer |

---

## Store Configuration

### `src/tests/store/store-config.test.ts` (3 tests)

| # | Scenario | Endpoint | Method | Auth |
|---|----------|----------|--------|------|
| 1 | Retrieve store configuration | `/store/storeConfigs` | GET | Admin |
| 2 | List available countries | `/directory/countries` | GET | Admin |
| 3 | Get currency information | `/directory/currency` | GET | Admin |

---

## API Endpoint Coverage Summary

| API Area | Endpoints Covered | Auth Types |
|----------|-------------------|------------|
| Customer (Storefront) | 3 (`/customers`, `/customers/me`, `/integration/customer/token`) | None, Customer |
| Customer (Admin) | 2 (`/customers/{id}`, `/customers/search`) | Admin |
| Token Lifecycle | 1 (`/integration/customer/revoke-customer-token`) | Customer |
| Products | 3 (`/products`, `/products/{sku}`, `/products/attributes`) | Admin |
| Categories | 1 (`/categories`, `/categories/{id}`) | Admin |
| Cart (Customer) | 4 (`/carts/mine`, `/carts/mine/items`, `/carts/mine/coupons`, `/carts/mine/billing-address`) | Customer |
| Cart (Guest) | 2 (`/guest-carts`, `/guest-carts/{id}/items`) | None |
| Checkout | 3 (`estimate-shipping-methods`, `shipping-information`, `payment-methods`, `payment-information`) | Customer |
| Orders | 2 (`/orders`, `/orders/{id}`, `/orders/{id}/comments`) | Admin |
| Invoices | 2 (`/order/{id}/invoice`, `/invoices/{id}`) | Admin |
| Shipments | 1 (`/order/{id}/ship`) | Admin |
| Store Config | 3 (`/store/storeConfigs`, `/directory/countries`, `/directory/currency`) | Admin |

## Running Tests

```bash
# Run all tests
npm test

# Run by domain
npm test -- src/tests/customer/
npm test -- src/tests/product/
npm test -- src/tests/category/
npm test -- src/tests/order/
npm test -- src/tests/store/

# Run specific test file
npm test -- src/tests/customer/customer-admin.test.ts

# Run by pattern
npm test -- --grep "Customer Token"
```
