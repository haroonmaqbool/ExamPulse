import { Link, useLocation } from 'react-router-dom'
import { useState } from 'react'
import { useTheme } from './ThemeContext'

function Navbar() {
  const location = useLocation()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { theme, toggleTheme } = useTheme()
  const isActive = (path) => location.pathname === path

  const navLinks = [
    { path: '/home', label: 'Home' },
    { path: '/upload', label: 'Upload' },
    { path: '/analysis', label: 'Analysis' },
    { path: '/expected-paper', label: 'Expected Paper' },
    { path: '/study-logs', label: 'Study Logs' },
    { path: '/smart-plan', label: 'Smart Plan' },
  ]

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-white/80 dark:bg-black/40 backdrop-blur-xl border-b border-gray-200 dark:border-white/5">
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-6 lg:px-8 h-20">
        {/* Brand with gradient */}
        <Link 
          to="/home" 
          className="flex items-center gap-2 text-2xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-500 bg-clip-text text-transparent hover:from-purple-300 hover:via-pink-300 hover:to-purple-400 transition-all duration-300"
        >
          ExamPulse
          <span className="h-2 w-2 rounded-full bg-purple-500 animate-pulse" />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`relative px-4 py-2 text-sm font-medium transition-all duration-300 rounded-lg group ${
                isActive(link.path)
                  ? 'text-gray-900 dark:text-white'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <span className="relative z-10">{link.label}</span>
              {isActive(link.path) ? (
                <span className="absolute inset-0 bg-gray-200 dark:bg-gradient-to-r dark:from-purple-600/20 dark:to-pink-600/20 rounded-lg border border-gray-300 dark:border-purple-500/30" />
              ) : (
                <span className="absolute inset-0 bg-transparent group-hover:bg-gray-200/60 dark:group-hover:bg-white/5 rounded-lg transition-colors duration-300" />
              )}
            </Link>
          ))}
          {/* Theme Toggle Button */}
          <button 
            onClick={toggleTheme}
            className="ml-4 relative w-14 h-7 flex items-center bg-gray-200 dark:bg-gray-700 rounded-full cursor-pointer transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
            aria-label="Toggle light and dark mode"
          >
            <span className={`w-5 h-5 absolute left-1 top-1 bg-white rounded-full shadow-md transform transition-transform duration-300 ease-in-out flex items-center justify-center ${theme === 'dark' ? 'translate-x-7' : 'translate-x-0'}`}>
              {theme === 'dark' ? (
                // Moon Icon
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-700" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              ) : (
                // Sun Icon
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm-.707 7.072l.707-.707a1 1 0 10-1.414-1.414l-.707.707a1 1 0 001.414 1.414zM3 11a1 1 0 100-2H2a1 1 0 100 2h1z" clipRule="evenodd" />
                </svg>
              )}
            </span>
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden relative p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200/60 dark:hover:bg-white/5 transition-all duration-300"
          aria-label="Toggle menu"
          aria-expanded={isMenuOpen}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {isMenuOpen ? (
              <path d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile Navigation Dropdown */}
      <div className={`md:hidden border-t border-gray-200 dark:border-white/5 bg-white/95 dark:bg-black/80 backdrop-blur-xl transition-all duration-300 ease-in-out ${isMenuOpen ? 'max-h-screen' : 'max-h-0 overflow-hidden'}`}>
        {isMenuOpen && (
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex flex-col space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`px-4 py-3 text-base font-medium rounded-lg transition-all duration-300 ${
                    isActive(link.path)
                      ? 'text-gray-900 dark:text-white bg-gray-200 dark:bg-gradient-to-r dark:from-purple-600/20 dark:to-pink-600/20 border border-gray-300 dark:border-purple-500/30'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200/60 dark:hover:bg-white/5'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

export default Navbar
