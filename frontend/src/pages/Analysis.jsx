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
import { Upload, FileText, ArrowRight } from 'lucide-react'

function Analysis() {
  const [analysisData, setAnalysisData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { theme } = useTheme()
  const isDarkMode = theme === 'dark'

  const fileIdsParam = searchParams.get('file_ids')
  let fileIds = []
  if (fileIdsParam) {
    try {
      fileIds = JSON.parse(fileIdsParam)
    } catch (e) {
      console.error('Parse error for file_ids:', e)
    }
  }

  const analyzeFile = async (ids) => {
    setLoading(true)
    setError(null)
    setAnalysisData(null)

    try {
      // Use a longer timeout for multi-file analysis
      const response = await api.post('/analyze/multi', {
        file_ids: ids
      }, {
        timeout: 600000 // 10 minutes for large file analysis
      })
      setAnalysisData(response.data)
    } catch (err) {
      // Provide more specific error messages
      if (err.code === 'ECONNABORTED' || err.message.includes('timeout')) {
        setError('Analysis is taking longer than expected. The backend is still processing. Please wait a moment and refresh the page, or try with fewer files.')
      } else {
        setError(err.message || 'Failed to analyze files')
      }
      console.error('Analysis error:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (fileIdsParam) {
      if (fileIds.length > 0) {
        analyzeFile(fileIds)
      } else {
        setError('Invalid file IDs. Please upload files again.')
      }
    } else {
      // Only set error if user navigated here directly without file IDs
      setError('No file IDs provided. Please upload files first.')
    }
  }, [fileIdsParam])

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
                <div className="h-4 w-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                <span>
                  Analyzing {fileIds.length > 1 ? `${fileIds.length} files` : 'file'}... 
                  {fileIds.length > 1 && 'This may take several minutes for multiple files.'}
                  {fileIds.length === 1 && 'This may take a minute.'}
                </span>
              </div>
            </div>
          ) : error && error.includes('No file IDs') ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center justify-center py-16 px-6"
            >
              <div className={`max-w-md w-full text-center space-y-6 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                {/* Icon */}
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="flex justify-center"
                >
                  <div className={`relative p-6 rounded-full ${
                    isDarkMode
                      ? 'bg-gradient-to-br from-purple-500/20 to-pink-500/20'
                      : 'bg-gradient-to-br from-blue-100 to-green-100'
                  }`}>
                    <FileText className={`w-16 h-16 ${
                      isDarkMode ? 'text-purple-400' : 'text-blue-600'
                    }`} strokeWidth={1.5} />
                  </div>
                </motion.div>

                {/* Message */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="space-y-3"
                >
                  <h2 className={`text-3xl font-black ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    No Files to Analyze
                  </h2>
                  <p className={`text-lg ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Upload your exam papers to get started with AI-powered analysis
                  </p>
                </motion.div>

                {/* CTA Button */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <button
                    onClick={() => navigate('/upload')}
                    className={`group relative px-8 py-4 rounded-xl font-bold text-base text-white overflow-hidden transition-all duration-300 shadow-lg transform hover:scale-[1.02] active:scale-[0.98] ${
                      isDarkMode
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 shadow-purple-500/30'
                        : 'bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-500 hover:to-green-500 shadow-blue-500/30'
                    }`}
                  >
                    <span className="relative flex items-center gap-2">
                      <Upload className="w-5 h-5" />
                      Upload Files
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                    </span>
                  </button>
                </motion.div>

                {/* Help Text */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className={`pt-6 border-t ${
                    isDarkMode ? 'border-white/10' : 'border-gray-200'
                  }`}
                >
                  <p className={`text-sm ${
                    isDarkMode ? 'text-gray-500' : 'text-gray-600'
                  }`}>
                    Supported formats: PDF, PNG, JPG • Max 10MB per file
                  </p>
                </motion.div>
              </div>
            </motion.div>
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
              <div className="flex items-start gap-4">
                <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                  isDarkMode ? 'bg-red-500/20' : 'bg-red-200'
                }`}>
                  <svg className={`w-5 h-5 ${isDarkMode ? 'text-red-400' : 'text-red-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className={`font-bold text-lg mb-2 ${
                    isDarkMode ? 'text-red-300' : 'text-red-800'
                  }`}>
                    Analysis Error
                  </h3>
                  <p className={`mb-4 ${
                    isDarkMode ? 'text-red-300/80' : 'text-red-700'
                  }`}>
                    {error}
                  </p>
                  <button
                    onClick={() => navigate('/upload')}
                    className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-[1.02] ${
                      isDarkMode
                        ? 'bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-400 hover:to-purple-500 text-white shadow-purple-500/30'
                        : 'bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-500 hover:to-green-500 text-white shadow-blue-500/30'
                    }`}
                  >
                    Go to Upload
                  </button>
                </div>
              </div>
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
