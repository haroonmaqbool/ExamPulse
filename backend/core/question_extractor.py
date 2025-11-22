"""
Question Extractor Module
Extracts and cleans questions from OCR text.

Key Features:
- Watermark/Noise Removal: Filters out footer text, watermarks, and boilerplate
- MCQ Option Reconstruction: Converts inline options (A. Time B. Force) to multi-line format
- Context-Aware Extraction: Uses multi-file context for better accuracy

Example MCQ Transformation:
  Before: "Which of the following is a base physical quantity? A. Time B. Force C. Density D. Velocity"
  After:  "Which of the following is a base physical quantity?\nA. Time\nB. Force\nC. Density\nD. Velocity"
"""

import re
import logging
from typing import List, Dict, Any

# Set up logger
logger = logging.getLogger("ExamPulse.QuestionExtractor")


def extract_questions_with_context(ocr_text: str, global_context: List[str] = None) -> List[Dict[str, Any]]:
    """
    Extract questions from OCR text with multi-file context.
    
    When analyzing multiple papers, uses all file texts as context to:
    - Avoid splitting questions incorrectly across pages
    - Merge broken lines more intelligently
    - Detect duplicate questions across files
    - Improve classification accuracy
    
    Args:
        ocr_text: Text extracted from OCR (can be combined from multiple files)
        global_context: Optional list of all file texts for context-aware extraction
    
    Returns:
        List of extracted questions with raw text
        Each question dict contains: {'text': str, 'raw_text': str, 'question_number': int, 'marks': int|None}
    """
    if not ocr_text or not ocr_text.strip():
        logger.warning("Empty OCR text provided")
        return []
    
    # If global context provided, use it for better normalization
    if global_context and len(global_context) > 1:
        logger.info(f"Using multi-file context: {len(global_context)} files")
        # Normalize with context awareness
        normalized_text = _normalize_ocr_text_with_context(ocr_text, global_context)
    else:
        # Single file - use standard normalization
        normalized_text = _normalize_ocr_text(ocr_text)
    
    logger.info(f"Extracting questions from text ({len(normalized_text):,} characters)")
    
    # Save first 500 characters for debugging
    sample_text = normalized_text[:500].replace('\n', '\\n')
    logger.debug(f"Normalized text sample (first 500 chars): {sample_text}")
    
    questions = []
    
    # Split text into lines for better processing
    lines = normalized_text.split('\n')
    
    # Use line-based extraction which is more reliable
    questions = _extract_questions_line_based(lines)
    
    # If line-based didn't work, try simpler approach
    if not questions:
        logger.info("Line-based extraction found no questions, trying simple extraction...")
        questions = _extract_questions_simple(normalized_text)
    
    # Remove duplicates (same question number) - especially important for multi-file
    seen_numbers = set()
    unique_questions = []
    for q in questions:
        if q['question_number'] not in seen_numbers:
            seen_numbers.add(q['question_number'])
            unique_questions.append(q)
        else:
            logger.warning(f"Duplicate question number {q['question_number']} found, keeping first occurrence")
    
    # If multi-file context, also check for duplicate question text (not just numbers)
    if global_context and len(global_context) > 1:
        seen_texts = {}
        deduplicated_questions = []
        for q in unique_questions:
            # Normalize question text for comparison (remove extra spaces, lowercase)
            normalized_q_text = re.sub(r'\s+', ' ', q['text'].lower().strip())
            # Check if we've seen this question before
            if normalized_q_text not in seen_texts:
                seen_texts[normalized_q_text] = q
                deduplicated_questions.append(q)
            else:
                logger.info(f"Duplicate question text detected (Q{q['question_number']}), keeping first occurrence")
        unique_questions = deduplicated_questions
        logger.info(f"After text deduplication: {len(unique_questions)} unique questions")
    
    logger.info(f"Extracted {len(unique_questions)} unique questions")
    
    # Log sample of extracted questions for debugging
    if unique_questions:
        sample = unique_questions[0]
        logger.debug(f"Sample question: Q{sample['question_number']} ({sample.get('marks', 'N/A')} marks) - {sample['text'][:100]}...")
    
    return unique_questions


