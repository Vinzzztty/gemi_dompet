/**
 * API Endpoints
 */
export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  LOGOUT: '/auth/logout',
  REFRESH: '/auth/refresh',

  // Categories
  CATEGORIES: '/categories',
  
  // Income
  INCOME: '/income',
  
  // Expense (for future use)
  EXPENSE: '/expense',
  
  // User
  USER: '/user',
  PROFILE: '/user/profile',
} as const;

/**
 * App Configuration
 */
export const APP_CONFIG = {
  APP_NAME: 'DompetKu',
  API_TIMEOUT: 30000,
  ITEMS_PER_PAGE: 10,
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
} as const;

/**
 * Transaction Types
 */
export const TRANSACTION_TYPES = {
  INCOME: 'income',
  EXPENSE: 'expense',
} as const;

export type TransactionType = typeof TRANSACTION_TYPES[keyof typeof TRANSACTION_TYPES];

/**
 * Category Types
 */
export const CATEGORY_TYPES = {
  INCOME: 'INCOME',
  EXPENSE: 'EXPENSE',
} as const;

export type CategoryType = typeof CATEGORY_TYPES[keyof typeof CATEGORY_TYPES];

/**
 * HTTP Status Codes
 */
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;

/**
 * Local Storage Keys
 */
export const STORAGE_KEYS = {
  TOKEN: 'auth_token',
  REFRESH_TOKEN: 'refresh_token',
  USER: 'user_data',
} as const;
