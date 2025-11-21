# ExamPulse API Specification

## Base URL

```
http://localhost:8000
```

## Endpoints

### Health Check

**GET** `/health/`

Returns API health status.

**Response:**
```json
{
  "status": "healthy",
  "service": "ExamPulse API"
}
```

---

### Upload File

**POST** `/upload/`

Upload a past exam paper (PDF or image).

**Request:**
- Content-Type: `multipart/form-data`
- Body: `file` (PDF or image file)

**Response:**
```json
{
  "message": "File uploaded successfully",
  "file_id": "uuid-string",
  "filename": "exam_paper.pdf",
  "content_type": "application/pdf"
}
```

---

### Analyze Paper

**POST** `/analyze/`

Analyze uploaded paper through OCR and AI classification.

**Request:**
```json
{
  "file_id": "uuid-string"
}
```

**Response:**
```json
{
  "analysis_id": "uuid-string",
  "questions": [
    {
      "id": 1,
      "question_text": "Solve for x: 2x + 5 = 15",
      "topic": "Algebra",
      "qtype": "short_answer",
      "marks": 5,
      "question_number": 1
    }
  ],
  "topic_frequencies": [
    {
      "topic": "Algebra",
      "frequency": 15,
      "percentage": 30.0
    }
  ]
}
```

---

### Generate Expected Paper

**POST** `/expected-paper/`

Generate expected exam paper (max 20 questions).

**Request:**
```json
{
  "analysis_id": "uuid-string"
}
```

**Response:**
```json
{
  "expected_paper": {
    "questions": [
      {
        "question_text": "Expected question 1",
        "topic": "Algebra",
        "qtype": "short_answer",
        "marks": 5,
        "question_number": 1
      }
    ],
    "total_questions": 20
  }
}
```

---

### Create Study Log

**POST** `/study-logs/`

Create a study log entry.

**Request:**
```json
{
  "topic": "Algebra",
  "log_type": "hours",
  "difficulty": "medium",
  "hours": 2.5,
  "notes": "Reviewed quadratic equations"
}
```

**Response:**
```json
{
  "id": 1,
  "topic": "Algebra",
  "log_type": "hours",
  "difficulty": "medium",
  "hours": 2.5,
  "notes": "Reviewed quadratic equations",
  "created_at": "2024-01-15T10:30:00Z"
}
```

---

### Get Smart Plan

**GET** `/smart-plan/`

Get AI-powered personalized study plan.

**Response:**
```json
{
  "plan": {
    "priorities": [
      "Focus on Algebra",
      "Review Geometry basics"
    ],
    "weaknesses": [
      "Calculus integration",
      "Trigonometry identities"
    ],
    "next_steps": [
      "Complete 10 practice problems on Algebra",
      "Watch tutorial on Geometry"
    ],
    "revision_plan": [
      "Day 1: Algebra review",
      "Day 2: Geometry practice"
    ],
    "confidence_percentage": 75.5
  }
}
```

---

## Error Responses

All endpoints may return errors in the following format:

```json
{
  "detail": "Error message description"
}
```

**Status Codes:**
- `200` - Success
- `400` - Bad Request
- `404` - Not Found
- `500` - Internal Server Error

