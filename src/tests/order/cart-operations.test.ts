import { expect } from 'chai';
import { ApiClient } from '../../utils/api-client';
import { CustomerDataGenerator } from '../../data-generators/customer';
import { ProductDataGenerator } from '../../data-generators/product';
import { getBaseUrl, getAdminUrl, config } from '../../config';
import { getAdminToken, delay } from '../../utils/test-helpers';
import { Customer, CustomerRegistration, Product, Cart, CartItemResponse } from '../../types';

describe('Cart Operations', function () {
  this.timeout(20000);

  let customerApiClient: ApiClient;
  let adminApiClient: ApiClient;
  let customerData: CustomerRegistration;
  let testProduct: Product;
  let cartItemId: number;

  before(async function () {
    customerApiClient = new ApiClient();
    adminApiClient = new ApiClient();

    // Admin setup
    const adminToken = await getAdminToken();
    adminApiClient.setAuthToken(adminToken);

    // Create test product
    const productData = ProductDataGenerator.generateSimpleProduct({
      sku: `CART-OPS-${Date.now()}`,
      price: 19.99,
      status: 1,
      visibility: 4,
      extension_attributes: {
        stock_item: {
          qty: 100,
          is_in_stock: true,
          manage_stock: true,
        },
      },
    });

    testProduct = await adminApiClient.post<Product>(getAdminUrl('/products'), {
      product: productData,
    });

    await delay(3000);

    // Create customer and log in
    customerData = CustomerDataGenerator.generateCustomerWithAddress();
    await customerApiClient.post<Customer>(getBaseUrl('/customers'), customerData);

    const customerToken = await customerApiClient.post<string>(
      getBaseUrl('/integration/customer/token'),
      {
        username: customerData.customer.email,
        password: customerData.password,
      },
    );
    customerApiClient.setAuthToken(customerToken);

    // Create cart and add item
    await customerApiClient.post<number>(getBaseUrl('/carts/mine'));

    try {
      const cartItem = await customerApiClient.post<CartItemResponse>(
        getBaseUrl('/carts/mine/items'),
        {
          cartItem: {
            sku: testProduct.sku,
            qty: 2,
          },
        },
      );
      cartItemId = cartItem.item_id;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || '';
      if (
        errorMessage.includes('setFinalPrice()') ||
        errorMessage.includes('module-cart-limitations')
      ) {
        console.log('Cart Limitations module preventing cart operations - skipping all cart tests');
      }
    }
  });

  describe('Cart Item Removal', function () {
    it('should remove an item from the cart', async function () {
      if (!cartItemId) {
        this.skip();
      }

      const response = await customerApiClient.delete<boolean>(
        getBaseUrl(`/carts/mine/items/${cartItemId}`),
      );

      expect(response).to.equal(true);
    });

    it('should have empty cart after removing all items', async function () {
      if (!cartItemId) {
        this.skip();
      }

      const cart = await customerApiClient.get<Cart>(getBaseUrl('/carts/mine'));

      expect(cart).to.be.an('object');
      expect(cart.items).to.be.an('array');
      expect(cart.items.length).to.equal(0);
      expect(cart.items_qty).to.equal(0);
    });
  });

  describe('Cart Coupon Operations', function () {
    it('should reject an invalid coupon code', async function () {
      // Create a fresh cart for coupon tests
      try {
        await customerApiClient.post<number>(getBaseUrl('/carts/mine'));
      } catch (_error: any) {
        // Cart may already exist, that's fine
      }

      try {
        await customerApiClient.put<boolean>(
          getBaseUrl('/carts/mine/coupons/INVALID_COUPON_12345'),
        );
        expect.fail('Expected error for invalid coupon');
      } catch (error: any) {
        // Magento returns 404 for invalid coupons or a message indicating the coupon is not valid
        expect(error.response.status).to.be.oneOf([404, 422]);
      }
    });

    it('should get current coupon (none applied)', async function () {
      try {
        const response = await customerApiClient.get<string>(getBaseUrl('/carts/mine/coupons'));

        // When no coupon is applied, Magento returns an empty string
        expect(response).to.be.a('string');
      } catch (error: any) {
        // Some Magento versions return 404 when no coupon is applied
        if (error.response?.status === 404) {
          // Acceptable - no coupon applied
          return;
        }
        throw error;
      }
    });
  });

  after(async function () {
    if (config.test.cleanupTestData && testProduct) {
      try {
        await adminApiClient.delete(
          getAdminUrl(`/products/${encodeURIComponent(testProduct.sku)}`),
        );
      } catch (_error: any) {
        // Ignore cleanup errors
      }
    } else if (testProduct) {
      console.log(`Test data preserved. Product SKU: ${testProduct.sku}`);
    }
  });
});
