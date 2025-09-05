from fastapi import APIRouter, HTTPException, Depends
from typing import List, Dict, Any
import time
import httpx
import os

from ..models.user import UserProfile, MatchRequest, MatchResponse, MatchResult
from ..services.recommendation_service import RecommendationService

router = APIRouter()

# Initialize recommendation service
recommendation_service = RecommendationService()

# Configuration
NODE_API_URL = os.getenv("NODE_API_URL", "http://localhost:5000/api")

async def fetch_users_from_node_api() -> List[UserProfile]:
    """Fetch all users from the Node.js API"""
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(f"{NODE_API_URL}/user/all", timeout=10.0)
            response.raise_for_status()
            
            users_data = response.json()
            
            # Convert to UserProfile objects
            users = []
            for user_data in users_data:
                user_profile = UserProfile(
                    user_id=str(user_data.get("_id", "")),
                    username=user_data.get("username", ""),
                    fullname=user_data.get("fullname", ""),
                    about=user_data.get("about", ""),
                    learning_skills=user_data.get("learning_skills", []),
                    teaching_skills=user_data.get("teaching_skills", []),
                    gender=user_data.get("gender"),
                    previous_meeting=user_data.get("previous_meeting", [])
                )
                users.append(user_profile)
            
            return users
    except Exception as e:
        print(f"Error fetching users from Node API: {e}")
        raise HTTPException(status_code=503, detail="Could not fetch users from database")

async def fetch_user_by_id(user_id: str) -> UserProfile:
    """Fetch a specific user from the Node.js API"""
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(f"{NODE_API_URL}/user/{user_id}", timeout=10.0)
            response.raise_for_status()
            
            user_data = response.json()
            
            return UserProfile(
                user_id=str(user_data.get("_id", "")),
                username=user_data.get("username", ""),
                fullname=user_data.get("fullname", ""),
                about=user_data.get("about", ""),
                learning_skills=user_data.get("learning_skills", []),
                teaching_skills=user_data.get("teaching_skills", []),
                gender=user_data.get("gender"),
                previous_meeting=user_data.get("previous_meeting", [])
            )
    except httpx.HTTPStatusError as e:
        if e.response.status_code == 404:
            raise HTTPException(status_code=404, detail="User not found")
        raise HTTPException(status_code=503, detail="Could not fetch user from database")
    except Exception as e:
        print(f"Error fetching user {user_id}: {e}")
        raise HTTPException(status_code=503, detail="Could not fetch user from database")

@router.post("/matches", response_model=MatchResponse)
async def find_matches(match_request: MatchRequest):
    """
    Find potential matches for a user based on content-based filtering
    """
    start_time = time.time()
    
    try:
        # Fetch the requesting user
        user = await fetch_user_by_id(match_request.user_id)
        
        # Fetch all potential candidates
        all_users = await fetch_users_from_node_api()
        
        # Find matches using recommendation service
        matches = recommendation_service.find_matches(
            user=user,
            candidates=all_users,
            limit=match_request.limit,
            exclude_previous=match_request.exclude_previous
        )
        
        processing_time = (time.time() - start_time) * 1000  # Convert to milliseconds
        
        return MatchResponse(
            matches=matches,
            total_candidates=len(all_users) - 1,  # Exclude the user themselves
            processing_time_ms=round(processing_time, 2)
        )
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error in find_matches: {e}")
        raise HTTPException(status_code=500, detail="Internal server error while finding matches")

@router.get("/profile/{user_id}", response_model=UserProfile)
async def get_user_profile(user_id: str):
    """Get a user's profile for recommendation purposes"""
    return await fetch_user_by_id(user_id)

@router.post("/compatibility")
async def calculate_compatibility(user1_id: str, user2_id: str):
    """Calculate compatibility between two specific users"""
    try:
        # Fetch both users
        user1 = await fetch_user_by_id(user1_id)
        user2 = await fetch_user_by_id(user2_id)
        
        # Calculate compatibility
        score, match_result = recommendation_service.calculate_overall_compatibility(user1, user2)
        
        return {
            "user1_id": user1_id,
            "user2_id": user2_id,
            "compatibility_score": score,
            "match_details": match_result
        }
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error calculating compatibility: {e}")
        raise HTTPException(status_code=500, detail="Internal server error while calculating compatibility")

@router.get("/stats")
async def get_recommendation_stats():
    """Get recommendation system statistics"""
    try:
        users = await fetch_users_from_node_api()
        
        # Calculate some basic stats
        total_users = len(users)
        total_learning_skills = sum(len(user.learning_skills) for user in users)
        total_teaching_skills = sum(len(user.teaching_skills) for user in users)
        
        # Most common skills
        all_learning_skills = []
        all_teaching_skills = []
        
        for user in users:
            all_learning_skills.extend(user.learning_skills)
            all_teaching_skills.extend(user.teaching_skills)
        
        from collections import Counter
        common_learning = Counter(all_learning_skills).most_common(10)
        common_teaching = Counter(all_teaching_skills).most_common(10)
        
        return {
            "total_users": total_users,
            "total_learning_skills": total_learning_skills,
            "total_teaching_skills": total_teaching_skills,
            "avg_learning_skills_per_user": round(total_learning_skills / max(total_users, 1), 2),
            "avg_teaching_skills_per_user": round(total_teaching_skills / max(total_users, 1), 2),
            "most_common_learning_skills": common_learning,
            "most_common_teaching_skills": common_teaching
        }
        
    except Exception as e:
        print(f"Error getting stats: {e}")
        raise HTTPException(status_code=500, detail="Internal server error while getting stats")
