import { ApiClient } from './api-client';
import { config, getAdminUrl } from '../config';

export async function getAdminToken(): Promise<string> {
  const client = new ApiClient();
  const response = await client.post<string>(getAdminUrl('/integration/admin/token'), {
    username: config.magento.adminUsername,
    password: config.magento.adminPassword,
  });
  return response;
}

export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function generateRandomString(length: number = 8): string {
  return Math.random()
    .toString(36)
    .substring(2, 2 + length);
}

export function generateRandomEmail(): string {
  return `test_${generateRandomString()}@example.com`;
}

export function simplifyAddressForCheckout(address: any): any {
  return {
    firstname: address.firstname,
    lastname: address.lastname,
    street: address.street,
    city: address.city,
    postcode: address.postcode,
    country_id: address.country_id,
    region_id: address.region?.region_id || address.region_id,
    telephone: address.telephone,
  };
}
