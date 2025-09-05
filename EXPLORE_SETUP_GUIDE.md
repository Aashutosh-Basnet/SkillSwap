# SkillSwap Explore/Matchmaking Setup Guide

## Issues Fixed

### 1. **404 Error on Token Generation**
- **Problem**: The explore page was trying to call backend API directly, but getting 404 errors
- **Solution**: Created Next.js API routes and fixed environment variable configuration

### 2. **Authentication Token Issues**
- **Problem**: Wrong token key being used (`token` instead of `authToken`)
- **Solution**: Fixed token retrieval to use the correct localStorage key

### 3. **Backend Connection Issues**
- **Problem**: Socket.io connection failing due to incorrect URL detection
- **Solution**: Improved environment variable detection and fallback logic

## Environment Setup

### 1. Client Environment Variables

Create `client/.env.local`:
```env
# Backend server URL - used by Next.js API routes
BACKEND_URL=http://localhost:5000

# Public backend URL - used by client-side socket.io connections
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000

# Agora App ID for video calls (optional for development)
NEXT_PUBLIC_AGORA_APP_ID=your_agora_app_id_here
```

### 2. Server Environment Variables

Create `server/.env`:
```env
# MongoDB connection
MONGO_URI=mongodb://localhost:27017/skillswap

# JWT secret
JWT_SECRET=your_super_secure_jwt_secret_key_here

# Server configuration
PORT=5000
NODE_ENV=development

# CORS origins
FRONTEND_URL=http://localhost:3000
CORS_ORIGIN=http://localhost:3000

# Agora configuration (optional - will use mock tokens in development)
AGORA_APP_ID=your_agora_app_id_here
AGORA_APP_CERTIFICATE=your_agora_app_certificate_here

# FastAPI recommendation service (optional)
RECOMMENDATION_API_URL=http://localhost:8000
```

### 3. FastAPI Environment Variables

Create `fastAPI/.env`:
```env
# Database configuration
DATABASE_URL=mongodb://localhost:27017/skillswap
```

## Starting the Services

### Start all services in this order:

1. **MongoDB** (if using local MongoDB):
   ```bash
   mongod
   ```

2. **FastAPI Recommendation Service** (optional):
   ```bash
   cd fastAPI
   python -m venv venv
   # Windows:
   venv\Scripts\activate
   # Mac/Linux:
   source venv/bin/activate
   
   pip install -r requirements.txt
   python start.py
   ```

3. **Backend Server**:
   ```bash
   cd server
   npm install
   npm start
   ```

4. **Frontend Client**:
   ```bash
   cd client
   npm install
   npm run dev
   ```

## Testing the Explore Feature

### 1. Prerequisites
- Must be logged in with a valid account
- Backend server must be running on port 5000
- Frontend must be running on port 3000

### 2. Test Steps
1. Navigate to `/explore` page
2. Check connection status indicator (should show "Connected")
3. Click "Find a Match" button
4. Wait for match (may need another user or test with multiple browser tabs)
5. When matched, video call interface should appear

### 3. Debug Information
The browser console will show detailed logs:
- `🔗 Connecting to backend:` - Shows which backend URL is being used
- Socket connection status messages
- Token generation logs
- Match found events

## Common Issues & Solutions

### Issue: "Failed to connect to server"
**Solutions:**
1. Check if backend server is running: `curl http://localhost:5000/health`
2. Verify environment variables are set correctly
3. Check browser console for specific error messages

### Issue: "No authentication token found"
**Solutions:**
1. Make sure you're logged in
2. Check localStorage for `authToken` key
3. Try logging out and logging back in

### Issue: Socket connection fails
**Solutions:**
1. Verify CORS configuration in server
2. Check if ports 3000 and 5000 are available
3. Ensure firewall isn't blocking connections

### Issue: Video call doesn't work
**Note:** The video calling will use mock tokens in development mode. For production, you need to configure Agora credentials.

## Architecture Overview

```
Frontend (Next.js :3000)
├── /explore page
├── Socket.io client ──────┐
├── /api/explore/token ─────┤
└── /api/user/profile ──────┤
                            │
Backend (Express :5000) ────┘
├── Socket.io server
├── /api/explore/token
├── /api/user/profile
└── Matchmaking logic
                            │
FastAPI (:8000) ────────────┘
└── AI recommendation system
```

## Next Steps

1. **Configure Agora** for real video calling (optional)
2. **Set up MongoDB** for data persistence
3. **Deploy FastAPI** for intelligent matching (optional)
4. **Test with multiple users** for full matchmaking experience

The system will work with mock data and random matching even without the optional components.
