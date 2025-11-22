/**
 * Smart Plan Page
 * Displays AI-powered personalized study plan
 */

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import PlanCard from '../components/PlanCard'
import { useTheme } from '../components/ThemeContext'
import api from '../utils/api'
import Navbar from '../components/Navbar'
import Background from '../components/Background'
import ShaderBackground from '../components/ShaderBackground'

function SmartPlan() {
  const [plan, setPlan] = useState(null)
  const [loading, setLoading] = useState(false)
  const { theme } = useTheme()
  const isDarkMode = theme === 'dark'

  const fetchSmartPlan = async () => {
    setLoading(true)
    setPlan(null)
    try {
      const response = await api.get('/smart-plan/')
      setPlan(response.data.plan)
    } catch (error) {
      console.error('Failed to fetch smart plan:', error)
      alert(error.message || 'Failed to fetch smart plan. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSmartPlan()
  }, [])

  return (
    <div className={`min-h-screen relative overflow-hidden transition-colors duration-500 ${
      isDarkMode
        ? 'bg-[#0a0a0a]'
        : 'bg-gradient-to-br from-blue-50 via-white to-green-50'
    }`}>
      {isDarkMode && <ShaderBackground />}
      {!isDarkMode && <Background />}
      <Navbar />
      <main className="pt-20 relative z-10">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className={`text-5xl font-black bg-gradient-to-r bg-clip-text text-transparent transition-all duration-300 ${
                isDarkMode
                  ? 'from-purple-400 to-pink-400'
                  : 'from-blue-600 to-green-600'
              }`}
            >
              Smart Exam Plan
            </motion.h1>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={fetchSmartPlan}
              disabled={loading}
              className={`relative px-6 py-3 rounded-xl font-semibold text-white overflow-hidden transition-all duration-300 disabled:opacity-50 disabled:hover:scale-100 shadow-lg ${
                isDarkMode
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 shadow-purple-500/30'
                  : 'bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-500 hover:to-green-500 shadow-blue-500/30'
              }`}
            >
              <span className="relative">
                {loading ? 'Loading...' : 'Refresh Plan'}
              </span>
            </motion.button>
          </div>

          {loading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className={`text-center py-12 transition-colors duration-300 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}
            >
              Loading smart plan...
            </motion.div>
          ) : plan ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <PlanCard plan={plan} />
              
              {plan.confidence_percentage !== undefined && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className={`rounded-2xl border p-8 transition-all duration-300 backdrop-blur-sm ${
                    isDarkMode
                      ? 'bg-white/5 border-white/10'
                      : 'bg-white/80 border-blue-200'
                  }`}
                >
                  <h3 className={`text-xl font-bold mb-4 transition-colors duration-300 ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    Confidence Level
                  </h3>
                  <div className={`w-full rounded-full h-3 overflow-hidden ${
                    isDarkMode ? 'bg-white/10' : 'bg-blue-200'
                  }`}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${plan.confidence_percentage}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className="h-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
                    />
                  </div>
                  <p className={`text-sm mt-3 transition-colors duration-300 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-700'
                  }`}>
                    {plan.confidence_percentage}% confidence
                  </p>
                </motion.div>
              )}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className={`rounded-2xl border p-8 text-center transition-all duration-300 backdrop-blur-sm ${
                isDarkMode
                  ? 'bg-white/5 border-white/10 text-gray-400'
                  : 'bg-white/80 border-blue-200 text-gray-700'
              }`}
            >
              No smart plan available. Upload papers and create study logs to generate a plan.
            </motion.div>
          )}
        </div>
      </main>
    </div>
  )
}

export default SmartPlan
