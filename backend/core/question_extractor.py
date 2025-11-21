"""
Question Extractor Module
Extracts and cleans questions from OCR text.
"""

import re
from typing import List, Dict, Any


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
        Each question dict contains: {'text': str, 'raw_text': str}
    """
    if not ocr_text or not ocr_text.strip():
        return []
    
    questions = []
    
    # Pattern to match questions - looks for:
    # - "Question 1", "Q1", "1.", "Q.1", etc.
    # - Followed by optional marks like "(5 marks)", "(10 marks)"
    question_pattern = re.compile(
        r'(?:Question\s*)?(?:Q\.?\s*)?(\d+)[\.\)]\s*(?:\((\d+)\s*marks?\))?\s*(.*?)(?=(?:Question\s*)?(?:Q\.?\s*)?\d+[\.\)]|$)',
        re.IGNORECASE | re.DOTALL
    )
    
    # Find all matches
    matches = question_pattern.finditer(ocr_text)
    
    for match in matches:
        question_num = match.group(1)
        marks = match.group(2) if match.group(2) else None
        question_text = match.group(3).strip()
        
        if question_text:  # Only add if there's actual text
            cleaned_text = clean_question_text(question_text)
            
            questions.append({
                'question_number': int(question_num),
                'marks': int(marks) if marks else None,
                'text': cleaned_text,
                'raw_text': question_text  # Keep original for reference
            })
    
    # If no questions found with pattern, try simpler approach
    if not questions:
        questions = _extract_questions_simple(ocr_text)
    
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
    questions = []
    
    # Split by common question separators
    # Look for lines starting with numbers or "Q"
    lines = ocr_text.split('\n')
    current_question = []
    question_num = 1
    
    for line in lines:
        line = line.strip()
        if not line:
            continue
        
        # Check if this line starts a new question
        if re.match(r'^(?:Question\s*)?(?:Q\.?\s*)?\d+[\.\)]', line, re.IGNORECASE):
            # Save previous question if exists
            if current_question:
                text = clean_question_text('\n'.join(current_question))
                if text:
                    questions.append({
                        'question_number': question_num,
                        'marks': None,
                        'text': text,
                        'raw_text': '\n'.join(current_question)
                    })
                    question_num += 1
                current_question = []
        
        current_question.append(line)
    
    # Add last question
    if current_question:
        text = clean_question_text('\n'.join(current_question))
        if text:
            questions.append({
                'question_number': question_num,
                'marks': None,
                'text': text,
                'raw_text': '\n'.join(current_question)
            })
    
    return questions


def clean_question_text(raw_text: str) -> str:
    """
    Clean and normalize question text.
    
    Removes:
    - Extra whitespace
    - Common OCR artifacts
    - Fixes common OCR errors
    
    Args:
        raw_text: Raw question text from OCR
    
    Returns:
        Cleaned question text
    """
    if not raw_text:
        return ""
    
    # Remove leading/trailing whitespace
    text = raw_text.strip()
    
    # Normalize multiple spaces to single space
    text = re.sub(r' +', ' ', text)
    
    # Normalize multiple newlines to double newline (paragraph break)
    text = re.sub(r'\n{3,}', '\n\n', text)
    
    # Remove common OCR artifacts
    # Remove isolated characters that are likely OCR errors
    text = re.sub(r'\s+[|]\s+', ' ', text)  # Remove isolated pipes
    text = re.sub(r'\s+[|]\s+', ' ', text)  # Remove isolated vertical bars
    
    # Fix common OCR mistakes
    # Replace common OCR errors (you can expand this list)
    replacements = {
        r'\b0\b': 'O',  # Single 0 might be O in some contexts (be careful with this)
        r'rn': 'm',  # Common OCR error: rn -> m
        r'vv': 'w',  # Common OCR error: vv -> w
    }
    
    # Only apply safe replacements
    # Note: Be careful with automatic replacements as they might cause issues
    
    # Remove excessive punctuation
    text = re.sub(r'[\.]{3,}', '...', text)  # Multiple dots to ellipsis
    
    # Clean up whitespace around punctuation
    text = re.sub(r'\s+([,.!?;:])', r'\1', text)  # Remove space before punctuation
    text = re.sub(r'([,.!?;:])\s*([,.!?;:])', r'\1\2', text)  # Remove duplicate punctuation
    
    # Final cleanup - remove any remaining excessive whitespace
    text = re.sub(r'\s+', ' ', text)  # Multiple spaces to single
    text = text.strip()
    
    return text

