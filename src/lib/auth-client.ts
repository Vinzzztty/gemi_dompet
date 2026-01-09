/**
 * Logout utility function
 * Clears authentication data from localStorage and redirects to login
 */
export function logout() {
    if (typeof window !== 'undefined') {
        // Clear auth data
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        // Redirect to login
        window.location.href = '/login';
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
