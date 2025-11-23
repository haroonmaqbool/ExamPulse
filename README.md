<div align="center">

# 🎓 ExamPulse

### AI-Powered Exam Preparation Platform

[![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![Supabase](https://img.shields.io/badge/Supabase-181818?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

**Transform your exam preparation with AI-powered analysis, smart insights, and personalized study plans.**

[Features](#-features) • [Quick Start](#-quick-start) • [Documentation](#-documentation) • [Deployment](#-deployment) • [Contributing](#-contributing)

---

</div>

## 📖 Overview

**ExamPulse** is an intelligent exam preparation platform that leverages AI to analyze past exam papers, extract meaningful patterns, and generate personalized study recommendations. Upload your past papers, get instant insights, and create a smart study plan tailored to your needs.

### What ExamPulse Does

1. **📄 Upload & Process** - Upload PDF or image files of past exam papers
2. **🔍 AI Analysis** - Automatically extract and classify questions by topic, type, and difficulty
3. **📊 Pattern Recognition** - Identify frequency patterns and topic distributions
4. **📝 Expected Paper Generation** - Generate expected questions based on historical patterns
5. **📈 Study Tracking** - Log your study sessions with multiple log types
6. **🎯 Smart Planning** - Get AI-powered personalized study plans with priorities and recommendations

---

## ✨ Features

### 🚀 Core Features

- **📤 Multi-File Upload** - Upload multiple PDF or image files simultaneously
- **🔬 Hybrid OCR Processing** - Advanced OCR using PyMuPDF (PDFs) and Tesseract (Images)
- **🤖 AI-Powered Analysis** - Intelligent question extraction and classification using Grok AI
- **📊 Topic Frequency Analysis** - Visual charts showing topic distribution and patterns
- **📝 Expected Paper Generation** - Generate up to 20 expected questions based on patterns
- **📚 Study Logs** - Track your study progress with 4 log types:
  - Text logs
  - Hours studied
  - Difficulty ratings
  - Completion checkboxes
- **🎯 Smart Study Plan** - AI-generated personalized study plan with:
  - Priority topics
  - Weakness identification
  - Revision recommendations
  - Confidence scores
- **💬 AI Chatbot** - Education-focused AI assistant for study help
- **📱 Responsive Design** - Fully responsive UI that works on all devices
- **🌓 Dark/Light Mode** - Beautiful theme toggle for comfortable studying

### 🎨 UI/UX Features

- **Modern Design** - Sleek, modern interface with smooth animations
- **Interactive Charts** - Beautiful data visualizations using Recharts
- **Real-time Updates** - Live progress tracking and status updates
- **Collapsible Navigation** - Space-efficient sidebar navigation
- **Smooth Animations** - Framer Motion powered transitions
- **Accessible** - Built with accessibility in mind

---

## 🛠️ Tech Stack

### Frontend

| Technology | Purpose |
|------------|---------|
| **React 18** | UI framework |
| **Vite** | Build tool and dev server |
| **Tailwind CSS** | Utility-first CSS framework |
| **Framer Motion** | Animation library |
| **React Router** | Client-side routing |
| **Axios** | HTTP client |
| **Recharts** | Data visualization |
| **Lucide React** | Icon library |

### Backend

| Technology | Purpose |
|------------|---------|
| **FastAPI** | Modern Python web framework |
| **Python 3.9+** | Programming language |
| **Uvicorn** | ASGI server |
| **OpenRouter (Grok AI)** | AI model for analysis and generation |
| **PyMuPDF** | PDF text extraction |
| **Tesseract OCR** | Image OCR processing |
| **Supabase** | PostgreSQL database |
| **Pydantic** | Data validation |

### Infrastructure

- **Monorepo Architecture** - Single repository for frontend and backend
- **RESTful API** - Clean API design
- **CORS Enabled** - Cross-origin resource sharing
- **Environment Variables** - Secure configuration management

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ and npm
- **Python** 3.9+
- **Tesseract OCR** (for image processing)
- **Supabase Account** (free tier works)
- **OpenRouter API Key** (for AI features)

### Installation

#### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/exampulse.git
cd exampulse
```

#### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment (recommended)
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env
# Edit .env with your credentials
```

**Backend Environment Variables** (`.env` file):

```env
# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your_anon_key

# OpenRouter AI Configuration
OPENROUTER_API_KEY=sk-or-v1-your-key-here
AI_MODEL=x-ai/grok-4.1-fast:free

# Optional: Logging
LOG_LEVEL=INFO
```

#### 3. Frontend Setup

```bash
# Navigate to frontend directory
cd ../frontend

# Install dependencies
npm install

# Create .env file (optional for local development)
# Vite proxy handles API calls automatically
```

#### 4. Run the Application

**Terminal 1 - Backend:**
```bash
cd backend
uvicorn main:app --reload
```
Backend runs on `http://localhost:8000`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
Frontend runs on `http://localhost:5173`

#### 5. Access the Application

- **Frontend:** http://localhost:5173
- **Backend API Docs:** http://localhost:8000/docs
- **Backend ReDoc:** http://localhost:8000/redoc

---

## 📁 Project Structure

```
ExamPulse/
├── backend/                 # FastAPI backend
│   ├── api/                 # API route handlers
│   │   ├── upload.py        # File upload endpoint
│   │   ├── analyze.py       # Single file analysis
│   │   ├── analyze_multi.py # Multi-file analysis
│   │   ├── expected_paper.py # Expected paper generation
│   │   ├── study_logs.py    # Study logs CRUD
│   │   ├── smart_plan.py    # Smart plan generation
│   │   ├── chatbot.py       # AI chatbot
│   │   ├── dashboard.py     # Dashboard statistics
│   │   └── health.py        # Health check
│   ├── core/                # Business logic
│   │   ├── ai_client.py     # AI integration (OpenRouter/Grok)
│   │   ├── ocr.py           # OCR processing
│   │   ├── question_extractor.py # Question extraction
│   │   └── ocr_providers/   # OCR provider implementations
│   ├── models/              # Pydantic schemas
│   │   └── schemas.py
│   ├── utils/               # Utilities
│   │   ├── database.py      # Supabase client
│   │   └── logger.py        # Logging configuration
│   ├── uploads/             # Uploaded files storage
│   ├── logs/                # Application logs
│   ├── main.py              # FastAPI app entry point
│   ├── requirements.txt     # Python dependencies
│   ├── Procfile             # Deployment configuration
│   └── runtime.txt           # Python version
│
├── frontend/                # React frontend
│   ├── src/
│   │   ├── components/      # React components
│   │   │   ├── Navbar.jsx   # Navigation sidebar
│   │   │   ├── Logo.jsx     # Brand logo
│   │   │   ├── Chatbot.jsx  # AI chatbot component
│   │   │   ├── TopicChart.jsx # Data visualization
│   │   │   ├── ThemeToggle.jsx # Dark/light mode
│   │   │   └── ...
│   │   ├── pages/           # Page components
│   │   │   ├── LandingPage.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Upload.jsx
│   │   │   ├── Analysis.jsx
│   │   │   ├── ExpectedPaper.jsx
│   │   │   ├── StudyLogs.jsx
│   │   │   └── SmartPlan.jsx
│   │   ├── utils/           # Utilities
│   │   │   └── api.js       # Axios configuration
│   │   ├── styles/          # CSS files
│   │   ├── App.jsx          # Main app component
│   │   └── main.jsx         # React entry point
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
├── docs/                    # Documentation
│   ├── api-spec.md          # API specification
│   ├── architecture.md      # System architecture
│   └── prompts.md           # AI prompt templates
│
├── DEPLOYMENT_GUIDE.md      # Deployment instructions
├── QUICK_DEPLOY.md          # Quick deployment guide
└── README.md                # This file
```

---

## 📡 API Endpoints

### Core Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/health/` | Health check endpoint |
| `POST` | `/upload/` | Upload exam paper (PDF/image) |
| `POST` | `/analyze/` | Analyze single uploaded paper |
| `POST` | `/analyze/multi` | Analyze multiple papers |
| `POST` | `/expected-paper/` | Generate expected paper |
| `POST` | `/study-logs/` | Create study log entry |
| `GET` | `/study-logs/` | Get all study logs |
| `DELETE` | `/study-logs/{id}` | Delete study log |
| `DELETE` | `/study-logs/` | Delete all study logs |
| `GET` | `/smart-plan/` | Get smart study plan |
| `POST` | `/chatbot/` | Chat with AI assistant |
| `GET` | `/dashboard/` | Get dashboard statistics |

### Interactive API Documentation

FastAPI automatically generates interactive API documentation:

- **Swagger UI:** `http://localhost:8000/docs`
- **ReDoc:** `http://localhost:8000/redoc`

### Example API Request

```bash
# Upload a file
curl -X POST "http://localhost:8000/upload/" \
  -F "file=@exam_paper.pdf"

# Analyze uploaded file
curl -X POST "http://localhost:8000/analyze/" \
  -H "Content-Type: application/json" \
  -d '{"file_id": "file_id_here"}'
```

For detailed API documentation, see [docs/api-spec.md](docs/api-spec.md).

---

## 🎯 Usage Guide

### 1. Upload Exam Papers

1. Navigate to the **Upload** page
2. Click "Choose Files" or drag and drop PDF/image files
3. Wait for upload confirmation
4. Files are stored and ready for analysis

### 2. Analyze Papers

1. Go to the **Analysis** page
2. Select uploaded file(s) from the dropdown
3. Click "Analyze Paper"
4. View results:
   - Extracted questions
   - Topic classification
   - Topic frequency chart
   - Question statistics

### 3. Generate Expected Paper

1. Navigate to **Expected Paper** page
2. Click "Generate Expected Paper"
3. AI generates up to 20 expected questions based on patterns
4. View and study the generated questions

### 4. Track Study Progress

1. Go to **Study Logs** page
2. Choose log type:
   - **Text:** General notes
   - **Hours:** Time spent studying
   - **Difficulty:** Rate topic difficulty
   - **Checkbox:** Mark topics as completed
3. Enter topic and details
4. Save your log

### 5. Get Smart Study Plan

1. Navigate to **Smart Plan** page
2. Click "Generate Smart Plan"
3. Review your personalized plan:
   - Priority topics
   - Identified weaknesses
   - Revision recommendations
   - Confidence scores

### 6. View Dashboard

The **Dashboard** provides:
- Total papers and topics analyzed
- Study progress and streaks
- Top topics by frequency
- Recent activity
- Study logs statistics

---

## 🚢 Deployment

### Quick Deployment

For the fastest deployment experience, see [QUICK_DEPLOY.md](QUICK_DEPLOY.md).

### Detailed Deployment Guide

Comprehensive deployment instructions are available in [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md).

### Recommended Platforms

**Backend:**
- 🚂 [Railway](https://railway.app) (Recommended - Easy & Free)
- 🎨 [Render](https://render.com) (Alternative - Free Tier)
- ✈️ [Fly.io](https://fly.io) (Alternative)

**Frontend:**
- ▲ [Vercel](https://vercel.com) (Recommended - Easiest)
- 🟢 [Netlify](https://netlify.com) (Alternative)
- 📄 [GitHub Pages](https://pages.github.com) (Free but Limited)

### Environment Variables

**Backend (Production):**
```env
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
OPENROUTER_API_KEY=your_openrouter_key
AI_MODEL=x-ai/grok-4.1-fast:free
ALLOWED_ORIGINS=https://your-frontend.vercel.app
```

**Frontend (Production):**
```env
VITE_API_URL=https://your-backend.railway.app
```

---

## 🧪 Development

### Running Tests

```bash
# Backend tests (if available)
cd backend
pytest

# Frontend tests (if available)
cd frontend
npm test
```

### Code Style

- **Backend:** Follow PEP 8 Python style guide
- **Frontend:** ESLint and Prettier configurations (if set up)

### Building for Production

```bash
# Build frontend
cd frontend
npm run build

# Output will be in frontend/dist/
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit your changes** (`git commit -m 'Add some amazing feature'`)
4. **Push to the branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

### Contribution Guidelines

- Follow the existing code style
- Add comments for complex logic
- Update documentation as needed
- Test your changes thoroughly
- Ensure all tests pass

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **OpenRouter** - AI model access
- **Supabase** - Database and backend services
- **FastAPI** - Modern Python web framework
- **React** - UI library
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Recharts** - Data visualization

---

## 📞 Support

- **Documentation:** Check the [docs/](docs/) folder
- **Issues:** Open an issue on GitHub
- **Questions:** Check existing issues or create a new one

---

## 🗺️ Roadmap

### Planned Features

- [ ] User authentication and multi-user support
- [ ] Export analysis reports (PDF/Excel)
- [ ] Mobile app (React Native)
- [ ] Advanced analytics dashboard
- [ ] Collaborative study groups
- [ ] Integration with calendar apps
- [ ] Spaced repetition system
- [ ] Question bank management
- [ ] Performance tracking over time
- [ ] AI-powered flashcards generation

---

## 📊 Project Status

**Current Version:** 1.0.0

**Status:** ✅ Production Ready

- ✅ All core features implemented
- ✅ Backend API fully functional
- ✅ Frontend UI/UX polished
- ✅ Responsive design complete
- ✅ Deployment guides available
- ✅ Documentation comprehensive

---

<div align="center">

**Made with ❤️ by the ExamPulse Team**

⭐ Star this repo if you find it helpful!

[⬆ Back to Top](#-exampulse)

</div>
