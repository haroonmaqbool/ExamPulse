/**
 * PlanCard Component
 * Displays smart exam plan information
 */

import { useTheme } from './ThemeContext'

function PlanCard({ plan }) {
  const { theme } = useTheme()
  const isDarkMode = theme === 'dark'

  // TODO: Implement plan card with real data
  return (
    <div className={`rounded-2xl border p-8 transition-all duration-300 backdrop-blur-sm ${
      isDarkMode
        ? 'bg-white/5 border-white/10'
        : 'bg-white/80 border-blue-200'
    }`}>
      <h3 className={`text-2xl font-bold mb-6 bg-gradient-to-r bg-clip-text text-transparent transition-all duration-300 ${
        isDarkMode
          ? 'from-purple-400 to-pink-400'
          : 'from-blue-600 to-green-600'
      }`}>
        Smart Exam Plan
      </h3>
      <div className="space-y-6">
        <div className="group">
          <h4 className={`font-semibold mb-2 flex items-center gap-2 transition-colors duration-300 ${
            isDarkMode 
              ? 'text-purple-400' 
              : 'text-blue-600'
          }`}>
            <span className={`w-2 h-2 rounded-full transition-colors duration-300 ${
              isDarkMode ? 'bg-purple-400' : 'bg-blue-600'
            }`}></span>
            Priorities
          </h4>
          <p className={`pl-4 transition-colors duration-300 ${
            isDarkMode ? 'text-gray-400' : 'text-gray-700'
          }`}>Plan priorities will appear here</p>
        </div>
        <div className="group">
          <h4 className={`font-semibold mb-2 flex items-center gap-2 transition-colors duration-300 ${
            isDarkMode 
              ? 'text-pink-400' 
              : 'text-green-600'
          }`}>
            <span className={`w-2 h-2 rounded-full transition-colors duration-300 ${
              isDarkMode ? 'bg-pink-400' : 'bg-green-600'
            }`}></span>
            Weaknesses
          </h4>
          <p className={`pl-4 transition-colors duration-300 ${
            isDarkMode ? 'text-gray-400' : 'text-gray-700'
          }`}>Identified weaknesses will appear here</p>
        </div>
        <div className="group">
          <h4 className={`font-semibold mb-2 flex items-center gap-2 transition-colors duration-300 ${
            isDarkMode 
              ? 'text-purple-400' 
              : 'text-blue-600'
          }`}>
            <span className={`w-2 h-2 rounded-full transition-colors duration-300 ${
              isDarkMode ? 'bg-purple-400' : 'bg-blue-600'
            }`}></span>
            Next Steps
          </h4>
          <p className={`pl-4 transition-colors duration-300 ${
            isDarkMode ? 'text-gray-400' : 'text-gray-700'
          }`}>Recommended next steps will appear here</p>
        </div>
      </div>
    </div>
  )
}

export default PlanCard

