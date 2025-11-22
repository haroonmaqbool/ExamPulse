"""
ExamPulse Backend - FastAPI Main Application
Entry point for the FastAPI server with CORS and route registration.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Initialize logging first
from utils.logger import logger

from api import upload, analyze, analyze_multi, combine_ocr, expected_paper, study_logs, smart_plan, health, chatbot

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
app.include_router(analyze_multi.router, prefix="/analyze", tags=["analyze"])
app.include_router(combine_ocr.router, prefix="/combine-ocr", tags=["combine-ocr"])
app.include_router(expected_paper.router, prefix="/expected-paper", tags=["expected-paper"])
app.include_router(study_logs.router, prefix="/study-logs", tags=["study-logs"])
app.include_router(smart_plan.router, prefix="/smart-plan", tags=["smart-plan"])
app.include_router(chatbot.router, prefix="/chatbot", tags=["chatbot"])


@app.get("/")
async def root():
    """Root endpoint"""
    logger.info("Root endpoint accessed")
    return {"message": "ExamPulse API", "version": "1.0.0"}


@app.on_event("startup")
async def startup_event():
    """Log server startup"""
    logger.info("ExamPulse API server started successfully")
    logger.info("Available endpoints: /upload, /analyze, /analyze/multi, /expected-paper, /study-logs, /smart-plan, /chatbot")


@app.on_event("shutdown")
async def shutdown_event():
    """Log server shutdown"""
    logger.info("ExamPulse API server shutting down")

