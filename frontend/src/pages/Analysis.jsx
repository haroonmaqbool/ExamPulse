/**
 * Analysis Page
 * Displays analysis results with topic frequencies and questions
 */

import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import TopicChart from '../components/TopicChart'
import { useTheme } from '../components/ThemeContext'
import api from '../utils/api'

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
    <div className={`transition-colors duration-500 ${
      isDarkMode
        ? 'bg-[#0a0a0a]'
        : 'bg-gradient-to-br from-blue-50 via-white to-green-50'
    }`}>
      <div className="max-w-6xl mx-auto px-6 py-12">
        <h1 className={`text-4xl font-bold mb-8 bg-gradient-to-r bg-clip-text text-transparent transition-all duration-300 ${
          isDarkMode
            ? 'from-purple-400 to-pink-400'
            : 'from-blue-600 to-green-600'
        }`}>
          Analysis Results
        </h1>
        
        {loading ? (
          <div className={`text-center py-12 transition-colors duration-300 ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            <div className="flex items-center justify-center gap-2">
              <div className="h-4 w-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
              <span>Analyzing file... This may take a minute.</span>
            </div>
          </div>
        ) : error ? (
          <div className={`p-6 rounded-xl border transition-all duration-300 ${
            isDarkMode
              ? 'bg-red-500/10 text-red-400 border-red-500/30'
              : 'bg-red-100 text-red-700 border-red-400'
          }`}>
            <p className="mb-4">{error}</p>
            <button
              onClick={() => navigate('/upload')}
              className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                isDarkMode
                  ? 'bg-purple-600 hover:bg-purple-700 text-white'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              Upload a File
            </button>
          </div>
        ) : analysisData ? (
          <div className="space-y-6">
            <div className={`p-4 rounded-xl border transition-all duration-300 ${
              isDarkMode
                ? 'bg-green-500/10 text-green-400 border-green-500/30'
                : 'bg-green-100 text-green-700 border-green-400'
            }`}>
              <p className="font-semibold">Analysis Complete!</p>
              <p className="text-sm mt-1">
                Found {analysisData.total_questions} question{analysisData.total_questions !== 1 ? 's' : ''}
              </p>
            </div>

            <TopicChart data={analysisData.topic_frequencies} />
            
            <div className={`rounded-2xl border p-8 transition-all duration-300 ${
              isDarkMode
                ? 'bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border-white/10'
                : 'bg-white border-2 border-blue-200'
            }`}>
              <h2 className={`text-2xl font-bold mb-4 transition-colors duration-300 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Extracted Questions ({analysisData.questions?.length || 0})
              </h2>
              {analysisData.questions && analysisData.questions.length > 0 ? (
                <div className="space-y-4">
                  {analysisData.questions.map((q, index) => (
                    <div
                      key={index}
                      className={`p-4 rounded-lg border transition-all duration-300 ${
                        isDarkMode
                          ? 'bg-white/5 border-white/10'
                          : 'bg-blue-50 border-blue-200'
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
                    </div>
                  ))}
                </div>
              ) : (
                <p className={`transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-700'
                }`}>
                  No questions found in this file.
                </p>
              )}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}

export default Analysis

