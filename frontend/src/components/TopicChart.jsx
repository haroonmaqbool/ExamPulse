/**
 * TopicChart Component
 * Displays topic frequency analysis using Recharts
 */

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

function TopicChart({ data }) {
  // TODO: Implement chart with real data
  const mockData = [
    { topic: 'Algebra', frequency: 15, percentage: 30 },
    { topic: 'Geometry', frequency: 10, percentage: 20 },
    { topic: 'Calculus', frequency: 8, percentage: 16 },
  ]

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-xl font-semibold mb-4">Topic Frequency Analysis</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={mockData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="topic" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="frequency" fill="#3b82f6" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default TopicChart

