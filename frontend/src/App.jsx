import { useState } from 'react'
import { Routes, Route, useLocation, Outlet } from 'react-router-dom'
import Navbar from './components/Navbar'
import Chatbot from './components/Chatbot'
import { ThemeProvider, useTheme } from './components/ThemeContext'
import Background from './components/Background'
import LandingPage from './pages/LandingPage'
import Dashboard from './pages/Dashboard'
import Upload from './pages/Upload'
import Analysis from './pages/Analysis'
import ExpectedPaper from './pages/ExpectedPaper'
import StudyLogs from './pages/StudyLogs'
import SmartPlan from './pages/SmartPlan'

/**
 * AppLayout provides the main structure for pages that need the Navbar.
 * 
 * Layout Logic:
 * 1. md:pl-64 -> Pushes content to the right on desktop to make room for the 64px (w-64) fixed sidebar.
 * 2. pt-16 -> Adds top padding on mobile for the fixed top header.
 * 3. md:pt-0 -> Removes top padding on desktop since the sidebar is full height.
 */
const AppLayout = () => {
  return (
    <>
      <Navbar />
      <main className="md:pl-64 pt-16 md:pt-0 min-h-screen transition-all duration-300">
        <Outlet />
      </main>
    </>
  );
};

function AppContent() {
  const { theme } = useTheme()
  const isDarkMode = theme === 'dark'
  const [isChatOpen, setIsChatOpen] = useState(false)
  const location = useLocation()

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen)
  }

  // Show chatbot only on home and onwards (not on landing page)
  const showChatbot = location.pathname !== '/'

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-[#0a0a0a]' : 'bg-white'}`}>
      <Background />
      <Routes>
        {/* Landing page - no navbar, no chatbot */}
        <Route path="/" element={<LandingPage />} />

        {/* Main app routes - with navbar and chatbot */}
        <Route element={<AppLayout />}>
          <Route path="/home" element={<Dashboard />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/analysis" element={<Analysis />} />
          <Route path="/expected-paper" element={<ExpectedPaper />} />
          <Route path="/study-logs" element={<StudyLogs />} />
          <Route path="/smart-plan" element={<SmartPlan />} />
        </Route>
      </Routes>

      {/* Floating Chatbot Button - Adjusted to sit nicely with sidebar */}
      {showChatbot && (
        <button
          onClick={toggleChat}
          className={`fixed bottom-4 right-4 sm:bottom-6 sm:right-6 p-3 sm:p-4 rounded-full text-white shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 z-50 group ${
            isDarkMode
              ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500'
              : 'bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-500 hover:to-green-500'
          }`}
          aria-label="Toggle chatbot"
        >
          {isChatOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          )}
        </button>
      )}

      {/* Chatbot Component */}
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