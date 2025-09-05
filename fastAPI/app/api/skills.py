from fastapi import APIRouter, HTTPException
from typing import List, Dict
import httpx
import os
from collections import Counter

from ..services.recommendation_service import RecommendationService

router = APIRouter()

# Initialize services
recommendation_service = RecommendationService()

# Configuration
NODE_API_URL = os.getenv("NODE_API_URL", "http://localhost:5000/api")

@router.get("/popular")
async def get_popular_skills(limit: int = 20):
    """Get most popular skills across all users"""
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(f"{NODE_API_URL}/user/all", timeout=10.0)
            response.raise_for_status()
            
            users_data = response.json()
            
            # Collect all skills
            all_learning_skills = []
            all_teaching_skills = []
            
            for user in users_data:
                all_learning_skills.extend(user.get("learning_skills", []))
                all_teaching_skills.extend(user.get("teaching_skills", []))
            
            # Count frequencies
            learning_counter = Counter(all_learning_skills)
            teaching_counter = Counter(all_teaching_skills)
            
            # Combine and get most common
            all_skills = all_learning_skills + all_teaching_skills
            combined_counter = Counter(all_skills)
            
            return {
                "most_wanted_to_learn": learning_counter.most_common(limit),
                "most_offered_to_teach": teaching_counter.most_common(limit),
                "most_popular_overall": combined_counter.most_common(limit),
                "total_unique_skills": len(combined_counter),
                "total_skill_mentions": len(all_skills)
            }
            
    except Exception as e:
        print(f"Error getting popular skills: {e}")
        raise HTTPException(status_code=500, detail="Could not fetch popular skills")

@router.get("/recommendations/{user_id}")
async def get_skill_recommendations(user_id: str, limit: int = 10):
    """Get skill recommendations for a specific user"""
    try:
        # Fetch user data
        async with httpx.AsyncClient() as client:
            user_response = await client.get(f"{NODE_API_URL}/user/{user_id}", timeout=10.0)
            user_response.raise_for_status()
            user_data = user_response.json()
            
            # Fetch all users to get skill pool
            all_users_response = await client.get(f"{NODE_API_URL}/user/all", timeout=10.0)
            all_users_response.raise_for_status()
            all_users_data = all_users_response.json()
        
        # Get user's current skills
        user_skills = user_data.get("learning_skills", []) + user_data.get("teaching_skills", [])
        
        # Get all available skills
        all_skills = []
        for user in all_users_data:
            all_skills.extend(user.get("learning_skills", []))
            all_skills.extend(user.get("teaching_skills", []))
        
        # Get recommendations
        recommended_skills = recommendation_service.get_skill_recommendations(
            user_skills=user_skills,
            all_skills=all_skills,
            limit=limit
        )
        
        return {
            "user_id": user_id,
            "current_skills": user_skills,
            "recommended_skills": recommended_skills,
            "recommendation_count": len(recommended_skills)
        }
        
    except httpx.HTTPStatusError as e:
        if e.response.status_code == 404:
            raise HTTPException(status_code=404, detail="User not found")
        raise HTTPException(status_code=503, detail="Could not fetch user data")
    except Exception as e:
        print(f"Error getting skill recommendations: {e}")
        raise HTTPException(status_code=500, detail="Could not generate skill recommendations")

@router.get("/supply-demand")
async def get_skill_supply_demand():
    """Analyze skill supply and demand"""
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(f"{NODE_API_URL}/user/all", timeout=10.0)
            response.raise_for_status()
            
            users_data = response.json()
            
            # Collect skills
            learning_skills = []  # Demand
            teaching_skills = []  # Supply
            
            for user in users_data:
                learning_skills.extend(user.get("learning_skills", []))
                teaching_skills.extend(user.get("teaching_skills", []))
            
            learning_counter = Counter(learning_skills)
            teaching_counter = Counter(teaching_skills)
            
            # Find skills with high demand but low supply
            all_skills = set(learning_skills + teaching_skills)
            supply_demand_analysis = []
            
            for skill in all_skills:
                demand = learning_counter.get(skill, 0)
                supply = teaching_counter.get(skill, 0)
                
                # Calculate demand-to-supply ratio
                if supply > 0:
                    ratio = demand / supply
                else:
                    ratio = float('inf') if demand > 0 else 0
                
                supply_demand_analysis.append({
                    "skill": skill,
                    "demand": demand,
                    "supply": supply,
                    "demand_to_supply_ratio": ratio if ratio != float('inf') else 999
                })
            
            # Sort by different criteria
            high_demand = sorted(supply_demand_analysis, key=lambda x: x["demand"], reverse=True)[:20]
            high_supply = sorted(supply_demand_analysis, key=lambda x: x["supply"], reverse=True)[:20]
            high_demand_low_supply = sorted(
                [s for s in supply_demand_analysis if s["supply"] > 0], 
                key=lambda x: x["demand_to_supply_ratio"], 
                reverse=True
            )[:20]
            
            return {
                "high_demand_skills": high_demand,
                "high_supply_skills": high_supply,
                "high_demand_low_supply_skills": high_demand_low_supply,
                "total_unique_skills": len(all_skills),
                "total_users_analyzed": len(users_data)
            }
            
    except Exception as e:
        print(f"Error analyzing skill supply and demand: {e}")
        raise HTTPException(status_code=500, detail="Could not analyze skill supply and demand")

