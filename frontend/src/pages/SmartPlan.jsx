/**
 * Smart Plan Page
 * Displays AI-powered personalized study plan
 */

import { useState, useEffect } from 'react'
import PlanCard from '../components/PlanCard'
import { useTheme } from '../components/ThemeContext'
import axios from 'axios'

function SmartPlan() {
  const [plan, setPlan] = useState(null)
  const [loading, setLoading] = useState(false)
  const { theme } = useTheme()
  const isDarkMode = theme === 'dark'

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
    <div className={`min-h-screen transition-colors duration-500 ${
      isDarkMode
        ? 'bg-[#0a0a0a]'
        : 'bg-gradient-to-br from-blue-50 via-white to-green-50'
    }`}>
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <h1 className={`text-4xl font-bold bg-gradient-to-r bg-clip-text text-transparent transition-all duration-300 ${
            isDarkMode
              ? 'from-purple-400 to-pink-400'
              : 'from-blue-600 to-green-600'
          }`}>
            Smart Exam Plan
          </h1>
          <button
            onClick={fetchSmartPlan}
            disabled={loading}
            className={`relative px-6 py-3 rounded-xl font-semibold text-white overflow-hidden transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100`}
          >
            <span className={`absolute inset-0 bg-gradient-to-r transition-all duration-300 ${
              isDarkMode
                ? 'from-purple-600 to-pink-600'
                : 'from-blue-600 to-green-600'
            }`} />
            <span className="relative">
              {loading ? 'Loading...' : 'Refresh Plan'}
            </span>
          </button>
        </div>

        {loading ? (
          <div className={`text-center py-12 transition-colors duration-300 ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>Loading smart plan...</div>
        ) : plan ? (
          <div className="space-y-6">
            <PlanCard plan={plan} />
            
            {plan.confidence_percentage !== undefined && (
              <div className={`rounded-2xl border p-8 transition-all duration-300 ${
                isDarkMode
                  ? 'bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border-white/10'
                  : 'bg-white border-2 border-blue-200'
              }`}>
                <h3 className={`text-xl font-bold mb-4 transition-colors duration-300 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>Confidence Level</h3>
                <div className={`w-full rounded-full h-3 overflow-hidden ${
                  isDarkMode ? 'bg-white/10' : 'bg-blue-200'
                }`}>
                  <div
                    className="h-3 rounded-full transition-all duration-500 bg-gradient-to-r from-purple-500 to-pink-500"
                    style={{ width: `${plan.confidence_percentage}%` }}
                  ></div>
                </div>
                <p className={`text-sm mt-3 transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-700'
                }`}>
                  {plan.confidence_percentage}% confidence
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className={`rounded-2xl border p-8 text-center transition-all duration-300 ${
            isDarkMode
              ? 'bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border-white/10 text-gray-400'
              : 'bg-white border-2 border-blue-200 text-gray-700'
          }`}>
            No smart plan available. Upload papers and create study logs to generate a plan.
          </div>
        )}
      </div>
    </div>
  )
}

export default SmartPlan

