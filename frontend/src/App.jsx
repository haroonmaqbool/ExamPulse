import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Upload from './pages/Upload'
import Analysis from './pages/Analysis'
import ExpectedPaper from './pages/ExpectedPaper'
import StudyLogs from './pages/StudyLogs'
import SmartPlan from './pages/SmartPlan'

function App() {
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/analysis" element={<Analysis />} />
          <Route path="/expected-paper" element={<ExpectedPaper />} />
          <Route path="/study-logs" element={<StudyLogs />} />
          <Route path="/smart-plan" element={<SmartPlan />} />
        </Routes>
      </main>
    </div>
  )
}

export default App

