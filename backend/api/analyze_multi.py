"""
Multi-file analysis endpoint
Processes multiple uploaded files through OCR and question extraction with improved multi-file context.
"""

import os
from pathlib import Path
from typing import Dict, List
from collections import Counter
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from dotenv import load_dotenv
import logging

from core.ocr import run_best_ocr
from core.question_extractor import extract_questions_with_context
from core.ai_client import ai_client
from utils.database import db
from utils.logger import analysis_logger

load_dotenv()

# Set up logger
logger = logging.getLogger("ExamPulse.AnalyzeMulti")

router = APIRouter()

# Upload directory (configurable via .env, defaults to ./uploads)
UPLOAD_DIR = Path(os.getenv("UPLOAD_DIR", "./uploads"))


class MultiAnalyzeRequest(BaseModel):
    """Request model for multi-file analysis"""
    file_ids: List[str]


def find_file_by_id(file_id: str) -> Path:
    """
    Find uploaded file by file_id.
    
    Args:
        file_id: Unique file identifier
        
    Returns:
        Path to the file
        
    Raises:
        HTTPException: If file not found
    """
    file_path = None
    for file in UPLOAD_DIR.iterdir():
        if file_id in file.name:
            file_path = file
            break
    
    if not file_path or not file_path.exists():
        raise HTTPException(
            status_code=404,
            detail=f"File with ID {file_id} not found"
        )
    
    return file_path


def classify_question(raw_q: Dict) -> Dict:
    """
    Classify a single question using AI.
    
    Args:
        raw_q: Raw question dict with 'text', 'question_number', 'marks'
    
    Returns:
        Classified question dict with topic, qtype, marks, question_number
    """
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
    
    try:
        # Call AI for classification
        ai_response = ai_client.run_ai_prompt(
            classification_prompt,
            system_instruction="You are an expert at classifying exam questions. Return only valid JSON."
        )
        
        # Check for API key authentication errors first (fail fast)
        if isinstance(ai_response, dict) and "error" in ai_response and ai_response.get("error_type") == "authentication_error":
            return {
                "question_text": raw_q.get('text', ''),
                "topic": "Unknown",
                "qtype": "Unknown",
                "marks": raw_q.get('marks', 0),
                "question_number": raw_q.get('question_number', 1),
                "error": "authentication_error",
                "error_type": "authentication_error"
            }
        
        # Check for other errors
        if isinstance(ai_response, dict) and "error" in ai_response:
            logger.warning(f"AI classification failed for question {raw_q.get('question_number')}: {ai_response.get('error_message', 'Unknown error')}")
            # Use defaults if AI fails
            marks_value = raw_q.get('marks')
            if marks_value is None:
                marks_value = 0
            else:
                marks_value = int(marks_value)
            
            return {
                "question_text": raw_q['text'],
                "topic": "Unknown",
                "qtype": "Unknown",
                "marks": marks_value,
                "question_number": raw_q.get('question_number', 1)
            }
        
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
        
        return {
            "question_text": raw_q['text'],
            "topic": ai_response.get("topic", "Unknown"),
            "qtype": ai_response.get("qtype", "Unknown"),
            "marks": marks_value,  # Always an integer, never null
            "question_number": ai_response.get("question_number", raw_q.get('question_number', 1))
        }
    except Exception as e:
        logger.error(f"AI classification error: {e}", exc_info=True)
        marks_value = raw_q.get('marks', 0)
        if marks_value is None:
            marks_value = 0
        else:
            try:
                marks_value = int(marks_value)
            except (ValueError, TypeError):
                marks_value = 0
        
        return {
            "question_text": raw_q.get('text', ''),
            "topic": "Unknown",
            "qtype": "Unknown",
            "marks": marks_value,
            "question_number": raw_q.get('question_number', 1),
            "error": str(e)
        }


