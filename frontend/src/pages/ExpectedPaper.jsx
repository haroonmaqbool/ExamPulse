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

function ExpectedPaper() {
  const [expectedPaper, setExpectedPaper] = useState(null)
  const [loading, setLoading] = useState(false)
  const { theme } = useTheme() // only need theme, toggle stays in navbar

  const generateExpectedPaper = async () => {
    setLoading(true)
    setExpectedPaper(null)
    try {
      const response = await api.post('/expected-paper/', {
        analysis_id: 'current' // Uses all questions in database
      })
      setExpectedPaper(response.data)
    } catch (error) {
      console.error('Failed to generate expected paper:', error)
      alert(error.message || 'Failed to generate expected paper. Please try again.')
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
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className={`text-5xl font-black bg-gradient-to-r bg-clip-text text-transparent transition-all duration-300 py-2 ${
              theme === 'dark'
                ? 'from-purple-400 to-pink-400'
                : 'from-blue-600 to-green-600'
            }`}>
              Expected Paper
            </motion.h1>

            {/* Generate button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={generateExpectedPaper}
              disabled={loading}
              className={`relative px-8 py-3 rounded-xl font-semibold text-white overflow-hidden transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg ${
                theme === 'dark'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 shadow-purple-500/30'
                  : 'bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-500 hover:to-green-500 shadow-blue-500/30'
              }`}
            >
              {loading ? 'Generating...' : 'Generate Expected Paper'}
            </motion.button>
          </div>

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
              className={`rounded-2xl border p-8 text-center transition-all duration-300 ${
              theme === 'dark'
                ? 'bg-white/5 border-white/10 backdrop-blur-xl text-gray-400'
                : 'bg-white/80 border-blue-200 backdrop-blur-sm text-gray-600'
            }`}>
              Click "Generate Expected Paper" to create an expected exam paper
            </motion.div>
          )}
        </div>
      </main>
    </div>
  )
}

export default ExpectedPaper
