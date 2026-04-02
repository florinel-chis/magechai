# MageChai Documentation

> Comprehensive REST API testing framework for Magento 2

Welcome to the MageChai documentation. This directory contains comprehensive guides, API references, and test coverage analysis for the Magento 2 REST API testing framework.

---

## 📚 Documentation Index

### Getting Started

| Document | Description | Audience |
|----------|-------------|----------|
| **[Quick Start Guide](QUICK_START.md)** | Get up and running quickly with setup, basic usage, and your first tests | Beginners |
| **[Main README](../README.md)** | Project overview, installation, and basic commands | All users |

### Test Coverage & Planning

| Document | Description | Audience |
|----------|-------------|----------|
| **[Test Coverage Analysis](TEST_COVERAGE_ANALYSIS.md)** | Comprehensive analysis of current and planned test coverage with implementation roadmap | Developers, QA |

### Historical Reports

| Document | Description |
|----------|-------------|
| [Test Results](../TEST_RESULTS.md) | Historical test execution results |
| [Final Test Results](../FINAL_TEST_RESULTS.md) | Final test execution report |
| [Final Success Report](../FINAL_SUCCESS_REPORT.md) | Project success summary |
| [Changelog](../CHANGELOG.md) | Version history and changes |

---

## 🎯 Quick Navigation

### By Task

**I want to...**

