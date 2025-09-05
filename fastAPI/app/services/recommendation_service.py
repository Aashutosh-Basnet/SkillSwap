import re
import math
import time
from typing import List, Dict, Set, Tuple
from collections import Counter

from ..models.user import UserProfile, MatchResult

class RecommendationService:
    """Content-based recommendation service for skill matching"""
    
    def __init__(self):
        # Simple stopwords list
        self.stopwords = {
            'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 
            'by', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 
            'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must',
            'i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him', 'her', 'us', 'them',
            'my', 'your', 'his', 'its', 'our', 'their', 'this', 'that', 'these', 'those'
        }
    
    def calculate_skill_compatibility(self, user: UserProfile, candidate: UserProfile) -> Tuple[float, List[str], List[str], List[str]]:
        """
        Calculate skill-based compatibility between two users
        
        Returns:
            - Overall skill compatibility score (0-1)
            - Common skills (both have in learning or teaching)
            - Learning-teaching overlap (user wants to learn, candidate can teach)
            - Teaching-learning overlap (user can teach, candidate wants to learn)
        """
        user_learning = set(skill.lower().strip() for skill in user.learning_skills)
        user_teaching = set(skill.lower().strip() for skill in user.teaching_skills)
        candidate_learning = set(skill.lower().strip() for skill in candidate.learning_skills)
        candidate_teaching = set(skill.lower().strip() for skill in candidate.teaching_skills)
        
        # Find overlaps
        learning_teaching_overlap = list(user_learning.intersection(candidate_teaching))
        teaching_learning_overlap = list(user_teaching.intersection(candidate_learning))
        common_learning = list(user_learning.intersection(candidate_learning))
        common_teaching = list(user_teaching.intersection(candidate_teaching))
        
        # Common skills (less weight than complementary skills)
        common_skills = common_learning + common_teaching
        
        # Calculate scores with different weights
        complementary_score = len(learning_teaching_overlap) + len(teaching_learning_overlap)
        common_score = len(common_skills) * 0.3  # Lower weight for common interests
        
        # Normalize by total possible skills
        total_user_skills = len(user_learning) + len(user_teaching)
        total_candidate_skills = len(candidate_learning) + len(candidate_teaching)
        max_possible_matches = min(total_user_skills, total_candidate_skills)
        
        if max_possible_matches == 0:
            return 0.0, [], learning_teaching_overlap, teaching_learning_overlap
        
        # Calculate final score (emphasize complementary skills)
        skill_score = min(1.0, (complementary_score * 2 + common_score) / (max_possible_matches + 2))
        
        return skill_score, common_skills, learning_teaching_overlap, teaching_learning_overlap
    
    def calculate_text_similarity(self, text1: str, text2: str) -> float:
        """Calculate text similarity using simple word overlap and Jaccard similarity"""
        if not text1.strip() or not text2.strip():
            return 0.0
        
        try:
            # Preprocess texts
            words1 = self._preprocess_text(text1)
            words2 = self._preprocess_text(text2)
            
            # Convert to sets for Jaccard similarity
            set1 = set(words1)
            set2 = set(words2)
            
            if not set1 or not set2:
                return 0.0
            
            # Calculate Jaccard similarity
            intersection = len(set1.intersection(set2))
            union = len(set1.union(set2))
            
            similarity = intersection / union if union > 0 else 0.0
            
            return float(similarity)
        except Exception as e:
            print(f"Error calculating text similarity: {e}")
            return 0.0
    
    def _preprocess_text(self, text: str) -> List[str]:
        """Preprocess text for similarity calculation"""
        # Convert to lowercase
        text = text.lower()
        
        # Remove special characters and numbers
        text = re.sub(r'[^a-zA-Z\s]', '', text)
        
        # Split into words
        words = text.split()
        
        # Remove stopwords and short words
        words = [word for word in words if word not in self.stopwords and len(word) > 2]
        
        return words
    
    def calculate_overall_compatibility(self, user: UserProfile, candidate: UserProfile) -> Tuple[float, MatchResult]:
        """Calculate overall compatibility score and create match result"""
        
        # Calculate skill compatibility
        skill_score, common_skills, learning_teaching, teaching_learning = self.calculate_skill_compatibility(user, candidate)
        
        # Calculate about section similarity
        about_similarity = self.calculate_text_similarity(user.about or "", candidate.about or "")
        
        # Weighted overall score
        # Skill compatibility is more important than text similarity
        overall_score = (skill_score * 0.8) + (about_similarity * 0.2)
        
        # Boost score if there are complementary skills
        if learning_teaching or teaching_learning:
            overall_score = min(1.0, overall_score * 1.2)
        
        # Create match result
        match_result = MatchResult(
            user_id=candidate.user_id,
            username=candidate.username,
            fullname=candidate.fullname,
            compatibility_score=round(overall_score, 3),
            skill_matches=common_skills,
            learning_teaching_overlap=learning_teaching,
            teaching_learning_overlap=teaching_learning,
            about_similarity=round(about_similarity, 3)
        )
        
        return overall_score, match_result
    
    def find_matches(self, user: UserProfile, candidates: List[UserProfile], limit: int = 5, exclude_previous: bool = True) -> List[MatchResult]:
        """
        Find best matches for a user from a list of candidates
        
        Args:
            user: The user seeking matches
            candidates: List of potential matches
            limit: Maximum number of matches to return
            exclude_previous: Whether to exclude users from previous meetings
        
        Returns:
            List of MatchResult objects sorted by compatibility score
        """
        start_time = time.time()
        
        # Filter candidates
        filtered_candidates = []
        for candidate in candidates:
            # Don't match with self
            if candidate.user_id == user.user_id:
                continue
                
            # Exclude previous meetings if requested
            if exclude_previous and candidate.user_id in user.previous_meeting:
                continue
                
            filtered_candidates.append(candidate)
        
        # Calculate compatibility with each candidate
        matches = []
        for candidate in filtered_candidates:
            score, match_result = self.calculate_overall_compatibility(user, candidate)
            matches.append(match_result)
        
        # Sort by compatibility score (highest first) and limit results
        matches.sort(key=lambda x: x.compatibility_score, reverse=True)
        
        return matches[:limit]
    
    def get_skill_recommendations(self, user_skills: List[str], all_skills: List[str], limit: int = 10) -> List[str]:
        """Recommend skills based on user's current skills"""
        user_skill_set = set(skill.lower().strip() for skill in user_skills)
        all_skill_set = set(skill.lower().strip() for skill in all_skills)
        
        # Remove skills user already has
        recommended_skills = list(all_skill_set - user_skill_set)
        
        # Simple recommendation: return most common skills not in user's list
        # In a real system, you might use collaborative filtering or skill relationships
        return recommended_skills[:limit]
