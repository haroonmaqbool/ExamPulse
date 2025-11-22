/**
 * PlanCard Component
 * Displays smart exam plan information
 */

import { useTheme } from './ThemeContext'

function PlanCard({ plan }) {
  const { theme } = useTheme()
  const isDarkMode = theme === 'dark'

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
        Your Personalized Study Plan
      </h3>
      <div className="space-y-6">
        {/* Priorities Section */}
        <div className="group">
          <h4 className={`font-semibold mb-3 flex items-center gap-2 transition-colors duration-300 ${
            isDarkMode
              ? 'text-purple-400'
              : 'text-blue-600'
          }`}>
            <span className={`w-2 h-2 rounded-full transition-colors duration-300 ${
              isDarkMode ? 'bg-purple-400' : 'bg-blue-600'
            }`}></span>
            Top Priorities
          </h4>
          {plan.priorities && plan.priorities.length > 0 ? (
            <ul className="space-y-2 pl-4">
              {plan.priorities.map((priority, index) => (
                <li key={index} className={`flex items-start gap-3 transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold mt-0.5 flex-shrink-0 ${
                    isDarkMode
                      ? 'bg-purple-500/20 text-purple-400'
                      : 'bg-blue-100 text-blue-600'
                  }`}>
                    {index + 1}
                  </span>
                  <span className="flex-1">{priority}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className={`pl-4 transition-colors duration-300 ${
              isDarkMode ? 'text-gray-500' : 'text-gray-500'
            }`}>No priorities identified yet</p>
          )}
        </div>

        {/* Weaknesses Section */}
        <div className="group">
          <h4 className={`font-semibold mb-3 flex items-center gap-2 transition-colors duration-300 ${
            isDarkMode
              ? 'text-pink-400'
              : 'text-green-600'
          }`}>
            <span className={`w-2 h-2 rounded-full transition-colors duration-300 ${
              isDarkMode ? 'bg-pink-400' : 'bg-green-600'
            }`}></span>
            Areas to Improve
          </h4>
          {plan.weaknesses && plan.weaknesses.length > 0 ? (
            <ul className="space-y-2 pl-4">
              {plan.weaknesses.map((weakness, index) => (
                <li key={index} className={`flex items-start gap-3 transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold mt-0.5 flex-shrink-0 ${
                    isDarkMode
                      ? 'bg-pink-500/20 text-pink-400'
                      : 'bg-green-100 text-green-600'
                  }`}>
                    {index + 1}
                  </span>
                  <span className="flex-1">{weakness}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className={`pl-4 transition-colors duration-300 ${
              isDarkMode ? 'text-gray-500' : 'text-gray-500'
            }`}>No weaknesses identified yet</p>
          )}
        </div>

        {/* Next Steps Section */}
        <div className="group">
          <h4 className={`font-semibold mb-3 flex items-center gap-2 transition-colors duration-300 ${
            isDarkMode
              ? 'text-purple-400'
              : 'text-blue-600'
          }`}>
            <span className={`w-2 h-2 rounded-full transition-colors duration-300 ${
              isDarkMode ? 'bg-purple-400' : 'bg-blue-600'
            }`}></span>
            Next Steps
          </h4>
          {plan.next_steps && plan.next_steps.length > 0 ? (
            <ul className="space-y-2 pl-4">
              {plan.next_steps.map((step, index) => (
                <li key={index} className={`flex items-start gap-3 transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold mt-0.5 flex-shrink-0 ${
                    isDarkMode
                      ? 'bg-purple-500/20 text-purple-400'
                      : 'bg-blue-100 text-blue-600'
                  }`}>
                    {index + 1}
                  </span>
                  <span className="flex-1">{step}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className={`pl-4 transition-colors duration-300 ${
              isDarkMode ? 'text-gray-500' : 'text-gray-500'
            }`}>No next steps available yet</p>
          )}
        </div>

        {/* Revision Plan Section */}
        {plan.revision_plan && plan.revision_plan.length > 0 && (
          <div className="group">
            <h4 className={`font-semibold mb-3 flex items-center gap-2 transition-colors duration-300 ${
              isDarkMode
                ? 'text-pink-400'
                : 'text-green-600'
            }`}>
              <span className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                isDarkMode ? 'bg-pink-400' : 'bg-green-600'
              }`}></span>
              Weekly Revision Plan
            </h4>
            <div className="space-y-4 pl-4">
              {plan.revision_plan.map((week, index) => (
                <div key={index} className={`rounded-lg p-4 transition-all duration-300 ${
                  isDarkMode
                    ? 'bg-white/5 border border-white/10'
                    : 'bg-blue-50 border border-blue-200'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <h5 className={`font-semibold transition-colors duration-300 ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      Week {week.week}
                    </h5>
                    {week.hours && (
                      <span className={`text-sm px-2 py-1 rounded transition-colors duration-300 ${
                        isDarkMode
                          ? 'bg-purple-500/20 text-purple-400'
                          : 'bg-blue-100 text-blue-600'
                      }`}>
                        {week.hours} hours
                      </span>
                    )}
                  </div>
                  {week.focus && (
                    <p className={`text-sm font-medium mb-2 transition-colors duration-300 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Focus: {week.focus}
                    </p>
                  )}
                  {week.tasks && week.tasks.length > 0 && (
                    <ul className="space-y-1 mt-2">
                      {week.tasks.map((task, taskIndex) => (
                        <li key={taskIndex} className={`text-sm flex items-start gap-2 transition-colors duration-300 ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          <span className="mt-1.5 w-1 h-1 rounded-full bg-current flex-shrink-0"></span>
                          <span>{task}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default PlanCard

