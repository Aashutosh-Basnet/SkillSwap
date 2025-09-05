from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

class UserProfile(BaseModel):
    """User profile model for recommendation system"""
    user_id: str = Field(..., description="Unique user identifier")
    username: str = Field(..., description="Username")
    fullname: str = Field(..., description="Full name")
    about: Optional[str] = Field("", description="User's about section")
    learning_skills: List[str] = Field(..., description="Skills the user wants to learn")
    teaching_skills: List[str] = Field(..., description="Skills the user can teach")
    gender: Optional[str] = Field(None, description="User's gender")
    previous_meeting: List[str] = Field(default_factory=list, description="Previous meeting user IDs")

class MatchRequest(BaseModel):
    """Request model for finding matches"""
    user_id: str = Field(..., description="ID of the user seeking matches")
    limit: int = Field(5, ge=1, le=20, description="Maximum number of matches to return")
    exclude_previous: bool = Field(True, description="Exclude users from previous meetings")

class MatchResult(BaseModel):
    """Result model for a potential match"""
    user_id: str = Field(..., description="Matched user's ID")
    username: str = Field(..., description="Matched user's username")
    fullname: str = Field(..., description="Matched user's full name")
    compatibility_score: float = Field(..., ge=0.0, le=1.0, description="Compatibility score (0-1)")
    skill_matches: List[str] = Field(..., description="Matching skills")
    learning_teaching_overlap: List[str] = Field(..., description="Skills where user wants to learn and match can teach")
    teaching_learning_overlap: List[str] = Field(..., description="Skills where user can teach and match wants to learn")
    about_similarity: float = Field(..., ge=0.0, le=1.0, description="Similarity based on about sections")

class MatchResponse(BaseModel):
    """Response model for match recommendations"""
    matches: List[MatchResult] = Field(..., description="List of recommended matches")
    total_candidates: int = Field(..., description="Total number of candidates considered")
    processing_time_ms: float = Field(..., description="Processing time in milliseconds")
