"""
ExamPulse Backend - FastAPI Main Application
Entry point for the FastAPI server with CORS and route registration.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api import upload, analyze, expected_paper, study_logs, smart_plan, health

app = FastAPI(
    title="ExamPulse API",
    description="AI-powered exam preparation platform backend",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],  # Vite default port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(health.router, prefix="/health", tags=["health"])
app.include_router(upload.router, prefix="/upload", tags=["upload"])
app.include_router(analyze.router, prefix="/analyze", tags=["analyze"])
app.include_router(expected_paper.router, prefix="/expected-paper", tags=["expected-paper"])
app.include_router(study_logs.router, prefix="/study-logs", tags=["study-logs"])
app.include_router(smart_plan.router, prefix="/smart-plan", tags=["smart-plan"])


@app.get("/")
async def root():
    """Root endpoint"""
    return {"message": "ExamPulse API", "version": "1.0.0"}

