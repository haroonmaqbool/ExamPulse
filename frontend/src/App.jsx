import { useState } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Chatbot from './components/Chatbot'
import Home from './pages/Home'
import Upload from './pages/Upload'
import Analysis from './pages/Analysis'
import ExpectedPaper from './pages/ExpectedPaper'
import StudyLogs from './pages/StudyLogs'
import SmartPlan from './pages/SmartPlan'
import LandingPage from './pages/LandingPage'
import { ThemeProvider } from './components/ThemeContext'

function AppContent() {
  const [isChatOpen, setIsChatOpen] = useState(false)
  const location = useLocation()

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen)
  }

  // Show chatbot only on home and onwards (not on landing page)
  const showChatbot = location.pathname !== '/'

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Routes>
        {/* Landing page - no navbar, no chatbot */}
        <Route path="/" element={<LandingPage />} />

        {/* Main app routes - with navbar and chatbot */}
        <Route path="/home" element={<><Navbar /><Home /></>} />
        <Route path="/upload" element={<><Navbar /><Upload /></>} />
        <Route path="/analysis" element={<><Navbar /><Analysis /></>} />
        <Route path="/expected-paper" element={<><Navbar /><ExpectedPaper /></>} />
        <Route path="/study-logs" element={<><Navbar /><StudyLogs /></>} />
        <Route path="/smart-plan" element={<><Navbar /><SmartPlan /></>} />
      </Routes>

      {/* Floating Chatbot Button - only show on home and onwards */}
      {showChatbot && (
        <button
          onClick={toggleChat}
          className="fixed bottom-6 right-6 p-4 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 z-50 group"
          aria-label="Toggle chatbot"
        >
          {isChatOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          )}
        </button>
      )}

      {/* Chatbot Component - only show on home and onwards */}
      {showChatbot && (
        <Chatbot isChatOpen={isChatOpen} toggleChat={toggleChat} />
      )}
    </div>
  )
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  )
}

export default App