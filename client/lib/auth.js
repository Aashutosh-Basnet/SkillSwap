// Client-side authentication utility for handling sliding expiration tokens

class AuthService {
  constructor() {
    this.tokenKey = 'authToken';
    // Use Next.js API routes instead of direct backend calls
    this.baseURL = '/api';
  }

  // Store token in localStorage
  setToken(token) {
    localStorage.setItem(this.tokenKey, token);
  }

  // Get token from localStorage
  getToken() {
    return localStorage.getItem(this.tokenKey);
  }

  // Remove token from localStorage
  removeToken() {
    localStorage.removeItem(this.tokenKey);
  }

  // Check if user is authenticated
  isAuthenticated() {
    const token = this.getToken();
    if (!token) return false;

    try {
      // Decode token to check expiration (basic check, server will validate)
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      
      // If token is expired, remove it
      if (payload.exp < currentTime) {
        this.removeToken();
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error checking token:', error);
      this.removeToken();
      return false;
    }
  }

  // Make authenticated API request with sliding expiration handling
  async makeAuthenticatedRequest(url, options = {}) {
    const token = this.getToken();
    
    if (!token) {
      throw new Error('No authentication token available');
    }

    const requestOptions = {
      ...options,
      headers: {
        ...options.headers,
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    };

    try {
      const response = await fetch(`${this.baseURL}${url}`, requestOptions);
      
      // Check for new token in response headers (sliding expiration)
      const newToken = response.headers.get('X-New-Token');
      if (newToken) {
        console.log('Token refreshed automatically');
        this.setToken(newToken);
      }

      // Handle different response statuses
      if (response.status === 401 || response.status === 403) {
        // Token is invalid or expired, remove it
        this.removeToken();
        throw new Error('Authentication failed');
      }

      return response;
    } catch (error) {
      console.error('Authenticated request failed:', error);
      throw error;
    }
  }

  // Login method
  async login(username, password) {
    try {
      const response = await fetch(`${this.baseURL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        this.setToken(data.token);
        return { success: true, user: data.user };
      } else {
        return { success: false, message: data.message, error: data.error };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'Network error during login' };
    }
  }

  // Register method
  async register(userData) {
    try {
      const response = await fetch(`${this.baseURL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (response.ok) {
        this.setToken(data.token);
        return { success: true, user: data.user };
      } else {
        return { success: false, message: data.message, error: data.error };
      }
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, message: 'Network error during registration' };
    }
  }

  // Logout method
  async logout() {
    try {
      // Call logout endpoint (optional, since JWT is stateless)
      await this.makeAuthenticatedRequest('/auth/logout', { method: 'POST' });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Always remove token from client storage
      this.removeToken();
    }
  }

  // Get current user info from token
  getCurrentUser() {
    const token = this.getToken();
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return {
        id: payload.id,
        username: payload.username,
        exp: payload.exp,
        iat: payload.iat,
      };
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }
}

// Export singleton instance
const authService = new AuthService();
export default authService; 