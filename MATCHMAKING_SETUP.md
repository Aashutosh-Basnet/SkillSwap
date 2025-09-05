# SkillSwap Matchmaking Setup Guide

## Quick Start for Development

### 1. Environment Configuration

**Server (.env file in `/server` directory):**
```bash
PORT=5000
FRONTEND_URL=http://localhost:3000
MONGODB_URI=mongodb://localhost:27017/skillswap
JWT_SECRET=your_jwt_secret_key_here

# Optional - for production video calls
AGORA_APP_ID=your_agora_app_id_here
AGORA_APP_CERTIFICATE=your_agora_app_certificate_here
```

**Client (.env.local file in `/client` directory):**
```bash
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000

# Optional - for production video calls  
NEXT_PUBLIC_AGORA_APP_ID=your_agora_app_id_here
```

### 2. Development Mode (Works without Agora)

The app now works in development mode without Agora credentials:

1. **Start the server:**
   ```bash
   cd server
   npm install
   npm run dev
   ```

2. **Start the client:**
   ```bash
   cd client
   npm install
   npm run dev
   ```

3. **Test matchmaking:**
   - Open two browser windows to `http://localhost:3000/explore`
   - Click "Find a Match" in both windows
   - The app will match users and provide mock video functionality

### 3. Production Setup (Full Video Calls)

For full video calling functionality:

1. **Get Agora Credentials:**
   - Sign up at [Agora.io](https://www.agora.io/)
   - Create a new project
   - Get your App ID and App Certificate

2. **Configure Environment Variables:**
   - Add the Agora credentials to your environment files
   - Restart both server and client

## Features Fixed

✅ **Socket Connection Issues** - Improved error handling and connection status
✅ **Matchmaking Logic** - Prevents duplicate queue entries and handles disconnections
✅ **Token Generation** - Works with or without Agora credentials
✅ **User Feedback** - Shows connection status and error messages
✅ **Development Mode** - Works out of the box for testing

## Troubleshooting

### "Not connected to server"
- Check if the server is running on port 5000
- Verify `NEXT_PUBLIC_BACKEND_URL` in client environment

### "Failed to get video token"
- Normal in development mode without Agora credentials
- Add Agora credentials for full video functionality

### Users not matching
- Ensure both users are connected (green status indicator)
- Check server logs for matchmaking events
- Refresh page if connection is lost

## Architecture

- **Socket.io** handles real-time matchmaking
- **Agora** provides video calling (optional in dev mode)
- **Express** serves the REST API for token generation
- **Next.js** provides the client interface