def extract_questions(ocr_text: str) -> List[Dict[str, Any]]:
    """
    Extract questions from OCR text.
    
    This function identifies questions by looking for common patterns:
    - "Question 1", "Q1", "1.", etc.
    - Marks in parentheses like "(5 marks)", "(10 marks)"
    - Question numbers
    
    Args:
        ocr_text: Text extracted from OCR
    
    Returns:
        List of extracted questions with raw text
        Each question dict contains: {'text': str, 'raw_text': str, 'question_number': int, 'marks': int|None}
    """
    if not ocr_text or not ocr_text.strip():
        logger.warning("Empty OCR text provided")
        return []
    
    logger.info(f"Extracting questions from text ({len(ocr_text):,} characters)")
    
    # Step 1: Normalize OCR text (fix spacing, broken lines, etc.)
    normalized_text = _normalize_ocr_text(ocr_text)
    logger.debug(f"Normalized text length: {len(normalized_text):,} characters")
    
    # Save first 500 characters for debugging
    sample_text = normalized_text[:500].replace('\n', '\\n')
    logger.debug(f"Normalized text sample (first 500 chars): {sample_text}")
    
    questions = []
    
    # Split text into lines for better processing
    lines = normalized_text.split('\n')
    
    # Use line-based extraction which is more reliable
    questions = _extract_questions_line_based(lines)
    
    # If line-based didn't work, try simpler approach
    if not questions:
        logger.info("Line-based extraction found no questions, trying simple extraction...")
        questions = _extract_questions_simple(normalized_text)
    
    # Remove duplicates (same question number)
    seen_numbers = set()
    unique_questions = []
    for q in questions:
        if q['question_number'] not in seen_numbers:
            seen_numbers.add(q['question_number'])
            unique_questions.append(q)
        else:
            logger.warning(f"Duplicate question number {q['question_number']} found, keeping first occurrence")
    
    logger.info(f"Extracted {len(unique_questions)} unique questions")
    
    # Log sample of extracted questions for debugging
    if unique_questions:
        sample = unique_questions[0]
        logger.debug(f"Sample question: Q{sample['question_number']} ({sample.get('marks', 'N/A')} marks) - {sample['text'][:100]}...")
    
    return unique_questions


