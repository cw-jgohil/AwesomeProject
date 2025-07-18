import {
  API_BASE_URL,
  API_TIMEOUT,
  NODE_ENV,
  APP_NAME,
  APP_VERSION,
  ENABLE_BLUETOOTH,
  ENABLE_ANALYTICS,
  STORAGE_ACCESS_TOKEN,
  STORAGE_REFRESH_TOKEN,
  STORAGE_USER_DATA,
} from '@env';

// Environment configuration
export const ENV = {
  NODE_ENV: NODE_ENV || 'development',
  IS_DEV: NODE_ENV === 'development',
  IS_PROD: NODE_ENV === 'production',
} as const;

// API configuration
export const API_CONFIG = {
  BASE_URL: API_BASE_URL || 'http://localhost:8000',
  TIMEOUT: parseInt(API_TIMEOUT || '10000', 10),
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/users/login',
      REFRESH: '/users/refresh',
      LOGOUT: '/users/logout',
      ME: '/users/me',
    },
    USER: {
      PROFILE: '/users/profile',
      UPDATE: '/users/update',
      DELETE: '/users/delete',
    },
  },
} as const;

// App configuration
export const APP_CONFIG = {
  NAME: APP_NAME || 'AwesomeProject',
  VERSION: APP_VERSION || '0.0.1',
} as const;

// Feature flags
export const FEATURE_FLAGS = {
  ENABLE_BLUETOOTH: ENABLE_BLUETOOTH === 'true',
  ENABLE_ANALYTICS: ENABLE_ANALYTICS === 'true',
} as const;

// Storage keys
export const STORAGE_KEYS = {
  ACCESS_TOKEN: STORAGE_ACCESS_TOKEN || 'access_token',
  REFRESH_TOKEN: STORAGE_REFRESH_TOKEN || 'refresh_token',
  USER_DATA: STORAGE_USER_DATA || 'user_data',
} as const;

// Main configuration object
export const CONFIG = {
  ENV,
  API: API_CONFIG,
  APP: APP_CONFIG,
  FEATURES: FEATURE_FLAGS,
  STORAGE: STORAGE_KEYS,
} as const;

export default CONFIG; 