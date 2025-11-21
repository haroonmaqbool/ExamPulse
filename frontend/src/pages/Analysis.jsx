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
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Analysis Results</h1>
      
      {loading ? (
        <div className="text-center py-12">Loading analysis...</div>
      ) : (
        <div className="space-y-6">
          <TopicChart data={analysisData?.topic_frequencies} />
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-semibold mb-4">Extracted Questions</h2>
            <p className="text-gray-600">
              Questions will be displayed here after analysis
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default Analysis

