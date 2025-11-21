# ExamPulse Architecture

## Overview

ExamPulse is an AI-powered exam preparation platform built as a monorepo with a FastAPI backend and React frontend.

## System Architecture

```
┌─────────────┐
│   Frontend  │  React + Vite + Tailwind
│  (Port 5173)│
└──────┬──────┘
       │ HTTP/REST
       │
┌──────▼──────┐
│   Backend   │  FastAPI + Python
│  (Port 8000)│
└──────┬──────┘
       │
   ┌───┴───┐
   │       │
┌──▼──┐ ┌──▼────┐
│Gemini│ │Supabase│
│  AI  │ │  DB   │
└──────┘ └───────┘
```

## Workflow

1. **File Upload** → User uploads PDF/image
2. **OCR Processing** → Tesseract OCR (with mock fallback)
3. **Question Extraction** → Parse and clean questions
4. **AI Classification** → Gemini AI classifies questions (topic, type, marks, number)
5. **Frequency Analysis** → Compute topic frequencies
6. **Expected Paper** → Generate expected paper (max 20 questions)
7. **Study Logs** → User inputs study logs
8. **Smart Plan** → Generate personalized study plan

## Backend Structure

```
backend/
  api/          # Route handlers
  core/         # Business logic
    - ai_client.py      # Gemini AI client
    - ocr.py            # OCR processing
    - question_extractor.py
  utils/        # Utilities
    - database.py       # Supabase client
  models/       # Pydantic schemas
  main.py       # FastAPI app
```

## Frontend Structure

```
frontend/
  src/
    pages/        # Page components
    components/   # Reusable components
    hooks/        # Custom hooks
    styles/       # CSS/Tailwind
```

## Database Schema

### questions
- id
- question_text
- topic
- qtype
- marks
- question_number
- created_at

### study_logs
- id
- topic
- log_type
- difficulty
- hours
- notes
- created_at

### plans
- id
- plan_json
- created_at

## API Endpoints

- `GET /health/` - Health check
- `POST /upload/` - Upload exam paper
- `POST /analyze/` - Analyze uploaded paper
- `POST /expected-paper/` - Generate expected paper
- `POST /study-logs/` - Create study log
- `GET /smart-plan/` - Get smart exam plan

## Technology Stack

### Backend
- Python 3.11+
- FastAPI
- Gemini API
- Tesseract OCR
- Supabase

### Frontend
- React 18
- Vite
- Tailwind CSS
- Recharts
- Axios

## Single-User Mode

The system operates in single-user mode - no authentication required. All data is stored per session/user.

