/**
 * TopicChart Component
 * Displays topic frequency analysis using Recharts
 */

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { useTheme } from './ThemeContext'

function TopicChart({ data }) {
  const { theme } = useTheme()
  const isDarkMode = theme === 'dark'

  // Process real data from backend
  // Data format: [{ topic: string, frequency: number, percentage: number }, ...]
  const chartData = data && Array.isArray(data) && data.length > 0
    ? data.slice(0, 10) // Limit to top 10 topics for better visualization
    : []

  return (
    <div className={`rounded-2xl border p-6 transition-all duration-300 ${
      isDarkMode
        ? 'bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border-white/10'
        : 'bg-white border-2 border-blue-200'
    }`}>
      <h3 className={`text-xl font-bold mb-6 transition-colors duration-300 ${
        isDarkMode ? 'text-white' : 'text-gray-900'
      }`}>Topic Frequency Analysis</h3>
      {chartData.length === 0 ? (
        <div className={`flex items-center justify-center h-[300px] ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
          <p className="text-sm">No topic data available</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#374151' : '#e5e7eb'} />
          <XAxis dataKey="topic" stroke={isDarkMode ? '#9ca3af' : '#6b7280'} />
          <YAxis stroke={isDarkMode ? '#9ca3af' : '#6b7280'} />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: isDarkMode ? '#1f2937' : '#f3f4f6', 
              border: isDarkMode ? '1px solid #374151' : '1px solid #e5e7eb',
              borderRadius: '8px',
              color: isDarkMode ? '#fff' : '#000'
            }}
            cursor={false}
          />
          <Legend wrapperStyle={{ color: isDarkMode ? '#9ca3af' : '#6b7280' }} />
          <Bar 
            dataKey="frequency" 
            fill="url(#colorGradient)"
            radius={[8, 8, 0, 0]}
            style={{ cursor: 'pointer' }}
          />
          <defs>
            <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
              {isDarkMode ? (
                <>
                  <stop offset="0%" stopColor="#a855f7" stopOpacity={0.8}/>
                  <stop offset="100%" stopColor="#ec4899" stopOpacity={0.8}/>
                </>
              ) : (
                <>
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.8}/>
                  <stop offset="100%" stopColor="#10b981" stopOpacity={0.8}/>
                </>
              )}
            </linearGradient>
          </defs>
        </BarChart>
      </ResponsiveContainer>
      )}
    </div>
  )
}

export default TopicChart

