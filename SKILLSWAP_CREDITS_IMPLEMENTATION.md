# SkillSwap Credits System Implementation

## Overview
Successfully implemented a credit-based system for SkillSwap that replaces the previous explore/matchmaking functionality with separate Learn and Teach sections.

## Key Features Implemented

### 1. Credit System
- **Initial Credits**: Every new user gets 5 SkillSwap credits upon registration
- **Learning Cost**: 1 credit is deducted when requesting to learn a skill
- **Teaching Reward**: 1 credit is earned when accepting a teaching session
- **Minimum Balance**: Users need at least 1 credit to request learning

### 2. Backend Changes

#### Updated User Model (`server/models/user.model.js`)
- Added `skillswap_credits` field with default value of 5

#### New Controllers
- **Learn Controller** (`server/controllers/learn.controller.js`):
  - `getAvailableTeachers()` - Find teachers for specific skills
  - `requestLearning()` - Deduct credits and process learning requests

- **Teach Controller** (`server/controllers/teach.controller.js`):
  - `getAvailableLearners()` - Find learners with credits for specific skills
  - `acceptTeaching()` - Award credits for teaching sessions
  - `getCreditBalance()` - Get current user credit balance

#### New Routes
- `/api/learn/teachers` - GET: Find available teachers
- `/api/learn/request` - POST: Request learning session
- `/api/teach/learners` - GET: Find available learners
- `/api/teach/accept` - POST: Accept teaching session
- `/api/teach/credits` - GET: Get credit balance

#### Updated Auth Controllers
- Login and registration now include `skillswap_credits` in user response

### 3. Frontend Changes

#### Updated Navigation (`client/app/components/Navbar.tsx`)
- Replaced "Explore" with "Learn" and "Teach" navigation items
- Added real-time credit balance display in navbar
- Shows credits in both desktop and mobile views

#### New Pages
- **Learn Page** (`client/app/learn/page.tsx`):
  - Search for teachers by skill
  - View teacher profiles and skills
  - Request learning sessions (costs 1 credit)
  - Real-time credit balance display

- **Teach Page** (`client/app/teach/page.tsx`):
  - Search for learners by skill
  - View learner profiles and desired skills
  - Accept teaching sessions (earns 1 credit)
  - Only shows learners with sufficient credits

#### Updated Profile Page
- Added SkillSwap credits display in user profile

#### API Routes (Frontend)
- `/api/learn/teachers` - Proxy to backend learn/teachers endpoint
- `/api/learn/request` - Proxy to backend learn/request endpoint
- `/api/teach/learners` - Proxy to backend teach/learners endpoint
- `/api/teach/accept` - Proxy to backend teach/accept endpoint
- `/api/teach/credits` - Proxy to backend teach/credits endpoint

### 4. User Experience Improvements

#### Credit Management
- Clear credit balance visibility throughout the app
- Insufficient credit warnings and handling
- Real-time credit updates after transactions

#### Skill-Based Matching
- Search functionality for specific skills
- Filter teachers/learners by skills they offer/want
- Only show available users (teachers who teach, learners with credits)

#### Responsive Design
- Mobile-friendly interfaces for all new pages
- Gradient designs consistent with app theme
- Loading states and error handling

## Migration Path
- Existing users will automatically get 5 credits added to their accounts
- The `/explore` route is kept for backward compatibility but replaced in navigation
- All new functionality is additive and doesn't break existing features

## Database Schema Changes
```javascript
// Added to user schema
skillswap_credits: {
    type: Number,
    required: true,
    default: 5,
    min: 0
}
```

## Usage Flow

### Learning Flow
1. User navigates to `/learn`
2. Searches for teachers by skill (optional)
3. Views available teachers and their skills
4. Clicks "Learn [Skill]" button (requires 1 credit)
5. Credit is deducted, teacher is notified
6. Credit balance updates in real-time

### Teaching Flow
1. User navigates to `/teach`
2. Searches for learners by skill (optional)
3. Views available learners (only those with credits)
4. Clicks "Teach [Skill]" button
5. Earns 1 credit, learner is notified
6. Credit balance updates in real-time

## Technical Stack Maintained
- **Backend**: Node.js, Express, MongoDB, Socket.io
- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **Authentication**: JWT with sliding expiration
- **API**: RESTful endpoints with proper error handling

The implementation maintains all existing functionality while adding the new credit-based learning/teaching system as requested.
