"""
Study logs endpoint
Accepts study log entries (text, hours, difficulty, checkbox).
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import Optional, Dict

from utils.database import db

router = APIRouter()

# Valid log types
VALID_LOG_TYPES = ["text", "hours", "difficulty", "checkbox"]
VALID_DIFFICULTY_LEVELS = ["easy", "medium", "hard"]


@router.get("/")
async def get_study_logs() -> Dict:
    """
    Get all study logs from the database.
    
    Returns:
        List of all study logs with statistics
    """
    try:
        all_logs = db.get_all_study_logs()
        
        # Calculate statistics
        total_logs = len(all_logs)
        total_hours = sum([float(log.get('hours', 0)) for log in all_logs if log.get('hours')])
        
        # Group by topic
        topic_stats = {}
        for log in all_logs:
            topic = log.get('topic', 'Unknown')
            if topic not in topic_stats:
                topic_stats[topic] = {
                    'count': 0,
                    'total_hours': 0,
                    'difficulties': []
                }
            topic_stats[topic]['count'] += 1
            if log.get('hours'):
                topic_stats[topic]['total_hours'] += float(log.get('hours', 0))
            if log.get('difficulty'):
                topic_stats[topic]['difficulties'].append(log.get('difficulty'))
        
        return {
            "logs": all_logs,
            "statistics": {
                "total_logs": total_logs,
                "total_hours": round(total_hours, 2),
                "topics_count": len(topic_stats),
                "topic_stats": topic_stats
            }
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch study logs: {str(e)}"
        )


class StudyLogRequest(BaseModel):
    """Request model for study log entry"""
    topic: str = Field(..., min_length=1, description="Subject/topic name")
    log_type: str = Field(..., description="Type of log: text, hours, difficulty, or checkbox")
    difficulty: Optional[str] = Field(None, description="Difficulty level: easy, medium, or hard")
    hours: Optional[float] = Field(None, ge=0, description="Study hours (must be >= 0)")
    notes: Optional[str] = Field(None, description="Additional notes")


@router.post("/")
async def create_study_log(request: StudyLogRequest) -> Dict:
    """
    Create a study log entry.
    
    Accepts:
        - topic: Subject/topic name (required)
        - log_type: Type of log - "text", "hours", "difficulty", or "checkbox" (required)
        - difficulty: Difficulty level - "easy", "medium", or "hard" (required if log_type is "difficulty")
        - hours: Study hours (required if log_type is "hours", must be >= 0)
        - notes: Additional notes (optional)
    
    Returns:
        Created study log entry with ID and timestamp
    """
    # Validate log_type
    if request.log_type not in VALID_LOG_TYPES:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid log_type. Must be one of: {', '.join(VALID_LOG_TYPES)}"
        )
    
    # Validate based on log_type
    if request.log_type == "difficulty":
        if not request.difficulty:
            raise HTTPException(
                status_code=400,
                detail="difficulty field is required when log_type is 'difficulty'"
            )
        if request.difficulty not in VALID_DIFFICULTY_LEVELS:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid difficulty. Must be one of: {', '.join(VALID_DIFFICULTY_LEVELS)}"
            )
    
    if request.log_type == "hours":
        if request.hours is None:
            raise HTTPException(
                status_code=400,
                detail="hours field is required when log_type is 'hours'"
            )
        if request.hours < 0:
            raise HTTPException(
                status_code=400,
                detail="hours must be >= 0"
            )
    
    # Prepare data for database
    log_data = {
        "topic": request.topic.strip(),
        "log_type": request.log_type,
        "difficulty": request.difficulty if request.log_type == "difficulty" else None,
        "hours": float(request.hours) if request.log_type == "hours" and request.hours is not None else None,
        "notes": request.notes.strip() if request.notes else None
    }
    
    # Store in database
    try:
        print(f"Creating study log: {log_data}")
        created_log = db.insert_study_log(log_data)
        
        if not created_log:
            raise HTTPException(
                status_code=500,
                detail="Failed to create study log in database"
            )
        
        return {
            "message": "Study log created successfully",
            "log": created_log
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to create study log: {str(e)}"
        )