def _extract_questions_line_based(lines: List[str]) -> List[Dict[str, Any]]:
    """
    Extract questions by processing line by line.
    More reliable than regex for complex formats.
    
    Args:
        lines: List of text lines from OCR
    
    Returns:
        List of extracted questions
    """
    questions = []
    current_question = []
    question_num = None
    found_questions = False
    
    i = 0
    while i < len(lines):
        line = lines[i].strip()
        
        if not line:
            if current_question:
                current_question.append('')  # Preserve paragraph breaks
            i += 1
            continue
        
        # Check if this line starts a new question
        # Look for: "Question 1", "Q1.", "1." at start of line
        question_match = None
        
        # Pattern 5 (checked early): Most lenient - "1." or "1)" with at least 5 chars after
        # This is the PRIMARY pattern for numbered questions (most common format)
        # Pattern: digits, dot/paren, space, then at least 5 characters
        match = re.match(r'^\s*([1-9]\d{0,1})[\.\)]\s+(.{5,})', line)
        if match:
            q_num = int(match.group(1))
            if q_num <= 50:  # Reasonable question number
                # Check that it's not part of a decimal or list item in the middle of text
                is_likely_question = True
                if i > 0:
                    prev_line = lines[i-1].strip() if i > 0 else ""
                    # If previous line ends with digit, might be part of a decimal
                    if prev_line and prev_line[-1].isdigit():
                        is_likely_question = False
                    # If previous line ends with punctuation and this looks like continuation, skip
                    if prev_line and prev_line[-1] in '.,;:' and len(line) < 20:
                        is_likely_question = False
                
                if is_likely_question:
                    question_match = match
                    logger.debug(f"Detected numbered question start: '{line[:80]}'")
        
        # If Pattern 5 didn't match, try more specific patterns
        if not question_match:
            # Pattern 1: "Question 1" or "Question 1:" (most reliable)
            match = re.match(r'^(?:Question\s+)(\d+)[\.\):]?\s+([A-Z])', line, re.IGNORECASE)
            if match:
                question_match = match
            else:
                # Pattern 2: "Q1." or "Q 1." or "Q1:" format
                match = re.match(r'^(?:Q\.?\s*)(\d+)[\.\):]\s+([A-Z])', line, re.IGNORECASE)
                if match:
                    question_match = match
                else:
                    # Pattern 3: "1." or "1)" at start, followed by space and capital letter
                    # Must start with 1-9 (not 0) to avoid matching decimals like "0.012345678"
                    # Must be reasonable question number (1-50)
                    match = re.match(r'^([1-9]\d{0,1})[\.\)]\s+([A-Z])', line)
                    if match:
                        q_num = int(match.group(1))
                        if q_num <= 50:  # Reasonable question number
                            # Additional check: previous line shouldn't end with digit (not part of decimal)
                            if i == 0 or not (lines[i-1].strip() and lines[i-1].strip()[-1].isdigit()):
                                question_match = match
                    else:
                        # Pattern 4: "1)" or "1." at start of line (more lenient, but still requires capital after)
                        match = re.match(r'^([1-9]\d{0,1})[\.\)]\s*([A-Z])', line)
                        if match and int(match.group(1)) <= 50:
                            question_match = match
        
        if question_match:
            found_questions = True
            detected_num = int(question_match.group(1))
            
            # Save previous question if exists
            if current_question and question_num is not None:
                # Join all lines of the question
                question_text = '\n'.join(current_question).strip()
                
                # Remove trailing question number patterns that might have been captured
                # (e.g., if "Question 3" was captured as part of Q2's text)
                question_text = re.sub(r'\s*(?:Question\s*)?(?:Q\.?\s*)?\d+[\.\):]?\s*$', '', question_text, flags=re.IGNORECASE)
                
                if question_text and len(question_text) > 15:
                    # Try to extract marks
                    marks_match = re.search(r'\((\d+)\s*marks?\)', question_text, re.IGNORECASE)
                    marks = int(marks_match.group(1)) if marks_match else None
                    
                    cleaned_text = clean_question_text(question_text)
                    
                    # Check if MCQ was reconstructed
                    if '\n' in cleaned_text and re.search(r'^[A-D][\.\)]\s+', cleaned_text, re.MULTILINE):
                        logger.debug(f"Extracted Q{question_num} (MCQ with {len(re.findall(r'^[A-D][\.\)]', cleaned_text, re.MULTILINE))} options)")
                    
                    if cleaned_text:
                        questions.append({
                            'question_number': question_num,
                            'marks': marks,
                            'text': cleaned_text,
                            'raw_text': question_text
                        })
                        logger.debug(f"Extracted Q{question_num}: {cleaned_text[:80]}...")
            
            # Start new question
            question_num = detected_num
            # Remove the question number prefix from the line
            # Handle both "Question X" format and simple "X." format
            line_without_prefix = re.sub(r'^(?:Question\s*)?(?:Q\.?\s*)?\d+[\.\):]?\s*', '', line, flags=re.IGNORECASE)
            # Also handle simple numbered format "X. text"
            if line_without_prefix == line:  # If no match, try simple format
                line_without_prefix = re.sub(r'^\s*\d+[\.\)]\s+', '', line)
            current_question = [line_without_prefix] if line_without_prefix.strip() else []
        else:
            # Continuation of current question
            if question_num is not None:
                # Check if this line starts with option markers (A., B., C., D.) - end of question
                if re.match(r'^[A-D][\.\)]\s+', line, re.IGNORECASE):
                    # This is likely the start of answer options, so we've reached the end of the question
                    # But still include this line as it might be part of the question text
                    current_question.append(line)
                    # Continue until we see the next question or run out of lines
                else:
                    # Check if this line might be the start of a new question (but wasn't caught by regex)
                    # Use the same lenient pattern as Pattern 5 above
                    potential_new_q = re.match(r'^\s*([1-9]\d{0,1})[\.\)]\s+(.{5,})', line)
                    if potential_new_q:
                        potential_num = int(potential_new_q.group(1))
                        if potential_num <= 50:  # Reasonable question number
                            # Check if this number is close to or after our current question number
                            # If it's the next question, save current and start new
                            if potential_num == question_num + 1 or (potential_num > question_num and potential_num - question_num <= 2):
                                # This is likely the next question
                                # Save current question first
                                question_text = '\n'.join(current_question).strip()
                                if question_text and len(question_text) > 15:
                                    marks_match = re.search(r'\((\d+)\s*marks?\)', question_text, re.IGNORECASE)
                                    marks = int(marks_match.group(1)) if marks_match else None
                                    cleaned_text = clean_question_text(question_text)
                                    
                                    # Check if MCQ was reconstructed
                                    if '\n' in cleaned_text and re.search(r'^[A-D][\.\)]\s+', cleaned_text, re.MULTILINE):
                                        logger.debug(f"Extracted Q{question_num} (MCQ with {len(re.findall(r'^[A-D][\.\)]', cleaned_text, re.MULTILINE))} options)")
                                    
                                    if cleaned_text:
                                        questions.append({
                                            'question_number': question_num,
                                            'marks': marks,
                                            'text': cleaned_text,
                                            'raw_text': question_text
                                        })
                                # Start new question
                                question_num = potential_num
                                line_without_prefix = re.sub(r'^\s*\d+[\.\)]\s+', '', line)
                                current_question = [line_without_prefix] if line_without_prefix.strip() else []
                                logger.debug(f"Detected numbered question start (fallback): '{line[:80]}'")
                            else:
                                # Not a new question, just part of current question (might be a number in the text)
                                current_question.append(line)
                        else:
                            # Number too large, not a question
                            current_question.append(line)
                    else:
                        # Regular continuation - add to current question
                        current_question.append(line)
            # If we haven't found a question yet, this might be header text - skip it
        
        i += 1
    
    # Add last question
    if current_question and question_num is not None:
        question_text = '\n'.join(current_question).strip()
        if question_text and len(question_text) > 15:
            marks_match = re.search(r'\((\d+)\s*marks?\)', question_text, re.IGNORECASE)
            marks = int(marks_match.group(1)) if marks_match else None
            cleaned_text = clean_question_text(question_text)
            if cleaned_text:
                questions.append({
                    'question_number': question_num,
                    'marks': marks,
                    'text': cleaned_text,
                    'raw_text': question_text
                })
    
    if found_questions:
        logger.info(f"Line-based extraction found {len(questions)} questions")
    else:
        logger.warning("No question indicators found in text")
    
    return questions


