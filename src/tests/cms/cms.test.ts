import { expect } from 'chai';
import { ApiClient } from '../../utils/api-client';
import { CmsDataGenerator } from '../../data-generators/cms';
import { getAdminUrl, config } from '../../config';
import { getAdminToken } from '../../utils/test-helpers';
import { CmsPage, CmsBlock, SearchResult } from '../../types';

describe('CMS API Tests', function () {
  this.timeout(15000);

  let apiClient: ApiClient;
  let adminToken: string;
  let createdPage: CmsPage;
  let createdBlock: CmsBlock;

  before(async function () {
    apiClient = new ApiClient();
    adminToken = await getAdminToken();
    apiClient.setAuthToken(adminToken);
  });

  describe('CMS Page Management', function () {
    describe('Page Creation', function () {
      it('should create a new CMS page', async function () {
        const pageData = CmsDataGenerator.generateCmsPage();

        const response = await apiClient.post<CmsPage>(getAdminUrl('/cmsPage'), {
          page: pageData,
        });

        expect(response).to.be.an('object');
        expect(response.id).to.be.a('number');
        expect(response.title).to.equal(pageData.title);
        expect(response.identifier).to.equal(pageData.identifier);
        expect(response.content).to.be.a('string');
        expect(response.active).to.equal(pageData.active);

        createdPage = response;
      });

      it('should create a CMS page with rich content', async function () {
        const pageData = CmsDataGenerator.generateRichCmsPage();

        const response = await apiClient.post<CmsPage>(getAdminUrl('/cmsPage'), {
          page: pageData,
        });

        expect(response.id).to.be.a('number');
        expect(response.content).to.include('<h1>');
        expect(response.content).to.include('<p>');

        // Clean up
        if (config.test.cleanupTestData) {
          try {
            await apiClient.delete(getAdminUrl(`/cmsPage/${response.id}`));
          } catch (error) {
            // Ignore cleanup errors
          }
        }
      });

      it('should create an inactive CMS page', async function () {
        const pageData = CmsDataGenerator.generateInactiveCmsPage();

        const response = await apiClient.post<CmsPage>(getAdminUrl('/cmsPage'), {
          page: pageData,
        });

        expect(response.active).to.be.false;

        // Clean up
        if (config.test.cleanupTestData) {
          try {
            await apiClient.delete(getAdminUrl(`/cmsPage/${response.id}`));
          } catch (error) {
            // Ignore cleanup errors
          }
        }
      });

      it('should not allow duplicate identifier', async function () {
        if (!createdPage) {
          this.skip();
        }

        const duplicatePageData = CmsDataGenerator.generateCmsPage({
          identifier: createdPage.identifier,
        });

        try {
          await apiClient.post<CmsPage>(getAdminUrl('/cmsPage'), {
            page: duplicatePageData,
          });
          expect.fail('Expected error for duplicate identifier');
        } catch (error: any) {
          expect(error.response?.status).to.be.oneOf([400, 500]);
        }
      });

      it('should validate required fields', async function () {
        const invalidPage = {
          page: {
            // Missing required fields
            content: 'Some content',
          },
        };

        try {
          await apiClient.post<CmsPage>(getAdminUrl('/cmsPage'), invalidPage);
          expect.fail('Expected validation error');
        } catch (error: any) {
          expect(error.response?.status).to.be.oneOf([400, 500]);
        }
      });
    });

    describe('Page Retrieval', function () {
      it('should get CMS page by ID', async function () {
        if (!createdPage) {
          this.skip();
        }

        const response = await apiClient.get<CmsPage>(getAdminUrl(`/cmsPage/${createdPage.id}`));

        expect(response).to.be.an('object');
        expect(response.id).to.equal(createdPage.id);
        expect(response.title).to.equal(createdPage.title);
        expect(response.identifier).to.equal(createdPage.identifier);
      });

      it('should search CMS pages', async function () {
        const searchCriteria = {
          searchCriteria: {
            filter_groups: [
              {
                filters: [
                  {
                    field: 'is_active',
                    value: '1',
                    condition_type: 'eq',
                  },
                ],
              },
            ],
            page_size: 10,
            current_page: 1,
          },
        };

        const response = await apiClient.get<SearchResult<CmsPage>>(
          getAdminUrl('/cmsPage/search'),
          { params: searchCriteria },
        );

        expect(response).to.be.an('object');
        expect(response.items).to.be.an('array');
        expect(response.total_count).to.be.a('number');
      });

      it('should handle non-existent page', async function () {
        try {
          await apiClient.get<CmsPage>(getAdminUrl('/cmsPage/999999'));
          expect.fail('Expected 404 error');
        } catch (error: any) {
          expect(error.response?.status).to.equal(404);
        }
      });
    });

    describe('Page Update', function () {
      it('should update CMS page title', async function () {
        if (!createdPage) {
          this.skip();
        }

        const newTitle = `Updated ${createdPage.title}`;
        const updateData = {
          page: {
            id: createdPage.id,
            identifier: createdPage.identifier,
            title: newTitle,
            active: createdPage.active,
          },
        };

        const response = await apiClient.put<CmsPage>(
          getAdminUrl(`/cmsPage/${createdPage.id}`),
          updateData,
        );

        expect(response.title).to.equal(newTitle);
        createdPage = response;
      });

      it('should update CMS page content', async function () {
        if (!createdPage) {
          this.skip();
        }

        const newContent = '<h1>Updated Content</h1><p>This is new content.</p>';
        const updateData = {
          page: {
            id: createdPage.id,
            identifier: createdPage.identifier,
            title: createdPage.title,
            content: newContent,
            active: createdPage.active,
          },
        };

        const response = await apiClient.put<CmsPage>(
          getAdminUrl(`/cmsPage/${createdPage.id}`),
          updateData,
        );

        expect(response.content).to.equal(newContent);
      });

      it('should enable/disable CMS page', async function () {
        if (!createdPage) {
          this.skip();
        }

        // Disable
        const disableData = {
          page: {
            id: createdPage.id,
            identifier: createdPage.identifier,
            title: createdPage.title,
            active: false,
          },
        };

        const disabledResponse = await apiClient.put<CmsPage>(
          getAdminUrl(`/cmsPage/${createdPage.id}`),
          disableData,
        );

        expect(disabledResponse.active).to.be.false;

        // Re-enable
        const enableData = {
          page: {
            id: createdPage.id,
            identifier: createdPage.identifier,
            title: createdPage.title,
            active: true,
          },
        };

        const enabledResponse = await apiClient.put<CmsPage>(
          getAdminUrl(`/cmsPage/${createdPage.id}`),
          enableData,
        );

        expect(enabledResponse.active).to.be.true;
      });
    });

    describe('Page Deletion', function () {
      it('should delete CMS page', async function () {
        if (!createdPage) {
          this.skip();
        }

        if (!config.test.cleanupTestData) {
          console.log(
            `Skipping deletion test - cleanup disabled. Page preserved: ${createdPage.id}`,
          );
          this.skip();
        }

        const response = await apiClient.delete<boolean>(getAdminUrl(`/cmsPage/${createdPage.id}`));

        expect(response).to.be.true;
      });

      it('should verify page is deleted', async function () {
        if (!createdPage || !config.test.cleanupTestData) {
          this.skip();
        }

        try {
          await apiClient.get<CmsPage>(getAdminUrl(`/cmsPage/${createdPage.id}`));
          expect.fail('Expected 404 error for deleted page');
        } catch (error: any) {
          expect(error.response?.status).to.equal(404);
        }
      });
    });
  });

  describe('CMS Block Management', function () {
    describe('Block Creation', function () {
      it('should create a new CMS block', async function () {
        const blockData = CmsDataGenerator.generateCmsBlock();

        const response = await apiClient.post<CmsBlock>(getAdminUrl('/cmsBlock'), {
          block: blockData,
        });

        expect(response).to.be.an('object');
        expect(response.id).to.be.a('number');
        expect(response.title).to.equal(blockData.title);
        expect(response.identifier).to.equal(blockData.identifier);
        expect(response.content).to.be.a('string');
        expect(response.active).to.equal(blockData.active);

        createdBlock = response;
      });

      it('should create a promotional block', async function () {
        const blockData = CmsDataGenerator.generatePromotionalBlock();

        const response = await apiClient.post<CmsBlock>(getAdminUrl('/cmsBlock'), {
          block: blockData,
        });

        expect(response.id).to.be.a('number');
        expect(response.content).to.include('Special Offer');

        // Clean up
        if (config.test.cleanupTestData) {
          try {
            await apiClient.delete(getAdminUrl(`/cmsBlock/${response.id}`));
          } catch (error) {
            // Ignore cleanup errors
          }
        }
      });

      it('should create an inactive block', async function () {
        const blockData = CmsDataGenerator.generateInactiveCmsBlock();

        const response = await apiClient.post<CmsBlock>(getAdminUrl('/cmsBlock'), {
          block: blockData,
        });

        expect(response.active).to.be.false;

        // Clean up
        if (config.test.cleanupTestData) {
          try {
            await apiClient.delete(getAdminUrl(`/cmsBlock/${response.id}`));
          } catch (error) {
            // Ignore cleanup errors
          }
        }
      });

      it('should not allow duplicate identifier', async function () {
        if (!createdBlock) {
          this.skip();
        }

        const duplicateBlockData = CmsDataGenerator.generateCmsBlock({
          identifier: createdBlock.identifier,
        });

        try {
          await apiClient.post<CmsBlock>(getAdminUrl('/cmsBlock'), {
            block: duplicateBlockData,
          });
          expect.fail('Expected error for duplicate identifier');
        } catch (error: any) {
          expect(error.response?.status).to.be.oneOf([400, 500]);
        }
      });
    });

    describe('Block Retrieval', function () {
      it('should get CMS block by ID', async function () {
        if (!createdBlock) {
          this.skip();
        }

        const response = await apiClient.get<CmsBlock>(getAdminUrl(`/cmsBlock/${createdBlock.id}`));

        expect(response).to.be.an('object');
        expect(response.id).to.equal(createdBlock.id);
        expect(response.title).to.equal(createdBlock.title);
        expect(response.identifier).to.equal(createdBlock.identifier);
      });

      it('should search CMS blocks', async function () {
        const searchCriteria = {
          searchCriteria: {
            filter_groups: [
              {
                filters: [
                  {
                    field: 'is_active',
                    value: '1',
                    condition_type: 'eq',
                  },
                ],
              },
            ],
            page_size: 10,
            current_page: 1,
          },
        };

        const response = await apiClient.get<SearchResult<CmsBlock>>(
          getAdminUrl('/cmsBlock/search'),
          { params: searchCriteria },
        );

        expect(response).to.be.an('object');
        expect(response.items).to.be.an('array');
        expect(response.total_count).to.be.a('number');
      });
    });

    describe('Block Update', function () {
      it('should update CMS block title', async function () {
        if (!createdBlock) {
          this.skip();
        }

        const newTitle = `Updated ${createdBlock.title}`;
        const updateData = {
          block: {
            id: createdBlock.id,
            identifier: createdBlock.identifier,
            title: newTitle,
            content: createdBlock.content,
            active: createdBlock.active,
          },
        };

        const response = await apiClient.put<CmsBlock>(
          getAdminUrl(`/cmsBlock/${createdBlock.id}`),
          updateData,
        );

        expect(response.title).to.equal(newTitle);
        createdBlock = response;
      });

      it('should update CMS block content', async function () {
        if (!createdBlock) {
          this.skip();
        }

        const newContent = '<div class="updated-block">New content</div>';
        const updateData = {
          block: {
            id: createdBlock.id,
            identifier: createdBlock.identifier,
            title: createdBlock.title,
            content: newContent,
            active: createdBlock.active,
          },
        };

        const response = await apiClient.put<CmsBlock>(
          getAdminUrl(`/cmsBlock/${createdBlock.id}`),
          updateData,
        );

        expect(response.content).to.equal(newContent);
      });
    });

    describe('Block Deletion', function () {
      it('should delete CMS block', async function () {
        if (!createdBlock) {
          this.skip();
        }

        if (!config.test.cleanupTestData) {
          console.log(
            `Skipping deletion test - cleanup disabled. Block preserved: ${createdBlock.id}`,
          );
          this.skip();
        }

        const response = await apiClient.delete<boolean>(
          getAdminUrl(`/cmsBlock/${createdBlock.id}`),
        );

        expect(response).to.be.true;
      });

      it('should verify block is deleted', async function () {
        if (!createdBlock || !config.test.cleanupTestData) {
          this.skip();
        }

        try {
          await apiClient.get<CmsBlock>(getAdminUrl(`/cmsBlock/${createdBlock.id}`));
          expect.fail('Expected 404 error for deleted block');
        } catch (error: any) {
          expect(error.response?.status).to.equal(404);
        }
      });
    });
  });

  after(async function () {
    if (!config.test.cleanupTestData) {
      return;
    }

    // Cleanup any remaining test data
    const itemsToClean = [
      { type: 'page', item: createdPage },
      { type: 'block', item: createdBlock },
    ];

    for (const { type, item } of itemsToClean) {
      if (item && item.id) {
        try {
          const endpoint = type === 'page' ? 'cmsPage' : 'cmsBlock';
          await apiClient.delete(getAdminUrl(`/${endpoint}/${item.id}`));
        } catch (error: any) {
          // Ignore cleanup errors
        }
      }
    }
  });
});
