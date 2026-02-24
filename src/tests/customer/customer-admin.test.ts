import { expect } from 'chai';
import { ApiClient } from '../../utils/api-client';
import { CustomerDataGenerator } from '../../data-generators/customer';
import { getBaseUrl, getAdminUrl, config } from '../../config';
import { getAdminToken } from '../../utils/test-helpers';
import { Customer, CustomerRegistration, SearchResult } from '../../types';

describe('Admin Customer Management', function () {
  this.timeout(15000);

  let adminApiClient: ApiClient;
  let customerApiClient: ApiClient;
  let customerData: CustomerRegistration;
  let createdCustomer: Customer;

  before(async function () {
    adminApiClient = new ApiClient();
    customerApiClient = new ApiClient();

    const adminToken = await getAdminToken();
    adminApiClient.setAuthToken(adminToken);

    // Create a test customer via storefront API
    customerData = CustomerDataGenerator.generateCustomerWithAddress();
    createdCustomer = await customerApiClient.post<Customer>(
      getBaseUrl('/customers'),
      customerData,
    );
  });

  describe('Customer Search and Retrieval', function () {
    it('should search customers with searchCriteria', async function () {
      const response = await adminApiClient.get<SearchResult<Customer>>(
        getAdminUrl('/customers/search'),
        {
          params: {
            searchCriteria: {
              filter_groups: [
                {
                  filters: [
                    {
                      field: 'email',
                      value: createdCustomer.email,
                      condition_type: 'eq',
                    },
                  ],
                },
              ],
              page_size: 10,
              current_page: 1,
            },
          },
        },
      );

      expect(response.items).to.be.an('array');
      expect(response.total_count).to.be.at.least(1);

      const found = response.items.find((c) => c.email === createdCustomer.email);
      expect(found).to.exist;
      expect(found!.firstname).to.equal(createdCustomer.firstname);
    });

    it('should get customer by ID', async function () {
      const response = await adminApiClient.get<Customer>(
        getAdminUrl(`/customers/${createdCustomer.id}`),
      );

      expect(response).to.be.an('object');
      expect(response.id).to.equal(createdCustomer.id);
      expect(response.email).to.equal(createdCustomer.email);
      expect(response.firstname).to.equal(createdCustomer.firstname);
      expect(response.lastname).to.equal(createdCustomer.lastname);
    });

    it('should return 404 for non-existent customer ID', async function () {
      try {
        await adminApiClient.get<Customer>(getAdminUrl('/customers/999999999'));
        expect.fail('Expected 404 error');
      } catch (error: any) {
        expect(error.response.status).to.equal(404);
      }
    });
  });

  describe('Admin Customer Update and Deletion', function () {
    it('should update customer via admin endpoint', async function () {
      const response = await adminApiClient.put<Customer>(
        getAdminUrl(`/customers/${createdCustomer.id}`),
        {
          customer: {
            id: createdCustomer.id,
            email: createdCustomer.email,
            firstname: 'AdminUpdated',
            lastname: createdCustomer.lastname,
            website_id: createdCustomer.website_id,
          },
        },
      );

      expect(response.firstname).to.equal('AdminUpdated');
      expect(response.id).to.equal(createdCustomer.id);
    });

    it('should delete customer via admin endpoint', async function () {
      if (!config.test.cleanupTestData) {
        console.log(`Skipping deletion - cleanup disabled. Customer ID: ${createdCustomer.id}`);
        this.skip();
      }

      const response = await adminApiClient.delete<boolean>(
        getAdminUrl(`/customers/${createdCustomer.id}`),
      );

      expect(response).to.equal(true);
    });

    it('should verify deleted customer returns 404', async function () {
      if (!config.test.cleanupTestData) {
        this.skip();
      }

      try {
        await adminApiClient.get<Customer>(getAdminUrl(`/customers/${createdCustomer.id}`));
        expect.fail('Expected 404 error for deleted customer');
      } catch (error: any) {
        expect(error.response.status).to.equal(404);
      }
    });
  });

  after(async function () {
    // Clean up if deletion tests were skipped
    if (config.test.cleanupTestData && createdCustomer) {
      try {
        await adminApiClient.delete(getAdminUrl(`/customers/${createdCustomer.id}`));
      } catch (_error: any) {
        // Ignore - customer may already be deleted by test
      }
    }
  });
});