def _extract_questions_simple(ocr_text: str) -> List[Dict[str, Any]]:
    """
    Simple extraction method when pattern matching fails.
    Splits text by common question indicators.
    
    Args:
        ocr_text: Text extracted from OCR
    
    Returns:
        List of extracted questions
    """
    logger.info("Using simple line-based extraction method")
    questions = []
    
    # Split by common question separators
    # Look for lines starting with numbers or "Q"
    lines = ocr_text.split('\n')
    current_question = []
    question_num = 1
    found_questions = False
    
    for line in lines:
        line = line.strip()
        if not line:
            if current_question:  # Add blank line to current question
                current_question.append('')
            continue
        
        # Enhanced regex patterns for better question detection
        # Pattern 1: "Question 1" or "Question 1:" (most reliable)
        question_match = re.match(r'^(?:Question\s+)(\d+)[\.\):]?\s+([A-Z])', line, re.IGNORECASE)
        
        if not question_match:
            # Pattern 2: "Q1." or "Q 1." or "Q1:" format
            question_match = re.match(r'^(?:Q\.?\s*)(\d+)[\.\):]\s+([A-Z])', line, re.IGNORECASE)
        
        if not question_match:
            # Pattern 3: "1." or "1)" at start, followed by space and capital letter
            # Must start with 1-9 (not 0) to avoid matching decimals
            question_match = re.match(r'^([1-9]\d{0,1})[\.\)]\s+([A-Z])', line)
            if question_match and int(question_match.group(1)) > 50:
                question_match = None  # Skip if number too large
        
        if not question_match:
            # Pattern 4: Most lenient - "1." or "1)" with at least 5-7 non-space chars after
            # This catches questions that don't start with capital or have different formatting
            question_match = re.match(r'^\s*([1-9]\d{0,1})[\.\)]\s+(.{5,})', line)
            if question_match:
                q_num = int(question_match.group(1))
                if q_num > 50:
                    question_match = None  # Skip if number too large
                else:
                    logger.debug(f"Detected numbered question start (simple): '{line[:80]}'")
        
        if question_match:
            found_questions = True
            detected_num = int(question_match.group(1))
            
            # Skip if number is suspiciously large (likely false match)
            if detected_num > 50:
                current_question.append(line)
                continue
            
            # Save previous question if exists
            if current_question:
                text = clean_question_text('\n'.join(current_question))
                if text and len(text) > 15:  # Only add if meaningful text
                    # Try to extract marks from the question
                    marks_match = re.search(r'\((\d+)\s*marks?\)', '\n'.join(current_question), re.IGNORECASE)
                    marks = int(marks_match.group(1)) if marks_match else None
                    
                    # Check if MCQ was reconstructed
                    if '\n' in text and re.search(r'^[A-D][\.\)]\s+', text, re.MULTILINE):
                        logger.debug(f"Extracted Q{question_num} (MCQ with {len(re.findall(r'^[A-D][\.\)]', text, re.MULTILINE))} options)")
                    
                    questions.append({
                        'question_number': question_num,
                        'marks': marks,
                        'text': text,
                        'raw_text': '\n'.join(current_question)
                    })
                    question_num = detected_num  # Update to detected number
                current_question = []
            else:
                question_num = detected_num  # First question
        
        current_question.append(line)
    
    # Add last question
    if current_question:
        text = clean_question_text('\n'.join(current_question))
        if text and len(text) > 10:
            marks_match = re.search(r'\((\d+)\s*marks?\)', '\n'.join(current_question), re.IGNORECASE)
            marks = int(marks_match.group(1)) if marks_match else None
            
            # Check if MCQ was reconstructed
            if '\n' in text and re.search(r'^[A-D][\.\)]\s+', text, re.MULTILINE):
                logger.debug(f"Extracted Q{question_num} (MCQ with {len(re.findall(r'^[A-D][\.\)]', text, re.MULTILINE))} options)")
            
            questions.append({
                'question_number': question_num,
                'marks': marks,
                'text': text,
                'raw_text': '\n'.join(current_question)
            })
    
    if not found_questions:
        logger.warning("No question indicators found in text. Trying paragraph-based extraction...")
        # Last resort: split by double newlines (paragraphs)
        paragraphs = ocr_text.split('\n\n')
        for idx, para in enumerate(paragraphs, 1):
            para = para.strip()
            if para and len(para) > 20:  # Only meaningful paragraphs
                questions.append({
                    'question_number': idx,
                    'marks': None,
                    'text': clean_question_text(para),
                    'raw_text': para
                })
    
    logger.info(f"Simple extraction found {len(questions)} questions")
    return questions


