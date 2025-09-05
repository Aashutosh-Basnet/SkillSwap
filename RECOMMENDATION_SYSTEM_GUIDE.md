# SkillSwap Content-Based Recommendation System

## 🎯 Overview

I've implemented a sophisticated content-based recommendation system that intelligently matches users based on:

- **Learning Skills** ↔ **Teaching Skills** (complementary matching)
- **About sections** (text similarity using TF-IDF)
- **Common interests** (shared skills)
- **Previous meeting history** (avoids repeat matches)

## 🏗️ Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Next.js       │    │   Node.js        │    │   FastAPI       │
│   Client        │◄──►│   Server         │◄──►│   ML Service    │
│                 │    │                  │    │                 │
│ • Match Request │    │ • Socket.io      │    │ • Scikit-learn  │
│ • User Auth     │    │ • User Data      │    │ • NLTK          │
│ • Video/Chat    │    │ • Matchmaking    │    │ • TF-IDF        │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

## 🚀 Quick Start

### 1. Start the Recommendation API (FastAPI)

```bash
cd fastAPI
python start.py
```

This will:
- ✅ Install dependencies automatically
- ✅ Download NLTK data
- ✅ Start server on http://localhost:8000
- ✅ Provide API docs at http://localhost:8000/docs

### 2. Start the Node.js Server

```bash
cd server
npm run dev
```

### 3. Start the Client

```bash
cd client
npm run dev
```

### 4. Test the System

1. **Open two browser windows** to your client URL
2. **Login with different users** who have different skills
3. **Click "Find a Match"** - the system will now use AI-powered matching!

## 🧠 How It Works

### Content-Based Filtering Algorithm

1. **Skill Compatibility Scoring:**
   ```python
   # Complementary skills (high weight)
   learning_teaching_overlap = user_learning ∩ candidate_teaching
   teaching_learning_overlap = user_teaching ∩ candidate_learning
   
   # Common interests (lower weight)
   common_skills = (user_learning ∩ candidate_learning) + (user_teaching ∩ candidate_teaching)
   
   # Final skill score
   skill_score = (complementary_score * 2 + common_score * 0.3) / max_possible_matches
   ```

2. **Text Similarity (TF-IDF + Cosine Similarity):**
   ```python
   # Process "about" sections
   processed_text = preprocess_text(about_section)
   tfidf_vectors = TfidfVectorizer().fit_transform([text1, text2])
   similarity = cosine_similarity(tfidf_vectors[0], tfidf_vectors[1])
   ```

3. **Overall Compatibility:**
   ```python
   final_score = (skill_score * 0.8) + (text_similarity * 0.2)
   
   # Boost for complementary skills
   if has_complementary_skills:
       final_score *= 1.2
   ```

### Intelligent Matching Process

1. **User requests match** → Sends user ID to server
2. **Server calls FastAPI** → `/api/users/matches` with user profile
3. **FastAPI analyzes** → Compares with all users in database
4. **Returns ranked matches** → Sorted by compatibility score
5. **Server finds best available match** → From current waiting queue
6. **Creates match** → If compatibility > 0.3 threshold

## 📊 API Endpoints

### User Matching
```bash
POST /api/users/matches
{
  "user_id": "user123",
  "limit": 5,
  "exclude_previous": true
}
```

### Get User Profile
```bash
GET /api/users/profile/{user_id}
```

### Calculate Compatibility
```bash
POST /api/users/compatibility?user1_id=123&user2_id=456
```

### Skill Analytics
```bash
GET /api/skills/popular           # Most popular skills
GET /api/skills/supply-demand     # Supply vs demand analysis
GET /api/skills/categories        # Skills organized by category
GET /api/skills/recommendations/{user_id}  # Personalized skill suggestions
```

### System Stats
```bash
GET /api/users/stats              # Recommendation system statistics
```

## 🔧 Configuration

### Environment Variables

**Server (.env):**
```bash
RECOMMENDATION_API_URL=http://localhost:8000
```

**FastAPI:**
```bash
NODE_API_URL=http://localhost:5000/api
```

### Matching Parameters

- **Minimum Compatibility Threshold:** 0.3 (30%)
- **Skill Weight:** 80% of total score
- **Text Similarity Weight:** 20% of total score
- **Complementary Skills Boost:** 20% bonus

## 📈 Features

### ✅ Intelligent Matching
- Prioritizes users who can teach what you want to learn
- Considers users who want to learn what you can teach
- Factors in shared interests and personality (via about sections)

### ✅ Fallback System
- Falls back to random matching if:
  - No user data available
  - No compatible users in queue
  - Recommendation API is down

### ✅ Analytics & Insights
- Real-time compatibility scoring
- Skill supply/demand analysis
- Popular skills trending
- User recommendation statistics

### ✅ Match Quality Indicators
```javascript
// Client receives match type and score
socket.on("matchFound", ({ roomId, matchType, compatibilityScore }) => {
  if (matchType === "intelligent") {
    console.log(`Smart match found! Compatibility: ${compatibilityScore}`);
  }
});
```

## 🎨 User Experience

### Before (Random Matching)
- ❌ Users matched completely randomly
- ❌ No consideration of skills or interests
- ❌ High chance of mismatched conversations

### After (AI-Powered Matching)
- ✅ Users matched based on skill compatibility
- ✅ Higher quality conversations
- ✅ Mutual learning opportunities
- ✅ Personalized experience

## 🔍 Example Matching Scenarios

### Scenario 1: Perfect Complementary Match
```
User A: Wants to learn "Python", can teach "Guitar"
User B: Wants to learn "Guitar", can teach "Python"
→ Compatibility Score: 0.95 (Excellent match!)
```

### Scenario 2: Partial Overlap
```
User A: Wants to learn "Cooking", can teach "Math"
User B: Wants to learn "Math", can teach "Spanish"
→ Compatibility Score: 0.65 (Good match!)
```

### Scenario 3: Common Interests
```
User A: Wants to learn "Photography", can teach "Design"
User B: Wants to learn "Art", can teach "Photography"
About A: "Love creative arts and visual storytelling"
About B: "Passionate about visual arts and creativity"
→ Compatibility Score: 0.72 (Great match!)
```

## 🚨 Troubleshooting

### FastAPI Won't Start
```bash
cd fastAPI
pip install -r requirements.txt
python start.py
```

### No Intelligent Matches
- Check if users have filled out their profiles
- Verify FastAPI is running on port 8000
- Check server logs for API call errors

### Low Compatibility Scores
- Encourage users to fill out detailed profiles
- Add more specific skills
- Write descriptive "about" sections

## 🌟 Future Enhancements

- **Collaborative Filtering:** Learn from successful matches
- **Deep Learning:** Advanced text analysis with transformers
- **Real-time Learning:** Update preferences based on feedback
- **Multi-language Support:** Support for non-English profiles
- **Skill Embeddings:** Better understanding of skill relationships

The recommendation system is now live and will automatically provide better matches as users fill out more detailed profiles!
