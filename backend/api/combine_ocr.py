"""
Combine OCR endpoint
Runs OCR on multiple files and returns combined raw text.
Used for advanced multi-file analysis.
"""

import os
from pathlib import Path
from typing import Dict, List
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from dotenv import load_dotenv
import logging

from core.ocr import run_best_ocr
from utils.logger import analysis_logger

load_dotenv()

# Set up logger
logger = logging.getLogger("ExamPulse.CombineOCR")

router = APIRouter()

# Upload directory (configurable via .env, defaults to ./uploads)
UPLOAD_DIR = Path(os.getenv("UPLOAD_DIR", "./uploads"))


class CombineOCRRequest(BaseModel):
    """Request model for combining OCR from multiple files"""
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


@router.post("/")
async def combine_ocr(request: CombineOCRRequest) -> Dict:
    """
    Combine OCR text from multiple files.
    
    Steps:
    1. Run OCR on each file using run_best_ocr()
    2. Combine all OCR text into a single string
    3. Return combined text with metadata
    
    Args:
        request: List of file_ids to process
    
    Returns:
        Combined OCR text and metadata
    """
    if not request.file_ids:
        raise HTTPException(
            status_code=400,
            detail="No file IDs provided"
        )
    
    analysis_logger.info(f"[COMBINE-OCR] Starting OCR combination for {len(request.file_ids)} file(s)")
    
    combined_text_parts = []
    processed_files = []
    failed_files = []
    ocr_providers_used = set()
    
    # Process each file
    for file_id in request.file_ids:
        try:
            # Find file
            file_path = find_file_by_id(file_id)
            file_size = os.path.getsize(file_path)
            
            analysis_logger.info(f"[COMBINE-OCR] Processing file_id: {file_id}")
            analysis_logger.info(f"[COMBINE-OCR] File: {file_path.name}, Size: {file_size:,} bytes")
            
            # Run OCR
            ocr_text = run_best_ocr(str(file_path.resolve()))
            
            if not ocr_text:
                analysis_logger.warning(f"[COMBINE-OCR] OCR failed for file_id: {file_id}")
                failed_files.append(file_id)
                continue
            
            # Track which provider was used (from logs, we can infer)
            # For now, we'll note that OCR succeeded
            combined_text_parts.append(ocr_text)
            processed_files.append({
                "file_id": file_id,
                "filename": file_path.name,
                "ocr_length": len(ocr_text)
            })
            
            analysis_logger.info(f"[COMBINE-OCR] ✓ Extracted {len(ocr_text):,} characters from {file_path.name}")
            
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Error processing file_id {file_id}: {str(e)}", exc_info=True)
            analysis_logger.error(f"[COMBINE-OCR] ✗ Error processing file_id: {file_id} - {str(e)}")
            failed_files.append(file_id)
            continue
    
    # Check if we got any text
    if not combined_text_parts:
        analysis_logger.error(f"[COMBINE-OCR] No OCR text extracted from any files")
        raise HTTPException(
            status_code=400,
            detail="No OCR text extracted from any files"
        )
    
    # Combine all OCR text
    # Add file separators for clarity
    combined_text = "\n\n" + "="*80 + "\n\n".join(
        f"--- FILE: {file_info['filename']} ---\n{text}"
        for file_info, text in zip(processed_files, combined_text_parts)
    )
    
    total_length = len(combined_text)
    analysis_logger.info(f"[COMBINE-OCR] ✓ Combined OCR complete: {total_length:,} total characters from {len(processed_files)} file(s)")
    
    return {
        "message": "OCR combination completed",
        "file_ids": request.file_ids,
        "processed_file_ids": [f["file_id"] for f in processed_files],
        "failed_file_ids": failed_files if failed_files else None,
        "combined_text": combined_text,
        "total_length": total_length,
        "file_details": processed_files
    }

