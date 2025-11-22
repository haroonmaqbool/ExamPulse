import { Link, useLocation } from 'react-router-dom'
import { useState } from 'react'
import { useTheme } from './ThemeContext'

function Navbar() {
  const location = useLocation()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { theme, toggleTheme } = useTheme()
  const isDarkMode = theme === 'dark'
  const isActive = (path) => location.pathname === path

  const navLinks = [
    { path: '/home', label: 'Dashboard', icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
    )},
    { path: '/upload', label: 'Upload', icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
    )},
    { path: '/analysis', label: 'Analysis', icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
    )},
    { path: '/expected-paper', label: 'Expected Paper', icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
    )},
    { path: '/study-logs', label: 'Study Logs', icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
    )},
    { path: '/smart-plan', label: 'Smart Plan', icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
    )},
  ]

  return (
    <>
      {/* Mobile Header (Only visible on small screens) */}
      <div className={`md:hidden fixed top-0 inset-x-0 h-16 z-40 flex items-center justify-between px-6 border-b backdrop-blur-xl transition-colors duration-500 ${
        isDarkMode ? 'bg-[#0a0a0a]/80 border-white/5' : 'bg-white/90 border-gray-300'
      }`}>
        <Link to="/" className="font-bold text-xl flex items-center gap-2">
           <span className={isDarkMode ? 'text-white' : 'text-gray-900'}>ExamPulse</span>
           <span className={`h-2 w-2 rounded-full animate-pulse ${isDarkMode ? 'bg-purple-500' : 'bg-blue-600'}`} />
        </Link>
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className={`p-2 rounded-lg ${isDarkMode ? 'text-gray-400 hover:bg-white/5' : 'text-gray-700 hover:bg-blue-50'}`}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
        </button>
      </div>

      {/* Sidebar Overlay (Mobile Only) */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* Vertical Sidebar */}
      <aside className={`fixed top-0 left-0 z-50 h-full w-64 transform transition-transform duration-300 ease-in-out border-r backdrop-blur-xl ${
        isMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      } ${
        isDarkMode
          ? 'bg-[#0a0a0a]/95 border-white/5'
          : 'bg-white/95 border-gray-200 shadow-lg md:shadow-none'
      }`}>
        <div className="flex flex-col h-full py-6">
          
          {/* 1. Brand Area */}
          <div className="px-6 mb-6">
            <Link
              to="/"
              className={`flex items-center gap-2 text-2xl font-bold ${
                isDarkMode
                  ? 'bg-gradient-to-r from-purple-400 via-pink-400 to-purple-500 bg-clip-text text-transparent'
                  : 'bg-gradient-to-r from-blue-600 via-green-600 to-blue-700 bg-clip-text text-transparent'
              }`}
            >
              ExamPulse
              <span className={`h-2 w-2 rounded-full animate-pulse ${
                isDarkMode ? 'bg-purple-500' : 'bg-blue-600'
              }`} />
            </Link>
          </div>

          {/* 2. Theme Toggle (Refined Look) */}
          <div className="px-4 mb-8">
            <button
              onClick={toggleTheme}
              className={`w-full group flex items-center justify-between px-3 py-2 rounded-full transition-all duration-300 border shadow-sm ${
                isDarkMode
                  ? 'bg-white/5 hover:bg-white/10 border-white/10 text-gray-300'
                  : 'bg-gray-50 hover:bg-gray-100 border-gray-200 text-gray-600'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className={`p-1 rounded-full ${isDarkMode ? 'bg-transparent' : 'bg-white shadow-sm text-yellow-500'}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm-.707 7.072l.707-.707a1 1 0 10-1.414-1.414l-.707.707a1 1 0 001.414 1.414zM3 11a1 1 0 100-2H2a1 1 0 100 2h1z" clipRule="evenodd" />
                  </svg>
                </span>
                <span className="text-xs font-semibold tracking-wide">
                  {isDarkMode ? 'Dark Mode' : 'Light Mode'}
                </span>
              </div>
              
              {/* Switch Indicator */}
              <div className={`relative w-8 h-4 rounded-full transition-colors duration-300 ${
                isDarkMode ? 'bg-purple-500/50' : 'bg-gray-300'
              }`}>
                <span className={`absolute left-0.5 top-0.5 w-3 h-3 bg-white rounded-full transition-transform duration-300 shadow-sm ${
                  isDarkMode ? 'translate-x-4' : 'translate-x-0'
                }`} />
              </div>
            </button>
          </div>

          {/* 3. Navigation Links */}
          <div className="flex-1 px-4 space-y-1 overflow-y-auto">
            {/* Optional Label for grouping */}
            <div className={`px-4 pb-2 text-xs font-bold uppercase tracking-wider ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
              Menu
            </div>
            
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all duration-300 rounded-xl group relative overflow-hidden ${
                  isActive(link.path)
                    ? isDarkMode ? 'text-white' : 'text-blue-700 font-bold'
                    : isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-blue-700'
                }`}
              >
                {/* Active State Background & Left Border Accent */}
                {isActive(link.path) && (
                  <>
                    <span className={`absolute inset-0 opacity-100 transition-colors duration-500 ${
                      isDarkMode
                        ? 'bg-gradient-to-r from-purple-600/20 to-transparent' // Soft fade to right
                        : 'bg-blue-50'
                    }`} />
                    {/* Vertical Accent Bar */}
                    <span className={`absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 rounded-r-full ${
                       isDarkMode ? 'bg-purple-500' : 'bg-blue-600'
                    }`} />
                  </>
                )}
                
                {/* Hover Background (Inactive) */}
                {!isActive(link.path) && (
                  <span className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                    isDarkMode ? 'bg-white/5' : 'bg-gray-50'
                  }`} />
                )}

                {/* Icon & Label */}
                <span className={`relative z-10 transition-transform duration-300 ${isActive(link.path) ? 'scale-110' : 'group-hover:scale-110'}`}>
                  {link.icon}
                </span>
                <span className="relative z-10">{link.label}</span>
              </Link>
            ))}
          </div>

        </div>
      </aside>
    </>
  )
}

export default Navbar