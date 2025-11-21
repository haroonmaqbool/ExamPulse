# ExamPulse

AI-powered exam preparation platform that analyzes past exam papers, extracts meaningful patterns, and generates personalized study recommendations.

## 🚀 Features

- **File Upload**: Upload past exam papers (PDF or images)
- **Hybrid OCR**: Tesseract OCR with mock fallback
- **AI Analysis**: Gemini AI-powered question classification and topic frequency analysis
- **Expected Paper Generation**: Generate expected exam papers (max 20 questions)
- **Study Logs**: Track study progress with logs
- **Smart Exam Plan**: AI-powered personalized study recommendations

## 📁 Project Structure

```
exam-pulse-ai/
├── backend/          # FastAPI backend server
├── frontend/         # React + Vite frontend
└── docs/            # Documentation (architecture, API spec, prompts)
```

## 🛠️ Tech Stack

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

## 🚦 Getting Started

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Set up environment variables:
```bash
# Create .env file
GEMINI_API_KEY=your_gemini_api_key
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
```

4. Run the server:
```bash
uvicorn app.main:app --reload
```

Backend will be available at `http://localhost:8000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Run development server:
```bash
npm run dev
```

Frontend will be available at `http://localhost:5173`

## 📚 Documentation

- [Architecture](./docs/architecture.md)
- [API Specification](./docs/api-spec.md)
- [AI Prompts](./docs/prompts.md)

## 🔧 Development

This is a monorepo structure. Both backend and frontend can be developed independently.

### Backend Development
- Follow FastAPI best practices
- All LLM calls must go through `ai_client.run_gemini_prompt()`
- Use Pydantic models for request/response validation

### Frontend Development
- Use React functional components with hooks
- Follow Tailwind CSS utility-first approach
- Use Axios for API calls

## 📝 License

This project is part of the ExamPulse platform.

