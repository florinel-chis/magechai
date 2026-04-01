import { expect } from 'chai';
import { ApiClient } from '../../utils/api-client';
import { getAdminUrl } from '../../config';
import { getAdminToken } from '../../utils/test-helpers';
import { Invoice, Order, SearchResult } from '../../types';

describe('Invoice API Tests', function () {
  this.timeout(20000);

  let apiClient: ApiClient;
  let existingInvoice: Invoice;
  let createdInvoiceId: number;
  let testOrderId: number;

  before(async function () {
    apiClient = new ApiClient();
    const adminToken = await getAdminToken();
    apiClient.setAuthToken(adminToken);

    // Try to find an existing invoice for read-only tests
    try {
      const invoicesResponse = await apiClient.get<SearchResult<Invoice>>(
        getAdminUrl('/invoices'),
        {
          params: {
            searchCriteria: {
              page_size: 1,
              current_page: 1,
            },
          },
        },
      );

      if (invoicesResponse.items.length > 0) {
        existingInvoice = invoicesResponse.items[0]!;
      }
    } catch (_error) {
      // Ignore
    }

    // Try to find an order that can be invoiced
    try {
      const ordersResponse = await apiClient.get<SearchResult<Order>>(getAdminUrl('/orders'), {
        params: {
          searchCriteria: {
            filter_groups: [
              {
                filters: [
                  {
                    field: 'state',
                    value: 'new',
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

      if (ordersResponse.items.length > 0) {
        testOrderId = ordersResponse.items[0]!.entity_id;
      }
    } catch (_error) {
      // Ignore
    }
  });

  describe('Invoice Retrieval', function () {
    it('should search invoices', async function () {
      const response = await apiClient.get<SearchResult<Invoice>>(getAdminUrl('/invoices'), {
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

    it('should get invoice by ID', async function () {
      if (!existingInvoice) {
        this.skip();
      }

      const response = await apiClient.get<Invoice>(
        getAdminUrl(`/invoices/${existingInvoice.entity_id}`),
      );

      expect(response).to.be.an('object');
      expect(response.entity_id).to.equal(existingInvoice.entity_id);
      expect(response.order_id).to.equal(existingInvoice.order_id);
      expect(response.grand_total).to.be.greaterThan(0);
      expect(response.items).to.be.an('array');
    });

    it('should filter invoices by order ID', async function () {
      if (!existingInvoice) {
        this.skip();
      }

      const response = await apiClient.get<SearchResult<Invoice>>(getAdminUrl('/invoices'), {
        params: {
          searchCriteria: {
            filter_groups: [
              {
                filters: [
                  {
                    field: 'order_id',
                    value: existingInvoice.order_id.toString(),
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

      const found = response.items.find((inv) => inv.entity_id === existingInvoice.entity_id);
      expect(found).to.exist;
    });
  });

  describe('Invoice Creation', function () {
    it('should create an invoice for an order', async function () {
      if (!testOrderId) {
        console.log('No invoiceable order available - skipping invoice creation');
        this.skip();
      }

      try {
        createdInvoiceId = await apiClient.post<number>(
          getAdminUrl(`/order/${testOrderId}/invoice`),
          {
            capture: true,
            notify: false,
          },
        );

        expect(createdInvoiceId).to.be.a('number');
      } catch (error: any) {
        const errorMessage = (error.response?.data?.message || '') as string;
        if (
          errorMessage.includes('cannot be invoiced') ||
          errorMessage.includes('does not allow an invoice') ||
          errorMessage.includes('without products')
        ) {
          console.log('Order cannot be invoiced in current state');
          this.skip();
        }
        throw error;
      }
    });

    it('should retrieve created invoice', async function () {
      if (!createdInvoiceId) {
        this.skip();
      }

      const response = await apiClient.get<Invoice>(getAdminUrl(`/invoices/${createdInvoiceId}`));

      expect(response).to.be.an('object');
      expect(response.entity_id).to.equal(createdInvoiceId);
      expect(response.items).to.be.an('array');
      expect(response.items.length).to.be.greaterThan(0);
    });
  });

  describe('Invoice Comments', function () {
    it('should add a comment to an invoice', async function () {
      const invoice =
        existingInvoice || (createdInvoiceId ? ({ entity_id: createdInvoiceId } as Invoice) : null);
      if (!invoice) {
        this.skip();
      }

      try {
        const response = await apiClient.post<boolean>(
          getAdminUrl(`/invoices/${invoice.entity_id}/comments`),
          {
            comment: 'Test invoice comment',
            is_visible_on_front: 0,
          },
        );

        expect(response).to.equal(true);
      } catch (error: any) {
        const errorMessage = (error.response?.data?.message || '') as string;
        if (
          error.response?.status === 404 ||
          errorMessage.includes('not found') ||
          errorMessage.includes('does not exist') ||
          errorMessage.includes('Request does not match any route')
        ) {
          console.log('Invoice comments endpoint not available on this Magento instance');
          this.skip();
        }
        throw error;
      }
    });
  });
});
