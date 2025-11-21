import { Link, useLocation } from 'react-router-dom'
import { useState } from 'react'

function Navbar() {
  const location = useLocation()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const isActive = (path) => location.pathname === path

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/upload', label: 'Upload' },
    { path: '/analysis', label: 'Analysis' },
    { path: '/expected-paper', label: 'Expected Paper' },
    { path: '/study-logs', label: 'Study Logs' },
    { path: '/smart-plan', label: 'Smart Plan' },
  ]

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-black/40 backdrop-blur-xl border-b border-white/5">
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-6 lg:px-8 h-20">
        {/* Brand with gradient */}
        <Link 
          to="/" 
          className="flex items-center gap-2 text-2xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-500 bg-clip-text text-transparent hover:from-purple-300 hover:via-pink-300 hover:to-purple-400 transition-all duration-300"
        >
          ExamPulse
          <span className="h-2 w-2 rounded-full bg-purple-500 animate-pulse" />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-2">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`relative px-4 py-2 text-sm font-medium transition-all duration-300 rounded-lg group ${
                isActive(link.path)
                  ? 'text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <span className="relative z-10">{link.label}</span>
              {isActive(link.path) ? (
                <span className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-lg border border-purple-500/30" />
              ) : (
                <span className="absolute inset-0 bg-white/0 group-hover:bg-white/5 rounded-lg transition-colors duration-300" />
              )}
            </Link>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden relative p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all duration-300"
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
      {isMenuOpen && (
        <div className="md:hidden border-t border-white/5 bg-black/60 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex flex-col space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`px-4 py-3 text-sm font-medium rounded-lg transition-all duration-300 ${
                    isActive(link.path)
                      ? 'text-white bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

export default Navbar

