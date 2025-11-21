/**
 * Expected Paper Page
 * Displays generated expected exam paper (max 20 questions)
 */

import { useState, useEffect } from 'react'
import axios from 'axios'

function ExpectedPaper() {
  const [expectedPaper, setExpectedPaper] = useState(null)
  const [loading, setLoading] = useState(false)

  const generateExpectedPaper = async () => {
    setLoading(true)
    try {
      // TODO: Implement actual API call
      const response = await axios.post('/api/expected-paper/', {
        analysis_id: 'placeholder'
      })
      setExpectedPaper(response.data)
    } catch (error) {
      console.error('Failed to generate expected paper:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <h1 className="text-4xl font-bold text-white bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          Expected Paper
        </h1>
        <button
          onClick={generateExpectedPaper}
          disabled={loading}
          className="relative px-6 py-3 rounded-xl font-semibold text-white overflow-hidden transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
        >
          <span className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600" />
          <span className="relative">
            {loading ? 'Generating...' : 'Generate Expected Paper'}
          </span>
        </button>
      </div>

      {expectedPaper ? (
        <div className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl rounded-2xl border border-white/10 p-8">
          <h2 className="text-2xl font-bold text-white mb-4">
            Expected Questions (Max 20)
          </h2>
          <p className="text-gray-400">
            Expected paper questions will be displayed here
          </p>
        </div>
      ) : (
        <div className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl rounded-2xl border border-white/10 p-8 text-center text-gray-400">
          Click "Generate Expected Paper" to create an expected exam paper
        </div>
      )}
    </div>
  )
}

export default ExpectedPaper

