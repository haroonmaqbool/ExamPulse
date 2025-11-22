/**
 * Analysis Page
 * Displays analysis results with topic frequencies and questions
 */

import { useState, useEffect } from 'react'
import TopicChart from '../components/TopicChart'
import { useTheme } from '../components/ThemeContext'
import axios from 'axios'

function Analysis() {
  const [analysisData, setAnalysisData] = useState(null)
  const [loading, setLoading] = useState(false)
  const { theme } = useTheme()
  const isDarkMode = theme === 'dark'

  useEffect(() => {
    // TODO: Load analysis data from API
    // This is a placeholder - implement actual data fetching
  }, [])

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
          }`}>Loading analysis...</div>
        ) : (
          <div className="space-y-6">
            <TopicChart data={analysisData?.topic_frequencies} />
            
            <div className={`rounded-2xl border p-8 transition-all duration-300 ${
              isDarkMode
                ? 'bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border-white/10'
                : 'bg-white border-2 border-blue-200'
            }`}>
              <h2 className={`text-2xl font-bold mb-4 transition-colors duration-300 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>Extracted Questions</h2>
              <p className={`transition-colors duration-300 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-700'
              }`}>
                Questions will be displayed here after analysis
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Analysis

