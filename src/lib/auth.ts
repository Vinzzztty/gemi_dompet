import jwt from 'jsonwebtoken';

// JWT Configuration
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

// JWT Payload Type
export interface JWTPayload {
  userId: string;
  email: string;
}

// Token storage key
const TOKEN_KEY = 'token'; // Changed from 'auth_token' to match actual localStorage key
const REFRESH_TOKEN_KEY = 'refresh_token';

/**
 * Get JWT token from localStorage
 */
export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

/**
 * Set JWT token to localStorage
 */
export function setToken(token: string): void {
  console.log('💾 setToken called with token:', token?.substring(0, 20) + '...');
  console.log('Window check:', typeof window !== 'undefined');
  
  if (typeof window === 'undefined') {
    console.warn('⚠️ Window is undefined - cannot save token');
    return;
  }
  
  localStorage.setItem(TOKEN_KEY, token);
  console.log('✅ Token saved! KEY:', TOKEN_KEY);
  console.log('✅ Verification:', localStorage.getItem(TOKEN_KEY)?.substring(0, 20) + '...');
}

/**
 * Get refresh token from localStorage
 */
export function getRefreshToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

/**
 * Set refresh token to localStorage
 */
export function setRefreshToken(token: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(REFRESH_TOKEN_KEY, token);
}

/**
 * Clear all auth tokens
 */
export function clearToken(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  return !!getToken();
}

/**
 * Parse JWT token to get payload
 */
export function parseToken(token?: string): any {
  try {
    const tokenToParse = token || getToken();
    if (!tokenToParse) return null;

    const base64Url = tokenToParse.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );

    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error parsing token:', error);
    return null;
  }
}

/**
 * Generate JWT token
 */
export function generateToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
}

/**
 * Get user ID from token
 */
export function getUserId(): string | null {
  const payload = parseToken();
  return payload?.userId || payload?.sub || null;
}

/**
 * Check if token is expired
 */
export function isTokenExpired(token?: string): boolean {
  try {
    const payload = parseToken(token);
    if (!payload || !payload.exp) return true;

    const currentTime = Date.now() / 1000;
    return payload.exp < currentTime;
  } catch (error) {
    return true;
  }
}
