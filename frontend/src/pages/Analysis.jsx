/**
 * Analysis Page
 * Displays analysis results with topic frequencies and questions
 */

import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import TopicChart from '../components/TopicChart'
import { useTheme } from '../components/ThemeContext'
import api from '../utils/api'
import Navbar from '../components/Navbar'
import Background from '../components/Background'
import ShaderBackground from '../components/ShaderBackground'
import { motion } from 'framer-motion'

function Analysis() {
  const [analysisData, setAnalysisData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { theme } = useTheme()
  const isDarkMode = theme === 'dark'

  const fileId = searchParams.get('file_id')

  const analyzeFile = async (id) => {
    setLoading(true)
    setError(null)
    setAnalysisData(null)

    try {
      const response = await api.post('/analyze/', {
        file_id: id
      })
      setAnalysisData(response.data)
    } catch (err) {
      setError(err.message || 'Failed to analyze file')
      console.error('Analysis error:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (fileId) {
      analyzeFile(fileId)
    } else {
      setError('No file ID provided. Please upload a file first.')
    }
  }, [fileId])

  return (
    <div className={`min-h-screen relative overflow-hidden transition-colors duration-500 ${
      isDarkMode 
        ? '' 
        : 'bg-gradient-to-br from-blue-50 via-white to-green-50'
    }`}>
      {isDarkMode && <ShaderBackground />}
      {!isDarkMode && <Background />}
      <Navbar />
      <main className="pt-20 relative z-10">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={`text-5xl font-black mb-8 bg-gradient-to-r bg-clip-text text-transparent transition-all duration-300 py-2 ${
            isDarkMode
              ? 'from-purple-400 to-pink-400'
              : 'from-blue-600 to-green-600'
          }`}>
            Analysis Results
          </motion.h1>
          
          {loading ? (
            <div className={`text-center py-12 transition-colors duration-300 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              <div className="flex items-center justify-center gap-2">
                <div className={`h-4 w-4 border-2 border-t-transparent rounded-full animate-spin ${
                  isDarkMode ? 'border-purple-500' : 'border-blue-600'
                }`}></div>
                <span>Analyzing file... This may take a minute.</span>
              </div>
            </div>
          ) : error ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className={`p-6 rounded-xl border transition-all duration-300 ${
              isDarkMode
                ? 'bg-red-500/10 text-red-400 border-red-500/30'
                : 'bg-red-100 text-red-700 border-red-400'
            }`}>
              <p className="mb-4">{error}</p>
              <button
                onClick={() => navigate('/upload')}
                className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-[1.02] ${
                  isDarkMode
                    ? 'bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-400 hover:to-purple-500 text-white shadow-purple-500/30'
                    : 'bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-500 hover:to-green-500 text-white shadow-blue-500/30'
                }`}
              >
                Upload a File
              </button>
            </motion.div>
          ) : analysisData ? (
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className={`p-4 rounded-xl border transition-all duration-300 ${
                isDarkMode
                  ? 'bg-green-500/10 text-green-400 border-green-500/30'
                  : 'bg-green-100 text-green-700 border-green-400'
              }`}>
                <p className="font-semibold">Analysis Complete!</p>
                <p className="text-sm mt-1">
                  Found {analysisData.total_questions} question{analysisData.total_questions !== 1 ? 's' : ''}
                </p>
              </motion.div>

              <TopicChart data={analysisData.topic_frequencies} />
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className={`rounded-2xl border p-8 transition-all duration-300 ${
                isDarkMode
                  ? 'bg-white/5 border-white/10 backdrop-blur-xl'
                  : 'bg-white/80 border-blue-200 backdrop-blur-sm'
              }`}>
                <h2 className={`text-2xl font-black mb-4 transition-colors duration-300 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  Extracted Questions ({analysisData.questions?.length || 0})
                </h2>
                {analysisData.questions && analysisData.questions.length > 0 ? (
                  <div className="space-y-4">
                    {analysisData.questions.map((q, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        whileHover={{ y: -2 }}
                        className={`p-4 rounded-lg border transition-all duration-300 ${
                          isDarkMode
                            ? 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-blue-500/50'
                            : 'bg-white/80 border-blue-200 hover:bg-white hover:border-blue-300 backdrop-blur-sm'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <span className={`font-semibold transition-colors duration-300 ${
                            isDarkMode ? 'text-purple-400' : 'text-blue-600'
                          }`}>
                            Q{q.question_number || index + 1}
                          </span>
                          <span className={`text-sm transition-colors duration-300 ${
                            isDarkMode ? 'text-gray-400' : 'text-gray-600'
                          }`}>
                            {q.marks || 0} marks • {q.topic} • {q.qtype}
                          </span>
                        </div>
                        <p className={`transition-colors duration-300 ${
                          isDarkMode ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                          {q.question_text}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <p className={`transition-colors duration-300 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-700'
                  }`}>
                    No questions found in this file.
                  </p>
                )}
              </motion.div>
            </div>
          ) : null}
        </div>
      </main>
    </div>
  )
}

export default Analysis