@router.get("/categories")
async def get_skill_categories():
    """Get skills organized by categories (basic categorization)"""
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(f"{NODE_API_URL}/user/all", timeout=10.0)
            response.raise_for_status()
            
            users_data = response.json()
            
            # Collect all skills
            all_skills = set()
            for user in users_data:
                all_skills.update(user.get("learning_skills", []))
                all_skills.update(user.get("teaching_skills", []))
            
            # Basic categorization based on keywords
            categories = {
                "Technology": [],
                "Languages": [],
                "Arts & Design": [],
                "Business": [],
                "Sports & Fitness": [],
                "Music": [],
                "Academic": [],
                "Life Skills": [],
                "Other": []
            }
            
            tech_keywords = ["programming", "coding", "javascript", "python", "web", "app", "software", "data", "ai", "machine learning", "computer"]
            language_keywords = ["english", "spanish", "french", "german", "chinese", "japanese", "language"]
            arts_keywords = ["design", "drawing", "painting", "photography", "video", "editing", "graphic"]
            business_keywords = ["marketing", "sales", "business", "management", "entrepreneurship", "finance"]
            sports_keywords = ["fitness", "gym", "sports", "running", "yoga", "workout", "exercise"]
            music_keywords = ["music", "guitar", "piano", "singing", "drums", "violin"]
            academic_keywords = ["math", "science", "physics", "chemistry", "biology", "history", "literature"]
            life_keywords = ["cooking", "cleaning", "organization", "time management", "communication"]
            
            for skill in all_skills:
                skill_lower = skill.lower()
                categorized = False
                
                for keyword in tech_keywords:
                    if keyword in skill_lower:
                        categories["Technology"].append(skill)
                        categorized = True
                        break
                
                if not categorized:
                    for keyword in language_keywords:
                        if keyword in skill_lower:
                            categories["Languages"].append(skill)
                            categorized = True
                            break
                
                if not categorized:
                    for keyword in arts_keywords:
                        if keyword in skill_lower:
                            categories["Arts & Design"].append(skill)
                            categorized = True
                            break
                
                if not categorized:
                    for keyword in business_keywords:
                        if keyword in skill_lower:
                            categories["Business"].append(skill)
                            categorized = True
                            break
                
                if not categorized:
                    for keyword in sports_keywords:
                        if keyword in skill_lower:
                            categories["Sports & Fitness"].append(skill)
                            categorized = True
                            break
                
                if not categorized:
                    for keyword in music_keywords:
                        if keyword in skill_lower:
                            categories["Music"].append(skill)
                            categorized = True
                            break
                
                if not categorized:
                    for keyword in academic_keywords:
                        if keyword in skill_lower:
                            categories["Academic"].append(skill)
                            categorized = True
                            break
                
                if not categorized:
                    for keyword in life_keywords:
                        if keyword in skill_lower:
                            categories["Life Skills"].append(skill)
                            categorized = True
                            break
                
                if not categorized:
                    categories["Other"].append(skill)
            
            # Add counts
            category_stats = {}
            for category, skills in categories.items():
                category_stats[category] = {
                    "skills": sorted(skills),
                    "count": len(skills)
                }
            
            return category_stats
            
    except Exception as e:
        print(f"Error categorizing skills: {e}")
        raise HTTPException(status_code=500, detail="Could not categorize skills")
