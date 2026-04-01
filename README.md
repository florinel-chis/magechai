# MageChai

A comprehensive REST API testing framework for Magento 2 e-commerce platform built with TypeScript, Mocha, and Chai.

## Features

- 🧪 Complete test coverage for Magento 2 REST APIs
- 🔐 Customer registration and authentication testing
- 📦 Product management (CRUD operations)
- 🛒 Shopping cart and checkout flow testing
- 📝 Order placement and verification
- 🏷️ Promotions: sales rules, coupons, cart rules
- 📦 Inventory: sources, stocks, source items (MSI)
- 📄 Sales documents: invoices, shipments, credit memos
- 🎯 TypeScript with strict type checking
- 🚀 Modern async/await syntax
- 📊 Detailed test reporting
- 🔧 Configurable via environment variables

## Prerequisites

- Node.js >= 18.0.0
- NPM or Yarn
- Access to a Magento 2 instance
- Admin credentials for product/order management tests

## Installation

```bash
# Clone the repository
git clone <repository-url>
cd magechai

# Install dependencies
npm install

# Copy environment example
cp .env.example .env

# Edit .env with your Magento instance details
```

## Configuration

Create a `.env` file in the project root:

```env
# Magento API Configuration
MAGENTO_BASE_URL=http://magento.local
MAGENTO_STORE_CODE=default

# Admin credentials (for product/order management)
MAGENTO_ADMIN_USERNAME=admin
MAGENTO_ADMIN_PASSWORD=admin123

# Test configuration
TEST_TIMEOUT=10000
LOG_LEVEL=info
CLEANUP_TEST_DATA=false  # Set to true to delete test data after tests
```

## Running Tests

```bash
# Run all tests
npm test

# Run specific test suite
npm test -- src/tests/customer/customer.test.ts

# Run tests with grep pattern
npm test -- --grep "Customer Registration"

# Run tests in watch mode
npm run test:watch

# Run with legacy environment variables
URL=http://magento.local STORE_CODE=default npm test
```

## Test Suites

### Customer Tests (`src/tests/customer/`)
- Customer registration with validation
- Email duplicate prevention
- Login/authentication
- Profile management
- Address management

### Product Tests (`src/tests/product/`)
- Create simple, virtual, and configurable products
- Product retrieval and search
- Update product details and stock
- Batch operations
- Product deletion

### Order Tests (`src/tests/order/`)
- Complete checkout flow
- Cart management
- Shipping and billing address
- Payment method selection
- Order placement
- Guest checkout
- Order verification

### Promotions Tests (`src/tests/promotions/`)
- Sales rule creation and management
- Coupon generation and updates
- Cart rule application

### Inventory Tests (`src/tests/inventory/`)
- Inventory source CRUD
- Stock management
- Source-to-stock linking
- Source item quantity tracking

### Sales Tests (`src/tests/sales/`)
- Invoice creation and retrieval
- Shipment creation and tracking
- Credit memo creation from invoices

## Development

```bash
# Run linting
npm run lint

# Fix linting issues
npm run lint:fix

# Type checking
npm run typecheck

# Clean build artifacts
npm run clean
```

## Project Structure

```
magechai/
├── src/
│   ├── config/          # Configuration management
│   ├── types/           # TypeScript type definitions
│   ├── utils/           # Utility functions and API client
│   ├── data-generators/ # Test data generators
│   └── tests/          # Test suites
│       ├── customer/   # Customer-related tests
│       ├── product/    # Product management tests
│       ├── order/      # Order and checkout tests
│       ├── promotions/ # Sales rules and coupon tests
│       ├── inventory/  # MSI inventory tests
│       └── sales/      # Invoice, shipment, credit memo tests
├── .env.example        # Environment variables template
├── .eslintrc.json      # ESLint configuration
├── .prettierrc.json    # Prettier configuration
├── .mocharc.json       # Mocha configuration
├── tsconfig.json       # TypeScript configuration
└── package.json        # Project dependencies
```

## API Client

The framework includes a robust API client with:
- Automatic token management
- Request/response interceptors
- Error handling and logging
- TypeScript generics for type safety

Example usage:
```typescript
const client = new ApiClient();
const customer = await client.post<Customer>('/customers', customerData);
```

## Data Generators

Test data generators using Faker.js:
```typescript
// Generate customer with address
const customer = CustomerDataGenerator.generateCustomerWithAddress();

// Generate simple product
const product = ProductDataGenerator.generateSimpleProduct();
```

## Best Practices

1. **Environment Variables**: Always use `.env` files for configuration
2. **Test Isolation**: Each test suite cleans up its data
3. **Type Safety**: Leverage TypeScript types for API contracts
4. **Error Handling**: Tests include negative scenarios
5. **Async/Await**: Modern syntax for better readability

## Troubleshooting

### Common Issues

1. **Authentication Errors**
   - Verify admin credentials in `.env`
   - Check if admin token has required permissions

2. **Product Not Found**
   - Allow time for product indexing after creation
   - Verify product visibility settings

3. **Checkout Failures**
   - Ensure shipping methods are configured
   - Check payment methods are enabled

4. **Cart Limitations Module**
   - If you encounter "Call to a member function setFinalPrice() on null" errors
   - This is related to vendor cart limitations module requirements
   - The module may require specific product attributes or configurations
   - Tests will automatically skip cart operations if this error is detected

5. **Permission Restrictions**
   - Customer tokens may not have permission to access catalog products
   - Guest checkout may be disabled on some Magento instances
   - Tests will automatically skip operations that lack required permissions

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.