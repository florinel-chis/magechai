import { faker } from '@faker-js/faker';
import { CmsPage, CmsBlock } from '../types';

export class CmsDataGenerator {
  /**
   * Generate a basic CMS page
   */
  static generateCmsPage(overrides: Partial<CmsPage> = {}): Partial<CmsPage> {
    const timestamp = Date.now();
    const title = overrides.title || `${faker.lorem.words(3)} ${timestamp}`;

    return {
      title,
      identifier: overrides.identifier || `page-${faker.string.alphanumeric(8)}-${timestamp}`,
      content: overrides.content || `
        <h1>${title}</h1>
        <p>${faker.lorem.paragraphs(3)}</p>
        <p>${faker.lorem.paragraphs(2)}</p>
      `,
      active: overrides.active !== undefined ? overrides.active : true,
      page_layout: overrides.page_layout || '1column',
      meta_title: overrides.meta_title || title,
      meta_keywords: overrides.meta_keywords || faker.lorem.words(5),
      meta_description: overrides.meta_description || faker.lorem.sentence(),
      content_heading: overrides.content_heading || title,
      sort_order: overrides.sort_order || 0,
      store_id: overrides.store_id || [0], // 0 = All Store Views
      ...overrides,
    };
  }

  /**
   * Generate a CMS page with rich HTML content
   */
  static generateRichCmsPage(overrides: Partial<CmsPage> = {}): Partial<CmsPage> {
    const timestamp = Date.now();
    const title = overrides.title || `${faker.lorem.words(3)} ${timestamp}`;

    return this.generateCmsPage({
      content: `
        <div class="cms-content">
          <h1>${title}</h1>
          <div class="intro">
            <p><strong>${faker.lorem.sentence()}</strong></p>
          </div>
          <div class="main-content">
            <h2>${faker.lorem.words(4)}</h2>
            <p>${faker.lorem.paragraphs(2)}</p>
            <ul>
              <li>${faker.lorem.sentence()}</li>
              <li>${faker.lorem.sentence()}</li>
              <li>${faker.lorem.sentence()}</li>
            </ul>
            <h2>${faker.lorem.words(4)}</h2>
            <p>${faker.lorem.paragraphs(2)}</p>
          </div>
        </div>
      `,
      ...overrides,
    });
  }

  /**
   * Generate an inactive CMS page
   */
  static generateInactiveCmsPage(overrides: Partial<CmsPage> = {}): Partial<CmsPage> {
    return this.generateCmsPage({
      active: false,
      ...overrides,
    });
  }

  /**
   * Generate a basic CMS block
   */
  static generateCmsBlock(overrides: Partial<CmsBlock> = {}): Partial<CmsBlock> {
    const timestamp = Date.now();
    const title = overrides.title || `${faker.lorem.words(2)} Block ${timestamp}`;

    return {
      title,
      identifier: overrides.identifier || `block-${faker.string.alphanumeric(8)}-${timestamp}`,
      content: overrides.content || `
        <div class="cms-block">
          <h3>${title}</h3>
          <p>${faker.lorem.paragraph()}</p>
        </div>
      `,
      active: overrides.active !== undefined ? overrides.active : true,
      store_id: overrides.store_id || [0], // 0 = All Store Views
      ...overrides,
    };
  }

  /**
   * Generate a promotional CMS block
   */
  static generatePromotionalBlock(overrides: Partial<CmsBlock> = {}): Partial<CmsBlock> {
    return this.generateCmsBlock({
      title: `Special Offer - ${Date.now()}`,
      content: `
        <div class="promotional-block">
          <h3>Special Offer!</h3>
          <p>${faker.lorem.sentence()}</p>
          <a href="#" class="button">Shop Now</a>
        </div>
      `,
      ...overrides,
    });
  }

  /**
   * Generate an inactive CMS block
   */
  static generateInactiveCmsBlock(overrides: Partial<CmsBlock> = {}): Partial<CmsBlock> {
    return this.generateCmsBlock({
      active: false,
      ...overrides,
    });
  }

  /**
   * Generate a CMS block for specific store view
   */
  static generateStoreSpecificBlock(storeId: number, overrides: Partial<CmsBlock> = {}): Partial<CmsBlock> {
    return this.generateCmsBlock({
      store_id: [storeId],
      ...overrides,
    });
  }
}
