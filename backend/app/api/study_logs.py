"""
Study logs endpoint
Accepts study log entries (text, hours, difficulty, checkbox).
"""

from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional

router = APIRouter()


class StudyLogRequest(BaseModel):
    """Request model for study log entry"""
    topic: str
    log_type: str  # text, hours, difficulty, checkbox
    difficulty: Optional[str] = None
    hours: Optional[float] = None
    notes: Optional[str] = None


@router.post("/")
async def create_study_log(request: StudyLogRequest):
    """
    Create a study log entry.
    
    Accepts:
        - topic: Subject/topic name
        - log_type: Type of log (text, hours, difficulty, checkbox)
        - difficulty: Difficulty level (optional)
        - hours: Study hours (optional)
        - notes: Additional notes (optional)
    
    Returns:
        Created study log entry
    """
    # TODO: Implement study log creation
    # - Validate input
    # - Store in Supabase (study_logs table)
    # - Return created entry
    return {
        "message": "Study logs endpoint - placeholder",
        "log": request.dict()
    }

