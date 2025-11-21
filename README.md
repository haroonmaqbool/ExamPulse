# ExamPulse Backend

FastAPI backend server for the ExamPulse AI-powered exam preparation platform.

## Setup

1. Install dependencies:
```bash
cd backend
pip install -r requirements.txt
```

2. Set up environment variables:
```bash
# Create .env file in backend/ directory
OPENROUTER_API_KEY=your_openrouter_api_key
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=10485760
```

3. Run the server:
```bash
cd backend
uvicorn main:app --reload
```

Server will run on `http://localhost:8000`

## API Endpoints

- `GET /health/` - Health check
- `POST /upload/` - Upload exam paper (PDF/image)
- `POST /analyze/` - Analyze uploaded paper
- `POST /expected-paper/` - Generate expected paper
- `POST /study-logs/` - Create study log entry
- `GET /smart-plan/` - Get smart exam plan
- `POST /chatbot/` - Chat with AI assistant

## API Documentation

FastAPI automatically generates interactive API documentation:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Project Structure

```
backend/
  api/            # API route handlers
    ├── upload.py
    ├── analyze.py
    ├── expected_paper.py
    ├── study_logs.py
    ├── smart_plan.py
    ├── chatbot.py
    └── health.py
  core/           # Business logic
    ├── ai_client.py      # OpenRouter/Grok AI integration
    ├── ocr.py            # OCR (PyMuPDF + Tesseract)
    └── question_extractor.py
  utils/          # Utilities
    └── database.py       # Supabase database client
  models/         # Pydantic schemas
    └── schemas.py
  main.py         # FastAPI app entry point
  requirements.txt
  README.md
```

## Tech Stack

- **Framework:** FastAPI
- **AI:** OpenRouter (Grok 4.1 Fast)
- **OCR:** PyMuPDF (PDFs) + Tesseract (Images)
- **Database:** Supabase
- **Language:** Python 3.9+

