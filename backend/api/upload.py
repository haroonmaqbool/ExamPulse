"""
File upload endpoint
Handles PDF and image uploads for past exam papers.
"""

import os
import uuid
from pathlib import Path
from fastapi import APIRouter, UploadFile, File, HTTPException
from typing import Dict
from dotenv import load_dotenv
import logging

load_dotenv()

logger = logging.getLogger("ExamPulse.Upload")
router = APIRouter()

# Upload directory (configurable via .env, defaults to ./uploads)
UPLOAD_DIR = Path(os.getenv("UPLOAD_DIR", "./uploads"))
UPLOAD_DIR.mkdir(exist_ok=True)

# Allowed file types
ALLOWED_EXTENSIONS = {'.pdf', '.png', '.jpg', '.jpeg'}
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB in bytes


@router.post("/")
async def upload_file(file: UploadFile = File(...)) -> Dict:
    """
    Upload a past exam paper (PDF or image).
    
    Validates file type and size, saves to uploads folder,
    and returns file metadata with unique file ID.
    
    Returns:
        Upload confirmation with file metadata including file_id
    """
    try:
        logger.info(f"Received upload request for file: {file.filename}")
        
        # Validate file extension
        file_ext = Path(file.filename).suffix.lower() if file.filename else ""
        
        if file_ext not in ALLOWED_EXTENSIONS:
            logger.warning(f"Invalid file type: {file_ext}")
            raise HTTPException(
                status_code=400,
                detail=f"Invalid file type. Allowed types: PDF, PNG, JPG, JPEG"
            )
        
        # Read file content to check size
        logger.info("Reading file content...")
        content = await file.read()
        file_size = len(content)
        logger.info(f"File size: {file_size:,} bytes")
        
        # Validate file size
        if file_size > MAX_FILE_SIZE:
            logger.warning(f"File too large: {file_size:,} bytes")
            raise HTTPException(
                status_code=400,
                detail=f"File too large. Maximum size: {MAX_FILE_SIZE / (1024*1024):.0f}MB"
            )
        
        if file_size == 0:
            logger.warning("Empty file received")
            raise HTTPException(
                status_code=400,
                detail="File is empty"
            )
        
        # Generate unique file ID
        file_id = str(uuid.uuid4())
        
        # Create filename with file_id to avoid conflicts
        original_filename = file.filename or "uploaded_file"
        safe_filename = f"{file_id}_{original_filename}"
        file_path = UPLOAD_DIR / safe_filename
        
        logger.info(f"Saving file to: {file_path}")
        
        # Save file
        try:
            with open(file_path, "wb") as f:
                f.write(content)
            logger.info(f"File saved successfully: {file_path}")
        except Exception as e:
            logger.error(f"Failed to save file: {str(e)}", exc_info=True)
            raise HTTPException(
                status_code=500,
                detail=f"Failed to save file: {str(e)}"
            )
        
        response_data = {
            "message": "File uploaded successfully",
            "file_id": file_id,
            "filename": original_filename,
            "file_path": str(file_path),
            "file_size": file_size,
            "content_type": file.content_type,
            "file_type": file_ext[1:] if file_ext else "unknown"  # Remove the dot
        }
        
        logger.info(f"Upload successful: {file_id}")
        return response_data
        
    except HTTPException:
        # Re-raise HTTP exceptions
        raise
    except Exception as e:
        logger.error(f"Unexpected error during upload: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail=f"Upload failed: {str(e)}"
        )

