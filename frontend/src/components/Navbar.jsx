import { Link } from 'react-router-dom'

function Navbar() {
  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-2xl font-bold text-blue-600">
            ExamPulse
          </Link>
          <div className="flex space-x-4">
            <Link
              to="/"
              className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600"
            >
              Home
            </Link>
            <Link
              to="/upload"
              className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600"
            >
              Upload
            </Link>
            <Link
              to="/analysis"
              className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600"
            >
              Analysis
            </Link>
            <Link
              to="/expected-paper"
              className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600"
            >
              Expected Paper
            </Link>
            <Link
              to="/study-logs"
              className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600"
            >
              Study Logs
            </Link>
            <Link
              to="/smart-plan"
              className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600"
            >
              Smart Plan
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar

