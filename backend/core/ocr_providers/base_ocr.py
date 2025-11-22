"""
Base OCR Provider
Abstract base class for all OCR providers.
"""

from abc import ABC, abstractmethod
from typing import Optional
import logging

logger = logging.getLogger("ExamPulse.OCR.Base")


class BaseOCR(ABC):
    """
    Abstract base class for OCR providers.
    All OCR providers must implement extract_text().
    """
    
    def __init__(self, name: str):
        """
        Initialize OCR provider.
        
        Args:
            name: Human-readable name of the provider
        """
        self.name = name
        self.logger = logging.getLogger(f"ExamPulse.OCR.{name}")
    
    @abstractmethod
    def extract_text(self, file_path: str) -> Optional[str]:
        """
        Extract text from a file.
        
        Args:
            file_path: Path to the file (PDF or image)
        
        Returns:
            Extracted text as string, or None if extraction failed
        """
        pass
    
    @abstractmethod
    def is_available(self) -> bool:
        """
        Check if this OCR provider is available (dependencies installed, etc.).
        
        Returns:
            True if provider can be used, False otherwise
        """
        pass
    
    @abstractmethod
    def supports_file_type(self, file_path: str) -> bool:
        """
        Check if this provider supports the given file type.
        
        Args:
            file_path: Path to the file
        
        Returns:
            True if file type is supported, False otherwise
        """
        pass
    
    def get_file_size(self, file_path: str) -> int:
        """
        Get file size in bytes.
        
        Args:
            file_path: Path to the file
        
        Returns:
            File size in bytes
        """
        import os
        try:
            return os.path.getsize(file_path)
        except OSError:
            return 0

