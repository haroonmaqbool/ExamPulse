"""
Tesseract OCR Provider
Extracts text from images using Tesseract OCR.
"""

from typing import Optional
import os
import logging
from .base_ocr import BaseOCR

logger = logging.getLogger("ExamPulse.OCR.Tesseract")

# Try to import Tesseract
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


class TesseractOCR(BaseOCR):
    """
    Tesseract OCR provider for image files.
    Supports PNG, JPG, JPEG formats.
    """
    
    def __init__(self):
        super().__init__("Tesseract")
    
    def is_available(self) -> bool:
        """Check if Tesseract is available."""
        return TESSERACT_AVAILABLE
    
    def supports_file_type(self, file_path: str) -> bool:
        """Tesseract supports image files."""
        file_ext = os.path.splitext(file_path)[1].lower()
        return file_ext in ['.png', '.jpg', '.jpeg']
    
    def extract_text(self, file_path: str) -> Optional[str]:
        """
        Extract text from image file using Tesseract OCR.
        
        Args:
            file_path: Path to image file
        
        Returns:
            Extracted text, or None if failed
        """
        if not self.is_available():
            self.logger.warning("Tesseract not available")
            return None
        
        if not os.path.exists(file_path):
            self.logger.error(f"File not found: {file_path}")
            return None
        
        file_size = self.get_file_size(file_path)
        self.logger.info(f"Processing image: {os.path.basename(file_path)} ({file_size:,} bytes)")
        
        try:
            # Open image
            image = Image.open(file_path)
            width, height = image.size
            self.logger.debug(f"Image dimensions: {width}x{height}")
            
            # Run OCR
            text = pytesseract.image_to_string(image, lang='eng')
            
            if not text.strip():
                self.logger.warning("No text extracted from image")
                return None
            
            self.logger.info(f"Successfully extracted {len(text):,} characters")
            return text
            
        except Exception as e:
            self.logger.error(f"Image OCR error: {e}", exc_info=True)
            return None