def _remove_watermark_lines(lines: List[str]) -> List[str]:
    """
    Remove watermark, footer, and noise lines from OCR text.
    
    Removes lines containing:
    - Watermark keywords (AKU-EB, Examinations, Teaching & Learning, etc.)
    - Page numbers (Page X of Y format)
    - Mostly uppercase boilerplate (> 20 chars, no digits, no lowercase)
    
    Args:
        lines: List of text lines
    
    Returns:
        Filtered list of lines with watermarks removed
    """
    watermark_keywords = [
        'aku-eb',
        'examinations',
        'teaching & learning',
        'for teaching',
        'page',
    ]
    
    filtered_lines = []
    removed_count = 0
    
    for line in lines:
        line_stripped = line.strip()
        if not line_stripped:
            filtered_lines.append(line)  # Keep empty lines
            continue
        
        line_lower = line_stripped.lower()
        
        # Check for watermark keywords
        is_watermark = False
        for keyword in watermark_keywords:
            if keyword in line_lower:
                # Special handling for "Page" - only remove if it's "Page X of Y" format
                if keyword == 'page':
                    if re.search(r'page\s+\d+\s+(of|/)\s+\d+', line_lower):
                        is_watermark = True
                        break
                else:
                    is_watermark = True
                    break
        
        if is_watermark:
            removed_count += 1
            logger.debug(f"Removed watermark line: {line_stripped[:80]}")
            continue
        
        # Check for mostly uppercase boilerplate (no digits, no lowercase, > 20 chars)
        if len(line_stripped) > 20:
            # Count uppercase, lowercase, digits
            upper_count = sum(1 for c in line_stripped if c.isupper())
            lower_count = sum(1 for c in line_stripped if c.islower())
            digit_count = sum(1 for c in line_stripped if c.isdigit())
            total_chars = len([c for c in line_stripped if c.isalnum()])
            
            if total_chars > 0:
                upper_ratio = upper_count / total_chars
                # If > 80% uppercase, no lowercase, and no digits -> likely boilerplate
                if upper_ratio > 0.8 and lower_count == 0 and digit_count == 0:
                    removed_count += 1
                    logger.debug(f"Removed boilerplate line: {line_stripped[:80]}")
                    continue
        
        # Keep the line
        filtered_lines.append(line)
    
    if removed_count > 0:
        logger.info(f"Removed {removed_count} watermark/noise lines")
    
    return filtered_lines


