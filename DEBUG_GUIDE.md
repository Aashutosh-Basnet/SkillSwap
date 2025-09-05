# SkillSwap Debug Guide

## Current Issues
- ❌ Video not working
- ❌ Chat not working 

## Step-by-Step Debugging

### 1. Port Forwarding Setup (CRITICAL)

**You MUST have port 5000 forwarded in VS Code:**

1. Press `Ctrl+Shift+P`
2. Type "Ports: Focus on Ports View"  
3. Click "Forward a Port"
4. Enter `5000`
5. Right-click the forwarded port → "Port Visibility" → "Public"
6. **Copy the generated URL** (should be `https://w6wx6d25-5000.inc1.devtunnels.ms`)

### 2. Test Server Connection

Open browser to: `https://w6wx6d25-5000.inc1.devtunnels.ms/health`

**Expected response:**
```json
{"message":"Server is running with sliding expiration enabled"}
```

If this fails, port forwarding is not working.

### 3. Test Matchmaking

1. Open **TWO separate browser windows** to your client URL
2. **Open browser console** (F12) in both windows
3. Click "Find a Match" in both windows

**Expected logs:**
```
Connecting to backend: https://w6wx6d25-5000.inc1.devtunnels.ms
Socket connected successfully
Fetching token from: https://w6wx6d25-5000.inc1.devtunnels.ms/api/explore/token
```

### 4. Test Chat

After matching:
1. Type a message in one window
2. Check browser console for:
   ```
   VideoCall socket connected
   Joined chat room: [room-id]
   Sending chat message: {text: "hello", ...}
   ```

**Server should show:**
```
Socket [id] joined room [room-id]
Message in room [room-id] from [socket-id]: hello
```

## Common Issues & Fixes

### Issue: "Failed to fetch" errors
**Fix:** Port 5000 not forwarded. Follow step 1 above.

### Issue: Chat not working
**Fix:** Check browser console - socket connection should show "VideoCall socket connected"

### Issue: Video not working
**Fix:** Expected - we're using mock tokens. For real video, need Agora credentials.

## Environment Setup

Create `.env` in server directory:
```bash
PORT=5000
FRONTEND_URL=https://w6wx6d25-3000.inc1.devtunnels.ms
```

Create `.env.local` in client directory:
```bash
NEXT_PUBLIC_BACKEND_URL=https://w6wx6d25-5000.inc1.devtunnels.ms
```

## Quick Test Commands

**Test server locally:**
```bash
curl http://localhost:5000/health
```

**Test server via tunnel:**
```bash
curl https://w6wx6d25-5000.inc1.devtunnels.ms/health
```

Both should return the same JSON response.

## What Should Work Now

✅ Matchmaking (finding partners)
✅ Chat messaging between matched users  
✅ Audio (with microphone permissions)
⚠️ Video (mock mode - shows camera unavailable)

For full video calling, you need Agora credentials in production.
