"""
File upload endpoint
Handles PDF and image uploads for past exam papers.
"""

from fastapi import APIRouter, UploadFile, File

router = APIRouter()


@router.post("/")
async def upload_file(file: UploadFile = File(...)):
    """
    Upload a past exam paper (PDF or image).
    
    Returns:
        Upload confirmation with file metadata
    """
    # TODO: Implement file upload logic
    # - Validate file type (PDF or image)
    # - Save file temporarily
    # - Return file ID or path
    return {
        "message": "File upload endpoint - placeholder",
        "filename": file.filename,
        "content_type": file.content_type
    }

