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
        
        # Get sample questions for context
        sample_questions = all_questions[:5]  # First 5 questions as examples
        sample_text = "\n".join([
            f"Q{q.get('question_number', i+1)} ({q.get('marks', 0)} marks) - {q.get('topic', 'Unknown')}: {q.get('question_text', '')[:100]}..."
            for i, q in enumerate(sample_questions)
        ])
        
        # Create AI prompt
        ai_prompt = f"""
Generate an expected exam paper based on the following topic frequency analysis from past papers.

Topic Frequencies:
{frequencies_text}

Sample Questions (for reference):
{sample_text}

Generate a maximum of 20 expected exam questions that:
1. Match the topic distribution shown above
2. Include appropriate question types (Multiple Choice, Short Answer, Problem Solving, etc.)
3. Have realistic marks distribution
4. Are similar in style and difficulty to the sample questions

Return ONLY valid JSON (no markdown, no code blocks, just JSON) with this exact structure:
{{
  "questions": [
    {{
      "question_text": "Full question text here",
      "topic": "Topic name",
      "qtype": "Question type",
      "marks": number,
      "question_number": number
    }}
  ]
}}

Generate exactly 20 questions (or fewer if topic frequencies suggest fewer questions needed).
"""
        
        # Step 4: Call AI to generate expected paper
        print("Generating expected paper with AI...")
        ai_response = ai_client.run_ai_prompt(
            ai_prompt,
            system_instruction="You are an expert at creating exam papers. Generate realistic exam questions based on topic frequencies. Return only valid JSON.",
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