def _reconstruct_mcq_options(question_text: str) -> str:
    """
    Reconstruct MCQ options from flattened inline format.
    
    Example transformation:
    Input: "Which of the following is a base physical quantity? A. Time B. Force C. Density D. Velocity"
    Output: "Which of the following is a base physical quantity?\nA. Time\nB. Force\nC. Density\nD. Velocity"
    
    Args:
        question_text: Question text that may contain inline options
    
    Returns:
        Question text with options properly formatted on separate lines
    """
    # Pattern to detect option markers: A., B., C., D. or A), B), etc.
    # Look for patterns like "A. Text B. Text C. Text D. Text" in a single line
    # Updated pattern to handle various spacing - use DOTALL to match across newlines if needed
    option_pattern = r'\b([A-D][\.\)])\s+([^A-D]+?)(?=\s+[A-D][\.\)]|$)'
    
    # Check if this looks like an MCQ with inline options
    # Must have at least 2 options (A. and B.) in the text
    # Use DOTALL flag to allow matching across newlines (in case options are split)
    option_matches = list(re.finditer(option_pattern, question_text, re.IGNORECASE | re.DOTALL))
    
    if len(option_matches) < 2:
        # Not an MCQ or already formatted - return as is
        return question_text
    
    # Find where options start (first A., B., C., or D.)
    first_option_pos = option_matches[0].start()
    
    # Split into question part and options part
    question_part = question_text[:first_option_pos].strip()
    options_part = question_text[first_option_pos:].strip()
    
    # Extract all options
    options = []
    for match in option_matches:
        option_marker = match.group(1)  # A., B., etc.
        option_text = match.group(2).strip()  # Text after the marker
        
        # Clean up option text (remove trailing punctuation that might be from next option)
        option_text = re.sub(r'\s+$', '', option_text)
        
        if option_text:
            options.append(f"{option_marker} {option_text}")
    
    # Reconstruct: question on first line, each option on its own line
    if options:
        reconstructed = question_part
        if reconstructed and not reconstructed.endswith('?'):
            # Add newline before options if question doesn't end with ?
            reconstructed += '\n'
        reconstructed += '\n'.join(options)
        
        logger.debug(f"Reconstructed MCQ with {len(options)} options")
        return reconstructed
    
    return question_text


