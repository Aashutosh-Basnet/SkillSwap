from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import uvicorn

from .api.users import router as users_router
from .api.skills import router as skills_router
from .services.recommendation_service import RecommendationService

app = FastAPI(
    title="SkillSwap Recommendation API",
    description="Content-based recommendation system for skill matching",
    version="1.0.0"
)

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure this properly in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(users_router, prefix="/api/users", tags=["users"])
app.include_router(skills_router, prefix="/api/skills", tags=["skills"])

# Initialize recommendation service
recommendation_service = RecommendationService()

@app.get("/")
async def root():
    return {"message": "SkillSwap Recommendation API is running"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "recommendation_api"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
