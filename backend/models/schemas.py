"""
Pydantic schemas for request/response models
"""

from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class Question(BaseModel):
    """Question model"""
    id: Optional[int] = None
    question_text: str
    topic: str
    qtype: str
    marks: int
    question_number: int
    created_at: Optional[datetime] = None


class StudyLog(BaseModel):
    """Study log model"""
    id: Optional[int] = None
    topic: str
    log_type: str
    difficulty: Optional[str] = None
    hours: Optional[float] = None
    notes: Optional[str] = None
    created_at: Optional[datetime] = None


class Plan(BaseModel):
    """Plan model"""
    id: Optional[int] = None
    plan_json: dict
    created_at: Optional[datetime] = None


class TopicFrequency(BaseModel):
    """Topic frequency analysis result"""
    topic: str
    frequency: int
    percentage: float


class AnalysisResult(BaseModel):
    """Analysis result model"""
    questions: List[Question]
    topic_frequencies: List[TopicFrequency]


class ExpectedPaper(BaseModel):
    """Expected paper model"""
    questions: List[Question]
    total_questions: int


class SmartPlan(BaseModel):
    """Smart exam plan model"""
    priorities: List[str]
    weaknesses: List[str]
    next_steps: List[str]
    revision_plan: List[str]
    confidence_percentage: float

