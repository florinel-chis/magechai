import { faker } from '@faker-js/faker';
import { CustomerRegistration, Address } from '../types';

export class CustomerDataGenerator {
  static generateCustomerRegistration(
    overrides?: Partial<CustomerRegistration>,
  ): CustomerRegistration {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const email = faker.internet.email({ firstName, lastName }).toLowerCase();

    return {
      customer: {
        email,
        firstname: firstName,
        lastname: lastName,
        addresses: [],
        ...overrides?.customer,
      },
      password: faker.internet.password({ 
        length: 12, 
        memorable: false,
        pattern: /[A-Za-z]/,
        prefix: 'Test@123' // Ensure it meets Magento requirements
      }),
      ...overrides,
    };
  }

  static generateAddress(overrides?: Partial<Address>): Address {
    return {
      firstname: faker.person.firstName(),
      lastname: faker.person.lastName(),
      street: [faker.location.streetAddress()],
      city: faker.location.city(),
      postcode: faker.location.zipCode(),
      country_id: 'US',
      region: {
        region_code: faker.location.state({ abbreviated: true }),
        region: faker.location.state(),
        region_id: faker.number.int({ min: 1, max: 50 }),
      },
      telephone: faker.phone.number(),
      default_shipping: true,
      default_billing: true,
      ...overrides,
    };
  }

  static generateCustomerWithAddress(): CustomerRegistration {
    const customer = this.generateCustomerRegistration();
    const address = this.generateAddress({
      firstname: customer.customer.firstname,
      lastname: customer.customer.lastname,
    });

    customer.customer.addresses = [address];
    return customer;
  }
}
