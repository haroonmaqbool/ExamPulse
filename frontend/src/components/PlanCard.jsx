/**
 * PlanCard Component
 * Displays smart exam plan information
 */

function PlanCard({ plan }) {
  // TODO: Implement plan card with real data
  return (
    <div className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl rounded-2xl border border-white/10 p-8">
      <h3 className="text-2xl font-bold text-white mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
        Smart Exam Plan
      </h3>
      <div className="space-y-6">
        <div className="group">
          <h4 className="font-semibold text-purple-400 mb-2 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-purple-400"></span>
            Priorities
          </h4>
          <p className="text-gray-400 pl-4">Plan priorities will appear here</p>
        </div>
        <div className="group">
          <h4 className="font-semibold text-pink-400 mb-2 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-pink-400"></span>
            Weaknesses
          </h4>
          <p className="text-gray-400 pl-4">Identified weaknesses will appear here</p>
        </div>
        <div className="group">
          <h4 className="font-semibold text-purple-400 mb-2 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-purple-400"></span>
            Next Steps
          </h4>
          <p className="text-gray-400 pl-4">Recommended next steps will appear here</p>
        </div>
      </div>
    </div>
  )
}

export default PlanCard

