import axios, { AxiosInstance, AxiosError } from 'axios';
import { getToken, clearToken } from './auth';

// Create axios instance with base configuration
const api: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || '/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - automatically add JWT token
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Handle 401 Unauthorized
    if (error.response?.status === 401) {
      clearToken();
      // Don't auto-redirect - let components handle auth errors
      console.warn('Authentication failed - token cleared');
    }

    // Handle other errors
    const errorMessage = 
      (error.response?.data as any)?.message || 
      error.message || 
      'An error occurred';

    // Return a formatted error
    return Promise.reject({
      status: error.response?.status,
      message: errorMessage,
      data: error.response?.data,
    });
  }
);

export default api;
