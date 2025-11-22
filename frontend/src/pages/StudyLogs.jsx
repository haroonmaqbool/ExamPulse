/**
 * Study Logs Page
 * Input form for study logs (text, hours, difficulty, checkbox)
 */

import { useState } from 'react'
import { useTheme } from '../components/ThemeContext'
import api from '../utils/api'
import Navbar from '../components/Navbar'
import Background from '../components/Background'

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
  const { theme } = useTheme()
  const isDarkMode = theme === 'dark'

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setSubmitStatus(null)

    try {
      const response = await api.post('/study-logs/', formData)
      setSubmitStatus({ 
        success: true, 
        message: 'Study log created successfully!' 
      })
      setFormData({
        topic: '',
        log_type: 'text',
        difficulty: '',
        hours: '',
        notes: ''
      })
    } catch (error) {
      setSubmitStatus({ 
        success: false, 
        message: error.message || 'Failed to create study log. Please try again.' 
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className={`min-h-screen relative overflow-hidden transition-colors duration-500 ${
      isDarkMode
        ? 'bg-[#0a0a0a]'
        : 'bg-gradient-to-br from-blue-50 via-white to-green-50'
    }`}>
      <Background />
      <Navbar />
      <main className="pt-20 relative z-10">
        <div className="max-w-2xl mx-auto px-6 py-12">
          <h1 className={`text-4xl font-bold mb-8 bg-gradient-to-r bg-clip-text text-transparent transition-all duration-300 py-2 ${
            isDarkMode
              ? 'from-purple-400 to-pink-400'
              : 'from-blue-600 to-green-600'
          }`}>
            Study Logs
          </h1>
          
          <form onSubmit={handleSubmit} className={`rounded-2xl border p-8 space-y-6 transition-all duration-300 ${
            isDarkMode
              ? 'bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border-white/10'
              : 'bg-white border-2 border-blue-200'
          }`}>
            <div>
              <label className={`block text-sm font-medium mb-2 transition-colors duration-300 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Topic
              </label>
              <input
                type="text"
                name="topic"
                value={formData.topic}
                onChange={handleChange}
                required
                className={`w-full px-4 py-3 rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:border-transparent ${
                  isDarkMode
                    ? 'bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:ring-purple-500'
                    : 'bg-blue-50 border border-blue-300 text-gray-900 placeholder-gray-400 focus:ring-blue-500'
                }`}
                placeholder="Enter topic name"
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 transition-colors duration-300 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Log Type
              </label>
              <select
                name="log_type"
                value={formData.log_type}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:border-transparent ${
                  isDarkMode
                    ? 'bg-white/5 border border-white/10 text-white focus:ring-purple-500'
                    : 'bg-blue-50 border border-blue-300 text-gray-900 focus:ring-blue-500'
                }`}
              >
                <option value="text" className={isDarkMode ? 'bg-gray-900' : 'bg-white'}>Text</option>
                <option value="hours" className={isDarkMode ? 'bg-gray-900' : 'bg-white'}>Hours</option>
                <option value="difficulty" className={isDarkMode ? 'bg-gray-900' : 'bg-white'}>Difficulty</option>
                <option value="checkbox" className={isDarkMode ? 'bg-gray-900' : 'bg-white'}>Checkbox</option>
              </select>
            </div>

            {formData.log_type === 'difficulty' && (
              <div>
                <label className={`block text-sm font-medium mb-2 transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Difficulty
                </label>
                <select
                  name="difficulty"
                  value={formData.difficulty}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:border-transparent ${
                    isDarkMode
                      ? 'bg-white/5 border border-white/10 text-white focus:ring-purple-500'
                      : 'bg-blue-50 border border-blue-300 text-gray-900 focus:ring-blue-500'
                  }`}
                >
                  <option value="" className={isDarkMode ? 'bg-gray-900' : 'bg-white'}>Select difficulty</option>
                  <option value="easy" className={isDarkMode ? 'bg-gray-900' : 'bg-white'}>Easy</option>
                  <option value="medium" className={isDarkMode ? 'bg-gray-900' : 'bg-white'}>Medium</option>
                  <option value="hard" className={isDarkMode ? 'bg-gray-900' : 'bg-white'}>Hard</option>
                </select>
              </div>
            )}

            {formData.log_type === 'hours' && (
              <div>
                <label className={`block text-sm font-medium mb-2 transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Hours
                </label>
                <input
                  type="number"
                  name="hours"
                  value={formData.hours}
                  onChange={handleChange}
                  step="0.5"
                  min="0"
                  className={`w-full px-4 py-3 rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:border-transparent ${
                    isDarkMode
                      ? 'bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:ring-purple-500'
                      : 'bg-blue-50 border border-blue-300 text-gray-900 placeholder-gray-400 focus:ring-blue-500'
                  }`}
                  placeholder="0.0"
                />
              </div>
            )}

            <div>
              <label className={`block text-sm font-medium mb-2 transition-colors duration-300 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Notes
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows="4"
                className={`w-full px-4 py-3 rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:border-transparent resize-none ${
                  isDarkMode
                    ? 'bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:ring-purple-500'
                    : 'bg-blue-50 border border-blue-300 text-gray-900 placeholder-gray-400 focus:ring-blue-500'
                }`}
                placeholder="Add your notes here..."
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className={`relative w-full px-6 py-4 rounded-xl font-semibold text-white overflow-hidden transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100`}
            >
              <span className={`absolute inset-0 bg-gradient-to-r transition-all duration-300 ${
                isDarkMode
                  ? 'from-purple-600 to-pink-600'
                  : 'from-blue-600 to-green-600'
              }`} />
              <span className="relative">
                {submitting ? 'Submitting...' : 'Create Study Log'}
              </span>
            </button>

            {submitStatus && (
              <div
                className={`p-4 rounded-xl border transition-all duration-300 ${
                  submitStatus.success
                    ? isDarkMode
                      ? 'bg-green-500/10 text-green-400 border-green-500/30'
                      : 'bg-green-100 text-green-700 border-green-400'
                    : isDarkMode
                      ? 'bg-red-500/10 text-red-400 border-red-500/30'
                      : 'bg-red-100 text-red-700 border-red-400'
                }`}
              >
                {submitStatus.message}
              </div>
            )}
          </form>
        </div>
      </main>
    </div>
  )
}

export default StudyLogs