import { faker } from '@faker-js/faker';
import { CategoryCreate } from '../types';

export class CategoryDataGenerator {
  static generateCategory(overrides?: Partial<CategoryCreate['category']>): CategoryCreate {
    return {
      category: {
        name: `Test Category ${faker.string.alphanumeric(6)}`,
        parent_id: 2, // Default Category
        is_active: true,
        include_in_menu: true,
        ...overrides,
      },
    };
  }

  static generateSubcategory(
    parentId: number,
    overrides?: Partial<CategoryCreate['category']>,
  ): CategoryCreate {
    return this.generateCategory({
      parent_id: parentId,
      name: `Test Subcategory ${faker.string.alphanumeric(6)}`,
      ...overrides,
    });
  }
}
