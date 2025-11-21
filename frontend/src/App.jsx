import { Routes, Route, Outlet } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Upload from './pages/Upload'
import Analysis from './pages/Analysis'
import ExpectedPaper from './pages/ExpectedPaper'
import StudyLogs from './pages/StudyLogs'
import SmartPlan from './pages/SmartPlan'
import LandingPage from './pages/LandingPage'
import { ThemeProvider } from './components/ThemeContext'

function App() {
  /**
   * AppLayout provides the common structure for the main application.
   * It's defined inside App so it has access to the ThemeProvider context.
   */
  const AppLayout = () => {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-[#0a0a0a]">
        <Navbar />
        <main>
          <Outlet /> {/* Child routes will render here */}
        </main>
      </div>
    );
  };

  return (
    <ThemeProvider>
      <Routes>
        {/* Route for the landing page, which doesn't have the main Navbar */}
        <Route path="/" element={<LandingPage />} />

        {/* Nested routes for the main application, which all share the AppLayout */}
        <Route element={<AppLayout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/analysis" element={<Analysis />} />
          <Route path="/expected-paper" element={<ExpectedPaper />} />
          <Route path="/study-logs" element={<StudyLogs />} />
          <Route path="/smart-plan" element={<SmartPlan />} />
        </Route>
      </Routes>
    </ThemeProvider>
  )
}

export default App
