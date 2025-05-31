import { faker } from '@faker-js/faker';
import { Product, StockItem } from '../types';

export class ProductDataGenerator {
  static generateSimpleProduct(overrides?: Partial<Product>): Product {
    const name = faker.commerce.productName();
    const sku = `SKU-${faker.string.alphanumeric(8).toUpperCase()}`;

    return {
      sku,
      name,
      attribute_set_id: 4, // Default attribute set
      price: parseFloat(faker.commerce.price({ min: 10, max: 1000 })),
      status: 1, // Enabled
      visibility: 4, // Catalog, Search
      type_id: 'simple',
      weight: faker.number.float({ min: 0.1, max: 10, fractionDigits: 2 }),
      extension_attributes: {
        stock_item: this.generateStockItem(),
      },
      custom_attributes: [
        {
          attribute_code: 'description',
          value: faker.commerce.productDescription(),
        },
        {
          attribute_code: 'short_description',
          value: faker.commerce.productAdjective() + ' ' + faker.commerce.product(),
        },
        {
          attribute_code: 'meta_title',
          value: name,
        },
        {
          attribute_code: 'meta_description',
          value: faker.commerce.productDescription(),
        },
        {
          attribute_code: 'url_key',
          value: `${name.toLowerCase().replace(/\s+/g, '-')}-${faker.string.alphanumeric(6).toLowerCase()}`,
        },
      ],
      ...overrides,
    };
  }

  static generateStockItem(overrides?: Partial<StockItem>): StockItem {
    return {
      qty: faker.number.int({ min: 10, max: 1000 }),
      is_in_stock: true,
      manage_stock: true,
      ...overrides,
    };
  }

  static generateConfigurableProduct(overrides?: Partial<Product>): Product {
    const product = this.generateSimpleProduct(overrides);
    product.type_id = 'configurable';
    product.extension_attributes = {
      ...product.extension_attributes,
      configurable_product_options: [
        {
          attribute_id: '93', // Color attribute
          label: 'Color',
          position: 0,
          is_use_default: true,
          values: [
            { value_index: 49 }, // Black
            { value_index: 50 }, // Blue
          ],
        },
        {
          attribute_id: '144', // Size attribute
          label: 'Size',
          position: 1,
          is_use_default: true,
          values: [
            { value_index: 166 }, // S
            { value_index: 167 }, // M
            { value_index: 168 }, // L
          ],
        },
      ],
    };
    return product;
  }

  static generateVirtualProduct(overrides?: Partial<Product>): Product {
    const product = this.generateSimpleProduct(overrides);
    product.type_id = 'virtual';
    delete product.weight;
    return product;
  }
}
