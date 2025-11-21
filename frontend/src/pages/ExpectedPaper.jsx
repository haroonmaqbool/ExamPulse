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
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Expected Paper</h1>
        <button
          onClick={generateExpectedPaper}
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Generating...' : 'Generate Expected Paper'}
        </button>
      </div>

      {expectedPaper ? (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">
            Expected Questions (Max 20)
          </h2>
          <p className="text-gray-600">
            Expected paper questions will be displayed here
          </p>
        </div>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow text-center text-gray-600">
          Click "Generate Expected Paper" to create an expected exam paper
        </div>
      )}
    </div>
  )
}

export default ExpectedPaper

