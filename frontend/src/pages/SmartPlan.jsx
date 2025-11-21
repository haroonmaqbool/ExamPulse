/**
 * Smart Plan Page
 * Displays AI-powered personalized study plan
 */

import { useState, useEffect } from 'react'
import PlanCard from '../components/PlanCard'
import axios from 'axios'

function SmartPlan() {
  const [plan, setPlan] = useState(null)
  const [loading, setLoading] = useState(false)

  const fetchSmartPlan = async () => {
    setLoading(true)
    try {
      // TODO: Implement actual API call
      const response = await axios.get('/api/smart-plan/')
      setPlan(response.data.plan)
    } catch (error) {
      console.error('Failed to fetch smart plan:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSmartPlan()
  }, [])

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <h1 className="text-4xl font-bold text-white bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          Smart Exam Plan
        </h1>
        <button
          onClick={fetchSmartPlan}
          disabled={loading}
          className="relative px-6 py-3 rounded-xl font-semibold text-white overflow-hidden transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
        >
          <span className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600" />
          <span className="relative">
            {loading ? 'Loading...' : 'Refresh Plan'}
          </span>
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-400">Loading smart plan...</div>
      ) : plan ? (
        <div className="space-y-6">
          <PlanCard plan={plan} />
          
          {plan.confidence_percentage !== undefined && (
            <div className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl rounded-2xl border border-white/10 p-8">
              <h3 className="text-xl font-bold text-white mb-4">Confidence Level</h3>
              <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${plan.confidence_percentage}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-400 mt-3">
                {plan.confidence_percentage}% confidence
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl rounded-2xl border border-white/10 p-8 text-center text-gray-400">
          No smart plan available. Upload papers and create study logs to generate a plan.
        </div>
      )}
    </div>
  )
}

export default SmartPlan

