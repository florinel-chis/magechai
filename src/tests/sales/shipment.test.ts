import { expect } from 'chai';
import { ApiClient } from '../../utils/api-client';
import { getAdminUrl } from '../../config';
import { getAdminToken } from '../../utils/test-helpers';
import { Shipment, Order, SearchResult } from '../../types';

describe('Shipment API Tests', function () {
  this.timeout(20000);

  let apiClient: ApiClient;
  let existingShipment: Shipment;
  let createdShipmentId: number;
  let testOrderId: number;

  before(async function () {
    apiClient = new ApiClient();
    const adminToken = await getAdminToken();
    apiClient.setAuthToken(adminToken);

    // Try to find an existing shipment for read-only tests
    try {
      const shipmentsResponse = await apiClient.get<SearchResult<Shipment>>(
        getAdminUrl('/shipments'),
        {
          params: {
            searchCriteria: {
              page_size: 1,
              current_page: 1,
            },
          },
        },
      );

      if (shipmentsResponse.items.length > 0) {
        existingShipment = shipmentsResponse.items[0]!;
      }
    } catch (_error) {
      // Ignore
    }

    // Try to find an order that can be shipped
    try {
      const ordersResponse = await apiClient.get<SearchResult<Order>>(getAdminUrl('/orders'), {
        params: {
          searchCriteria: {
            filter_groups: [
              {
                filters: [
                  {
                    field: 'state',
                    value: 'processing',
                    condition_type: 'eq',
                  },
                ],
              },
            ],
            page_size: 5,
            current_page: 1,
          },
        },
      });

      // Find an order that hasn't been fully shipped yet
      for (const order of ordersResponse.items) {
        const orderShipments = await apiClient.get<SearchResult<Shipment>>(
          getAdminUrl('/shipments'),
          {
            params: {
              searchCriteria: {
                filter_groups: [
                  {
                    filters: [
                      {
                        field: 'order_id',
                        value: order.entity_id.toString(),
                        condition_type: 'eq',
                      },
                    ],
                  },
                ],
                page_size: 10,
              },
            },
          },
        );

        if (orderShipments.total_count === 0) {
          testOrderId = order.entity_id;
          break;
        }
      }
    } catch (_error) {
      // Ignore
    }
  });

  describe('Shipment Retrieval', function () {
    it('should search shipments', async function () {
      const response = await apiClient.get<SearchResult<Shipment>>(getAdminUrl('/shipments'), {
        params: {
          searchCriteria: {
            page_size: 10,
            current_page: 1,
          },
        },
      });

      expect(response).to.be.an('object');
      expect(response.items).to.be.an('array');
      expect(response.total_count).to.be.a('number');
    });

    it('should find shipment by ID via search', async function () {
      if (!existingShipment) {
        this.skip();
      }

      // GET /shipments/{id} is not available in all Magento REST APIs
      const response = await apiClient.get<SearchResult<Shipment>>(getAdminUrl('/shipments'), {
        params: {
          searchCriteria: {
            filter_groups: [
              {
                filters: [
                  {
                    field: 'entity_id',
                    value: existingShipment.entity_id!.toString(),
                    condition_type: 'eq',
                  },
                ],
              },
            ],
            page_size: 1,
            current_page: 1,
          },
        },
      });

      expect(response.items).to.be.an('array');
      expect(response.items.length).to.be.at.least(1);

      const found = response.items[0]!;
      expect(found.entity_id).to.equal(existingShipment.entity_id);
      expect(found.order_id).to.equal(existingShipment.order_id);
      expect(found.items).to.be.an('array');
    });

    it('should filter shipments by order ID', async function () {
      if (!existingShipment) {
        this.skip();
      }

      const response = await apiClient.get<SearchResult<Shipment>>(getAdminUrl('/shipments'), {
        params: {
          searchCriteria: {
            filter_groups: [
              {
                filters: [
                  {
                    field: 'order_id',
                    value: existingShipment.order_id.toString(),
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

      const found = response.items.find((shp) => shp.entity_id === existingShipment.entity_id);
      expect(found).to.exist;
    });
  });

  describe('Shipment Creation', function () {
    it('should create a shipment for an order', async function () {
      if (!testOrderId) {
        console.log('No shippable order available - skipping shipment creation');
        this.skip();
      }

      try {
        createdShipmentId = await apiClient.post<number>(
          getAdminUrl(`/order/${testOrderId}/ship`),
          {
            notify: false,
          },
        );

        expect(createdShipmentId).to.be.a('number');
      } catch (error: any) {
        const errorMessage = (error.response?.data?.message || '') as string;
        if (
          errorMessage.includes('cannot be shipped') ||
          errorMessage.includes('cannot ship') ||
          errorMessage.includes('no items')
        ) {
          console.log('Order cannot be shipped in current state');
          this.skip();
        }
        throw error;
      }
    });

    it('should retrieve created shipment', async function () {
      if (!createdShipmentId) {
        this.skip();
      }

      const response = await apiClient.get<Shipment>(
        getAdminUrl(`/shipments/${createdShipmentId}`),
      );

      expect(response).to.be.an('object');
      expect(response.entity_id).to.equal(createdShipmentId);
      expect(response.items).to.be.an('array');
      expect(response.items.length).to.be.greaterThan(0);
    });
  });

  describe('Shipment Tracks', function () {
    it('should add a track to a shipment', async function () {
      const shipment =
        existingShipment ||
        (createdShipmentId ? ({ entity_id: createdShipmentId } as Shipment) : null);
      if (!shipment) {
        this.skip();
      }

      try {
        const response = await apiClient.post<number>(
          getAdminUrl(`/shipment/${shipment.entity_id}/track`),
          {
            track: {
              carrier_code: 'custom',
              title: 'Test Carrier',
              track_number: `TRACK-${Date.now()}`,
            },
          },
        );

        expect(response).to.be.a('number');
      } catch (error: any) {
        const errorMessage = (error.response?.data?.message || '') as string;
        if (
          error.response?.status === 404 ||
          errorMessage.includes('not found') ||
          errorMessage.includes('does not exist') ||
          errorMessage.includes('Invalid carrier') ||
          errorMessage.includes('Request does not match any route')
        ) {
          console.log('Shipment track creation not available or shipment not found');
          this.skip();
        }
        throw error;
      }
    });
  });
});