- **Run my first test** → [Quick Start Guide](QUICK_START.md#running-tests)
- **Write a new test** → [Quick Start Guide](QUICK_START.md#writing-new-tests)
- **Understand test coverage** → [Test Coverage Analysis](TEST_COVERAGE_ANALYSIS.md)
- **See what's missing** → [Test Coverage Analysis - Coverage Gaps](TEST_COVERAGE_ANALYSIS.md#coverage-gaps-analysis)
- **Learn best practices** → [Quick Start Guide - Best Practices](QUICK_START.md#best-practices)
- **Troubleshoot issues** → [Quick Start Guide - Troubleshooting](QUICK_START.md#troubleshooting)

### By Test Suite

| Suite | File | Documentation |
|-------|------|---------------|
| **Customer** | `src/tests/customer/customer.test.ts` | [Quick Start](QUICK_START.md#1-customer-tests) |
| **Product** | `src/tests/product/product.test.ts` | [Quick Start](QUICK_START.md#2-product-tests) |
| **Order/Cart** | `src/tests/order/order.test.ts` | [Quick Start](QUICK_START.md#3-ordercart-tests) |
| **Category** | `src/tests/catalog/category.test.ts` | [Quick Start](QUICK_START.md#4-category-tests) |
| **Search** | `src/tests/catalog/search.test.ts` | [Quick Start](QUICK_START.md#5-search-tests) |
| **CMS** | `src/tests/cms/cms.test.ts` | [Quick Start](QUICK_START.md#6-cms-tests) |
| **Promotions** 🆕 | `src/tests/promotions/coupon.test.ts` | - |
| **Inventory** 🆕 | `src/tests/inventory/inventory.test.ts` | - |
| **Sales** 🆕 | `src/tests/sales/` | - |

---

## 📊 Test Coverage Overview

### Current Coverage

| Module | Coverage | Test Suite | Status |
|--------|----------|------------|--------|
| Customer API | ✅ 90% | `customer.test.ts` | Complete |
| Product API | ✅ 85% | `product.test.ts` | Complete |
| Order/Cart API | ✅ 80% | `order.test.ts` | Complete |
| Category API | ✅ 70% | `category.test.ts` | Complete |
| Search API | ✅ 75% | `search.test.ts` | Complete |
| CMS API | ✅ 65% | `cms.test.ts` | Complete |
| Promotions API | 🆕 75% | `promotions/coupon.test.ts` | New |
| Inventory API | 🆕 70% | `inventory/inventory.test.ts` | New |
| Invoice API | 🆕 65% | `sales/invoice.test.ts` | New |
| Shipment API | 🆕 60% | `sales/shipment.test.ts` | New |
| Credit Memo API | 🆕 55% | `sales/credit-memo.test.ts` | New |

**Overall Progress:** ~75% of critical Magento 2 REST API endpoints

See [Test Coverage Analysis](TEST_COVERAGE_ANALYSIS.md) for detailed breakdown and roadmap.

---

## 🏗️ Architecture

### Project Structure

```
magechai/
├── src/
│   ├── config/              # Environment configuration
│   ├── types/               # TypeScript type definitions
│   ├── utils/               # API client and helpers
│   ├── data-generators/     # Test data factories
│   │   ├── customer.ts      # Customer data generator
│   │   ├── product.ts       # Product data generator
│   │   ├── category.ts      # Category data generator (NEW)
│   │   ├── cms.ts           # CMS data generator (NEW)
│   │   └── coupon.ts        # Coupon data generator (NEW)
│   └── tests/               # Test suites
│       ├── customer/        # Customer API tests
│       ├── product/         # Product API tests
│       ├── order/           # Order/Cart API tests
│       ├── catalog/         # Category & Search tests (NEW)
│       └── cms/             # CMS tests (NEW)
└── docs/                    # Documentation (you are here)
    ├── README.md            # This index
    ├── QUICK_START.md       # Quick start guide
    └── TEST_COVERAGE_ANALYSIS.md  # Coverage analysis
```

### Key Components

#### Data Generators
Located in `src/data-generators/`, these factories create consistent test data:

```typescript
// Example: Generate a product
import { ProductDataGenerator } from '../data-generators/product';

const product = ProductDataGenerator.generateSimpleProduct({
  price: 99.99,
  name: 'Custom Product Name'
});
```

**Available Generators:**
- `CustomerDataGenerator` - Customers, addresses
- `ProductDataGenerator` - Products (simple, virtual)
- `CategoryDataGenerator` - Categories and subcategories
- `CmsDataGenerator` - CMS pages and blocks
- `CouponDataGenerator` - Sales rules and coupons

#### Type Definitions
Located in `src/types/index.ts`, comprehensive TypeScript interfaces for:
- Core entities (Customer, Product, Order)
- Catalog (Category, CategoryProduct)
- CMS (CmsPage, CmsBlock)
- Sales (Invoice, Shipment, CreditMemo)
- Promotions (SalesRule, Coupon)
- Inventory (InventorySource, InventoryStock)
- Search (SearchCriteria, SearchResult, Filters)

---

## 🚀 Common Tasks

### Running Tests

```bash
# All tests
npm test

# Specific suite
npm test -- src/tests/catalog/category.test.ts

# By pattern
npm test -- --grep "Category Creation"

# With custom timeout
npm test -- --timeout 60000
```

### Development

```bash
# Linting
npm run lint
npm run lint:fix

# Type checking
npm run typecheck

# Clean build artifacts
npm run clean
```

---

## 📖 External Resources

### Official Magento Documentation
- [REST API Overview](https://developer.adobe.com/commerce/webapi/rest/)
- [REST API Reference](https://developer.adobe.com/commerce/webapi/rest/reference/)
- [Getting Started Guide](https://developer.adobe.com/commerce/webapi/get-started/)
- [REST Endpoint List](https://r-martins.github.io/m1docs/guides/v2.4/rest/list.html)

### Testing Tools
- [Mocha Test Framework](https://mochajs.org/)
- [Chai Assertion Library](https://www.chaijs.com/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)

---

## 🤝 Contributing

When adding new tests or documentation:

1. **Follow existing patterns** - See [Writing New Tests](QUICK_START.md#writing-new-tests)
2. **Use data generators** - Create or extend generators in `src/data-generators/`
3. **Add types** - Define TypeScript interfaces in `src/types/index.ts`
4. **Document** - Update this documentation when adding major features
5. **Test thoroughly** - Ensure tests pass on standard Magento 2.4.x
6. **Clean up** - Implement proper cleanup in `after` hooks

---

## 📈 Roadmap

See [Test Coverage Analysis - Implementation Priority](TEST_COVERAGE_ANALYSIS.md#implementation-priority) for the detailed roadmap.

**Next Priority Suites:**
1. ✅ Category & Search (Complete)
2. ✅ CMS Content (Complete)
3. ✅ Cart Coupons & Promotions (Complete)
4. ✅ Order Fulfillment: Invoice, Shipment, Credit Memo (Complete)
5. ✅ Inventory Management (Complete)
6. ⏳ Advanced Checkout (Planned - requires shipping methods config)

---

## ❓ Getting Help

**For test failures:**
1. Check [Troubleshooting Guide](QUICK_START.md#troubleshooting)
2. Review test logs for specific errors
3. Verify Magento instance configuration

**For coverage questions:**
1. See [Test Coverage Analysis](TEST_COVERAGE_ANALYSIS.md)
2. Check [API Endpoint Reference](TEST_COVERAGE_ANALYSIS.md#api-endpoint-reference)

**For development:**
1. Review [Best Practices](QUICK_START.md#best-practices)
2. Examine existing test suites for patterns
3. Check TypeScript types in `src/types/index.ts`

---

## 📝 Document Versions

| Document | Version | Last Updated |
|----------|---------|--------------|
| README (this file) | 1.1 | 2026-04-01 |
| Quick Start Guide | 1.0 | 2025-11-15 |
| Test Coverage Analysis | 1.1 | 2026-04-01 |

---

**Happy Testing! 🧪**

For questions or contributions, please refer to the main project [README](../README.md).
