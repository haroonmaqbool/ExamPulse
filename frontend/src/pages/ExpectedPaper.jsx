/**
 * Expected Paper Page
 * Displays generated expected exam paper (max 20 questions)
 */

import { useState } from 'react'
import api from '../utils/api'
import { useTheme } from '../components/ThemeContext'
import Navbar from '../components/Navbar'
import Background from '../components/Background'
import ShaderBackground from '../components/ShaderBackground'
import GeneratingLoader from '../components/GeneratingLoader'
import { motion } from 'framer-motion'
import { Sparkles, FileText, Brain, TrendingUp, Zap } from 'lucide-react'

function ExpectedPaper() {
  const [expectedPaper, setExpectedPaper] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const { theme } = useTheme() // only need theme, toggle stays in navbar

  const generateExpectedPaper = async () => {
    setLoading(true)
    setExpectedPaper(null)
    setError(null)
    try {
      const response = await api.post('/expected-paper/', {
        analysis_id: 'current' // Uses all questions in database
      })
      setExpectedPaper(response.data)
    } catch (error) {
      console.error('Failed to generate expected paper:', error)
      setError(error.response?.data?.detail || error.message || 'Failed to generate expected paper. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={`min-h-screen relative overflow-hidden transition-colors duration-500 ${
      theme === 'dark' ? '' : 'bg-gradient-to-br from-blue-50 via-white to-green-50'
    }`}>
      {theme === 'dark' && <ShaderBackground />}
      {theme !== 'dark' && <Background />}
      <Navbar />
      
      <main className="pt-20 relative z-10">
        <div className="max-w-6xl mx-auto px-6 py-12">
          {/* Header with title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={`text-5xl font-black bg-gradient-to-r bg-clip-text text-transparent transition-all duration-300 py-2 mb-8 ${
              theme === 'dark'
                ? 'from-purple-400 to-pink-400'
                : 'from-blue-600 to-green-600'
            }`}>
            Expected Paper
          </motion.h1>

          {/* Error Display */}
          {error && !loading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className={`mb-6 p-6 rounded-xl border transition-all duration-300 ${
                theme === 'dark'
                  ? 'bg-red-500/10 text-red-400 border-red-500/30'
                  : 'bg-red-100 text-red-700 border-red-400'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                  theme === 'dark' ? 'bg-red-500/20' : 'bg-red-200'
                }`}>
                  <svg className={`w-5 h-5 ${theme === 'dark' ? 'text-red-400' : 'text-red-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className={`font-bold text-lg mb-2 ${
                    theme === 'dark' ? 'text-red-300' : 'text-red-800'
                  }`}>
                    Generation Failed
                  </h3>
                  <p className={`mb-4 ${
                    theme === 'dark' ? 'text-red-300/80' : 'text-red-700'
                  }`}>
                    {error}
                  </p>
                  <button
                    onClick={generateExpectedPaper}
                    className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-[1.02] ${
                      theme === 'dark'
                        ? 'bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-400 hover:to-purple-500 text-white shadow-purple-500/30'
                        : 'bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-500 hover:to-green-500 text-white shadow-blue-500/30'
                    }`}
                  >
                    Try Again
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Expected Paper Display */}
          {loading ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className={`rounded-2xl border transition-all duration-300 ${
              theme === 'dark'
                ? 'bg-white/5 border-white/10 backdrop-blur-xl'
                : 'bg-white/80 border-blue-200 backdrop-blur-sm'
            }`}>
              <GeneratingLoader text="Generating" />
            </motion.div>
          ) : expectedPaper ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className={`rounded-2xl border p-8 transition-all duration-300 ${
              theme === 'dark'
                ? 'bg-white/5 border-white/10 backdrop-blur-xl'
                : 'bg-white/80 border-blue-200 backdrop-blur-sm'
            }`}>
              <div className="mb-4">
                <h2 className={`text-2xl font-black mb-2 transition-colors duration-300 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  Expected Questions ({expectedPaper.total_questions || 0})
                </h2>
                {expectedPaper.based_on_topics && (
                  <p className={`text-sm transition-colors duration-300 ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Based on topics: {expectedPaper.based_on_topics.join(', ')}
                  </p>
                )}
              </div>
              
              {expectedPaper.questions && expectedPaper.questions.length > 0 ? (
                <div className="space-y-4">
                  {expectedPaper.questions.map((q, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      whileHover={{ y: -2 }}
                      className={`p-4 rounded-lg border transition-all duration-300 ${
                        theme === 'dark'
                          ? 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-blue-500/50'
                          : 'bg-white/80 border-blue-200 hover:bg-white hover:border-blue-300 backdrop-blur-sm'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <span className={`font-semibold transition-colors duration-300 ${
                          theme === 'dark' ? 'text-purple-400' : 'text-blue-600'
                        }`}>
                          Q{q.question_number || index + 1}
                        </span>
                        <span className={`text-sm transition-colors duration-300 ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          {q.marks || 0} marks • {q.topic} • {q.qtype}
                        </span>
                      </div>
                      <p className={`transition-colors duration-300 ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        {q.question_text}
                      </p>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <p className={`transition-colors duration-300 ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  No questions generated.
                </p>
              )}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-8"
            >
              {/* Empty State Card */}
              <div className={`rounded-2xl border p-12 transition-all duration-300 ${
                theme === 'dark'
                  ? 'bg-white/5 border-white/10 backdrop-blur-xl'
                  : 'bg-white/80 border-blue-200 backdrop-blur-sm'
              }`}>
                <div className="flex flex-col items-center justify-center text-center space-y-6 max-w-2xl mx-auto">
                  {/* Icon */}
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="relative"
                  >
                    <div className={`relative p-6 rounded-full ${
                      theme === 'dark'
                        ? 'bg-gradient-to-br from-purple-500/20 to-pink-500/20'
                        : 'bg-gradient-to-br from-blue-100 to-green-100'
                    }`}>
                      <Sparkles className={`w-16 h-16 ${
                        theme === 'dark' ? 'text-purple-400' : 'text-blue-600'
                      }`} strokeWidth={1.5} />
                    </div>
                    <motion.div
                      animate={{ 
                        scale: [1, 1.1, 1],
                        opacity: [0.5, 0.8, 0.5]
                      }}
                      transition={{ 
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      className={`absolute inset-0 rounded-full ${
                        theme === 'dark'
                          ? 'bg-purple-500/20'
                          : 'bg-blue-500/20'
                      }`}
                    />
                  </motion.div>

                  {/* Message */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="space-y-3"
                  >
                    <h2 className={`text-3xl font-black ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                      Generate Your Expected Paper
                    </h2>
                    <p className={`text-lg ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      AI will analyze your uploaded papers and predict the most likely questions for your upcoming exam
                    </p>
                  </motion.div>

                  {/* Features */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className={`grid grid-cols-1 md:grid-cols-3 gap-4 w-full mt-8 ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}
                  >
                    <div className={`p-4 rounded-xl ${
                      theme === 'dark'
                        ? 'bg-white/5 border border-white/10'
                        : 'bg-blue-50/50 border border-blue-200'
                    }`}>
                      <Brain className={`w-6 h-6 mb-2 mx-auto ${
                        theme === 'dark' ? 'text-purple-400' : 'text-blue-600'
                      }`} />
                      <p className="text-sm font-medium">AI-Powered</p>
                      <p className="text-xs mt-1 opacity-80">Smart predictions</p>
                    </div>
                    <div className={`p-4 rounded-xl ${
                      theme === 'dark'
                        ? 'bg-white/5 border border-white/10'
                        : 'bg-green-50/50 border border-green-200'
                    }`}>
                      <TrendingUp className={`w-6 h-6 mb-2 mx-auto ${
                        theme === 'dark' ? 'text-green-400' : 'text-green-600'
                      }`} />
                      <p className="text-sm font-medium">Pattern Analysis</p>
                      <p className="text-xs mt-1 opacity-80">Based on trends</p>
                    </div>
                    <div className={`p-4 rounded-xl ${
                      theme === 'dark'
                        ? 'bg-white/5 border border-white/10'
                        : 'bg-purple-50/50 border border-purple-200'
                    }`}>
                      <Zap className={`w-6 h-6 mb-2 mx-auto ${
                        theme === 'dark' ? 'text-yellow-400' : 'text-purple-600'
                      }`} />
                      <p className="text-sm font-medium">Quick Generation</p>
                      <p className="text-xs mt-1 opacity-80">Instant results</p>
                    </div>
                  </motion.div>

                  {/* CTA */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="pt-4"
                  >
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={generateExpectedPaper}
                      disabled={loading}
                      className={`group relative px-8 py-4 rounded-xl font-bold text-base text-white overflow-hidden transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg ${
                        theme === 'dark'
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 shadow-purple-500/30'
                          : 'bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-500 hover:to-green-500 shadow-blue-500/30'
                      }`}
                    >
                      <span className="relative flex items-center gap-2">
                        <FileText className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                        Generate Expected Paper
                      </span>
                    </motion.button>
                  </motion.div>

                  {/* Help Text */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    className={`pt-6 border-t w-full ${
                      theme === 'dark' ? 'border-white/10' : 'border-gray-200'
                    }`}
                  >
                    <p className={`text-sm ${
                      theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
                    }`}>
                      💡 Tip: Upload 3-5 years of past papers for more accurate predictions
                    </p>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  )
}

export default ExpectedPaper
