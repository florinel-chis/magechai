import { faker } from '@faker-js/faker';
import { Category } from '../types';

export class CategoryDataGenerator {
  /**
   * Generate a basic category with required fields
   */
  static generateCategory(overrides: Partial<Category> = {}): Partial<Category> {
    const timestamp = Date.now();
    return {
      name: overrides.name || `Category ${faker.commerce.department()} ${timestamp}`,
      is_active: overrides.is_active !== undefined ? overrides.is_active : true,
      position: overrides.position || 1,
      level: overrides.level || 2,
      parent_id: overrides.parent_id || 2, // Default root category
      include_in_menu: overrides.include_in_menu !== undefined ? overrides.include_in_menu : true,
      custom_attributes: overrides.custom_attributes || [
        {
          attribute_code: 'url_key',
          value: overrides.name
            ? overrides.name.toLowerCase().replace(/\s+/g, '-')
            : `category-${faker.string.alphanumeric(8)}-${timestamp}`,
        },
        {
          attribute_code: 'display_mode',
          value: 'PRODUCTS',
        },
        {
          attribute_code: 'is_anchor',
          value: '1',
        },
      ],
      ...overrides,
    };
  }

  /**
   * Generate a subcategory with a specific parent
   */
  static generateSubcategory(
    parentId: number,
    overrides: Partial<Category> = {},
  ): Partial<Category> {
    return this.generateCategory({
      parent_id: parentId,
      level: 3,
      ...overrides,
    });
  }

  /**
   * Generate a root-level category
   */
  static generateRootCategory(overrides: Partial<Category> = {}): Partial<Category> {
    return this.generateCategory({
      parent_id: 2, // Default Magento root category
      level: 2,
      ...overrides,
    });
  }

  /**
   * Generate a disabled category
   */
  static generateDisabledCategory(overrides: Partial<Category> = {}): Partial<Category> {
    return this.generateCategory({
      is_active: false,
      ...overrides,
    });
  }

  /**
   * Generate a category with custom attributes
   */
  static generateCategoryWithAttributes(
    customAttributes: Array<{ attribute_code: string; value: string | number }>,
    overrides: Partial<Category> = {},
  ): Partial<Category> {
    const baseCategory = this.generateCategory(overrides);
    return {
      ...baseCategory,
      custom_attributes: [...(baseCategory.custom_attributes || []), ...customAttributes],
    };
  }
}
