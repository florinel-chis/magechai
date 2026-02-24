import { faker } from '@faker-js/faker';
import { SalesRule, Coupon } from '../types';

export class CouponDataGenerator {
  /**
   * Generate a percentage discount sales rule
   */
  static generatePercentageDiscountRule(overrides: Partial<SalesRule> = {}): Partial<SalesRule> {
    const timestamp = Date.now();

    return {
      name: overrides.name || `${faker.lorem.words(2)} Discount ${timestamp}`,
      description: overrides.description || faker.lorem.sentence(),
      is_active: overrides.is_active !== undefined ? overrides.is_active : true,
      simple_action: 'by_percent',
      discount_amount: overrides.discount_amount || faker.number.int({ min: 10, max: 50 }),
      coupon_type: overrides.coupon_type || 'specific_coupon',
      use_auto_generation: false,
      uses_per_customer: overrides.uses_per_customer || 1,
      uses_per_coupon: overrides.uses_per_coupon || 100,
      website_ids: overrides.website_ids || [1],
      customer_group_ids: overrides.customer_group_ids || [0, 1, 2, 3], // All groups
      stop_rules_processing: false,
      sort_order: overrides.sort_order || 0,
      ...overrides,
    };
  }

  /**
   * Generate a fixed amount discount sales rule
   */
  static generateFixedDiscountRule(overrides: Partial<SalesRule> = {}): Partial<SalesRule> {
    const timestamp = Date.now();

    return {
      name: overrides.name || `Fixed ${faker.lorem.word()} Discount ${timestamp}`,
      description: overrides.description || faker.lorem.sentence(),
      is_active: overrides.is_active !== undefined ? overrides.is_active : true,
      simple_action: 'by_fixed',
      discount_amount: overrides.discount_amount || faker.number.int({ min: 5, max: 25 }),
      coupon_type: overrides.coupon_type || 'specific_coupon',
      use_auto_generation: false,
      uses_per_customer: overrides.uses_per_customer || 1,
      uses_per_coupon: overrides.uses_per_coupon || 100,
      website_ids: overrides.website_ids || [1],
      customer_group_ids: overrides.customer_group_ids || [0, 1, 2, 3],
      stop_rules_processing: false,
      sort_order: overrides.sort_order || 0,
      ...overrides,
    };
  }

  /**
   * Generate a free shipping sales rule
   */
  static generateFreeShippingRule(overrides: Partial<SalesRule> = {}): Partial<SalesRule> {
    const timestamp = Date.now();

    return {
      name: overrides.name || `Free Shipping ${timestamp}`,
      description: overrides.description || 'Free shipping on all orders',
      is_active: overrides.is_active !== undefined ? overrides.is_active : true,
      simple_action: 'by_percent',
      discount_amount: 0,
      coupon_type: overrides.coupon_type || 'specific_coupon',
      simple_free_shipping: '1',
      use_auto_generation: false,
      uses_per_customer: overrides.uses_per_customer || 1,
      uses_per_coupon: overrides.uses_per_coupon || 100,
      website_ids: overrides.website_ids || [1],
      customer_group_ids: overrides.customer_group_ids || [0, 1, 2, 3],
      stop_rules_processing: false,
      sort_order: overrides.sort_order || 0,
      ...overrides,
    };
  }

  /**
   * Generate a buy X get Y free sales rule
   */
  static generateBuyXGetYRule(overrides: Partial<SalesRule> = {}): Partial<SalesRule> {
    const timestamp = Date.now();

    return {
      name: overrides.name || `Buy X Get Y ${timestamp}`,
      description: overrides.description || 'Buy X get Y free',
      is_active: overrides.is_active !== undefined ? overrides.is_active : true,
      simple_action: 'buy_x_get_y',
      discount_amount: overrides.discount_amount || 100, // 100% discount on Y items
      discount_qty: overrides.discount_qty || 1, // Number of Y items
      discount_step: overrides.discount_step || 2, // Buy X items
      coupon_type: overrides.coupon_type || 'specific_coupon',
      use_auto_generation: false,
      uses_per_customer: overrides.uses_per_customer || 5,
      uses_per_coupon: overrides.uses_per_coupon || 100,
      website_ids: overrides.website_ids || [1],
      customer_group_ids: overrides.customer_group_ids || [0, 1, 2, 3],
      stop_rules_processing: false,
      sort_order: overrides.sort_order || 0,
      ...overrides,
    };
  }

  /**
   * Generate a time-limited sales rule
   */
  static generateTimeLimitedRule(
    fromDate: Date,
    toDate: Date,
    overrides: Partial<SalesRule> = {},
  ): Partial<SalesRule> {
    return this.generatePercentageDiscountRule({
      from_date: fromDate.toISOString().split('T')[0],
      to_date: toDate.toISOString().split('T')[0],
      ...overrides,
    });
  }

  /**
   * Generate a coupon code
   */
  static generateCoupon(ruleId: number, overrides: Partial<Coupon> = {}): Partial<Coupon> {
    const code = overrides.code || `SAVE${faker.string.alphanumeric(6).toUpperCase()}`;

    return {
      rule_id: ruleId,
      code,
      usage_limit: overrides.usage_limit || 100,
      usage_per_customer: overrides.usage_per_customer || 1,
      times_used: overrides.times_used || 0,
      is_primary: overrides.is_primary !== undefined ? overrides.is_primary : true,
      ...overrides,
    };
  }

  /**
   * Generate a coupon code with expiration
   */
  static generateExpiringCoupon(
    ruleId: number,
    expirationDate: Date,
    overrides: Partial<Coupon> = {},
  ): Partial<Coupon> {
    return this.generateCoupon(ruleId, {
      expiration_date: expirationDate.toISOString().split('T')[0],
      ...overrides,
    });
  }

  /**
   * Generate a simple coupon code string
   */
  static generateCouponCode(prefix = 'SAVE'): string {
    return `${prefix}${faker.string.alphanumeric(6).toUpperCase()}`;
  }
}