def _normalize_ocr_text(ocr_text: str) -> str:
    """
    Normalize OCR text to fix common issues.
    
    Fixes:
    - Removes watermark/footer lines
    - Weird spacing (multiple spaces, tabs)
    - Broken lines (lines that should be connected)
    - Preserves question numbers
    - Fixes common OCR errors
    
    Args:
        ocr_text: Raw OCR text
    
    Returns:
        Normalized text
    """
    if not ocr_text:
        return ""
    
    # Step 0: Remove watermark/noise lines first
    lines = ocr_text.split('\n')
    lines = _remove_watermark_lines(lines)
    
    # Step 1: Fix line breaks - join lines that are clearly part of the same sentence
    normalized_lines = []
    
    for i, line in enumerate(lines):
        line = line.strip()
        if not line:
            normalized_lines.append('')
            continue
        
        # If line doesn't end with punctuation and next line doesn't start with capital/question number,
        # it might be a broken line - join with space
        if i < len(lines) - 1:
            next_line = lines[i + 1].strip()
            # Don't join if:
            # - Current line ends with punctuation (. ! ? : ;)
            # - Next line starts with question number (1. Q1 Question 1)
            # - Next line starts with capital letter (likely new sentence)
            # - Current line is very short (likely a label/header)
            should_join = (
                not re.search(r'[.!?:;]$', line) and
                not re.match(r'^(?:Question\s*)?(?:Q\.?\s*)?\d+[\.\):]', next_line, re.IGNORECASE) and
                not (next_line and next_line[0].isupper() and len(line) > 20) and
                len(line) > 3
            )
            
            if should_join and next_line:
                line = line + ' ' + next_line
                # Skip next line since we joined it
                lines[i + 1] = ''
        
        normalized_lines.append(line)
    
    # Join all lines back
    text = '\n'.join(normalized_lines)
    
    # Step 2: Fix spacing issues
    # Replace multiple spaces/tabs with single space
    text = re.sub(r'[ \t]+', ' ', text)
    
    # Fix spacing around punctuation (but keep question numbers intact)
    # Don't remove space before numbers (could be question numbers)
    text = re.sub(r'\s+([,.!?;:])', r'\1', text)
    text = re.sub(r'([,.!?;:])\s*([,.!?;:])', r'\1\2', text)
    
    # Step 3: Fix common OCR errors
    # Fix broken question numbers (e.g., "Q uestion 1" -> "Question 1")
    text = re.sub(r'Q\s+uestion\s+(\d+)', r'Question \1', text, flags=re.IGNORECASE)
    text = re.sub(r'Q\s*\.\s*(\d+)', r'Q\1', text, flags=re.IGNORECASE)
    
    # Fix broken marks (e.g., "(5 m arks)" -> "(5 marks)")
    text = re.sub(r'\((\d+)\s*m\s*arks?\)', r'(\1 marks)', text, flags=re.IGNORECASE)
    
    # Step 4: Normalize multiple newlines (but keep paragraph breaks)
    text = re.sub(r'\n{4,}', '\n\n\n', text)  # Max 3 newlines
    
    # Step 5: Final cleanup
    text = text.strip()
    
    return text


def _normalize_ocr_text_with_context(ocr_text: str, global_context: List[str]) -> str:
    """
    Normalize OCR text with multi-file context awareness.
    
    Uses patterns from all files to:
    - Better detect question boundaries
    - Merge broken lines more intelligently
    - Avoid splitting questions across file boundaries
    
    Args:
        ocr_text: Current file's OCR text
        global_context: List of all file texts for pattern detection
    
    Returns:
        Normalized text with context-aware improvements
    """
    if not ocr_text:
        return ""
    
    # First, normalize the current text
    normalized = _normalize_ocr_text(ocr_text)
    
    # Analyze patterns across all files to improve normalization
    # Extract common question patterns from all files
    all_question_patterns = []
    for context_text in global_context:
        # Find question indicators in each file
        patterns = re.findall(r'(?:Question\s+)(\d+)|(?:Q\.?\s*)(\d+)|^([1-9]\d{0,1})[\.\)]', context_text, re.MULTILINE | re.IGNORECASE)
        all_question_patterns.extend(patterns)
    
    # Use patterns to better detect question boundaries
    # If we see a pattern that looks like a question number but wasn't caught,
    # it might be a broken line that needs joining
    
    lines = normalized.split('\n')
    improved_lines = []
    i = 0
    
    while i < len(lines):
        line = lines[i].strip()
        
        if not line:
            improved_lines.append('')
            i += 1
            continue
        
        # Check if this line might be a continuation of previous line
        # (doesn't start with capital/question number, previous line doesn't end with punctuation)
        if i > 0 and improved_lines:
            prev_line = improved_lines[-1].strip()
            # If previous line doesn't end with punctuation and current doesn't start with question pattern,
            # they might be part of the same sentence
            if (prev_line and 
                not re.search(r'[.!?:;]$', prev_line) and
                not re.match(r'^(?:Question\s+)?(?:Q\.?\s*)?\d+[\.\):]', line, re.IGNORECASE) and
                not (line and line[0].isupper() and len(prev_line) > 30)):
                # Join with previous line
                improved_lines[-1] = prev_line + ' ' + line
                i += 1
                continue
        
        improved_lines.append(line)
        i += 1
    
    # Join back
    improved_text = '\n'.join(improved_lines)
    
    # Additional cleanup for multi-file context
    # Remove file separator artifacts if present
    improved_text = re.sub(r'={3,}.*?={3,}', '', improved_text)  # Remove separator lines
    improved_text = re.sub(r'---\s*FILE:.*?---\s*', '', improved_text, flags=re.IGNORECASE)  # Remove file headers
    
    # Remove watermark lines from improved text
    lines = improved_text.split('\n')
    lines = _remove_watermark_lines(lines)
    improved_text = '\n'.join(lines)
    
    return improved_text.strip()


