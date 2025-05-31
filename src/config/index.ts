import dotenv from 'dotenv';

dotenv.config();

export const config = {
  magento: {
    baseUrl: process.env.MAGENTO_BASE_URL || process.env.URL || 'http://magento.local',
    storeCode: process.env.MAGENTO_STORE_CODE || process.env.STORE_CODE || 'default',
    adminUsername: process.env.MAGENTO_ADMIN_USERNAME || 'admin',
    adminPassword: process.env.MAGENTO_ADMIN_PASSWORD || 'admin123',
  },
  test: {
    timeout: parseInt(process.env.TEST_TIMEOUT || '10000', 10),
    logLevel: process.env.LOG_LEVEL || 'info',
    cleanupTestData: process.env.CLEANUP_TEST_DATA === 'true', // Opt-in cleanup
  },
} as const;

export const getBaseUrl = (path: string = ''): string => {
  const base = config.magento.baseUrl.replace(/\/$/, '');
  const storePath = config.magento.storeCode === 'default' ? '' : `/${config.magento.storeCode}`;
  return `${base}${storePath}/rest/V1${path}`;
};

export const getAdminUrl = (path: string = ''): string => {
  const base = config.magento.baseUrl.replace(/\/$/, '');
  return `${base}/rest/V1${path}`;
};