import { expect } from 'chai';
import { ApiClient } from '../../utils/api-client';
import { getAdminUrl } from '../../config';
import { getAdminToken } from '../../utils/test-helpers';
import { StoreConfig, Country, CurrencyInfo } from '../../types';

describe('Store Configuration API Tests', function () {
  this.timeout(10000);

  let apiClient: ApiClient;

  before(async function () {
    apiClient = new ApiClient();
    const adminToken = await getAdminToken();
    apiClient.setAuthToken(adminToken);
  });

  it('should retrieve store configuration', async function () {
    const response = await apiClient.get<StoreConfig[]>(getAdminUrl('/store/storeConfigs'));

    expect(response).to.be.an('array');
    expect(response.length).to.be.greaterThan(0);

    const storeConfig = response[0]!;
    expect(storeConfig).to.have.property('code');
    expect(storeConfig).to.have.property('locale');
    expect(storeConfig).to.have.property('base_currency_code');
    expect(storeConfig).to.have.property('base_url');
    expect(storeConfig).to.have.property('timezone');
    expect(storeConfig.locale).to.be.a('string');
    expect(storeConfig.base_currency_code).to.be.a('string');
  });

  it('should list available countries', async function () {
    const response = await apiClient.get<Country[]>(getAdminUrl('/directory/countries'));

    expect(response).to.be.an('array');
    expect(response.length).to.be.greaterThan(0);

    const country = response[0]!;
    expect(country).to.have.property('id');
    expect(country).to.have.property('two_letter_abbreviation');
    expect(country).to.have.property('full_name_english');

    // Verify US is in the list
    const us = response.find((c) => c.id === 'US');
    expect(us).to.exist;
    expect(us!.full_name_english).to.equal('United States');
  });

  it('should get currency information', async function () {
    const response = await apiClient.get<CurrencyInfo>(getAdminUrl('/directory/currency'));

    expect(response).to.be.an('object');
    expect(response).to.have.property('base_currency_code');
    expect(response).to.have.property('available_currency_codes');
    expect(response.base_currency_code).to.be.a('string');
    expect(response.available_currency_codes).to.be.an('array');
    expect(response.available_currency_codes.length).to.be.greaterThan(0);
    expect(response.available_currency_codes).to.include(response.base_currency_code);
  });
});
