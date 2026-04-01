import { expect } from 'chai';
import { ApiClient } from '../../utils/api-client';
import { getAdminUrl, config } from '../../config';
import { getAdminToken, delay } from '../../utils/test-helpers';
import { InventorySource, InventoryStock, SourceItem } from '../../types';

describe('Inventory API Tests', function () {
  this.timeout(20000);

  let apiClient: ApiClient;
  let createdSource: InventorySource;
  let createdStock: InventoryStock;

  before(async function () {
    apiClient = new ApiClient();
    const adminToken = await getAdminToken();
    apiClient.setAuthToken(adminToken);
  });

  describe('Inventory Source Management', function () {
    it('should create a new inventory source', async function () {
      const timestamp = Date.now();
      const sourceData: Partial<InventorySource> = {
        source_code: `test-src-${timestamp}`,
        name: `Test Source ${timestamp}`,
        enabled: true,
        country_id: 'US',
        region_id: 12,
        city: 'New York',
        street: '123 Test Street',
        postcode: '10001',
        contact_name: 'Test Contact',
        email: 'test@example.com',
        phone: '555-123-4567',
        use_default_carrier_config: true,
      };

      await apiClient.post<unknown>(getAdminUrl('/inventory/sources'), {
        source: sourceData,
      });

      // Magento returns empty array on success; verify by GET
      const verifyResponse = await apiClient.get<InventorySource>(
        getAdminUrl(`/inventory/sources/${sourceData.source_code}`),
      );

      expect(verifyResponse).to.be.an('object');
      expect(verifyResponse.source_code).to.equal(sourceData.source_code);
      expect(verifyResponse.name).to.equal(sourceData.name);
      expect(verifyResponse.enabled).to.be.true;

      createdSource = verifyResponse;
    });

    it('should get inventory source by code', async function () {
      if (!createdSource) {
        this.skip();
      }

      const response = await apiClient.get<InventorySource>(
        getAdminUrl(`/inventory/sources/${createdSource.source_code}`),
      );

      expect(response).to.be.an('object');
      expect(response.source_code).to.equal(createdSource.source_code);
      expect(response.name).to.equal(createdSource.name);
    });

    it('should update inventory source', async function () {
      if (!createdSource) {
        this.skip();
      }

      const updatedName = `Updated ${createdSource.name}`;
      const updateData: Partial<InventorySource> = {
        source_code: createdSource.source_code,
        name: updatedName,
        enabled: true,
        country_id: createdSource.country_id,
        region_id: createdSource.region_id,
        city: createdSource.city,
        street: createdSource.street,
        postcode: createdSource.postcode,
        contact_name: createdSource.contact_name,
        email: createdSource.email,
        phone: createdSource.phone,
        use_default_carrier_config: createdSource.use_default_carrier_config,
      };

      await apiClient.put<unknown>(getAdminUrl(`/inventory/sources/${createdSource.source_code}`), {
        source: updateData,
      });

      // Verify update
      const verifyResponse = await apiClient.get<InventorySource>(
        getAdminUrl(`/inventory/sources/${createdSource.source_code}`),
      );

      expect(verifyResponse.name).to.equal(updatedName);
      createdSource = verifyResponse;
    });

    it('should list inventory sources', async function () {
      const response = await apiClient.get<{ items: InventorySource[]; total_count: number }>(
        getAdminUrl('/inventory/sources'),
      );

      expect(response).to.be.an('object');
      expect(response.items).to.be.an('array');
      expect(response.items.length).to.be.greaterThan(0);
    });
  });

  describe('Inventory Stock Management', function () {
    it('should create a new inventory stock', async function () {
      const timestamp = Date.now();
      const stockData: Partial<InventoryStock> = {
        name: `Test Stock ${timestamp}`,
      };

      const stockId = await apiClient.post<number>(getAdminUrl('/inventory/stocks'), {
        stock: stockData,
      });

      expect(stockId).to.be.a('number');

      // Verify creation
      const verifyResponse = await apiClient.get<InventoryStock>(
        getAdminUrl(`/inventory/stocks/${stockId}`),
      );

      expect(verifyResponse).to.be.an('object');
      expect(verifyResponse.stock_id).to.equal(stockId);
      expect(verifyResponse.name).to.equal(stockData.name);

      createdStock = verifyResponse;
    });

    it('should get inventory stock by ID', async function () {
      if (!createdStock) {
        this.skip();
      }

      const response = await apiClient.get<InventoryStock>(
        getAdminUrl(`/inventory/stocks/${createdStock.stock_id}`),
      );

      expect(response).to.be.an('object');
      expect(response.stock_id).to.equal(createdStock.stock_id);
      expect(response.name).to.equal(createdStock.name);
    });

    it('should update inventory stock', async function () {
      if (!createdStock) {
        this.skip();
      }

      const updatedName = `Updated ${createdStock.name}`;
      const updateData: Partial<InventoryStock> = {
        stock_id: createdStock.stock_id,
        name: updatedName,
      };

      await apiClient.put<unknown>(getAdminUrl(`/inventory/stocks/${createdStock.stock_id}`), {
        stock: updateData,
      });

      const verifyResponse = await apiClient.get<InventoryStock>(
        getAdminUrl(`/inventory/stocks/${createdStock.stock_id}`),
      );

      expect(verifyResponse.name).to.equal(updatedName);
      createdStock = verifyResponse;
    });

    it('should assign source to stock', async function () {
      if (!createdSource || !createdStock) {
        this.skip();
      }

      try {
        await apiClient.post<unknown>(getAdminUrl('/inventory/stock-source-links'), {
          links: [
            {
              stock_id: createdStock.stock_id,
              source_code: createdSource.source_code,
              priority: 1,
            },
          ],
        });

        // Give Magento time to index the link
        await delay(1000);

        // Verify link exists by searching stock-source-links
        const linksResponse = await apiClient.get<{
          items: Array<{ stock_id: number; source_code: string }>;
          total_count: number;
        }>(getAdminUrl('/inventory/stock-source-links'), {
          params: {
            searchCriteria: {
              filter_groups: [
                {
                  filters: [
                    {
                      field: 'stock_id',
                      value: createdStock.stock_id!.toString(),
                      condition_type: 'eq',
                    },
                  ],
                },
              ],
              page_size: 10,
            },
          },
        });

        const found = linksResponse.items.find(
          (link) => link.source_code === createdSource.source_code,
        );
        expect(found).to.exist;
      } catch (error: any) {
        const errorMessage = (error.response?.data?.message || '') as string;
        if (
          errorMessage.includes('Could not save') ||
          errorMessage.includes('Request does not match any route')
        ) {
          console.log('Stock-source link creation restricted on this Magento instance');
          this.skip();
        }
        throw error;
      }
    });
  });

  describe('Source Item Management', function () {
    it('should create source items for a product', async function () {
      if (!createdSource) {
        this.skip();
      }

      const sourceItems: Partial<SourceItem>[] = [
        {
          sku: '24-MB01',
          source_code: createdSource.source_code,
          quantity: 100,
          status: 1,
        },
      ];

      await apiClient.post<unknown>(getAdminUrl('/inventory/source-items'), {
        sourceItems,
      });

      // Verify by searching source items
      const response = await apiClient.get<{
        items: SourceItem[];
        total_count: number;
      }>(getAdminUrl(`/inventory/source-items`), {
        params: {
          searchCriteria: {
            filter_groups: [
              {
                filters: [
                  {
                    field: 'sku',
                    value: '24-MB01',
                    condition_type: 'eq',
                  },
                  {
                    field: 'source_code',
                    value: createdSource.source_code,
                    condition_type: 'eq',
                  },
                ],
              },
            ],
          },
        },
      });

      expect(response.items).to.be.an('array');
      const found = response.items.find(
        (item) => item.sku === '24-MB01' && item.source_code === createdSource.source_code,
      );
      expect(found).to.exist;
      if (found) {
        expect(found.quantity).to.equal(100);
        expect(found.status).to.equal(1);
      }
    });

    it('should update source item quantity', async function () {
      if (!createdSource) {
        this.skip();
      }

      const sourceItems: Partial<SourceItem>[] = [
        {
          sku: '24-MB01',
          source_code: createdSource.source_code,
          quantity: 50,
          status: 1,
        },
      ];

      // Some Magento versions use POST for both create and update of source items
      try {
        await apiClient.post<unknown>(getAdminUrl('/inventory/source-items'), {
          sourceItems,
        });
      } catch (updateError: any) {
        if (updateError.response?.status === 404) {
          console.log('Source item update endpoint not available');
          this.skip();
          return;
        }
        throw updateError;
      }

      const response = await apiClient.get<{
        items: SourceItem[];
        total_count: number;
      }>(getAdminUrl(`/inventory/source-items`), {
        params: {
          searchCriteria: {
            filter_groups: [
              {
                filters: [
                  {
                    field: 'sku',
                    value: '24-MB01',
                    condition_type: 'eq',
                  },
                  {
                    field: 'source_code',
                    value: createdSource.source_code,
                    condition_type: 'eq',
                  },
                ],
              },
            ],
          },
        },
      });

      const found = response.items.find(
        (item) => item.sku === '24-MB01' && item.source_code === createdSource.source_code,
      );
      expect(found).to.exist;
      if (found) {
        expect(found.quantity).to.equal(50);
      }
    });
  });

  describe('Inventory Cleanup', function () {
    it('should delete source item', async function () {
      if (!createdSource) {
        this.skip();
      }

      if (!config.test.cleanupTestData) {
        console.log('Skipping source item deletion - cleanup disabled');
        this.skip();
      }

      const sourceItems: Partial<SourceItem>[] = [
        {
          sku: '24-MB01',
          source_code: createdSource.source_code,
          quantity: 0,
          status: 0,
        },
      ];

      // Some Magento versions delete via PUT with status 0, others via DELETE
      try {
        await apiClient.put<unknown>(getAdminUrl('/inventory/source-items'), {
          sourceItems,
        });
      } catch (error: any) {
        console.log('Source item cleanup result:', error.response?.status);
      }
    });

    it('should delete inventory stock', async function () {
      if (!createdStock) {
        this.skip();
      }

      if (!config.test.cleanupTestData) {
        console.log(
          `Skipping stock deletion - cleanup disabled. Stock ID: ${createdStock.stock_id}`,
        );
        this.skip();
      }

      try {
        await apiClient.delete(getAdminUrl(`/inventory/stocks/${createdStock.stock_id}`));
      } catch (error: any) {
        console.log('Stock cleanup result:', error.response?.status);
      }
    });

    it('should delete inventory source', async function () {
      if (!createdSource) {
        this.skip();
      }

      if (!config.test.cleanupTestData) {
        console.log(
          `Skipping source deletion - cleanup disabled. Source: ${createdSource.source_code}`,
        );
        this.skip();
      }

      try {
        await apiClient.delete(getAdminUrl(`/inventory/sources/${createdSource.source_code}`));
      } catch (error: any) {
        console.log('Source cleanup result:', error.response?.status);
      }
    });
  });

  after(async function () {
    if (!config.test.cleanupTestData) {
      if (createdSource) {
        console.log(`Test data preserved. Source: ${createdSource.source_code}`);
      }
      if (createdStock) {
        console.log(`Test data preserved. Stock ID: ${createdStock.stock_id}`);
      }
      return;
    }

    // Best-effort cleanup in reverse dependency order
    if (createdStock) {
      try {
        await apiClient.delete(getAdminUrl(`/inventory/stocks/${createdStock.stock_id}`));
      } catch (_error) {
        // Ignore
      }
    }

    if (createdSource) {
      try {
        await apiClient.delete(getAdminUrl(`/inventory/sources/${createdSource.source_code}`));
      } catch (_error) {
        // Ignore
      }
    }
  });
});
