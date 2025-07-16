# SkillSwap Auth System Setup

## Overview
This setup creates a complete authentication system with login and register pages that match the provided design.

## Components Created/Updated

### Frontend (Next.js)
- **SidePanel.tsx** - Purple gradient side panel with steps
- **RegisterForm.tsx** - Registration form with validation
- **LoginForm.tsx** - Login form with validation
- **register/page.tsx** - Registration page layout
- **login/page.tsx** - Login page layout
- **API routes** - Proxy routes to backend server

### Backend (Express.js)
- **authController.js** - Login/register endpoints
- **auth.route.js** - Auth routes configuration

## Running the Application

### 1. Start the Backend Server
```bash
cd server
npm install
npm start
```
The server will run on `http://localhost:5000`

### 2. Start the Frontend Client
```bash
cd client
npm install
npm run dev
```
The client will run on `http://localhost:3000`

### 3. Access the Pages
- Register: `http://localhost:3000/register`
- Login: `http://localhost:3000/login`

## Features Implemented

### Authentication Flow
- ✅ User registration with validation
- ✅ User login with validation
- ✅ JWT token generation
- ✅ Error handling and display
- ✅ Form validation with Zod
- ✅ React Hook Form integration

### UI/UX Features
- ✅ Purple gradient side panel
- ✅ Dark theme design
- ✅ Responsive layout
- ✅ Social login buttons (UI only)
- ✅ Step indicators
- ✅ Form validation messages
- ✅ Loading states

### API Integration
- ✅ Frontend-backend connection
- ✅ Error handling
- ✅ Token storage
- ✅ CORS configuration

## Environment Variables
The client uses `http://localhost:5000` as the default backend URL. You can set `BACKEND_URL` in your environment if needed.

## Database Connection
Make sure your MongoDB connection is configured in the server's `.env` file for the authentication to work properly. 