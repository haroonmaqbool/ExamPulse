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
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Smart Exam Plan</h1>
        <button
          onClick={fetchSmartPlan}
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Loading...' : 'Refresh Plan'}
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12">Loading smart plan...</div>
      ) : plan ? (
        <div className="space-y-6">
          <PlanCard plan={plan} />
          
          {plan.confidence_percentage !== undefined && (
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-2">Confidence Level</h3>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div
                  className="bg-blue-600 h-4 rounded-full"
                  style={{ width: `${plan.confidence_percentage}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                {plan.confidence_percentage}% confidence
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow text-center text-gray-600">
          No smart plan available. Upload papers and create study logs to generate a plan.
        </div>
      )}
    </div>
  )
}

export default SmartPlan

