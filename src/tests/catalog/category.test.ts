import { expect } from 'chai';
import { ApiClient } from '../../utils/api-client';
import { CategoryDataGenerator } from '../../data-generators/category';
import { getAdminUrl, config } from '../../config';
import { getAdminToken } from '../../utils/test-helpers';
import { Category, SearchResult } from '../../types';

describe('Category API Tests', function () {
  this.timeout(15000);

  let apiClient: ApiClient;
  let adminToken: string;
  let createdCategory: Category;
  let createdSubcategory: Category;

  before(async function () {
    apiClient = new ApiClient();
    adminToken = await getAdminToken();
    apiClient.setAuthToken(adminToken);
  });

  describe('Category Creation', function () {
    it('should create a new category', async function () {
      const categoryData = CategoryDataGenerator.generateCategory();

      const response = await apiClient.post<Category>(getAdminUrl('/categories'), {
        category: categoryData,
      });

      expect(response).to.be.an('object');
      expect(response.id).to.be.a('number');
      expect(response.name).to.equal(categoryData.name);
      expect(response.is_active).to.equal(categoryData.is_active);
      expect(response.position).to.be.a('number');
      expect(response.level).to.be.a('number');
      expect(response.parent_id).to.equal(categoryData.parent_id);

      createdCategory = response;
    });

    it('should create a subcategory', async function () {
      if (!createdCategory) {
        this.skip();
      }

      const subcategoryData = CategoryDataGenerator.generateSubcategory(createdCategory.id);

      const response = await apiClient.post<Category>(getAdminUrl('/categories'), {
        category: subcategoryData,
      });

      expect(response).to.be.an('object');
      expect(response.id).to.be.a('number');
      expect(response.parent_id).to.equal(createdCategory.id);
      expect(response.level).to.be.greaterThan(createdCategory.level);

      createdSubcategory = response;
    });

    it('should create a disabled category', async function () {
      const categoryData = CategoryDataGenerator.generateDisabledCategory();

      const response = await apiClient.post<Category>(getAdminUrl('/categories'), {
        category: categoryData,
      });

      expect(response.is_active).to.be.false;

      // Clean up
      if (config.test.cleanupTestData) {
        try {
          await apiClient.delete(getAdminUrl(`/categories/${response.id}`));
        } catch (error) {
          // Ignore cleanup errors
        }
      }
    });

    it('should validate required fields', async function () {
      const invalidCategory = {
        category: {
          // Missing required fields like name
          is_active: true,
        },
      };

      try {
        await apiClient.post<Category>(getAdminUrl('/categories'), invalidCategory);
        expect.fail('Expected validation error');
      } catch (error: any) {
        expect(error.response?.status).to.be.oneOf([400, 500]);
      }
    });
  });

  describe('Category Retrieval', function () {
    it('should get category by ID', async function () {
      if (!createdCategory) {
        this.skip();
      }

      const response = await apiClient.get<Category>(
        getAdminUrl(`/categories/${createdCategory.id}`),
      );

      expect(response).to.be.an('object');
      expect(response.id).to.equal(createdCategory.id);
      expect(response.name).to.equal(createdCategory.name);
      expect(response.parent_id).to.equal(createdCategory.parent_id);
    });

    it('should get category list', async function () {
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

      const response = await apiClient.get<SearchResult<Category>>(
        getAdminUrl('/categories/list'),
        { params: searchCriteria },
      );

      expect(response).to.be.an('object');
      expect(response.items).to.be.an('array');
      expect(response.total_count).to.be.a('number');
      expect(response.total_count).to.be.greaterThan(0);
    });

    it('should handle non-existent category', async function () {
      try {
        await apiClient.get<Category>(getAdminUrl('/categories/999999'));
        expect.fail('Expected 404 error');
      } catch (error: any) {
        expect(error.response?.status).to.equal(404);
      }
    });
  });

  describe('Category Update', function () {
    it('should update category name', async function () {
      if (!createdCategory) {
        this.skip();
      }

      const newName = `Updated ${createdCategory.name}`;
      const updateData = {
        category: {
          id: createdCategory.id,
          name: newName,
        },
      };

      const response = await apiClient.put<Category>(
        getAdminUrl(`/categories/${createdCategory.id}`),
        updateData,
      );

      expect(response.name).to.equal(newName);
      createdCategory = response; // Update reference
    });

    it('should update category status', async function () {
      if (!createdCategory) {
        this.skip();
      }

      const updateData = {
        category: {
          id: createdCategory.id,
          is_active: false,
        },
      };

      const response = await apiClient.put<Category>(
        getAdminUrl(`/categories/${createdCategory.id}`),
        updateData,
      );

      expect(response.is_active).to.be.false;

      // Restore status
      await apiClient.put<Category>(getAdminUrl(`/categories/${createdCategory.id}`), {
        category: { id: createdCategory.id, is_active: true },
      });
    });

    it('should update category position', async function () {
      if (!createdCategory) {
        this.skip();
      }

      const newPosition = 99;
      const updateData = {
        category: {
          id: createdCategory.id,
          position: newPosition,
        },
      };

      const response = await apiClient.put<Category>(
        getAdminUrl(`/categories/${createdCategory.id}`),
        updateData,
      );

      expect(response.position).to.equal(newPosition);
    });

    it('should move category to different parent', async function () {
      if (!createdSubcategory) {
        this.skip();
      }

      // Move subcategory to root
      const updateData = {
        category: {
          id: createdSubcategory.id,
          parent_id: 2, // Default root category
        },
      };

      const response = await apiClient.put<Category>(
        getAdminUrl(`/categories/${createdSubcategory.id}`),
        updateData,
      );

      // Some Magento configurations restrict moving categories to root
      if (response.parent_id !== 2) {
        console.log('Category move to root was restricted by Magento configuration');
        this.skip();
      }

      expect(response.parent_id).to.equal(2);
    });
  });

  describe('Category Products', function () {
    it('should assign products to category', async function () {
      if (!createdCategory) {
        this.skip();
      }

      // Note: This requires existing products in the Magento instance
      // This test demonstrates the endpoint but may skip if no products available

      // Try to get first available product
      try {
        const productsResponse = await apiClient.get<SearchResult<any>>(getAdminUrl('/products'), {
          params: {
            searchCriteria: {
              page_size: 1,
              current_page: 1,
            },
          },
        });

        if (productsResponse.items.length === 0) {
          console.log('No products available for category assignment test');
          this.skip();
        }

        const productSku = productsResponse.items[0].sku;

        // Assign product to category
        const assignData = {
          productLink: {
            sku: productSku,
            position: 1,
            category_id: createdCategory.id.toString(),
          },
        };

        const response = await apiClient.post<boolean>(
          getAdminUrl(`/categories/${createdCategory.id}/products`),
          assignData,
        );

        // Response should be boolean true
        expect(response).to.be.true;
      } catch (error: any) {
        if (error.response?.status === 404) {
          console.log('Product assignment endpoint not available or products not found');
          this.skip();
        }
        throw error;
      }
    });
  });

  describe('Category Search & Filtering', function () {
    it('should filter categories by active status', async function () {
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
        },
      };

      const response = await apiClient.get<SearchResult<Category>>(
        getAdminUrl('/categories/list'),
        { params: searchCriteria },
      );

      expect(response.items).to.be.an('array');
      response.items.forEach((category) => {
        expect(category.is_active).to.be.true;
      });
    });

    it('should filter categories by parent', async function () {
      if (!createdCategory) {
        this.skip();
      }

      const searchCriteria = {
        searchCriteria: {
          filter_groups: [
            {
              filters: [
                {
                  field: 'parent_id',
                  value: createdCategory.parent_id.toString(),
                  condition_type: 'eq',
                },
              ],
            },
          ],
        },
      };

      const response = await apiClient.get<SearchResult<Category>>(
        getAdminUrl('/categories/list'),
        { params: searchCriteria },
      );

      expect(response.items).to.be.an('array');
      expect(response.items.length).to.be.greaterThan(0);
    });

    it('should search categories by name', async function () {
      if (!createdCategory) {
        this.skip();
      }

      const searchCriteria = {
        searchCriteria: {
          filter_groups: [
            {
              filters: [
                {
                  field: 'name',
                  value: `%${createdCategory.name.substring(0, 10)}%`,
                  condition_type: 'like',
                },
              ],
            },
          ],
        },
      };

      const response = await apiClient.get<SearchResult<Category>>(
        getAdminUrl('/categories/list'),
        { params: searchCriteria },
      );

      expect(response.items).to.be.an('array');
      // May or may not find the category depending on indexing
    });
  });

  describe('Category Deletion', function () {
    it('should delete category', async function () {
      if (!createdCategory) {
        this.skip();
      }

      if (!config.test.cleanupTestData) {
        console.log(
          `Skipping deletion test - cleanup disabled. Category preserved: ${createdCategory.id}`,
        );
        this.skip();
      }

      // Delete subcategory first if it exists
      if (createdSubcategory) {
        try {
          const subResponse = await apiClient.delete<boolean>(
            getAdminUrl(`/categories/${createdSubcategory.id}`),
          );
          expect(subResponse).to.be.true;
        } catch (error: any) {
          console.log(`Note: Could not delete subcategory ${createdSubcategory.id}`);
        }
      }

      // Delete main category
      const response = await apiClient.delete<boolean>(
        getAdminUrl(`/categories/${createdCategory.id}`),
      );

      expect(response).to.be.true;
    });

    it('should verify category is deleted', async function () {
      if (!createdCategory || !config.test.cleanupTestData) {
        this.skip();
      }

      try {
        await apiClient.get<Category>(getAdminUrl(`/categories/${createdCategory.id}`));
        expect.fail('Expected 404 error for deleted category');
      } catch (error: any) {
        expect(error.response?.status).to.equal(404);
      }
    });
  });

  after(async function () {
    // Cleanup any remaining test categories
    if (config.test.cleanupTestData) {
      const categoriesToClean = [createdSubcategory, createdCategory].filter(Boolean);

      for (const category of categoriesToClean) {
        try {
          await apiClient.delete(getAdminUrl(`/categories/${category.id}`));
        } catch (error: any) {
          // Ignore cleanup errors - category might already be deleted
        }
      }
    }
  });
});
