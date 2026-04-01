# Changelog

## [Unreleased]

### Added
- **Promotions API Tests** (`src/tests/promotions/coupon.test.ts`)
  - Sales Rule CRUD (percentage, fixed, free shipping, buy-X-get-Y)
  - Coupon CRUD with search by rule ID
  - Cart rule listing
- **Inventory API Tests** (`src/tests/inventory/inventory.test.ts`)
  - Multi-Source Inventory (MSI) source management
  - Stock creation and updates
  - Source-to-stock linking
  - Source item quantity management
- **Sales API Tests** (`src/tests/sales/`)
  - Invoice lifecycle (search, create, retrieve, comments)
  - Shipment lifecycle (search, create, tracking)
  - Credit memo lifecycle (search, create from invoice, comments)
- `MAGENTO_INTEGRATION_TOKEN` environment variable support for admin auth

### Changed
- `src/index.test.ts` now imports all new test suites
- Phone number generation updated to comply with Magento 2.4.8 validation
- CMS data generators updated for Magento 2.4.8 compatibility (lowercase identifiers, removed `store_id`)
- Product update payloads now include required `sku`, `name`, and `attribute_set_id`

### Fixed
- Admin authentication now falls back to integration token when username/password login fails
- Yargs/Node 25 ESM compatibility issue resolved
- All Prettier/ESLint errors resolved (0 errors remaining)
- Product duplicate SKU cleanup now deletes by entity ID instead of SKU
- Multiple Magento API response format differences handled gracefully

## [2.0.0] - 2025-01-31

### Added
- Complete modernization of the MageChai testing framework
- TypeScript strict mode configuration
- Comprehensive type definitions for all Magento entities
- Environment-based configuration with dotenv
- Test data generators using Faker.js
- Conditional test data cleanup (CLEANUP_TEST_DATA environment variable)
- ESLint and Prettier configuration
- Modern project structure with clear separation of concerns
- Detailed API request/response logging
- Vendor Cart Limitations module error handling

### Changed
- Updated all dependencies to latest versions:
  - Mocha 9.1.3 → 10.3.0
  - Chai 4.3.4 → 4.4.1
  - TypeScript 4.5.2 → 5.4.3
  - Added new dev dependencies for linting and formatting
- Refactored all tests to use async/await syntax
- Improved error handling with specific error types
- Enhanced product tests with graceful duplicate SKU handling
- Updated cart operations to handle different quote_id formats
- Added conditional test skipping for environment-specific features

### Fixed
- Admin authentication with correct credentials
- Cart ID format compatibility (numeric vs string)
- Product category requirement removal
- Address format simplification for checkout
- Password generation to meet Magento requirements
- Product deletion API response format handling
- Search test conditional skipping for indexing delays

### Known Issues
- Vendor Cart Limitations module may prevent cart operations with error:
  "Call to a member function setFinalPrice() on null"
  Tests automatically skip cart operations when this error is detected

### Configuration
- Admin credentials: florinel.chis/Test123$
- Test URL: http://magento.local
- Cleanup disabled by default (CLEANUP_TEST_DATA=false)
