"""
OCR Providers Module
Modular OCR architecture with pluggable providers.
"""

from .base_ocr import BaseOCR
from .pymupdf_ocr import PyMuPDFOCR
from .tesseract_ocr import TesseractOCR

__all__ = [
    'BaseOCR',
    'PyMuPDFOCR',
    'TesseractOCR',
]
