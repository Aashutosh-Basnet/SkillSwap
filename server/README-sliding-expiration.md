# Sliding Expiration Authentication Implementation

This implementation provides automatic token refresh using sliding expiration, ensuring users don't get logged out while actively using the application.

## How It Works

1. **Token Generation**: When a user logs in, a JWT token is generated with a 1-hour expiration
2. **Sliding Window**: If a token is within 15 minutes of expiration, the server automatically generates a new token
3. **Automatic Refresh**: New tokens are sent in the `X-New-Token` header and automatically stored by the client
4. **Seamless Experience**: Users never experience session timeouts during active use

## Server Configuration

### Environment Variables (.env)

```bash
# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-complex-at-least-32-characters
JWT_EXPIRES_IN=1h

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/skillswap

# Server Configuration
PORT=5000
NODE_ENV=development
```

### Key Components

1. **Middleware** (`middlewares/auth.middleware.js`):
   - Validates JWT tokens
   - Checks for sliding expiration
   - Automatically refreshes tokens when needed

2. **Auth Controller** (`controllers/authController.js`):
   - Handles login/register/logout
   - Uses utility functions for token generation
   - Returns structured error responses

3. **Utilities** (`utilities/asyncHandler.utility.js`):
   - Centralized token generation
   - Environment-based configuration
   - Helper functions for token validation

## Client-Side Usage

### Basic Usage with the AuthService

```javascript
import authService from '../lib/auth.js';

// Login
const result = await authService.login('username', 'password');
if (result.success) {
  console.log('Logged in successfully:', result.user);
} else {
  console.error('Login failed:', result.message);
}

// Make authenticated requests
try {
  const response = await authService.makeAuthenticatedRequest('/api/protected-route');
  const data = await response.json();
} catch (error) {
  console.error('Request failed:', error);
}

// Check authentication status
if (authService.isAuthenticated()) {
  console.log('User is authenticated');
}

// Logout
await authService.logout();
```

### React Hook Example

```javascript
import { useEffect, useState } from 'react';
import authService from '../lib/auth.js';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    const result = await authService.login(username, password);
    if (result.success) {
      setUser(result.user);
    }
    return result;
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  return {
    user,
    loading,
    login,
    logout,
    isAuthenticated: authService.isAuthenticated(),
  };
};
```

## Configuration Options

### Sliding Expiration Settings

You can modify these values in `utilities/asyncHandler.utility.js`:

```javascript
// Time before expiration to refresh token (in seconds)
const SLIDING_EXPIRATION_THRESHOLD = 15 * 60; // 15 minutes

// Token expiration time (can be set via environment variable)
const TOKEN_EXPIRATION_TIME = process.env.JWT_EXPIRES_IN || '1h';
```

### Security Considerations

1. **JWT Secret**: Use a strong, randomly generated secret (at least 32 characters)
2. **HTTPS**: Always use HTTPS in production to protect tokens in transit
3. **Token Storage**: Consider using secure HTTP-only cookies instead of localStorage for enhanced security
4. **Token Blacklisting**: For immediate logout, implement server-side token blacklisting

## Error Handling

The implementation provides structured error responses:

```javascript
// Common error codes
{
  "MISSING_TOKEN": "No token provided",
  "INVALID_TOKEN": "Token is invalid or malformed",
  "EXPIRED_TOKEN": "Token has expired",
  "USER_NOT_FOUND": "User does not exist",
  "INVALID_CREDENTIALS": "Wrong username/password",
  "USER_EXISTS": "User already exists",
  "VALIDATION_ERROR": "Required fields missing"
}
```

## Testing

Test the sliding expiration by:

1. Setting a short expiration time (e.g., 2 minutes)
2. Setting a short threshold (e.g., 30 seconds)
3. Making requests near the expiration time
4. Checking for the `X-New-Token` header in responses

## Monitoring

Monitor token refresh activity by checking server logs for:
```
Token refreshed for user: username
```

This helps track sliding expiration behavior and user activity patterns. 