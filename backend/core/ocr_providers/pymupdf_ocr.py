"""
PyMuPDF OCR Provider
Extracts text from PDFs using PyMuPDF (fitz).
"""

from typing import Optional
import os
import io
import logging
from .base_ocr import BaseOCR

logger = logging.getLogger("ExamPulse.OCR.PyMuPDF")

# Try to import PyMuPDF
try:
    import fitz  # PyMuPDF
    PYMUPDF_AVAILABLE = True
except ImportError:
    PYMUPDF_AVAILABLE = False

# Try to import Tesseract for fallback OCR on scanned pages
try:
    import pytesseract
    from PIL import Image
    TESSERACT_AVAILABLE = True
    # Configure Tesseract path for Windows
    TESSERACT_PATH = r"C:\Program Files\Tesseract-OCR\tesseract.exe"
    if os.path.exists(TESSERACT_PATH):
        pytesseract.pytesseract.tesseract_cmd = TESSERACT_PATH
except ImportError:
    TESSERACT_AVAILABLE = False


class PyMuPDFOCR(BaseOCR):
    """
    PyMuPDF OCR provider for PDF files.
    Uses direct text extraction, falls back to Tesseract OCR for scanned pages.
    """
    
    def __init__(self):
        super().__init__("PyMuPDF")
    
    def is_available(self) -> bool:
        """Check if PyMuPDF is available."""
        return PYMUPDF_AVAILABLE
    
    def supports_file_type(self, file_path: str) -> bool:
        """PyMuPDF supports PDF files."""
        file_ext = os.path.splitext(file_path)[1].lower()
        return file_ext == '.pdf'
    
    def extract_text(self, file_path: str) -> Optional[str]:
        """
        Extract text from PDF using PyMuPDF.
        
        Tries multiple extraction methods:
        1. Direct text extraction (for text-based PDFs)
        2. OCR on rendered pages (for scanned/image-based PDFs)
        
        Args:
            file_path: Path to PDF file
        
        Returns:
            Extracted text from all pages, or None if failed
        """
        if not self.is_available():
            self.logger.warning("PyMuPDF not available")
            return None
        
        if not os.path.exists(file_path):
            self.logger.error(f"File not found: {file_path}")
            return None
        
        file_size = self.get_file_size(file_path)
        self.logger.info(f"Processing PDF: {os.path.basename(file_path)} ({file_size:,} bytes)")
        
        try:
            # Open PDF with PyMuPDF
            doc = fitz.open(file_path)
            total_pages = len(doc)
            self.logger.info(f"PDF has {total_pages} page(s)")
            
            # Extract text from each page
            all_text = []
            pages_with_text = 0
            pages_without_text = 0
            
            for page_num in range(total_pages):
                self.logger.debug(f"Processing page {page_num + 1}/{total_pages}...")
                page = doc[page_num]
                
                # Method 1: Try direct text extraction first (fastest, works for text-based PDFs)
                text = page.get_text("text", sort=True)
                
                # If no text found, try OCR on the rendered page (for scanned PDFs)
                if not text.strip():
                    pages_without_text += 1
                    self.logger.info(f"  No direct text on page {page_num + 1}, trying OCR...")
                    
                    if TESSERACT_AVAILABLE:
                        try:
                            # Render page as image with higher DPI for better OCR
                            mat = fitz.Matrix(2.0, 2.0)  # 2x zoom = 144 DPI
                            pix = page.get_pixmap(matrix=mat)
                            img_data = pix.tobytes("png")
                            image = Image.open(io.BytesIO(img_data))
                            
                            # Run Tesseract OCR on the image
                            ocr_text = pytesseract.image_to_string(image, lang='eng')
                            
                            if ocr_text.strip():
                                text = ocr_text
                                self.logger.info(f"  OCR extracted {len(text)} chars from page {page_num + 1}")
                            else:
                                self.logger.warning(f"  OCR found no text on page {page_num + 1}")
                        except Exception as ocr_error:
                            self.logger.error(f"  OCR failed for page {page_num + 1}: {ocr_error}")
                    else:
                        self.logger.warning("  Tesseract not available for OCR fallback")
                else:
                    pages_with_text += 1
                    self.logger.debug(f"  Direct extraction: {len(text)} chars from page {page_num + 1}")
                
                if text.strip():
                    all_text.append(text)
            
            doc.close()
            
            # Summary
            self.logger.info(f"Extraction summary: {pages_with_text} pages with direct text, {pages_without_text} pages used OCR")
            
            if all_text:
                combined_text = "\n\n".join(all_text)
                self.logger.info(f"Successfully extracted {len(combined_text):,} characters")
                return combined_text
            else:
                self.logger.error("No text extracted from PDF")
                return None
                
        except Exception as e:
            self.logger.error(f"PDF extraction error: {e}", exc_info=True)
            return None

