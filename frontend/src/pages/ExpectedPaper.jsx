/**
 * Expected Paper Page
 * Displays generated expected exam paper (max 20 questions)
 */

import { useState } from 'react'
import api from '../utils/api'
import { useTheme } from '../components/ThemeContext'
import Navbar from '../components/Navbar'
import Background from '../components/Background'
import GeneratingLoader from '../components/GeneratingLoader'

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
      theme === 'dark' ? 'bg-[#0a0a0a] text-white' : 'bg-gradient-to-br from-blue-50 via-white to-green-50'
    }`}>
      <Background />
      <Navbar />
      
      <main className="pt-20 relative z-10">
        <div className="max-w-6xl mx-auto px-6 py-12">
          {/* Header with title */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <h1 className={`text-4xl font-bold ${
              theme === 'dark'
                ? 'bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent'
                : 'text-gray-900'
            }`}>
              Expected Paper
            </h1>

            {/* Generate button */}
            <button
                onClick={generateExpectedPaper}
                disabled={loading}
                className={`relative px-6 py-3 rounded-xl font-semibold text-white overflow-hidden transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 ${
                  theme === 'dark'
                    ? 'text-white'
                    : 'text-gray-900' // button text color in light mode
                }`}
            >
                <span className={`absolute inset-0 ${
                  theme === 'dark'
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600'
                    : 'bg-gradient-to-r from-blue-500 to-green-500' // light mode gradient
                }`} />
                <span className="relative">
                  {loading ? 'Generating...' : 'Generate Expected Paper'}
                </span>
            </button>
          </div>

          {/* Expected Paper Display */}
          {loading ? (
            <div className={`rounded-2xl border transition-all duration-300 ${
              theme === 'dark'
                ? 'bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border-white/10'
                : 'bg-white border-2 border-blue-200'
            }`}>
              <GeneratingLoader text="Generating" />
            </div>
          ) : expectedPaper ? (
            <div className={`rounded-2xl border p-8 transition-all duration-300 ${
              theme === 'dark'
                ? 'bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border-white/10'
                : 'bg-white border-2 border-blue-200'
            }`}>
              <div className="mb-4">
                <h2 className={`text-2xl font-bold mb-2 transition-colors duration-300 ${
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
                    <div
                      key={index}
                      className={`p-4 rounded-lg border transition-all duration-300 ${
                        theme === 'dark'
                          ? 'bg-white/5 border-white/10'
                          : 'bg-blue-50 border-blue-200'
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
                    </div>
                  ))}
                </div>
              ) : (
                <p className={`transition-colors duration-300 ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  No questions generated.
                </p>
              )}
            </div>
          ) : (
            <div className={`rounded-2xl border p-8 text-center transition-all duration-300 ${
              theme === 'dark'
                ? 'bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border-white/10 text-gray-400'
                : 'bg-white border-2 border-blue-200 text-gray-600'
            }`}>
              Click "Generate Expected Paper" to create an expected exam paper
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default ExpectedPaper
