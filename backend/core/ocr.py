"""
OCR Module - Main Entry Point
Modular OCR architecture with provider-based system.
Maintains backward compatibility with existing code.
"""

from typing import Optional
import os
import logging
from pathlib import Path

# Import OCR providers
from .ocr_providers import PyMuPDFOCR, TesseractOCR

# Set up logger
logger = logging.getLogger("ExamPulse.OCR")

# Initialize providers
_pymupdf_provider = PyMuPDFOCR()
_tesseract_provider = TesseractOCR()


def run_best_ocr(file_path: str) -> Optional[str]:
    """
    Run OCR using the best available provider for the file type.
    
    Strategy (priority order):
    1. For PDFs: PyMuPDF → Tesseract (fallback)
    2. For Images: Tesseract
    3. Log which provider was used
    
    Args:
        file_path: Path to the file (PDF or image)
    
    Returns:
        Extracted text, or None if all providers fail
    """
    if not os.path.exists(file_path):
        logger.error(f"File not found: {file_path}")
        return None
    
    file_ext = os.path.splitext(file_path)[1].lower()
    file_size = os.path.getsize(file_path)
    
    logger.info(f"Starting OCR for: {os.path.basename(file_path)} ({file_size:,} bytes, type: {file_ext})")
    
    # Process based on file type
    if file_ext == '.pdf':
        # Use PyMuPDF for PDFs
        if _pymupdf_provider.is_available():
            logger.info("Using PyMuPDF provider for PDF")
            result = _pymupdf_provider.extract_text(file_path)
            if result:
                logger.info(f"✓ PyMuPDF OCR successful: {len(result):,} characters extracted")
                return result
            else:
                logger.warning("✗ PyMuPDF OCR failed, trying Tesseract fallback...")
        
        # Fallback: Try Tesseract for scanned PDFs
        if _tesseract_provider.is_available():
            logger.info("Using Tesseract provider as fallback for PDF")
            result = _tesseract_provider.extract_text(file_path)
            if result:
                logger.info(f"✓ Tesseract OCR successful: {len(result):,} characters extracted")
                return result
            else:
                logger.warning("✗ Tesseract OCR failed")
        else:
            logger.warning("Tesseract not available")
    
    elif file_ext in ['.png', '.jpg', '.jpeg', '.webp', '.tiff']:
        # Use Tesseract for images
        if _tesseract_provider.is_available():
            logger.info("Using Tesseract provider for image")
            result = _tesseract_provider.extract_text(file_path)
            if result:
                logger.info(f"✓ Tesseract OCR successful: {len(result):,} characters extracted")
                return result
            else:
                logger.warning("✗ Tesseract OCR failed")
        else:
            logger.warning("Tesseract not available")
    
    else:
        logger.warning(f"Unsupported file type: {file_ext}")
    
    # All providers failed
    logger.error("All OCR providers failed")
    return None


def run_ocr(file_path: str) -> Optional[str]:
    """
    Main OCR function - maintains backward compatibility.
    
    This is the entry point used by existing code.
    It calls run_best_ocr() and provides fallback to mock OCR.
    
    Args:
        file_path: Path to the uploaded file (PDF or image)
    
    Returns:
        Extracted text from the file, or mock text if extraction fails
    """
    result = run_best_ocr(file_path)
    
    if result:
        return result
    
    # Fallback to mock OCR for testing
    logger.warning("Falling back to mock OCR")
    return _mock_ocr_fallback(file_path)


def _mock_ocr_fallback(file_path: str) -> str:
    """
    Mock OCR fallback when all providers fail.
    
    Args:
        file_path: Path to the uploaded file
    
    Returns:
        Mock extracted text
    """
    file_name = os.path.basename(file_path)
    
    mock_text = f"""
MOCK OCR TEXT - File: {file_name}

Question 1 (5 marks)
This is a sample question extracted using mock OCR fallback.
The actual OCR failed, so this is placeholder text for testing.

Question 2 (10 marks)
Another sample question to demonstrate the mock OCR functionality.
This would normally be extracted by OCR providers.

Question 3 (15 marks)
A third sample question showing the structure of exam papers.
Topics: Algebra, Geometry, Calculus

Note: This is mock data. OCR providers were unable to process this file.
Please check the file format and quality.
"""
    
    return mock_text.strip()
