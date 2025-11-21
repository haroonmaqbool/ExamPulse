/**
 * PlanCard Component
 * Displays smart exam plan information
 */

function PlanCard({ plan }) {
  // TODO: Implement plan card with real data
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-xl font-semibold mb-4">Smart Exam Plan</h3>
      <div className="space-y-4">
        <div>
          <h4 className="font-medium text-gray-700">Priorities</h4>
          <p className="text-gray-600">Plan priorities will appear here</p>
        </div>
        <div>
          <h4 className="font-medium text-gray-700">Weaknesses</h4>
          <p className="text-gray-600">Identified weaknesses will appear here</p>
        </div>
        <div>
          <h4 className="font-medium text-gray-700">Next Steps</h4>
          <p className="text-gray-600">Recommended next steps will appear here</p>
        </div>
      </div>
    </div>
  )
}

export default PlanCard