@router.post("/multi")
async def analyze_multiple(request: MultiAnalyzeRequest) -> Dict:
    """
    Analyze multiple uploaded papers with improved multi-file context:
    1. Combine OCR from all files (internal combine-ocr call)
    2. Extract questions from combined text with context awareness
    3. Detect duplicate questions across files
    4. Classify using AI
    5. Store in database
    6. Compute combined topic frequencies
    
    Returns:
        Combined analysis results with all questions and topic frequencies
    """
    if not request.file_ids:
        raise HTTPException(
            status_code=400,
            detail="No file IDs provided"
        )
    
    analysis_logger.info(f"[MULTI-ANALYZE] Starting multi-file analysis for {len(request.file_ids)} file(s)")
    logger.info(f"Starting multi-file analysis for {len(request.file_ids)} file(s)")
    
    # Step 1: Combine OCR from all files (internal combine-ocr call)
    analysis_logger.info(f"[MULTI-ANALYZE] Step 1: Combining OCR from {len(request.file_ids)} file(s)...")
    
    all_ocr_texts = []
    processed_file_ids = []
    failed_file_ids = []
    
    # Run OCR on each file and collect texts
    for file_id in request.file_ids:
        try:
            # Find file by file_id
            file_path = find_file_by_id(file_id)
            absolute_path = str(file_path.resolve())
            file_size = os.path.getsize(absolute_path)
            
            analysis_logger.info(f"[MULTI-ANALYZE] Running OCR on file_id: {file_id}")
            analysis_logger.info(f"[MULTI-ANALYZE] File: {file_path.name}, Size: {file_size:,} bytes")
            
            # Run OCR
            ocr_text = run_best_ocr(absolute_path)
            
            if not ocr_text:
                analysis_logger.warning(f"[MULTI-ANALYZE] OCR failed for file_id: {file_id}")
                failed_file_ids.append(file_id)
                continue
            
            all_ocr_texts.append(ocr_text)
            processed_file_ids.append(file_id)
            analysis_logger.info(f"[MULTI-ANALYZE] ✓ OCR extracted {len(ocr_text):,} characters from {file_path.name}")
            
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Error processing file_id {file_id}: {str(e)}", exc_info=True)
            analysis_logger.error(f"[MULTI-ANALYZE] ✗ Error processing file_id: {file_id} - {str(e)}")
            failed_file_ids.append(file_id)
            continue
    
    # Check if we got any OCR text
    if not all_ocr_texts:
        analysis_logger.error(f"[MULTI-ANALYZE] No OCR text extracted from any files")
        raise HTTPException(
            status_code=400,
            detail=f"No OCR text extracted from any files. Failed file IDs: {failed_file_ids}"
        )
    
    # Step 2: Combine OCR texts
    combined_ocr = "\n\n".join(all_ocr_texts)
    total_ocr_length = len(combined_ocr)
    
    analysis_logger.info(f"[MULTI-ANALYZE] Step 2: Combined OCR complete")
    analysis_logger.info(f"[MULTI-ANALYZE] Combined OCR length: {total_ocr_length:,} characters from {len(all_ocr_texts)} file(s)")
    analysis_logger.info(f"[MULTI-ANALYZE] Files combined: {', '.join(processed_file_ids)}")
    
    # Step 3: Extract questions with multi-file context
    analysis_logger.info(f"[MULTI-ANALYZE] Step 3: Extracting questions with multi-file context...")
    raw_questions = extract_questions_with_context(combined_ocr, global_context=all_ocr_texts)
    
    questions_before_dedup = len(raw_questions)
    analysis_logger.info(f"[MULTI-ANALYZE] Extracted {questions_before_dedup} questions before deduplication")
    
    if not raw_questions:
        analysis_logger.error(f"[MULTI-ANALYZE] No questions found in combined OCR text")
        raise HTTPException(
            status_code=400,
            detail="No questions found in any of the provided files"
        )
    
    # Step 4: Classify questions using AI
    analysis_logger.info(f"[MULTI-ANALYZE] Step 4: Classifying {len(raw_questions)} questions with AI...")
    
    # Test API key on first question to fail fast if invalid
    first_question = raw_questions[0]
    test_classification = classify_question(first_question)
    
    # Check if API key is invalid (401 error)
    if "error" in test_classification and test_classification.get("error_type") == "authentication_error":
        raise HTTPException(
            status_code=401,
            detail=(
                "OpenRouter API key is invalid or expired. "
                "Please check your OPENROUTER_API_KEY in the .env file. "
                "Get a valid API key from https://openrouter.ai/keys"
            )
        )
    
    all_questions = []
    
    # Add first question
    all_questions.append(test_classification)
    db.insert_question(test_classification)
    
    # Process remaining questions
    for raw_q in raw_questions[1:]:
        classified_q = classify_question(raw_q)
        all_questions.append(classified_q)
        db.insert_question(classified_q)
    
    questions_after_dedup = len(all_questions)
    analysis_logger.info(f"[MULTI-ANALYZE] Questions after deduplication: {questions_after_dedup}")
    
    # Step 5: Compute combined topic frequencies
    topics = [q['topic'] for q in all_questions if q['topic'] != "Unknown"]
    topic_counts = Counter(topics)
    total_questions = len(all_questions)
    
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
    
    analysis_logger.info(f"[MULTI-ANALYZE] ✓ Analysis complete: {total_questions} questions, {len(topic_frequencies)} topics")
    analysis_logger.info(f"[MULTI-ANALYZE] Top topics: {', '.join([t['topic'] for t in topic_frequencies[:3]])}")
    analysis_logger.info(f"[MULTI-ANALYZE] Summary: {questions_before_dedup} questions extracted, {questions_after_dedup} after deduplication")
    
    return {
        "message": "Multi-file analysis complete",
        "file_ids": request.file_ids,
        "processed_file_ids": processed_file_ids,
        "failed_file_ids": failed_file_ids if failed_file_ids else None,
        "total_questions": total_questions,
        "questions": all_questions,
        "topic_frequencies": topic_frequencies,
        "combined_ocr_length": total_ocr_length,
        "questions_before_dedup": questions_before_dedup
    }
