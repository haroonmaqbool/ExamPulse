"""
Analysis endpoint
Processes uploaded files through OCR and question extraction.
"""

import os
from pathlib import Path
from typing import Dict, List
from collections import Counter
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from dotenv import load_dotenv

from core.ocr import run_ocr
from core.question_extractor import extract_questions
from core.ai_client import ai_client
from utils.database import db

load_dotenv()

router = APIRouter()

# Upload directory (configurable via .env, defaults to ./uploads)
UPLOAD_DIR = Path(os.getenv("UPLOAD_DIR", "./uploads"))


class AnalyzeRequest(BaseModel):
    """Request model for analysis"""
    file_id: str


@router.post("/")
async def analyze_paper(request: AnalyzeRequest) -> Dict:
    """
    Analyze uploaded paper:
    1. Run Hybrid OCR (Tesseract → Mock fallback)
    2. Extract questions
    3. Use AI for classification (topic, type, marks, question number)
    4. Compute topic frequencies
    5. Store questions in database
    
    Returns:
        Analysis results with questions and topic frequencies
    """
    # Find file by file_id
    file_path = None
    for file in UPLOAD_DIR.iterdir():
        if file.is_file() and request.file_id in file.name:
            file_path = file
            break
    
    if not file_path or not file_path.exists():
        raise HTTPException(
            status_code=404,
            detail=f"File with ID {request.file_id} not found"
        )
    
    try:
        # Step 1: Run OCR
        # Convert to absolute path to avoid path issues
        absolute_path = str(file_path.resolve())
        print(f"Running OCR on {absolute_path}...")
        print(f"File exists: {os.path.exists(absolute_path)}")
        ocr_text = run_ocr(absolute_path)
        
        if not ocr_text:
            raise HTTPException(
                status_code=500,
                detail="OCR failed to extract text from file"
            )
        
        # Step 2: Extract questions
        print("Extracting questions...")
        raw_questions = extract_questions(ocr_text)
        
        if not raw_questions:
            raise HTTPException(
                status_code=400,
                detail="No questions found in the document. Please ensure the file contains exam questions."
            )
        
        # Step 3: Classify questions using AI
        print(f"Classifying {len(raw_questions)} questions with AI...")
        classified_questions = []
        
        for raw_q in raw_questions:
            # Prepare prompt for AI classification
            classification_prompt = f"""
Classify this exam question and return ONLY valid JSON (no markdown, no code blocks, just JSON):

{{
  "topic": "topic name (e.g., Algebra, Geometry, Calculus, Physics, Chemistry, etc.)",
  "qtype": "question type (e.g., Multiple Choice, Short Answer, Essay, Problem Solving, etc.)",
  "marks": {raw_q.get('marks') or 'null'},
  "question_number": {raw_q.get('question_number', 1)}
}}

Question text:
{raw_q['text']}
"""
            
            # Call AI for classification
            ai_response = ai_client.run_ai_prompt(
                classification_prompt,
                system_instruction="You are an expert at classifying exam questions. Return only valid JSON.",
                response_format="json"
            )
            
            # Check for errors
            if "error" in ai_response:
                print(f"Warning: AI classification failed for question {raw_q.get('question_number')}: {ai_response.get('error_message', 'Unknown error')}")
                # Use defaults if AI fails
                marks_value = raw_q.get('marks')
                if marks_value is None:
                    marks_value = 0
                else:
                    marks_value = int(marks_value)
                
                classified_q = {
                    "question_text": raw_q['text'],
                    "topic": "Unknown",
                    "qtype": "Unknown",
                    "marks": marks_value,
                    "question_number": raw_q.get('question_number', 1)
                }
            else:
                # Extract classification from AI response
                # Handle marks - ensure it's never null
                marks_value = ai_response.get("marks")
                if marks_value is None:
                    # Try to get from raw question
                    marks_value = raw_q.get('marks')
                if marks_value is None:
                    marks_value = 0  # Default to 0 if not found
                else:
                    # Ensure it's an integer
                    try:
                        marks_value = int(marks_value)
                    except (ValueError, TypeError):
                        marks_value = 0
                
                classified_q = {
                    "question_text": raw_q['text'],
                    "topic": ai_response.get("topic", "Unknown"),
                    "qtype": ai_response.get("qtype", "Unknown"),
                    "marks": marks_value,  # Always an integer, never null
                    "question_number": ai_response.get("question_number", raw_q.get('question_number', 1))
                }
            
            classified_questions.append(classified_q)
            
            # Store in database
            db.insert_question(classified_q)
        
        # Step 4: Compute topic frequencies
        topics = [q['topic'] for q in classified_questions if q['topic'] != "Unknown"]
        topic_counts = Counter(topics)
        total_questions = len(classified_questions)
        
        topic_frequencies = [
            {
                "topic": topic,
                "frequency": count,
                "percentage": round((count / total_questions) * 100, 2) if total_questions > 0 else 0
            }
            for topic, count in topic_counts.items()
        ]
        
        # Sort by frequency (descending)
        topic_frequencies.sort(key=lambda x: x['frequency'], reverse=True)
        
        return {
            "message": "Analysis completed successfully",
            "file_id": request.file_id,
            "total_questions": total_questions,
            "questions": classified_questions,
            "topic_frequencies": topic_frequencies
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Analysis failed: {str(e)}"
        )

