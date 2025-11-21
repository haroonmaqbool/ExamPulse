/**
 * Home Page
 * Landing page for ExamPulse
 */

import { Link } from 'react-router-dom'

function Home() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to ExamPulse
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          AI-powered exam preparation platform
        </p>
        <div className="flex justify-center space-x-4">
          <Link
            to="/upload"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700"
          >
            Upload Exam Paper
          </Link>
          <Link
            to="/smart-plan"
            className="bg-gray-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-700"
          >
            View Smart Plan
          </Link>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mt-12">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Upload Papers</h3>
          <p className="text-gray-600">
            Upload past exam papers in PDF or image format for analysis
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">AI Analysis</h3>
          <p className="text-gray-600">
            Get AI-powered insights on topics, frequencies, and patterns
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Smart Planning</h3>
          <p className="text-gray-600">
            Receive personalized study plans based on your progress
          </p>
        </div>
      </div>
    </div>
  )
}

export default Home

