import { expect } from 'chai';
import { ApiClient } from '../../utils/api-client';
import { CustomerDataGenerator } from '../../data-generators/customer';
import { getBaseUrl } from '../../config';
import { Customer, CustomerRegistration } from '../../types';

describe('Customer Token Lifecycle', function () {
  this.timeout(10000);

  const apiClient = new ApiClient();
  let customerData: CustomerRegistration;
  let customerToken: string;

  before(async function () {
    // Create a customer and log in
    customerData = CustomerDataGenerator.generateCustomerWithAddress();
    await apiClient.post<Customer>(getBaseUrl('/customers'), customerData);

    customerToken = await apiClient.post<string>(getBaseUrl('/integration/customer/token'), {
      username: customerData.customer.email,
      password: customerData.password,
    });

    apiClient.setAuthToken(customerToken);

    // Verify token works
    const profile = await apiClient.get<Customer>(getBaseUrl('/customers/me'));
    expect(profile.email).to.equal(customerData.customer.email);
  });

  it('should revoke customer token (logout)', async function () {
    const response = await apiClient.post<boolean>(
      getBaseUrl('/integration/customer/revoke-customer-token'),
    );

    expect(response).to.equal(true);
  });

  it('should reject requests with revoked token', async function () {
    // The token was revoked in the previous test but is still set on the client
    try {
      await apiClient.get<Customer>(getBaseUrl('/customers/me'));
      expect.fail('Expected authentication error for revoked token');
    } catch (error: any) {
      expect(error.response.status).to.equal(401);
    }
  });

  it('should allow re-login after token revocation', async function () {
    apiClient.clearAuthToken();

    const newToken = await apiClient.post<string>(getBaseUrl('/integration/customer/token'), {
      username: customerData.customer.email,
      password: customerData.password,
    });

    expect(newToken).to.be.a('string');
    expect(newToken.length).to.be.greaterThan(0);
    expect(newToken).to.not.equal(customerToken);

    // Verify new token works
    apiClient.setAuthToken(newToken);
    const profile = await apiClient.get<Customer>(getBaseUrl('/customers/me'));
    expect(profile.email).to.equal(customerData.customer.email);
  });
});
