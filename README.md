# ExamPulse Backend

FastAPI backend server for the ExamPulse AI-powered exam preparation platform.

## Setup

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Set up environment variables:
```bash
# Create .env file
GEMINI_API_KEY=your_gemini_api_key
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
```

3. Run the server:
```bash
uvicorn app.main:app --reload
```

## API Endpoints

- `GET /health/` - Health check
- `POST /upload/` - Upload exam paper (PDF/image)
- `POST /analyze/` - Analyze uploaded paper
- `POST /expected-paper/` - Generate expected paper
- `POST /study-logs/` - Create study log entry
- `GET /smart-plan/` - Get smart exam plan

## Project Structure

```
backend/
  app/
    api/          # API route handlers
    core/         # Business logic (AI, OCR, question extraction)
    utils/        # Utilities (database, helpers)
    models/       # Pydantic schemas
    main.py       # FastAPI app entry point
  requirements.txt
  README.md
```

