/**
 * Logout utility function
 * Clears authentication data from localStorage.
 */
export function logout() {
    clearAuthData();
    // No redirect here, components should handle navigation after logout
}

/**
 * Clears authentication data (token and user) from localStorage.
 */
export function clearAuthData() {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }
}

/**
 * Handles authentication errors, specifically 401 Unauthorized.
 * Clears invalid/expired token and logs a warning.
 * @param error The error object, potentially from an API response.
 */
export function handleAuthError(error: any): void {
  if (error.response?.status === 401) {
    // Clear invalid/expired token
    clearAuthData();
    // Don't auto-redirect - let components handle it
    console.warn('Auth error - token cleared. Please login again.');
  }
}

/**
 * Get current authenticated user from localStorage
 * @returns User object or null if not authenticated
 */
export function getCurrentUser() {
    if (typeof window !== 'undefined') {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            try {
                return JSON.parse(userStr);
            } catch (error) {
                console.error('Error parsing user data:', error);
                return null;
            }
        }
    }
    return null;
}

/**
 * Check if user is authenticated
 * @returns boolean
 */
export function isAuthenticated(): boolean {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        return !!token;
    }
    return false;
}

/**
 * Get authentication token
 * @returns JWT token or null
 */
export function getToken(): string | null {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('token');
    }
    return null;
}
