import { expect } from 'chai';
import { ApiClient } from '../../utils/api-client';
import { CustomerDataGenerator } from '../../data-generators/customer';
import { getBaseUrl } from '../../config';
import { Customer, CustomerRegistration } from '../../types';

describe('Customer API Tests', function () {
  this.timeout(10000);

  const apiClient = new ApiClient();
  let customerData: CustomerRegistration;
  let createdCustomer: Customer;
  let authToken: string;

  before(function () {
    customerData = CustomerDataGenerator.generateCustomerWithAddress();
  });

  describe('Customer Registration', function () {
    it('should create a new customer account', async function () {
      const response = await apiClient.post<Customer>(getBaseUrl('/customers'), customerData);

      expect(response).to.be.an('object');
      expect(response.id).to.be.a('number');
      expect(response.email).to.equal(customerData.customer.email);
      expect(response.firstname).to.equal(customerData.customer.firstname);
      expect(response.lastname).to.equal(customerData.customer.lastname);
      expect(response.addresses).to.be.an('array');

      createdCustomer = response;
    });

    it('should not allow duplicate email registration', async function () {
      try {
        await apiClient.post<Customer>(getBaseUrl('/customers'), customerData);
        expect.fail('Expected error for duplicate email');
      } catch (error: any) {
        expect((error as any).response.status).to.equal(400);
        expect((error as any).response.data.message).to.include('already exists');
      }
    });

    it('should validate required fields', async function () {
      const invalidData = {
        customer: {
          email: '',
          firstname: '',
          lastname: '',
        },
        password: '',
      };

      try {
        await apiClient.post<Customer>(getBaseUrl('/customers'), invalidData);
        expect.fail('Expected validation error');
      } catch (error: any) {
        expect((error as any).response.status).to.equal(400);
      }
    });
  });

  describe('Customer Authentication', function () {
    it('should login with valid credentials', async function () {
      const response = await apiClient.post<string>(getBaseUrl('/integration/customer/token'), {
        username: customerData.customer.email,
        password: customerData.password,
      });

      expect(response).to.be.a('string');
      expect(response.length).to.be.greaterThan(0);
      authToken = response;
      apiClient.setAuthToken(authToken);
    });

    it('should reject invalid credentials', async function () {
      try {
        await apiClient.post<string>(getBaseUrl('/integration/customer/token'), {
          username: customerData.customer.email,
          password: 'wrong_password',
        });
        expect.fail('Expected authentication error');
      } catch (error: any) {
        expect((error as any).response.status).to.equal(401);
      }
    });

    it('should reject non-existent user', async function () {
      try {
        await apiClient.post<string>(getBaseUrl('/integration/customer/token'), {
          username: 'nonexistent@example.com',
          password: 'any_password',
        });
        expect.fail('Expected authentication error');
      } catch (error: any) {
        expect((error as any).response.status).to.equal(401);
      }
    });
  });

  describe('Customer Profile Management', function () {
    it('should retrieve customer profile', async function () {
      const response = await apiClient.get<Customer>(getBaseUrl('/customers/me'));

      expect(response).to.be.an('object');
      expect(response.id).to.equal(createdCustomer.id);
      expect(response.email).to.equal(createdCustomer.email);
      expect(response.firstname).to.equal(createdCustomer.firstname);
      expect(response.lastname).to.equal(createdCustomer.lastname);
    });

    it('should update customer profile', async function () {
      const updatedData = {
        customer: {
          id: createdCustomer.id,
          email: createdCustomer.email,
          firstname: 'Updated',
          lastname: 'Name',
          websiteId: createdCustomer.website_id,
        },
      };

      const response = await apiClient.put<Customer>(getBaseUrl('/customers/me'), updatedData);

      expect(response.firstname).to.equal('Updated');
      expect(response.lastname).to.equal('Name');
    });

    it('should require authentication for profile access', async function () {
      apiClient.clearAuthToken();

      try {
        await apiClient.get<Customer>(getBaseUrl('/customers/me'));
        expect.fail('Expected authentication error');
      } catch (error: any) {
        expect((error as any).response.status).to.equal(401);
      }

      // Restore token for cleanup
      apiClient.setAuthToken(authToken);
    });
  });

  describe('Customer Address Management', function () {
    it('should add a new address', async function () {
      const newAddress = CustomerDataGenerator.generateAddress({
        firstname: createdCustomer.firstname,
        lastname: createdCustomer.lastname,
      });

      const updatedCustomer = {
        customer: {
          id: createdCustomer.id,
          email: createdCustomer.email,
          firstname: createdCustomer.firstname,
          lastname: createdCustomer.lastname,
          websiteId: createdCustomer.website_id,
          addresses: [...(createdCustomer.addresses || []), newAddress],
        },
      };

      const response = await apiClient.put<Customer>(getBaseUrl('/customers/me'), updatedCustomer);

      expect(response.addresses).to.have.lengthOf.at.least(2);
    });
  });

  after(async function () {
    // Clean up - Note: Magento doesn't allow customers to delete their own accounts via API
    // In a real test environment, you might want to use admin credentials to clean up test data
  });
});
