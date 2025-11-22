import { Link } from 'react-router-dom'
import { useTheme } from './ThemeContext'

function Logo({ collapsed = false, className = '' }) {
  const { theme } = useTheme()
  const isDarkMode = theme === 'dark'

  if (collapsed) {
    return (
      <Link
        to="/"
        className={`flex items-center justify-center w-full ${className}`}
        title="ExamPulse"
      >
        <div className="relative w-10 h-10 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-purple-600 to-purple-500 shadow-purple-500/30 group-hover:shadow-purple-500/50">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      </Link>
    )
  }

  return (
    <Link to="/" className={`flex items-center gap-2.5 group ${className}`}>
      <div className="relative w-10 h-10 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-purple-600 to-purple-500 shadow-purple-500/30 group-hover:shadow-purple-500/50">
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <div className="flex flex-col -space-y-1">
        <span className={`text-xl font-bold tracking-tight ${
          isDarkMode ? 'text-white' : 'text-gray-900'
        }`}>
          ExamPulse
        </span>
        <span className={`text-[10px] font-medium tracking-wider uppercase ${
          isDarkMode ? 'text-purple-400' : 'text-purple-600'
        }`}>
          AI STUDY PLATFORM
        </span>
      </div>
    </Link>
  )
}

export default Logo

