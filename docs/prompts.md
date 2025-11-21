# ExamPulse AI Prompts

This document contains the prompts used for Gemini AI interactions in ExamPulse.

## Question Classification Prompt

**Purpose:** Classify extracted questions by topic, type, marks, and question number.

**Prompt Template:**
```
You are an expert exam question analyzer. Analyze the following questions extracted from an exam paper and classify each question.

For each question, extract:
1. Topic (e.g., Algebra, Geometry, Calculus)
2. Question Type (e.g., short_answer, multiple_choice, essay)
3. Marks (points allocated)
4. Question Number

Return ONLY a valid JSON array with this structure:
[
  {
    "question_text": "full question text",
    "topic": "topic name",
    "qtype": "question type",
    "marks": number,
    "question_number": number
  }
]

Questions to analyze:
{questions_text}
```

---

## Topic Frequency Analysis Prompt

**Purpose:** Analyze topic frequencies from classified questions.

**Prompt Template:**
```
Analyze the following classified questions and compute topic frequencies.

Return ONLY a valid JSON object with this structure:
{
  "topic_frequencies": [
    {
      "topic": "topic name",
      "frequency": number,
      "percentage": number
    }
  ]
}

Classified questions:
{classified_questions_json}
```

---

## Expected Paper Generation Prompt

**Purpose:** Generate expected exam paper based on topic frequency analysis (max 20 questions).

**Prompt Template:**
```
You are an expert exam paper generator. Based on the following topic frequency analysis, generate an expected exam paper with a maximum of 20 questions.

The expected paper should:
- Reflect the topic distribution from the analysis
- Include appropriate question types
- Have realistic mark allocations
- Be suitable for exam preparation

Return ONLY a valid JSON object with this structure:
{
  "questions": [
    {
      "question_text": "question text",
      "topic": "topic name",
      "qtype": "question type",
      "marks": number,
      "question_number": number
    }
  ],
  "total_questions": number (max 20)
}

Topic frequency analysis:
{topic_frequencies_json}
```

---

## Smart Exam Plan Generation Prompt

**Purpose:** Generate personalized study plan based on analysis and study logs.

**Prompt Template:**
```
You are an expert study planner. Based on the following information, generate a personalized smart exam plan.

Input data:
- Topic frequency analysis: {topic_frequencies_json}
- Study logs: {study_logs_json}
- Extracted questions: {questions_json}

Generate a comprehensive study plan that includes:
1. Priorities (top 3-5 focus areas)
2. Weaknesses (areas needing improvement)
3. Next steps (specific actionable items)
4. Revision plan (day-by-day or week-by-week schedule)
5. Confidence percentage (0-100, based on current preparation level)

Return ONLY a valid JSON object with this structure:
{
  "priorities": ["priority 1", "priority 2", ...],
  "weaknesses": ["weakness 1", "weakness 2", ...],
  "next_steps": ["step 1", "step 2", ...],
  "revision_plan": ["day 1 plan", "day 2 plan", ...],
  "confidence_percentage": number (0-100)
}
```

---

## Notes

- All prompts must return **CLEAN JSON ONLY** - no markdown, no explanations
- All LLM calls must go through `ai_client.run_gemini_prompt()`
- Prompts should be parameterized and reusable
- Error handling should be implemented for malformed JSON responses

