/**
 * Study Logs Page
 * Input form for study logs (text, hours, difficulty, checkbox)
 */

import { useState } from 'react'
import axios from 'axios'

function StudyLogs() {
  const [formData, setFormData] = useState({
    topic: '',
    log_type: 'text',
    difficulty: '',
    hours: '',
    notes: ''
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setSubmitStatus(null)

    try {
      // TODO: Implement actual API call
      await axios.post('/api/study-logs/', formData)
      setSubmitStatus({ success: true, message: 'Study log created successfully' })
      setFormData({
        topic: '',
        log_type: 'text',
        difficulty: '',
        hours: '',
        notes: ''
      })
    } catch (error) {
      setSubmitStatus({ success: false, message: 'Failed to create study log' })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold text-white mb-8 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
        Study Logs
      </h1>
      
      <form onSubmit={handleSubmit} className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl rounded-2xl border border-white/10 p-8 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Topic
          </label>
          <input
            type="text"
            name="topic"
            value={formData.topic}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            placeholder="Enter topic name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Log Type
          </label>
          <select
            name="log_type"
            value={formData.log_type}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
          >
            <option value="text" className="bg-gray-900">Text</option>
            <option value="hours" className="bg-gray-900">Hours</option>
            <option value="difficulty" className="bg-gray-900">Difficulty</option>
            <option value="checkbox" className="bg-gray-900">Checkbox</option>
          </select>
        </div>

        {formData.log_type === 'difficulty' && (
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Difficulty
            </label>
            <select
              name="difficulty"
              value={formData.difficulty}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            >
              <option value="" className="bg-gray-900">Select difficulty</option>
              <option value="easy" className="bg-gray-900">Easy</option>
              <option value="medium" className="bg-gray-900">Medium</option>
              <option value="hard" className="bg-gray-900">Hard</option>
            </select>
          </div>
        )}

        {formData.log_type === 'hours' && (
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Hours
            </label>
            <input
              type="number"
              name="hours"
              value={formData.hours}
              onChange={handleChange}
              step="0.5"
              min="0"
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              placeholder="0.0"
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Notes
          </label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows="4"
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
            placeholder="Add your notes here..."
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="relative w-full px-6 py-4 rounded-xl font-semibold text-white overflow-hidden transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100"
        >
          <span className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600" />
          <span className="relative">
            {submitting ? 'Submitting...' : 'Create Study Log'}
          </span>
        </button>

        {submitStatus && (
          <div
            className={`p-4 rounded-xl border ${
              submitStatus.success
                ? 'bg-green-500/10 text-green-400 border-green-500/30'
                : 'bg-red-500/10 text-red-400 border-red-500/30'
            }`}
          >
            {submitStatus.message}
          </div>
        )}
      </form>
    </div>
  )
}

export default StudyLogs

