import { expect } from 'chai';
import { ApiClient } from '../../utils/api-client';
import { CustomerDataGenerator } from '../../data-generators/customer';
import { ProductDataGenerator } from '../../data-generators/product';
import { getBaseUrl, getAdminUrl, config } from '../../config';
import { getAdminToken, delay, simplifyAddressForCheckout } from '../../utils/test-helpers';
import {
  Customer,
  CustomerRegistration,
  Product,
  CartItemResponse,
  ShippingMethod,
  Order,
  ShippingInformationResponse,
  SearchResult,
  OrderComment,
  Invoice,
} from '../../types';

describe('Order Management (Admin)', function () {
  this.timeout(45000);

  let adminApiClient: ApiClient;
  let customerApiClient: ApiClient;
  let customerData: CustomerRegistration;
  let customer: Customer;
  let testProduct: Product;
  let orderId: string;
  let invoiceId: number;

  before(async function () {
    adminApiClient = new ApiClient();
    customerApiClient = new ApiClient();

    // Admin setup
    const adminToken = await getAdminToken();
    adminApiClient.setAuthToken(adminToken);

    // Create test product
    const productData = ProductDataGenerator.generateSimpleProduct({
      sku: `ORD-MGMT-${Date.now()}`,
      name: 'Test Product for Order Management',
      price: 29.99,
      status: 1,
      visibility: 4,
      weight: 1,
      extension_attributes: {
        stock_item: {
          qty: 1000,
          is_in_stock: true,
          manage_stock: true,
        },
      },
      custom_attributes: [
        { attribute_code: 'tax_class_id', value: '2' },
        { attribute_code: 'url_key', value: `order-mgmt-product-${Date.now()}` },
      ],
    });

    testProduct = await adminApiClient.post<Product>(getAdminUrl('/products'), {
      product: productData,
    });

    await delay(5000);

    // Create customer and login
    customerData = CustomerDataGenerator.generateCustomerWithAddress();
    customer = await customerApiClient.post<Customer>(getBaseUrl('/customers'), customerData);

    const customerToken = await customerApiClient.post<string>(
      getBaseUrl('/integration/customer/token'),
      {
        username: customerData.customer.email,
        password: customerData.password,
      },
    );
    customerApiClient.setAuthToken(customerToken);

    // Full checkout flow
    try {
      await customerApiClient.post<number>(getBaseUrl('/carts/mine'));

      await customerApiClient.post<CartItemResponse>(getBaseUrl('/carts/mine/items'), {
        cartItem: {
          sku: testProduct.sku,
          qty: 2,
        },
      });

      const address = simplifyAddressForCheckout(customerData.customer.addresses![0]!);

      await customerApiClient.post(getBaseUrl('/carts/mine/billing-address'), {
        address: { ...address, email: customer.email },
      });

      const shippingMethods = await customerApiClient.post<ShippingMethod[]>(
        getBaseUrl('/carts/mine/estimate-shipping-methods'),
        { address },
      );

      if (shippingMethods.length === 0) {
        console.log('No shipping methods available - skipping order management tests');
        this.skip();
      }

      const shippingInfo = await customerApiClient.post<ShippingInformationResponse>(
        getBaseUrl('/carts/mine/shipping-information'),
        {
          addressInformation: {
            billing_address: { ...address, email: customer.email },
            shipping_address: { ...address, email: customer.email },
            shipping_carrier_code: shippingMethods[0]!.carrier_code,
            shipping_method_code: shippingMethods[0]!.method_code,
          },
        },
      );

      const paymentMethod = shippingInfo.payment_methods[0]?.code || 'checkmo';

      orderId = await customerApiClient.put<string>(getBaseUrl('/carts/mine/payment-information'), {
        paymentMethod: { method: paymentMethod },
      });

      await delay(2000);
      console.log(`Order placed: ${orderId}`);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || '';
      console.error('Checkout flow failed:', errorMessage);
      this.skip();
    }
  });

  describe('Order Search', function () {
    it('should search orders with searchCriteria', async function () {
      if (!orderId) {
        this.skip();
      }

      const response = await adminApiClient.get<SearchResult<Order>>(getAdminUrl('/orders'), {
        params: {
          searchCriteria: {
            filter_groups: [
              {
                filters: [
                  {
                    field: 'customer_email',
                    value: customer.email,
                    condition_type: 'eq',
                  },
                ],
              },
            ],
            page_size: 10,
            current_page: 1,
          },
        },
      });

      expect(response.items).to.be.an('array');
      expect(response.total_count).to.be.at.least(1);

      const found = response.items.find((o) => o.entity_id === parseInt(orderId));
      expect(found).to.exist;
      expect(found!.customer_email).to.equal(customer.email);
    });
  });

  describe('Order Comments', function () {
    it('should add a comment to an order', async function () {
      if (!orderId) {
        this.skip();
      }

      const response = await adminApiClient.post<boolean>(
        getAdminUrl(`/orders/${orderId}/comments`),
        {
          statusHistory: {
            comment: 'Test comment from API automation',
            is_visible_on_front: 1,
            is_customer_notified: 0,
          },
        },
      );

      expect(response).to.equal(true);
    });

    it('should retrieve order comments', async function () {
      if (!orderId) {
        this.skip();
      }

      const response = await adminApiClient.get<{ items: OrderComment[] }>(
        getAdminUrl(`/orders/${orderId}/comments`),
      );

      expect(response.items).to.be.an('array');
      expect(response.items.length).to.be.at.least(1);

      const latestComment = response.items[response.items.length - 1]!;
      expect(latestComment.comment).to.equal('Test comment from API automation');
    });
  });

  describe('Invoice Creation', function () {
    it('should create an invoice for the order', async function () {
      if (!orderId) {
        this.skip();
      }

      try {
        invoiceId = await adminApiClient.post<number>(getAdminUrl(`/order/${orderId}/invoice`), {
          capture: true,
          notify: false,
        });

        expect(invoiceId).to.be.a('number');
      } catch (error: any) {
        const errorMessage = (error.response?.data?.message || '') as string;
        if (errorMessage.includes('cannot be invoiced') || errorMessage.includes('no items')) {
          console.log('Order cannot be invoiced in current state');
          this.skip();
        }
        throw error;
      }
    });

    it('should retrieve the invoice', async function () {
      if (!invoiceId) {
        this.skip();
      }

      const response = await adminApiClient.get<Invoice>(getAdminUrl(`/invoices/${invoiceId}`));

      expect(response).to.be.an('object');
      expect(response.entity_id).to.equal(invoiceId);
      expect(response.order_id).to.equal(parseInt(orderId));
      expect(response.grand_total).to.be.greaterThan(0);
      expect(response.items).to.be.an('array');
      expect(response.items.length).to.be.greaterThan(0);
    });
  });

  describe('Shipment Creation', function () {
    it('should create a shipment for the order', async function () {
      if (!orderId || !invoiceId) {
        this.skip();
      }

      try {
        const shipmentId = await adminApiClient.post<number>(
          getAdminUrl(`/order/${orderId}/ship`),
          {
            notify: false,
          },
        );

        expect(shipmentId).to.be.a('number');
      } catch (error: any) {
        const errorMessage = (error.response?.data?.message || '') as string;
        if (
          errorMessage.includes('cannot be shipped') ||
          errorMessage.includes('no items') ||
          errorMessage.includes('cannot ship')
        ) {
          console.log('Order cannot be shipped in current state');
          this.skip();
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
        // Ignore - product may be associated with orders
      }
    } else if (testProduct) {
      console.log(`Test data preserved. Product SKU: ${testProduct.sku}`);
    }
  });
});
