# Quick Start Guide - Magento 2 REST API Testing

This guide will help you get started with the expanded Magento 2 REST API test suite.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Setup](#setup)
3. [Running Tests](#running-tests)
4. [Test Suites Overview](#test-suites-overview)
5. [Writing New Tests](#writing-new-tests)
6. [Best Practices](#best-practices)

---

## Prerequisites

- Node.js 16+ and npm
- Access to a Magento 2.4.x instance
- Admin credentials for your Magento instance
- Basic understanding of TypeScript and Mocha/Chai

---

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Create a `.env` file in the project root:

```env
# Magento Instance URL
URL=https://your-magento-instance.com

# Store Configuration
STORE_CODE=default

# Admin Credentials (for admin API operations)
ADMIN_USERNAME=your_admin_username
ADMIN_PASSWORD=your_admin_password

# Test Configuration
TEST_TIMEOUT=30000
CLEANUP_TEST_DATA=true
```

### 3. Verify Configuration

Run a quick test to verify your setup:

```bash
npm test -- src/tests/customer/customer.test.ts --grep "should create a new customer account"
```

---

## Running Tests

### Run All Tests

```bash
npm test
```

### Run Specific Test Suite

```bash
# Customer tests
npm test -- src/tests/customer/customer.test.ts

# Product tests
npm test -- src/tests/product/product.test.ts

# Order/Cart tests
npm test -- src/tests/order/order.test.ts

# Category tests (NEW)
npm test -- src/tests/catalog/category.test.ts

# Search tests (NEW)
npm test -- src/tests/catalog/search.test.ts

# CMS tests (NEW)
npm test -- src/tests/cms/cms.test.ts
```

### Run Tests by Pattern

```bash
# Run all category-related tests
npm test -- --grep "Category"

# Run all search tests
npm test -- --grep "search"

# Run creation tests across all suites
npm test -- --grep "Creation"
```

### Run with Custom Timeout

```bash
# For slower Magento instances
npm test -- --timeout 60000
```

---

## Test Suites Overview

### Existing Test Suites

#### 1. Customer Tests (`src/tests/customer/customer.test.ts`)
- ✅ Customer registration
- ✅ Authentication (login/token)
- ✅ Profile management
- ✅ Address management

**Run:** `npm test -- src/tests/customer/customer.test.ts`

#### 2. Product Tests (`src/tests/product/product.test.ts`)
- ✅ Product CRUD operations
- ✅ Simple and virtual products
- ✅ Stock management
- ✅ Batch operations

**Run:** `npm test -- src/tests/product/product.test.ts`

#### 3. Order/Cart Tests (`src/tests/order/order.test.ts`)
- ✅ Shopping cart management
- ✅ Checkout process
- ✅ Order placement
- ✅ Guest checkout

**Run:** `npm test -- src/tests/order/order.test.ts`

### New Test Suites

#### 4. Category Tests (`src/tests/catalog/category.test.ts`) 🆕
Tests catalog category management:
- Category CRUD operations
- Subcategory creation
- Product-category assignments
- Category search and filtering
- Enable/disable categories

**Run:** `npm test -- src/tests/catalog/category.test.ts`

**Key Features:**
- Tests category hierarchy
- Validates parent-child relationships
- Tests category attributes
- Search functionality

#### 5. Search Tests (`src/tests/catalog/search.test.ts`) 🆕
Tests product search and filtering capabilities:
- Basic product search
- Advanced filtering (price, status, visibility)
- Sorting (name, price, custom attributes)
- Pagination
- Complex multi-filter queries

**Run:** `npm test -- src/tests/catalog/search.test.ts`

**Key Features:**
- Comprehensive filter testing
- AND/OR logic with filter groups
- Sorting validation
- Pagination verification

#### 6. CMS Tests (`src/tests/cms/cms.test.ts`) 🆕
Tests CMS content management:
- CMS Pages (create, read, update, delete)
- CMS Blocks (create, read, update, delete)
- Rich content handling
- Active/inactive state management

**Run:** `npm test -- src/tests/cms/cms.test.ts`

**Key Features:**
- Tests HTML content storage
- Identifier uniqueness validation
- Store-specific content
- Content activation/deactivation

---

## Writing New Tests

### 1. Test Structure

Follow the existing pattern:

```typescript
import { expect } from 'chai';
import { ApiClient } from '../../utils/api-client';
import { YourDataGenerator } from '../../data-generators/your-generator';
import { getAdminUrl, config } from '../../config';
import { getAdminToken } from '../../utils/test-helpers';
import { YourType } from '../../types';

describe('Your Test Suite', function () {
  this.timeout(15000);

  let apiClient: ApiClient;
  let adminToken: string;

  before(async function () {
    apiClient = new ApiClient();
    adminToken = await getAdminToken();
    apiClient.setAuthToken(adminToken);
  });

  describe('Feature Group', function () {
    it('should do something specific', async function () {
      // Arrange
      const testData = YourDataGenerator.generateData();

      // Act
      const response = await apiClient.post<YourType>(
        getAdminUrl('/your-endpoint'),
        testData,
      );

      // Assert
      expect(response).to.be.an('object');
      expect(response.id).to.be.a('number');
    });
  });

  after(async function () {
    // Cleanup test data
    if (config.test.cleanupTestData) {
      // Clean up resources
    }
  });
});
```

### 2. Using Data Generators

Data generators help create consistent, unique test data:

```typescript
import { CustomerDataGenerator } from '../data-generators/customer';
import { ProductDataGenerator } from '../data-generators/product';
import { CategoryDataGenerator } from '../data-generators/category';
import { CmsDataGenerator } from '../data-generators/cms';
import { CouponDataGenerator } from '../data-generators/coupon';

// Generate customer with address
const customer = CustomerDataGenerator.generateCustomerWithAddress();

// Generate simple product
const product = ProductDataGenerator.generateSimpleProduct({
  price: 99.99, // Override specific fields
});

// Generate category
const category = CategoryDataGenerator.generateCategory();

// Generate CMS page
const page = CmsDataGenerator.generateCmsPage();

// Generate coupon
const coupon = CouponDataGenerator.generateCoupon(ruleId);
```

### 3. Available Types

All Magento entities have TypeScript interfaces in `src/types/index.ts`:

- `Customer`, `CustomerRegistration`, `Address`
- `Product`, `StockItem`, `CategoryLink`
- `Category`, `CategoryProduct`
- `CmsPage`, `CmsBlock`
- `Cart`, `CartItem`, `Order`
- `Invoice`, `Shipment`, `CreditMemo`
- `SalesRule`, `Coupon`
- `SearchResult<T>`, `SearchCriteria`

### 4. API Client Usage

The `ApiClient` class handles all HTTP communication:

```typescript
// GET request
const product = await apiClient.get<Product>(
  getAdminUrl('/products/SKU123'),
);

// GET with query parameters
const products = await apiClient.get<SearchResult<Product>>(
  getAdminUrl('/products'),
  {
    params: {
      searchCriteria: {
        filter_groups: [/* ... */],
      },
    },
  },
);

// POST request
const newProduct = await apiClient.post<Product>(
  getAdminUrl('/products'),
  { product: productData },
);

// PUT request
const updated = await apiClient.put<Product>(
  getAdminUrl('/products/SKU123'),
  { product: updateData },
);

// DELETE request
const success = await apiClient.delete<boolean>(
  getAdminUrl('/products/SKU123'),
);
```

---

## Best Practices

### 1. Test Isolation

Each test should be independent:

```typescript
describe('Test Group', function () {
  let testResource: Resource;

  beforeEach(async function () {
    // Create fresh test data for each test
    testResource = await createTestResource();
  });

  afterEach(async function () {
    // Clean up after each test
    if (config.test.cleanupTestData) {
      await deleteTestResource(testResource);
    }
  });
});
```

### 2. Use Unique Identifiers

Always use timestamps or UUIDs for uniqueness:

```typescript
const uniqueSku = `TEST-${Date.now()}`;
const uniqueEmail = `test${Date.now()}@example.com`;
```

### 3. Handle Magento Quirks

Magento behavior can vary:

```typescript
it('should handle edge case', async function () {
  try {
    const response = await apiClient.delete(endpoint);

    // Magento might return different status codes
    if (response === true || response === undefined) {
      return; // Success
    }
  } catch (error: any) {
    // Check various success scenarios
    if (error.response?.status === 200 || error.response?.status === 204) {
      return; // Also success
    }
    throw error;
  }
});
```

### 4. Skip Tests When Appropriate

Don't fail tests for unavailable features:

```typescript
it('should test optional feature', async function () {
  if (!prerequisiteData) {
    this.skip();
  }

  try {
    // Test logic
  } catch (error: any) {
    if (error.response?.status === 404) {
      console.log('Feature not available');
      this.skip();
    }
    throw error;
  }
});
```

### 5. Wait for Indexing

Magento indexes data asynchronously:

```typescript
import { delay } from '../../utils/test-helpers';

// After creating products
await delay(3000); // Wait for indexing

// Then search/verify
const results = await apiClient.get(searchEndpoint);
```

### 6. Test Both Success and Failure

```typescript
describe('Validation', function () {
  it('should accept valid data', async function () {
    const validData = generator.generateValid();
    const response = await apiClient.post(endpoint, validData);
    expect(response).to.be.an('object');
  });

  it('should reject invalid data', async function () {
    const invalidData = { /* missing required fields */ };
    try {
      await apiClient.post(endpoint, invalidData);
      expect.fail('Expected validation error');
    } catch (error: any) {
      expect(error.response?.status).to.be.oneOf([400, 422, 500]);
    }
  });
});
```

### 7. Cleanup Test Data

Always clean up in `after` hooks:

```typescript
after(async function () {
  if (!config.test.cleanupTestData) {
    console.log('Cleanup disabled. Resources preserved.');
    return;
  }

  for (const resource of testResources) {
    try {
      await apiClient.delete(getAdminUrl(`/endpoint/${resource.id}`));
    } catch (error) {
      // Log but don't fail - cleanup is best-effort
      console.log(`Could not delete ${resource.id}`);
    }
  }
});
```

---

## Troubleshooting

### Tests Fail with 401 Unauthorized

- Check your admin credentials in `.env`
- Verify the admin user has API permissions
- Token might have expired - tests will get a fresh token

### Tests Timeout

- Increase timeout in test file: `this.timeout(30000)`
- Or via CLI: `npm test -- --timeout 60000`
- Check Magento instance performance

### Products Not Found After Creation

- Magento requires indexing - add delays
- Check product status and visibility
- Verify stock status (must be in stock)

### Tests Create Data But Don't Clean Up

- Set `CLEANUP_TEST_DATA=true` in `.env`
- Or manually delete via Magento admin
- Check console for preserved resource IDs

### Search Returns No Results

- Wait for indexing: `await delay(5000)`
- Verify search filters match data
- Check Magento indexers are running

---

## Next Steps

1. **Review the Test Coverage Analysis:**
   See `docs/TEST_COVERAGE_ANALYSIS.md` for detailed coverage information

2. **Explore Additional Test Suites:**
   Consider implementing the remaining suites outlined in the coverage analysis

3. **Integrate with CI/CD:**
   Add tests to your continuous integration pipeline

4. **Customize for Your Needs:**
   Modify data generators and tests for your specific Magento configuration

---

## Resources

- [Magento 2 REST API Documentation](https://developer.adobe.com/commerce/webapi/rest/)
- [Mocha Documentation](https://mochajs.org/)
- [Chai Assertion Library](https://www.chaijs.com/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

*Last Updated: 2025-11-15*
*Version: 1.0*
