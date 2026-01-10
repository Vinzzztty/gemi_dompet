import { post } from '@/lib/http';
import { setToken, setRefreshToken, clearToken } from '@/lib/auth';
import { API_ENDPOINTS } from '@/lib/constants';
import type { ApiResponse } from '@/types/api';

/**
 * Login Request
 */
export interface LoginRequest {
  email: string;
  password: string;
}

/**
 * Register Request
 */
export interface RegisterRequest {
  email: string;
  password: string;
  fullName: string;
}

/**
 * Auth Response
 */
export interface AuthResponse {
  token: string;
  refreshToken?: string;
  user: {
    id: string;
    email: string;
    fullName: string;
  };
}

/**
 * Auth Service
 * Handles authentication operations
 */
export class AuthService {
  /**
   * Login user
   */
  async login(credentials: LoginRequest): Promise<ApiResponse<AuthResponse>> {
    console.log('🔐 Login started with:', credentials.email);
    
    const response = await post<ApiResponse<AuthResponse>, LoginRequest>(
      API_ENDPOINTS.LOGIN,
      credentials
    );

    console.log('📥 Login API response:', {
      success: response.success,
      hasData: !!response.data,
      dataKeys: response.data ? Object.keys(response.data) : [],
      token: response.data?.token ? 'EXISTS (length: ' + response.data.token.length + ')' : 'MISSING',
    });

    // Store tokens if login successful
    if (response.success && response.data) {
      console.log('✅ Login successful - About to save token...');
      console.log('Token to save:', response.data.token?.substring(0, 20) + '...');
      
      setToken(response.data.token);
      
      console.log('💾 After setToken - Verifying storage:');
      console.log('  localStorage.auth_token:', localStorage.getItem('auth_token'));
      console.log('  All keys:', Object.keys(localStorage));
      
      if (response.data.refreshToken) {
        setRefreshToken(response.data.refreshToken);
      }
    } else {
      console.error('❌ Login failed:', response);
    }

    return response;
  }

  /**
   * Register new user
   */
  async register(data: RegisterRequest): Promise<ApiResponse<AuthResponse>> {
    const response = await post<ApiResponse<AuthResponse>, RegisterRequest>(
      API_ENDPOINTS.REGISTER,
      data
    );

    // Store tokens if registration successful
    if (response.success && response.data) {
      setToken(response.data.token);
      if (response.data.refreshToken) {
        setRefreshToken(response.data.refreshToken);
      }
    }

    return response;
  }

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    try {
      await post(API_ENDPOINTS.LOGOUT);
    } catch (error) {
      // Continue with logout even if API call fails
      console.error('Logout error:', error);
    } finally {
      clearToken();
    }
  }
}

// Export singleton instance
export const authService = new AuthService();
