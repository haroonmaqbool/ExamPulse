import { useState } from 'react';
import { useTheme } from '../components/ThemeContext';
import { Link } from 'react-router-dom';

export default function LandingPage() {
  const { theme, toggleTheme } = useTheme();
  const [isHovered, setIsHovered] = useState(null);
  
  const features = [
    { icon: "📊", title: "Smart Pattern Analysis", description: "AI analyzes 3-5 years of past papers to identify recurring exam patterns and high-probability topics." },
    { icon: "📝", title: "Expected Paper Generation", description: "Get AI-generated expected papers based on historical data and topic frequency analysis." },
    { icon: "🎯", title: "Personalized Study Plans", description: "Receive customized study plans that adapt to your strengths, weaknesses, and available time." },
    { icon: "📈", title: "Progress Tracking", description: "Monitor your study progress with detailed analytics and confidence scoring." },
    { icon: "🔍", title: "Weak Area Detection", description: "Automatically identify topics that need more attention based on your study logs." },
    { icon: "⚡", title: "Quick OCR Upload", description: "Upload past papers as PDFs or images and let AI extract questions instantly." }
  ];

  const stats = [
    { number: "5+", label: "Years Analyzed" },
    { number: "95%", label: "Accuracy Rate" },
    { number: "10K+", label: "Questions Processed" },
    { number: "24/7", label: "AI Assistant" }
  ];

  return (
    <div className={`min-h-screen transition-colors duration-500 ${
      theme === 'dark'
        ? 'bg-[#0a0a0a]' 
        : 'bg-gradient-to-br from-blue-50 via-white to-green-50'
    }`}>
      {/* Animated gradient background for dark mode */}
      {theme === 'dark' && (
        <>
          <div className="fixed inset-0 bg-gradient-to-b from-[#050505] via-[#0a0a0a] to-black opacity-90" />
          <div className="fixed inset-0 pointer-events-none">
            <div className="absolute top-1/4 left-1/3 w-72 h-72 bg-purple-700/10 rounded-full blur-[140px]" />
            <div className="absolute bottom-1/4 right-1/3 w-72 h-72 bg-pink-700/10 rounded-full blur-[140px]" />
          </div>
          <div className="fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:120px_120px] opacity-10" />
        </>
      )}

      {/* Navigation */}
      <nav className={`sticky top-0 z-50 transition-colors duration-500 ${
        theme === 'dark' ? 'bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/5' : 'bg-white shadow-sm'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                theme === 'dark' 
                  ? 'bg-gradient-to-br from-purple-500 to-pink-500' 
                  : 'bg-gradient-to-br from-blue-500 to-green-500'
              }`}>
                <span className="text-white font-bold text-xl">EP</span>
              </div>
              <span className={`text-2xl font-bold ${
                theme === 'dark' 
                  ? 'bg-gradient-to-r from-purple-400 via-pink-400 to-purple-500 bg-clip-text text-transparent'
                  : 'bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent'
              }`}>
                ExamPulse
              </span>
            </div>
            <div className="flex items-center space-x-8">
              <div className="hidden md:flex space-x-8">
                <a href="#features" className={`transition ${
                  theme === 'dark' ? 'text-gray-400 hover:text-purple-400' : 'text-gray-700 hover:text-blue-600'
                }`}>Features</a>
                <a href="#how-it-works" className={`transition ${
                  theme === 'dark' ? 'text-gray-400 hover:text-purple-400' : 'text-gray-700 hover:text-blue-600'
                }`}>How It Works</a>
              </div>
              <button
                onClick={toggleTheme}
                className={`relative w-16 h-8 rounded-full transition-colors duration-500 ${
                  theme === 'dark' ? 'bg-purple-900/30 border border-purple-500/30' : 'bg-blue-200'
                }`}
                aria-label="Toggle dark mode"
              >
                <div className={`absolute top-1 left-1 w-6 h-6 rounded-full transition-all duration-500 transform ${
                  theme === 'dark' ? 'translate-x-8 bg-gradient-to-br from-purple-500 to-pink-500' : 'translate-x-0 bg-yellow-400'
                } flex items-center justify-center`}>
                  {theme === 'dark' ? <span className="text-xs">🌙</span> : <span className="text-xs">☀️</span>}
                </div>
              </button>
              <Link to="/home" className={`px-6 py-2 rounded-lg font-semibold transition transform hover:scale-105 text-center ${
                theme === 'dark'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-[0_0_40px_rgba(168,85,247,0.4)]'
                  : 'bg-gradient-to-r from-blue-500 to-green-500 text-white hover:shadow-lg'
              }`}>
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="inline-block">
              <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                theme === 'dark' 
                  ? 'bg-gradient-to-r from-purple-600/10 to-pink-600/10 border border-purple-500/20 text-purple-400'
                  : 'bg-blue-100 text-blue-700'
              }`}>
                🚀 AI-Powered Exam Preparation
              </span>
            </div>
            <h1 className={`text-5xl md:text-6xl font-bold leading-tight ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Study <span className={theme === 'dark' 
                ? 'bg-gradient-to-r from-purple-400 via-pink-400 to-purple-500 bg-clip-text text-transparent'
                : 'bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent'
              }>Smarter</span>, Not Harder
            </h1>
            <p className={`text-xl leading-relaxed ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              ExamPulse uses advanced AI to analyze past papers, predict exam patterns, and create personalized study plans tailored to your needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/home" className={`px-8 py-4 rounded-lg font-semibold text-lg transition transform hover:scale-105 text-center ${
                theme === 'dark'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-[0_0_40px_rgba(168,85,247,0.4)]'
                  : 'bg-gradient-to-r from-blue-500 to-green-500 text-white hover:shadow-xl'
              }`}>
                Start Analyzing Papers
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-4 pt-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className={`text-2xl font-bold ${theme === 'dark' ? 'text-purple-400' : 'text-blue-600'}`}>
                    {stat.number}
                  </div>
                  <div className={`text-sm ${theme === 'dark' ? 'text-gray-500' : 'text-gray-600'}`}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className={`relative rounded-2xl p-8 shadow-2xl transform rotate-3 hover:rotate-0 transition duration-500 ${
              theme === 'dark'
                ? 'bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30'
                : 'bg-gradient-to-br from-blue-400 to-green-400'
            }`}>
              <div className={`rounded-xl p-6 space-y-4 ${
                theme === 'dark' ? 'bg-white/5 backdrop-blur-xl border border-white/10' : 'bg-white'
              }`}>
                <div className="flex items-center space-x-3">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    theme === 'dark' ? 'bg-gradient-to-br from-purple-600/20 to-pink-600/20 border border-purple-500/30' : 'bg-green-100'
                  }`}>
                    <span className="text-2xl">🎯</span>
                  </div>
                  <div>
                    <div className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      Expected Paper Ready
                    </div>
                    <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                      20 high-priority questions
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Confidence Score</span>
                    <span className={`font-semibold ${theme === 'dark' ? 'text-purple-400' : 'text-green-600'}`}>92%</span>
                  </div>
                  <div className={`w-full rounded-full h-2 ${theme === 'dark' ? 'bg-white/10' : 'bg-gray-200'}`}>
                    <div className={`h-2 rounded-full ${
                      theme === 'dark' 
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500'
                        : 'bg-gradient-to-r from-blue-500 to-green-500'
                    }`} style={{ width: '92%' }}></div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-2">
                  <div className={`p-3 rounded-lg text-center ${theme === 'dark' ? 'bg-purple-600/10 border border-purple-500/20' : 'bg-blue-50'}`}>
                    <div className={`text-lg font-bold ${theme === 'dark' ? 'text-purple-400' : 'text-blue-600'}`}>15</div>
                    <div className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Topics</div>
                  </div>
                  <div className={`p-3 rounded-lg text-center ${theme === 'dark' ? 'bg-pink-600/10 border border-pink-500/20' : 'bg-green-50'}`}>
                    <div className={`text-lg font-bold ${theme === 'dark' ? 'text-pink-400' : 'text-green-600'}`}>8</div>
                    <div className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>High Priority</div>
                  </div>
                  <div className={`p-3 rounded-lg text-center ${theme === 'dark' ? 'bg-purple-600/10 border border-purple-500/20' : 'bg-purple-50'}`}>
                    <div className={`text-lg font-bold ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}`}>5</div>
                    <div className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Papers</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features and other sections remain the same... */}
    </div>
  );
}