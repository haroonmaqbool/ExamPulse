"""
Smart Exam Plan endpoint
Generates AI-powered personalized study plan.
"""

from typing import Dict, List
from collections import Counter
from fastapi import APIRouter, HTTPException

from core.ai_client import ai_client
from utils.database import db
from models.schemas import SmartPlan

router = APIRouter()


@router.get("/")
async def get_smart_plan() -> Dict:
    """
    Generate Smart Exam Plan using AI.
    
    Process:
        1. Load all questions from database
        2. Load all study logs from database
        3. Calculate topic frequencies and study patterns
        4. Use AI to generate personalized study plan
        5. Store plan in database (optional)
        6. Return plan
    
    Plan includes:
        - Priorities: What to focus on
        - Weaknesses: Areas needing improvement
        - Next steps: Immediate actions
        - Revision plan: Detailed weekly plan
        - Confidence percentage: AI confidence in the plan
    
    Returns:
        Smart exam plan with all components
    """
    try:
        # Step 1: Load questions from database
        print("Loading questions from database...")
        all_questions = db.get_all_questions()
        
        # Step 2: Load study logs from database
        print("Loading study logs from database...")
        all_study_logs = db.get_all_study_logs()
        
        # Step 3: Calculate topic frequencies from questions
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
        topic_frequencies.sort(key=lambda x: x['frequency'], reverse=True)
        
        # Step 4: Analyze study logs
        # Group by topic and log type
        study_summary = {}
        for log in all_study_logs:
            topic = log.get('topic', 'Unknown')
            if topic not in study_summary:
                study_summary[topic] = {
                    "total_hours": 0,
                    "difficulties": [],
                    "log_count": 0
                }
            
            study_summary[topic]["log_count"] += 1
            
            # Sum hours
            if log.get('hours'):
                study_summary[topic]["total_hours"] += float(log['hours'])
            
            # Collect difficulties
            if log.get('difficulty'):
                study_summary[topic]["difficulties"].append(log['difficulty'])
        
        # Step 5: Prepare data for AI
        frequencies_text = "\n".join([
            f"- {tf['topic']}: {tf['frequency']} questions ({tf['percentage']}%)"
            for tf in topic_frequencies[:10]
        ])
        
        study_summary_text = "\n".join([
            f"- {topic}: {data['log_count']} logs, {data['total_hours']:.1f} hours, "
            f"difficulties: {', '.join(set(data['difficulties'])) if data['difficulties'] else 'none'}"
            for topic, data in list(study_summary.items())[:10]
        ])
        
        # Step 6: Create AI prompt
        ai_prompt = f"""
Generate a personalized Smart Exam Plan based on the following analysis:

TOPIC FREQUENCIES (from analyzed exam papers):
{frequencies_text if frequencies_text else "No questions analyzed yet."}

STUDY LOGS SUMMARY:
{study_summary_text if study_summary_text else "No study logs yet."}

Generate a comprehensive study plan that includes:

1. PRIORITIES (3-5 items): What topics should be focused on based on:
   - High frequency in exam papers
   - Low study time spent
   - High difficulty encountered

2. WEAKNESSES (3-5 items): Areas that need improvement based on:
   - Topics with high difficulty ratings
   - Topics with low study time
   - Topics that appear frequently but haven't been studied much

3. NEXT STEPS (3-5 items): Immediate actionable steps to take:
   - Specific study tasks
   - Practice recommendations
   - Resource suggestions

4. REVISION PLAN: A detailed weekly plan (4-6 weeks) with:
   - Week number
   - Focus topics for that week
   - Specific tasks and goals
   - Estimated hours per week

5. CONFIDENCE PERCENTAGE: A number (0-100) indicating how confident you are in this plan based on:
   - Amount of data available (more data = higher confidence)
   - Consistency of study patterns
   - Coverage of high-frequency topics

Return ONLY valid JSON (no markdown, no code blocks, just JSON) with this exact structure:
{{
  "priorities": ["priority 1", "priority 2", ...],
  "weaknesses": ["weakness 1", "weakness 2", ...],
  "next_steps": ["step 1", "step 2", ...],
  "revision_plan": [
    {{
      "week": 1,
      "focus": "topic name",
      "tasks": ["task 1", "task 2"],
      "hours": 10
    }},
    ...
  ],
  "confidence_percentage": 75.5
}}
"""
        
        # Step 7: Call AI to generate plan
        print("Generating smart plan with AI...")
        ai_response = ai_client.run_gemini_prompt(
            ai_prompt,
            system_instruction="You are an expert study planner. Generate personalized, actionable study plans based on exam analysis and study logs. Return only valid JSON.",
            response_format="json"
        )
        
        # Check for errors
        if "error" in ai_response:
            raise HTTPException(
                status_code=500,
                detail=f"AI generation failed: {ai_response.get('error_message', 'Unknown error')}"
            )
        
        # Step 8: Extract and validate plan
        plan_data = {
            "priorities": ai_response.get("priorities", []),
            "weaknesses": ai_response.get("weaknesses", []),
            "next_steps": ai_response.get("next_steps", []),
            "revision_plan": ai_response.get("revision_plan", []),
            "confidence_percentage": float(ai_response.get("confidence_percentage", 0))
        }
        
        # Ensure all fields are lists (not strings)
        for key in ["priorities", "weaknesses", "next_steps"]:
            if isinstance(plan_data[key], str):
                plan_data[key] = [plan_data[key]]
            if not isinstance(plan_data[key], list):
                plan_data[key] = []
        
        # Ensure revision_plan is a list
        if not isinstance(plan_data["revision_plan"], list):
            plan_data["revision_plan"] = []
        
        # Validate confidence percentage
        if plan_data["confidence_percentage"] < 0:
            plan_data["confidence_percentage"] = 0
        if plan_data["confidence_percentage"] > 100:
            plan_data["confidence_percentage"] = 100
        
        # Step 9: Store plan in database (optional but good practice)
        try:
            db.insert_plan({"plan_json": plan_data})
            print("Plan stored in database")
        except Exception as e:
            print(f"Warning: Failed to store plan in database: {e}")
            # Continue even if storage fails
        
        # Step 10: Return plan
        return {
            "message": "Smart plan generated successfully",
            "plan": plan_data,
            "based_on": {
                "total_questions": total_questions,
                "total_study_logs": len(all_study_logs),
                "topics_analyzed": len(topic_frequencies)
            }
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to generate smart plan: {str(e)}"
        )

