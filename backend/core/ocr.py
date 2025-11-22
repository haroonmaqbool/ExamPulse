"""
OCR Module
Hybrid OCR implementation with fallbacks.
1. PyMuPDF (fitz) - Direct PDF text extraction (no external dependencies)
2. Tesseract - Direct image OCR
3. Mock OCR - Fallback for testing
"""

from typing import Optional
import os
import pytesseract
from PIL import Image

# Try to import PyMuPDF (fitz) - PDF text extraction
try:
    import fitz  # PyMuPDF
    PYMUPDF_AVAILABLE = True
except ImportError:
    PYMUPDF_AVAILABLE = False

# Configure Tesseract path for Windows
# On Windows, Tesseract might not be in PATH, so we set it explicitly
TESSERACT_PATH = r"C:\Program Files\Tesseract-OCR\tesseract.exe"
if os.path.exists(TESSERACT_PATH):
    pytesseract.pytesseract.tesseract_cmd = TESSERACT_PATH


def run_ocr(file_path: str) -> Optional[str]:
    """
    Run OCR on uploaded file.
    
    Process:
        1. For PDFs: Use PyMuPDF for direct text extraction
        2. For Images: Use Tesseract OCR
        3. If both fail: Use Mock OCR fallback
    
    Args:
        file_path: Path to the uploaded file (PDF or image)
    
    Returns:
        Extracted text from the file, or mock text if extraction fails
    """
    if not os.path.exists(file_path):
        print(f"File not found: {file_path}")
        return mock_ocr_fallback(file_path)
    
    # Get file extension to determine type
    file_ext = os.path.splitext(file_path)[1].lower()
    
    try:
        # Handle PDF files
        if file_ext == '.pdf':
            if PYMUPDF_AVAILABLE:
                try:
                    print("Extracting text from PDF using PyMuPDF...")
                    return _ocr_pdf(file_path)
                except Exception as e:
                    print(f"PDF extraction failed: {e}")
                    print("Falling back to mock OCR...")
            else:
                print("PyMuPDF not available. Install with: pip install PyMuPDF")
                print("Falling back to mock OCR...")
            
            return mock_ocr_fallback(file_path)
        
        # Handle image files (PNG, JPG, JPEG)
        elif file_ext in ['.png', '.jpg', '.jpeg']:
            return _ocr_image(file_path)
        
        else:
            print(f"Unsupported file type: {file_ext}")
            return mock_ocr_fallback(file_path)
            
    except Exception as e:
        print(f"OCR failed: {e}")
        print(f"Error type: {type(e).__name__}")
        print("Falling back to mock OCR...")
        import traceback
        print("Full traceback:")
        traceback.print_exc()
        return mock_ocr_fallback(file_path)


def _ocr_pdf(file_path: str) -> str:
    """
    Extract text from PDF using PyMuPDF (fitz).
    
    No external dependencies needed - works on Windows, Mac, and Linux.
    
    Args:
        file_path: Path to PDF file
    
    Returns:
        Extracted text from all pages
    """
    try:
        # Open PDF with PyMuPDF
        doc = fitz.open(file_path)
        
        # Extract text from each page
        all_text = []
        for page_num in range(len(doc)):
            print(f"Processing PDF page {page_num + 1}/{len(doc)}...")
            page = doc[page_num]
            text = page.get_text()
            if text.strip():
                all_text.append(text)
        
        doc.close()
        
        if all_text:
            return "\n\n".join(all_text)
        else:
            raise Exception("No text extracted from PDF")
            
    except Exception as e:
        print(f"PDF extraction error: {e}")
        raise




def _ocr_image(file_path: str) -> str:
    """
    Extract text from image file using OCR.
    
    Args:
        file_path: Path to image file
    
    Returns:
        Extracted text
    """
    try:
        # Open image
        image = Image.open(file_path)
        
        # Run OCR
        text = pytesseract.image_to_string(image, lang='eng')
        
        if not text.strip():
            raise Exception("No text extracted from image")
        
        return text
        
    except Exception as e:
        print(f"Image OCR error: {e}")
        raise


def mock_ocr_fallback(file_path: str) -> str:
    """
    Mock OCR fallback when Tesseract fails.
    
    This returns placeholder text for testing purposes.
    In production, you might want to log this or handle it differently.
    
    Args:
        file_path: Path to the uploaded file
    
    Returns:
        Mock extracted text
    """
    file_name = os.path.basename(file_path)
    
    # Return a structured mock text that looks like exam questions
    mock_text = f"""
MOCK OCR TEXT - File: {file_name}

Question 1 (5 marks)
This is a sample question extracted using mock OCR fallback.
The actual OCR failed, so this is placeholder text for testing.

Question 2 (10 marks)
Another sample question to demonstrate the mock OCR functionality.
This would normally be extracted by Tesseract OCR.

Question 3 (15 marks)
A third sample question showing the structure of exam papers.
Topics: Algebra, Geometry, Calculus

Note: This is mock data. Tesseract OCR was unable to process this file.
Please check the file format and quality.
"""
    
    return mock_text.strip()

