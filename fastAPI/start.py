#!/usr/bin/env python3
"""
Startup script for SkillSwap Recommendation API
"""

import os
import sys
import subprocess
import uvicorn

def check_dependencies():
    """Check if required packages are installed"""
    try:
        import fastapi
        import httpx
        print("✅ All dependencies are installed")
        return True
    except ImportError as e:
        print(f"❌ Missing dependency: {e}")
        print("Installing dependencies...")
        
        try:
            subprocess.check_call([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"])
            print("✅ Dependencies installed successfully")
            return True
        except subprocess.CalledProcessError:
            print("❌ Failed to install dependencies")
            return False

def main():
    """Main startup function"""
    print("🚀 Starting SkillSwap Recommendation API...")
    
    # Check dependencies
    if not check_dependencies():
        sys.exit(1)
    
    # Set environment variables
    os.environ.setdefault("NODE_API_URL", "http://localhost:5000/api")
    
    print("📊 Recommendation API Configuration:")
    print(f"   - Node.js API URL: {os.environ.get('NODE_API_URL')}")
    print(f"   - API Port: 8000")
    print()
    
    # Start the server
    print("🌟 Starting FastAPI server on http://localhost:8000")
    print("📖 API Documentation available at: http://localhost:8000/docs")
    print()
    
    # Start uvicorn from the current directory, pointing to app.main
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )

if __name__ == "__main__":
    main()
