import { expect } from 'chai';
import { ApiClient } from '../../utils/api-client';
import { CouponDataGenerator } from '../../data-generators/coupon';
import { getAdminUrl, config } from '../../config';
import { getAdminToken } from '../../utils/test-helpers';
import { SalesRule, Coupon, SearchResult } from '../../types';

describe('Promotions API Tests', function () {
  this.timeout(20000);

  let apiClient: ApiClient;
  let createdRule: SalesRule;
  let createdCoupon: Coupon;

  before(async function () {
    apiClient = new ApiClient();
    const adminToken = await getAdminToken();
    apiClient.setAuthToken(adminToken);
  });

  describe('Sales Rule Management', function () {
    it('should create a percentage discount sales rule', async function () {
      const ruleData = CouponDataGenerator.generatePercentageDiscountRule();

      const response = await apiClient.post<SalesRule>(getAdminUrl('/salesRules'), {
        rule: ruleData,
      });

      expect(response).to.be.an('object');
      expect(response.rule_id).to.be.a('number');
      expect(response.name).to.equal(ruleData.name);
      expect(response.simple_action).to.equal('by_percent');
      expect(response.is_active).to.be.true;

      createdRule = response;
    });

    it('should create a fixed amount discount sales rule', async function () {
      const ruleData = CouponDataGenerator.generateFixedDiscountRule();

      const response = await apiClient.post<SalesRule>(getAdminUrl('/salesRules'), {
        rule: ruleData,
      });

      expect(response).to.be.an('object');
      expect(response.rule_id).to.be.a('number');
      expect(response.simple_action).to.equal('by_fixed');

      if (config.test.cleanupTestData) {
        try {
          await apiClient.delete(getAdminUrl(`/salesRules/${response.rule_id}`));
        } catch (_error) {
          // Ignore cleanup errors
        }
      }
    });

    it('should get sales rule by ID', async function () {
      if (!createdRule) {
        this.skip();
      }

      const response = await apiClient.get<SalesRule>(
        getAdminUrl(`/salesRules/${createdRule.rule_id}`),
      );

      expect(response).to.be.an('object');
      expect(response.rule_id).to.equal(createdRule.rule_id);
      expect(response.name).to.equal(createdRule.name);
    });

    it('should search sales rules', async function () {
      if (!createdRule) {
        this.skip();
      }

      const searchCriteria = {
        searchCriteria: {
          filter_groups: [
            {
              filters: [
                {
                  field: 'name',
                  value: `%${createdRule.name.split(' ')[0]}%`,
                  condition_type: 'like',
                },
              ],
            },
          ],
          page_size: 10,
          current_page: 1,
        },
      };

      const response = await apiClient.get<SearchResult<SalesRule>>(
        getAdminUrl('/salesRules/search'),
        { params: searchCriteria },
      );

      expect(response.items).to.be.an('array');
      expect(response.total_count).to.be.at.least(1);

      const found = response.items.find((r) => r.rule_id === createdRule.rule_id);
      expect(found).to.exist;
    });

    it('should update sales rule', async function () {
      if (!createdRule) {
        this.skip();
      }

      const updatedName = `Updated ${createdRule.name}`;
      const updateData = {
        rule: {
          rule_id: createdRule.rule_id,
          name: updatedName,
          is_active: true,
          simple_action: createdRule.simple_action,
          discount_amount: createdRule.discount_amount,
          coupon_type: createdRule.coupon_type,
        },
      };

      const response = await apiClient.put<SalesRule>(
        getAdminUrl(`/salesRules/${createdRule.rule_id}`),
        updateData,
      );

      expect(response.name).to.equal(updatedName);
      createdRule = response;
    });
  });

  describe('Coupon Management', function () {
    it('should create a coupon for a sales rule', async function () {
      if (!createdRule) {
        this.skip();
      }

      const couponData = CouponDataGenerator.generateCoupon(createdRule.rule_id!);

      const response = await apiClient.post<Coupon>(getAdminUrl('/coupons'), {
        coupon: couponData,
      });

      expect(response).to.be.an('object');
      expect(response.coupon_id).to.be.a('number');
      expect(response.code).to.equal(couponData.code);
      expect(response.rule_id).to.equal(createdRule.rule_id);

      createdCoupon = response;
    });

    it('should get coupon by ID', async function () {
      if (!createdCoupon) {
        this.skip();
      }

      const response = await apiClient.get<Coupon>(
        getAdminUrl(`/coupons/${createdCoupon.coupon_id}`),
      );

      expect(response).to.be.an('object');
      expect(response.coupon_id).to.equal(createdCoupon.coupon_id);
      expect(response.code).to.equal(createdCoupon.code);
    });

    it('should search coupons by rule', async function () {
      if (!createdRule || !createdCoupon) {
        this.skip();
      }

      const searchCriteria = {
        searchCriteria: {
          filter_groups: [
            {
              filters: [
                {
                  field: 'rule_id',
                  value: createdRule.rule_id!.toString(),
                  condition_type: 'eq',
                },
              ],
            },
          ],
          page_size: 10,
          current_page: 1,
        },
      };

      const response = await apiClient.get<SearchResult<Coupon>>(getAdminUrl('/coupons/search'), {
        params: searchCriteria,
      });

      expect(response.items).to.be.an('array');
      expect(response.total_count).to.be.at.least(1);

      const found = response.items.find((c) => c.coupon_id === createdCoupon.coupon_id);
      expect(found).to.exist;
    });

    it('should update coupon', async function () {
      if (!createdCoupon) {
        this.skip();
      }

      const updatedCode = `UPD${Date.now()}`;
      const updateData = {
        coupon: {
          coupon_id: createdCoupon.coupon_id,
          rule_id: createdCoupon.rule_id,
          code: updatedCode,
        },
      };

      const response = await apiClient.put<Coupon>(
        getAdminUrl(`/coupons/${createdCoupon.coupon_id}`),
        updateData,
      );

      expect(response.code).to.equal(updatedCode);
      createdCoupon = response;
    });

    it('should delete coupon', async function () {
      if (!createdCoupon) {
        this.skip();
      }

      if (!config.test.cleanupTestData) {
        console.log(
          `Skipping coupon deletion - cleanup disabled. Coupon ID: ${createdCoupon.coupon_id}`,
        );
        this.skip();
      }

      const response = await apiClient.delete<boolean>(
        getAdminUrl(`/coupons/${createdCoupon.coupon_id}`),
      );

      expect(response).to.equal(true);
    });
  });

  describe('Cart Rule Application', function () {
    it('should list existing cart rules', async function () {
      const response = await apiClient.get<SearchResult<SalesRule>>(
        getAdminUrl('/salesRules/search'),
        {
          params: {
            searchCriteria: {
              page_size: 10,
              current_page: 1,
            },
          },
        },
      );

      expect(response.items).to.be.an('array');
      expect(response.total_count).to.be.a('number');
    });
  });

  after(async function () {
    if (!config.test.cleanupTestData) {
      if (createdRule) {
        console.log(`Test data preserved. Rule ID: ${createdRule.rule_id}`);
      }
      return;
    }

    if (createdCoupon) {
      try {
        await apiClient.delete(getAdminUrl(`/coupons/${createdCoupon.coupon_id}`));
      } catch (_error) {
        // Ignore
      }
    }

    if (createdRule) {
      try {
        await apiClient.delete(getAdminUrl(`/salesRules/${createdRule.rule_id}`));
      } catch (_error) {
        // Ignore
      }
    }
  });
});
