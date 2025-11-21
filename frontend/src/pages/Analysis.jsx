/**
 * Analysis Page
 * Displays analysis results with topic frequencies and questions
 */

import { useState, useEffect } from 'react'
import TopicChart from '../components/TopicChart'
import axios from 'axios'

function Analysis() {
  const [analysisData, setAnalysisData] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // TODO: Load analysis data from API
    // This is a placeholder - implement actual data fetching
  }, [])

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold text-white mb-8 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
        Analysis Results
      </h1>
      
      {loading ? (
        <div className="text-center py-12 text-gray-400">Loading analysis...</div>
      ) : (
        <div className="space-y-6">
          <TopicChart data={analysisData?.topic_frequencies} />
          
          <div className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl rounded-2xl border border-white/10 p-8">
            <h2 className="text-2xl font-bold text-white mb-4">Extracted Questions</h2>
            <p className="text-gray-400">
              Questions will be displayed here after analysis
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default Analysis

