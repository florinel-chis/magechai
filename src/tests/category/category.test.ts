import { expect } from 'chai';
import { ApiClient } from '../../utils/api-client';
import { CategoryDataGenerator } from '../../data-generators/category';
import { getAdminUrl, config } from '../../config';
import { getAdminToken } from '../../utils/test-helpers';
import { Category } from '../../types';

describe('Category API Tests', function () {
  this.timeout(15000);

  let apiClient: ApiClient;
  let parentCategory: Category;
  let childCategory: Category;

  before(async function () {
    apiClient = new ApiClient();
    const adminToken = await getAdminToken();
    apiClient.setAuthToken(adminToken);
  });

  describe('Category Creation', function () {
    it('should create a new category', async function () {
      const categoryData = CategoryDataGenerator.generateCategory();

      const response = await apiClient.post<Category>(getAdminUrl('/categories'), categoryData);

      expect(response).to.be.an('object');
      expect(response.id).to.be.a('number');
      expect(response.name).to.equal(categoryData.category.name);
      expect(response.parent_id).to.equal(2);
      expect(response.is_active).to.equal(true);
      expect(response.include_in_menu).to.equal(true);

      parentCategory = response;
    });

    it('should create a subcategory', async function () {
      if (!parentCategory) {
        this.skip();
      }

      const subcategoryData = CategoryDataGenerator.generateSubcategory(parentCategory.id);

      const response = await apiClient.post<Category>(getAdminUrl('/categories'), subcategoryData);

      expect(response).to.be.an('object');
      expect(response.id).to.be.a('number');
      expect(response.parent_id).to.equal(parentCategory.id);
      expect(response.name).to.equal(subcategoryData.category.name);

      childCategory = response;
    });
  });

  describe('Category Retrieval', function () {
    it('should get category by ID', async function () {
      if (!parentCategory) {
        this.skip();
      }

      const response = await apiClient.get<Category>(
        getAdminUrl(`/categories/${parentCategory.id}`),
      );

      expect(response).to.be.an('object');
      expect(response.id).to.equal(parentCategory.id);
      expect(response.name).to.equal(parentCategory.name);
      expect(response.is_active).to.equal(true);
    });

    it('should get category tree', async function () {
      const response = await apiClient.get<Category>(getAdminUrl('/categories'));

      expect(response).to.be.an('object');
      expect(response.id).to.be.a('number');
      expect(response.children_data).to.be.an('array');
      // Root category (id=1) should have children including Default Category (id=2)
      expect(response.children_data!.length).to.be.greaterThan(0);
    });
  });

  describe('Category Update and Deletion', function () {
    it('should update category name and status', async function () {
      if (!parentCategory) {
        this.skip();
      }

      const updatedName = `Updated ${parentCategory.name}`;
      const response = await apiClient.put<Category>(
        getAdminUrl(`/categories/${parentCategory.id}`),
        {
          category: {
            name: updatedName,
            is_active: false,
          },
        },
      );

      expect(response.name).to.equal(updatedName);
      expect(response.is_active).to.equal(false);

      // Update local reference for cleanup
      parentCategory = response;
    });

    it('should delete category', async function () {
      if (!parentCategory) {
        this.skip();
      }

      if (!config.test.cleanupTestData) {
        console.log(`Skipping deletion - cleanup disabled. Category ID: ${parentCategory.id}`);
        this.skip();
      }

      // Delete child first to avoid constraint errors
      if (childCategory) {
        const childResult = await apiClient.delete<boolean>(
          getAdminUrl(`/categories/${childCategory.id}`),
        );
        expect(childResult).to.equal(true);
        childCategory = undefined as any;
      }

      const result = await apiClient.delete<boolean>(
        getAdminUrl(`/categories/${parentCategory.id}`),
      );
      expect(result).to.equal(true);
    });
  });

  after(async function () {
    if (!config.test.cleanupTestData) {
      if (parentCategory) {
        console.log(`Test data preserved. Category ID: ${parentCategory.id}`);
      }
      return;
    }

    // Clean up remaining categories (child first, then parent)
    if (childCategory) {
      try {
        await apiClient.delete(getAdminUrl(`/categories/${childCategory.id}`));
      } catch (_error: any) {
        // Ignore - may already be deleted
      }
    }
    if (parentCategory) {
      try {
        await apiClient.delete(getAdminUrl(`/categories/${parentCategory.id}`));
      } catch (_error: any) {
        // Ignore - may already be deleted
      }
    }
  });
});