def clean_question_text(raw_text: str) -> str:
    """
    Clean and normalize question text.
    
    Removes:
    - Extra whitespace
    - Common OCR artifacts
    - Watermark text fragments (e.g., "2025only")
    - Fixes common OCR errors
    
    Reconstructs:
    - MCQ options from inline format to multi-line format
    
    Args:
        raw_text: Raw question text from OCR
    
    Returns:
        Cleaned question text with proper formatting
    
    Example MCQ transformation:
    Before: "Which of the following is a base physical quantity? A. Time B. Force C. Density D. Velocity"
    After:  "Which of the following is a base physical quantity?\nA. Time\nB. Force\nC. Density\nD. Velocity"
    """
    if not raw_text:
        return ""
    
    # Remove leading/trailing whitespace
    text = raw_text.strip()
    
    # Step 1: Remove watermark fragments that might appear in the middle of text
    # Remove patterns like "2025only", "AKU-EB", etc. that appear as fragments
    # More flexible pattern: matches "2025only" even if attached to punctuation
    text = re.sub(r'\d{4}only\b', '', text, flags=re.IGNORECASE)  # Remove "2025only" type patterns (removed \b before digits)
    text = re.sub(r'\bAKU-EB\b', '', text, flags=re.IGNORECASE)  # Remove AKU-EB fragments
    text = re.sub(r'\bExaminations\s+\d{4}\b', '', text, flags=re.IGNORECASE)  # Remove "Examinations 2025"
    # Also remove standalone watermark fragments that might appear anywhere
    text = re.sub(r'\s+2025only\b', '', text, flags=re.IGNORECASE)  # Remove " 2025only" with space before
    text = re.sub(r'2025only\s+', '', text, flags=re.IGNORECASE)  # Remove "2025only " with space after
    
    # Step 2: Normalize multiple spaces to single space (but preserve newlines)
    # First, normalize spaces within lines
    lines = text.split('\n')
    normalized_lines = []
    for line in lines:
        # Normalize spaces but keep the line structure
        line = re.sub(r' +', ' ', line.strip())
        if line:  # Only add non-empty lines
            normalized_lines.append(line)
    text = '\n'.join(normalized_lines)
    
    # Step 3: Reconstruct MCQ options if present
    text = _reconstruct_mcq_options(text)
    
    # Step 4: Normalize multiple newlines to double newline (paragraph break)
    text = re.sub(r'\n{3,}', '\n\n', text)
    
    # Step 5: Remove common OCR artifacts
    # Remove isolated characters that are likely OCR errors
    text = re.sub(r'\s+[|]\s+', ' ', text)  # Remove isolated pipes
    text = re.sub(r'\s+[|]\s+', ' ', text)  # Remove isolated vertical bars
    
    # Step 6: Remove excessive punctuation
    text = re.sub(r'[\.]{3,}', '...', text)  # Multiple dots to ellipsis
    
    # Step 7: Clean up whitespace around punctuation (but preserve option markers)
    # Don't remove space before A., B., C., D. (option markers)
    text = re.sub(r'\s+([,.!?;:])', r'\1', text)  # Remove space before punctuation
    text = re.sub(r'([,.!?;:])\s*([,.!?;:])', r'\1\2', text)  # Remove duplicate punctuation
    
    # Step 8: Final cleanup - normalize spaces (but preserve intentional line breaks)
    # Only normalize spaces within the same line
    lines = text.split('\n')
    cleaned_lines = []
    for line in lines:
        line = re.sub(r' +', ' ', line.strip())  # Normalize spaces within line
        if line:
            cleaned_lines.append(line)
    
    text = '\n'.join(cleaned_lines)
    text = text.strip()
    
    return text

