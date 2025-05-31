# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

magechai is a TypeScript-based REST API testing framework for Magento 2 e-commerce platform. It uses Mocha/Chai for testing with comprehensive coverage of customer, product, and order management APIs.

## Essential Commands

### Running Tests
```bash
# Run all tests (using .env configuration)
npm test

# Run specific test suite
npm test -- src/tests/customer/customer.test.ts
npm test -- src/tests/product/product.test.ts
npm test -- src/tests/order/order.test.ts

# Run tests with grep pattern
npm test -- --grep "Customer Registration"

# Run with legacy environment variables
URL="http://magento.local" STORE_CODE="default" npm test
```

### Development Commands
```bash
# Linting
npm run lint          # Check for linting issues
npm run lint:fix      # Auto-fix linting issues

# TypeScript
npm run typecheck     # Check for type errors

# Clean
npm run clean         # Remove build artifacts
```

## Architecture & Code Structure

### Project Structure
```
src/
├── config/          # Environment configuration management
├── types/           # TypeScript interfaces for Magento API contracts
├── utils/           # API client and test helpers
├── data-generators/ # Test data factories using faker
└── tests/          # Test suites organized by domain
    ├── customer/   # Customer registration, auth, profile tests
    ├── product/    # Product CRUD operations tests
    └── order/      # Cart, checkout, order placement tests
```

### Key Components

1. **ApiClient** (`src/utils/api-client.ts`)
   - Axios-based HTTP client with interceptors
   - Automatic token management
   - Request/response logging
   - Error handling with typed responses

2. **Configuration** (`src/config/index.ts`)
   - Centralized config using dotenv
   - Helper functions for URL construction
   - Support for both admin and customer endpoints

3. **Type System** (`src/types/index.ts`)
   - Complete TypeScript interfaces for Magento entities
   - Covers Customer, Product, Order, Cart, and related types
   - Ensures type safety across all API interactions

### Testing Patterns

1. **Test Organization**
   - Each domain has its own test suite with setup/teardown
   - Tests are grouped by functionality using `describe` blocks
   - Both positive and negative test cases included

2. **Authentication Flow**
   - Customer tests: Create account → Login → Use token
   - Admin tests: Get admin token in `before` hook
   - Tokens managed by ApiClient instance

3. **Data Generation**
   - Use data generators for consistent test data
   - Faker.js ensures unique values for each test run
   - Generators support overrides for specific test cases

### Important Implementation Details

- **Async/Await**: All API calls use modern async/await syntax
- **Environment Config**: Uses .env file with fallback to process.env
- **Error Handling**: Typed error responses with detailed logging
- **Test Isolation**: Each test suite cleans up created resources
- **TypeScript Strict Mode**: Enabled for better type safety
- **HTTP Timeouts**: Configurable via TEST_TIMEOUT env variable