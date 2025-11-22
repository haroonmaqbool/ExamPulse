"""
Expected Paper generation endpoint
Generates expected exam paper based on analysis (max 20 questions).
"""

from typing import Dict, List
from collections import Counter
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from core.ai_client import ai_client
from utils.database import db

router = APIRouter()


class ExpectedPaperRequest(BaseModel):
    """Request model for expected paper generation"""
    analysis_id: str  # Can be file_id or any identifier


@router.post("/")
async def generate_expected_paper(request: ExpectedPaperRequest) -> Dict:
    """
    Generate expected exam paper using AI.
    
    Process:
        1. Load all questions from database
        2. Calculate topic frequencies
        3. Use AI to generate expected paper (max 20 questions)
        4. Return expected paper
    
    Constraints:
        - Maximum 20 questions
        - Based on topic frequency analysis
    
    Returns:
        Expected paper with questions
    """
    try:
        # Step 1: Load questions from database
        print(f"Loading questions for analysis_id: {request.analysis_id}")
        all_questions = db.get_all_questions()
        
        if not all_questions:
            raise HTTPException(
                status_code=404,
                detail="No questions found in database. Please analyze some exam papers first."
            )
        
        # Step 2: Calculate topic frequencies from existing questions
        topics = [q['topic'] for q in all_questions if q.get('topic') and q['topic'] != "Unknown"]
        topic_counts = Counter(topics)
        total_questions = len(all_questions)
        
        topic_frequencies = [
            {
                "topic": topic,
                "frequency": count,
                "percentage": round((count / total_questions) * 100, 2) if total_questions > 0 else 0
            }
            for topic, count in topic_counts.items()
        ]
        
        # Sort by frequency (descending)
        topic_frequencies.sort(key=lambda x: x['frequency'], reverse=True)
        
        # Step 3: Prepare prompt for AI to generate expected paper
        frequencies_text = "\n".join([
            f"- {tf['topic']}: {tf['frequency']} questions ({tf['percentage']}%)"
            for tf in topic_frequencies[:10]  # Top 10 topics
        ])

        # Get ALL analyzed questions for context (limit to 100 for performance)
        # Use all questions to give AI maximum context about style, difficulty, and format
        context_questions = all_questions[:100] if len(all_questions) > 100 else all_questions

        # Format all questions for AI context with full text
        analyzed_questions_text = "\n\n".join([
            f"Q{q.get('question_number', i+1)}. [{q.get('topic', 'Unknown')}] ({q.get('marks', 0)} marks) - {q.get('qtype', 'Unknown')}\n{q.get('question_text', '')}"
            for i, q in enumerate(context_questions)
        ])

        # Create enhanced AI prompt that asks for SIMILAR questions
        ai_prompt = f"""
You are an expert exam paper generator. Based on the analyzed exam questions below, generate a NEW expected exam paper with SIMILAR questions.

ANALYZED QUESTIONS FROM PAST PAPERS:
{analyzed_questions_text}

TOPIC DISTRIBUTION TO FOLLOW:
{frequencies_text}

YOUR TASK:
Generate exactly 20 NEW questions that are SIMILAR to the analyzed questions above. The new questions should:

1. **Match Topic Distribution**: Follow the topic frequency percentages shown above
2. **Similar Style & Format**: Match the writing style, format, and structure of the analyzed questions
3. **Similar Difficulty Level**: Generate questions at the same difficulty level as the analyzed ones
4. **Similar Question Types**: Use the same types of questions (MCQ, Short Answer, Problem Solving, etc.)
5. **Realistic Content**: Create realistic, educational questions that could appear in an actual exam
6. **Same Subject Context**: Stay within the same subject area and academic level

CRITICAL FORMATTING REQUIREMENTS:

**For MCQ Questions:**
- Format: Statement first, then options A, B, C, D each on a NEW LINE
- Example format:
  "What is the capital of France?
  A. London
  B. Paris
  C. Berlin
  D. Madrid"
- Marks: ALWAYS 1 mark for MCQs
- qtype: "MCQ"

**For Short Answer Questions:**
- Clear, concise questions requiring brief answers
- Marks: ALWAYS 2 marks for short questions
- qtype: "Short Answer"

**For Long/Essay Questions:**
- Detailed questions requiring extended answers
- Marks: ALWAYS 4 marks for long questions
- qtype: "Essay" or "Long Answer" or "Problem Solving"

IMPORTANT GUIDELINES:
- DO NOT copy questions verbatim - generate NEW similar questions
- Maintain the same level of complexity and depth
- Use similar phrasing and question patterns
- MCQ options MUST be on separate lines (use \\n between options)
- Keep the academic rigor and educational value

Return ONLY valid JSON (no markdown, no code blocks, just JSON) with this exact structure:
{{
  "questions": [
    {{
      "question_text": "Question statement here\\nA. Option A\\nB. Option B\\nC. Option C\\nD. Option D",
      "topic": "Topic name",
      "qtype": "MCQ",
      "marks": 1,
      "question_number": 1
    }},
    {{
      "question_text": "Short answer question here?",
      "topic": "Topic name",
      "qtype": "Short Answer",
      "marks": 2,
      "question_number": 2
    }},
    {{
      "question_text": "Long question requiring detailed explanation?",
      "topic": "Topic name",
      "qtype": "Essay",
      "marks": 4,
      "question_number": 3
    }}
  ]
}}

STRICT RULES:
- MCQ questions: marks = 1, qtype = "MCQ", options on separate lines with \\n
- Short Answer questions: marks = 2, qtype = "Short Answer"
- Long/Essay questions: marks = 4, qtype = "Essay" or "Long Answer" or "Problem Solving"

Generate exactly 20 questions that match the topic distribution and are similar to the analyzed questions.
"""
        
        # Step 4: Call AI to generate expected paper with similar questions
        print(f"Generating expected paper with AI based on {len(context_questions)} analyzed questions...")
        ai_response = ai_client.run_ai_prompt(
            ai_prompt,
            system_instruction="You are an expert exam paper generator. Analyze the provided questions and generate NEW similar questions that match their style, difficulty, format, and topic distribution. Return only valid JSON.",
            response_format="json"
        )
        
        # Check for errors
        if "error" in ai_response:
            raise HTTPException(
                status_code=500,
                detail=f"AI generation failed: {ai_response.get('error_message', 'Unknown error')}"
            )
        
        # Extract questions from AI response
        generated_questions = ai_response.get("questions", [])
        
        if not generated_questions:
            raise HTTPException(
                status_code=500,
                detail="AI did not generate any questions. Please try again."
            )
        
        # Limit to max 20 questions
        if len(generated_questions) > 20:
            generated_questions = generated_questions[:20]
            print(f"Limited to 20 questions (AI generated {len(generated_questions)} questions)")
        
        # Ensure all questions have required fields
        validated_questions = []
        for i, q in enumerate(generated_questions, 1):
            validated_q = {
                "question_text": q.get("question_text", ""),
                "topic": q.get("topic", "Unknown"),
                "qtype": q.get("qtype", "Unknown"),
                "marks": int(q.get("marks", 0)) if q.get("marks") is not None else 0,
                "question_number": q.get("question_number", i)
            }
            validated_questions.append(validated_q)
        
        return {
            "message": "Expected paper generated successfully",
            "analysis_id": request.analysis_id,
            "total_questions": len(validated_questions),
            "questions": validated_questions,
            "based_on_topics": [tf["topic"] for tf in topic_frequencies[:5]]  # Top 5 topics used
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to generate expected paper: {str(e)}"
        )

