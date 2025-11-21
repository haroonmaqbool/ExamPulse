import { useState } from 'react';

export default function LandingPage() {
  const [isHovered, setIsHovered] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const features = [
    {
      icon: "📊",
      title: "Smart Pattern Analysis",
      description: "AI analyzes 3-5 years of past papers to identify recurring exam patterns and high-probability topics."
    },
    {
      icon: "📝",
      title: "Expected Paper Generation",
      description: "Get AI-generated expected papers based on historical data and topic frequency analysis."
    },
    {
      icon: "🎯",
      title: "Personalized Study Plans",
      description: "Receive customized study plans that adapt to your strengths, weaknesses, and available time."
    },
    {
      icon: "📈",
      title: "Progress Tracking",
      description: "Monitor your study progress with detailed analytics and confidence scoring."
    },
    {
      icon: "🔍",
      title: "Weak Area Detection",
      description: "Automatically identify topics that need more attention based on your study logs."
    },
    {
      icon: "⚡",
      title: "Quick OCR Upload",
      description: "Upload past papers as PDFs or images and let AI extract questions instantly."
    }
  ];

  const stats = [
    { number: "5+", label: "Years Analyzed" },
    { number: "95%", label: "Accuracy Rate" },
    { number: "10K+", label: "Questions Processed" },
    { number: "24/7", label: "AI Assistant" }
  ];

  return (
    <div className={`min-h-screen transition-colors duration-500 ${
      isDarkMode 
        ? 'bg-[#0a0a0a]' 
        : 'bg-gradient-to-br from-blue-50 via-white to-green-50'
    }`}>
      {/* Animated gradient background for dark mode */}
      {isDarkMode && (
        <>
          {/* Subtle dark gradient base */}
          <div className="fixed inset-0 bg-gradient-to-b from-[#050505] via-[#0a0a0a] to-black opacity-90" />

          {/* Very soft orbs */}
          <div className="fixed inset-0 pointer-events-none">
            <div className="absolute top-1/4 left-1/3 w-72 h-72 bg-purple-700/10 rounded-full blur-[140px]" />
            <div className="absolute bottom-1/4 right-1/3 w-72 h-72 bg-pink-700/10 rounded-full blur-[140px]" />
          </div>

          {/* Very subtle grid (dark mode friendly) */}
          <div className="fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:120px_120px] opacity-10" />
        </>
      )}

      {/* Navigation */}
      <nav className={`sticky top-0 z-50 transition-colors duration-500 ${
        isDarkMode ? 'bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/5' : 'bg-white shadow-sm'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                isDarkMode 
                  ? 'bg-gradient-to-br from-purple-500 to-pink-500' 
                  : 'bg-gradient-to-br from-blue-500 to-green-500'
              }`}>
                <span className="text-white font-bold text-xl">EP</span>
              </div>
              <span className={`text-2xl font-bold ${
                isDarkMode 
                  ? 'bg-gradient-to-r from-purple-400 via-pink-400 to-purple-500 bg-clip-text text-transparent'
                  : 'bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent'
              }`}>
                ExamPulse
              </span>
            </div>
            <div className="flex items-center space-x-8">
              <div className="hidden md:flex space-x-8">
                <a href="#features" className={`transition ${
                  isDarkMode ? 'text-gray-400 hover:text-purple-400' : 'text-gray-700 hover:text-blue-600'
                }`}>Features</a>
                <a href="#how-it-works" className={`transition ${
                  isDarkMode ? 'text-gray-400 hover:text-purple-400' : 'text-gray-700 hover:text-blue-600'
                }`}>How It Works</a>
              </div>
              
              {/* Dark Mode Toggle */}
              <button
                onClick={toggleDarkMode}
                className={`relative w-16 h-8 rounded-full transition-colors duration-500 ${
                  isDarkMode ? 'bg-purple-900/30 border border-purple-500/30' : 'bg-blue-200'
                }`}
                aria-label="Toggle dark mode"
              >
                <div className={`absolute top-1 left-1 w-6 h-6 rounded-full transition-all duration-500 transform ${
                  isDarkMode ? 'translate-x-8 bg-gradient-to-br from-purple-500 to-pink-500' : 'translate-x-0 bg-yellow-400'
                } flex items-center justify-center`}>
                  {isDarkMode ? (
                    <span className="text-xs">🌙</span>
                  ) : (
                    <span className="text-xs">☀️</span>
                  )}
                </div>
              </button>
              
              <button className={`px-6 py-2 rounded-lg font-semibold transition transform hover:scale-105 ${
                isDarkMode
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-[0_0_40px_rgba(168,85,247,0.4)]'
                  : 'bg-gradient-to-r from-blue-500 to-green-500 text-white hover:shadow-lg'
              }`}>
                Get Started
              </button>
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
                isDarkMode 
                  ? 'bg-gradient-to-r from-purple-600/10 to-pink-600/10 border border-purple-500/20 text-purple-400'
                  : 'bg-blue-100 text-blue-700'
              }`}>
                🚀 AI-Powered Exam Preparation
              </span>
            </div>
            <h1 className={`text-5xl md:text-6xl font-bold leading-tight ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Study <span className={isDarkMode 
                ? 'bg-gradient-to-r from-purple-400 via-pink-400 to-purple-500 bg-clip-text text-transparent'
                : 'bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent'
              }>Smarter</span>,
              Not Harder
            </h1>
            <p className={`text-xl leading-relaxed ${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              ExamPulse uses advanced AI to analyze past papers, predict exam patterns, and create personalized study plans tailored to your needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button className={`px-8 py-4 rounded-lg font-semibold text-lg transition transform hover:scale-105 ${
                isDarkMode
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-[0_0_40px_rgba(168,85,247,0.4)]'
                  : 'bg-gradient-to-r from-blue-500 to-green-500 text-white hover:shadow-xl'
              }`}>
                Start Analyzing Papers
              </button>
            </div>
            {/* Stats */}
            <div className="grid grid-cols-4 gap-4 pt-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className={`text-2xl font-bold ${
                    isDarkMode ? 'text-purple-400' : 'text-blue-600'
                  }`}>{stat.number}</div>
                  <div className={`text-sm ${
                    isDarkMode ? 'text-gray-500' : 'text-gray-600'
                  }`}>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className={`relative rounded-2xl p-8 shadow-2xl transform rotate-3 hover:rotate-0 transition duration-500 ${
              isDarkMode
                ? 'bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30'
                : 'bg-gradient-to-br from-blue-400 to-green-400'
            }`}>
              <div className={`rounded-xl p-6 space-y-4 ${
                isDarkMode ? 'bg-white/5 backdrop-blur-xl border border-white/10' : 'bg-white'
              }`}>
                <div className="flex items-center space-x-3">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    isDarkMode ? 'bg-gradient-to-br from-purple-600/20 to-pink-600/20 border border-purple-500/30' : 'bg-green-100'
                  }`}>
                    <span className="text-2xl">🎯</span>
                  </div>
                  <div>
                    <div className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      Expected Paper Ready
                    </div>
                    <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      20 high-priority questions
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                      Confidence Score
                    </span>
                    <span className={`font-semibold ${isDarkMode ? 'text-purple-400' : 'text-green-600'}`}>92%</span>
                  </div>
                  <div className={`w-full rounded-full h-2 ${
                    isDarkMode ? 'bg-white/10' : 'bg-gray-200'
                  }`}>
                    <div className={`h-2 rounded-full ${
                      isDarkMode 
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500'
                        : 'bg-gradient-to-r from-blue-500 to-green-500'
                    }`} style={{ width: '92%' }}></div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 pt-2">
                  <div className={`p-3 rounded-lg text-center ${
                    isDarkMode ? 'bg-purple-600/10 border border-purple-500/20' : 'bg-blue-50'
                  }`}>
                    <div className={`text-lg font-bold ${isDarkMode ? 'text-purple-400' : 'text-blue-600'}`}>15</div>
                    <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Topics</div>
                  </div>
                  <div className={`p-3 rounded-lg text-center ${
                    isDarkMode ? 'bg-pink-600/10 border border-pink-500/20' : 'bg-green-50'
                  }`}>
                    <div className={`text-lg font-bold ${isDarkMode ? 'text-pink-400' : 'text-green-600'}`}>8</div>
                    <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>High Priority</div>
                  </div>
                  <div className={`p-3 rounded-lg text-center ${
                    isDarkMode ? 'bg-purple-600/10 border border-purple-500/20' : 'bg-purple-50'
                  }`}>
                    <div className={`text-lg font-bold ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`}>5</div>
                    <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Papers</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className={`relative z-10 py-20 transition-colors duration-500 ${
        isDarkMode ? 'bg-transparent' : 'bg-white'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className={`text-4xl font-bold mb-4 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Powerful Features for <span className={isDarkMode 
                ? 'bg-gradient-to-r from-purple-400 via-pink-400 to-purple-500 bg-clip-text text-transparent'
                : 'bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent'
              }>Exam Success</span>
            </h2>
            <p className={`text-xl max-w-2xl mx-auto ${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Everything you need to ace your exams, powered by cutting-edge AI technology
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                onMouseEnter={() => setIsHovered(index)}
                onMouseLeave={() => setIsHovered(null)}
                className={`p-6 rounded-xl transition duration-300 hover:shadow-xl transform hover:-translate-y-2 ${
                  isDarkMode
                    ? `bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border ${
                        isHovered === index ? 'border-purple-500/30 shadow-[0_0_50px_rgba(168,85,247,0.15)]' : 'border-white/10'
                      }`
                    : `bg-gradient-to-br border-2 ${
                        isHovered === index ? 'from-blue-50 to-green-50 border-blue-300' : 'from-gray-50 to-white border-gray-200'
                      }`
                }`}
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className={`text-xl font-bold mb-2 ${
                  isDarkMode 
                    ? `${isHovered === index ? 'text-purple-300' : 'text-white'}`
                    : 'text-gray-900'
                }`}>{feature.title}</h3>
                <p className={`${
                  isDarkMode 
                    ? `${isHovered === index ? 'text-gray-300' : 'text-gray-400'}`
                    : 'text-gray-600'
                }`}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className={`relative z-10 py-20 transition-colors duration-500 ${
        isDarkMode 
          ? 'bg-transparent' 
          : 'bg-gradient-to-br from-blue-50 to-green-50'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className={`text-4xl font-bold mb-4 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              How It Works
            </h2>
            <p className={`text-xl ${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>Simple, fast, and effective</p>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: "1", title: "Upload Papers", desc: "Upload past exam papers as PDF or images", icon: "📤" },
              { step: "2", title: "AI Analysis", desc: "Our AI extracts and categorizes questions", icon: "🤖" },
              { step: "3", title: "Get Insights", desc: "Receive pattern analysis and expected papers", icon: "💡" },
              { step: "4", title: "Study Smart", desc: "Follow your personalized study plan", icon: "🎓" }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4 shadow-lg ${
                  isDarkMode
                    ? 'bg-gradient-to-br from-purple-600 to-pink-600 text-white'
                    : 'bg-gradient-to-br from-blue-500 to-green-500 text-white'
                }`}>
                  {item.icon}
                </div>
                <div className={`rounded-lg p-6 shadow-md ${
                  isDarkMode ? 'bg-white/5 backdrop-blur-xl border border-white/10' : 'bg-white'
                }`}>
                  <div className={`text-sm font-semibold mb-2 ${
                    isDarkMode ? 'text-purple-400' : 'text-blue-600'
                  }`}>STEP {item.step}</div>
                  <h3 className={`text-lg font-bold mb-2 ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>{item.title}</h3>
                  <p className={`text-sm ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={`relative z-10 py-20 ${
        isDarkMode 
          ? 'bg-gradient-to-r from-purple-900/30 to-pink-900/30 border-y border-purple-500/20'
          : 'bg-gradient-to-r from-blue-600 to-green-600'
      }`}>
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Transform Your Exam Preparation?
          </h2>
          <p className={`text-xl mb-8 ${
            isDarkMode ? 'text-gray-300' : 'text-blue-100'
          }`}>
            Join thousands of students who are studying smarter with ExamPulse
          </p>
          <button className={`px-8 py-4 rounded-lg font-semibold text-lg transition transform hover:scale-105 ${
            isDarkMode
              ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-[0_0_40px_rgba(168,85,247,0.5)]'
              : 'bg-white text-blue-600 hover:shadow-2xl'
          }`}>
            Get Started
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className={`relative z-10 py-12 transition-colors duration-500 ${
        isDarkMode ? 'border-t border-white/5 bg-transparent' : 'bg-gray-900'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                isDarkMode 
                  ? 'bg-gradient-to-br from-purple-500 to-pink-500' 
                  : 'bg-gradient-to-br from-blue-500 to-green-500'
              }`}>
                <span className="text-white font-bold text-xl">EP</span>
              </div>
              <span className="text-xl font-bold text-white">ExamPulse</span>
            </div>
            <p className={`text-sm mb-4 ${
              isDarkMode ? 'text-gray-500' : 'text-gray-400'
            }`}>
              © 2025 ExamPulse. Built with ❤️ for students.
            </p>
            <p className={`text-xs ${
              isDarkMode ? 'text-gray-600' : 'text-gray-500'
            }`}>
              Team: Haroon, Azmeer, Saria, Soban, Basima, Dr. Mubashar
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}