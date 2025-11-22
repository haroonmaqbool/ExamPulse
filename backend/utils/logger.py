"""
Logging configuration for ExamPulse backend
"""

import logging
import os
from pathlib import Path
from datetime import datetime

# Create logs directory if it doesn't exist
LOG_DIR = Path("logs")
LOG_DIR.mkdir(exist_ok=True)

# Create log filenames with timestamp
LOG_FILENAME = LOG_DIR / f"exampulse_{datetime.now().strftime('%Y%m%d')}.log"
ANALYSIS_LOG_FILENAME = LOG_DIR / f"analysis_{datetime.now().strftime('%Y%m%d')}.log"

# Configure main logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        # Write to file
        logging.FileHandler(LOG_FILENAME, encoding='utf-8'),
        # Also print to console
        logging.StreamHandler()
    ]
)

# Configure analysis-specific logger
analysis_logger = logging.getLogger("ExamPulse.Analysis")
analysis_logger.setLevel(logging.INFO)

# Create analysis log file handler (separate from main log)
analysis_file_handler = logging.FileHandler(ANALYSIS_LOG_FILENAME, encoding='utf-8')
analysis_file_handler.setFormatter(
    logging.Formatter('%(asctime)s - %(levelname)s - %(message)s')
)
analysis_logger.addHandler(analysis_file_handler)
# Don't propagate to root logger to avoid duplicate logs
analysis_logger.propagate = False

# Create logger instance
logger = logging.getLogger("ExamPulse")

# Log startup message
logger.info("=" * 80)
logger.info("ExamPulse Backend - Logging initialized")
logger.info(f"Log file: {LOG_FILENAME.absolute()}")
logger.info("=" * 80)

