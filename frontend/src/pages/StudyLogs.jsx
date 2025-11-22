/**
 * Study Logs Page
 * Modern, sleek UI for creating and viewing study logs
 */

import { useState, useEffect } from 'react'
import { useTheme } from '../components/ThemeContext'
import api from '../utils/api'
import Navbar from '../components/Navbar'
import Background from '../components/Background'
import ShaderBackground from '../components/ShaderBackground'
import { motion, AnimatePresence } from 'framer-motion'
import { BookOpen, Clock, TrendingUp, Target, Plus, X, CheckCircle2, AlertCircle, Calendar, BarChart3 } from 'lucide-react'

function StudyLogs() {
  const [formData, setFormData] = useState({
    topic: '',
    log_type: 'hours',
    difficulty: '',
    hours: '',
    notes: ''
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [studyLogs, setStudyLogs] = useState([])
  const [statistics, setStatistics] = useState(null)
  const [loading, setLoading] = useState(true)
  const { theme } = useTheme()
  const isDarkMode = theme === 'dark'

  // Fetch study logs on mount
  useEffect(() => {
    fetchStudyLogs()
  }, [])

  const fetchStudyLogs = async () => {
    try {
      setLoading(true)
      const response = await api.get('/study-logs/')
      setStudyLogs(response.data.logs || [])
      setStatistics(response.data.statistics || null)
    } catch (error) {
      console.error('Failed to fetch study logs:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setSubmitStatus(null)

    try {
      await api.post('/study-logs/', formData)
      setSubmitStatus({ 
        success: true, 
        message: 'Study log created successfully!' 
      })
      setFormData({
        topic: '',
        log_type: 'hours',
        difficulty: '',
        hours: '',
        notes: ''
      })
      setShowForm(false)
      // Refresh logs
      await fetchStudyLogs()
    } catch (error) {
      setSubmitStatus({ 
        success: false, 
        message: error.response?.data?.detail || error.message || 'Failed to create study log. Please try again.' 
      })
    } finally {
      setSubmitting(false)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown date'
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch {
      return dateString
    }
  }

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy':
        return isDarkMode ? 'text-green-400 bg-green-500/20' : 'text-green-700 bg-green-100'
      case 'medium':
        return isDarkMode ? 'text-yellow-400 bg-yellow-500/20' : 'text-yellow-700 bg-yellow-100'
      case 'hard':
        return isDarkMode ? 'text-red-400 bg-red-500/20' : 'text-red-700 bg-red-100'
      default:
        return isDarkMode ? 'text-gray-400 bg-gray-500/20' : 'text-gray-700 bg-gray-100'
    }
  }

  const getLogTypeIcon = (logType) => {
    switch (logType) {
      case 'hours':
        return <Clock className="w-4 h-4" />
      case 'difficulty':
        return <TrendingUp className="w-4 h-4" />
      case 'checkbox':
        return <CheckCircle2 className="w-4 h-4" />
      default:
        return <BookOpen className="w-4 h-4" />
    }
  }

  return (
    <div className={`min-h-screen relative overflow-hidden transition-colors duration-500 ${
      isDarkMode
        ? ''
        : 'bg-gradient-to-br from-blue-50 via-white to-green-50'
    }`}>
      {isDarkMode && <ShaderBackground />}
      {!isDarkMode && <Background />}
      <Navbar />
      <main className="pt-20 relative z-10">
        <div className="max-w-7xl mx-auto px-6 py-12">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className={`text-5xl font-black bg-gradient-to-r bg-clip-text text-transparent transition-all duration-300 py-2 ${
                isDarkMode
                  ? 'from-purple-400 to-pink-400'
                  : 'from-blue-600 to-green-600'
              }`}>
              Study Logs
            </motion.h1>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowForm(!showForm)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg ${
                isDarkMode
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-white shadow-purple-500/30'
                  : 'bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-500 hover:to-green-500 text-white shadow-blue-500/30'
              }`}
            >
              {showForm ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
              {showForm ? 'Cancel' : 'New Log'}
            </motion.button>
          </div>

          {/* Statistics Cards */}
          {statistics && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
            >
              <div className={`rounded-xl p-6 border transition-all duration-300 ${
                isDarkMode
                  ? 'bg-white/5 border-white/10'
                  : 'bg-white/80 border-blue-200 backdrop-blur-sm'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <BookOpen className={`w-5 h-5 ${isDarkMode ? 'text-purple-400' : 'text-blue-600'}`} />
                  <span className={`text-2xl font-black ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {statistics.total_logs}
                  </span>
                </div>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Total Logs
                </p>
              </div>

              <div className={`rounded-xl p-6 border transition-all duration-300 ${
                isDarkMode
                  ? 'bg-white/5 border-white/10'
                  : 'bg-white/80 border-green-200 backdrop-blur-sm'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <Clock className={`w-5 h-5 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`} />
                  <span className={`text-2xl font-black ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {statistics.total_hours.toFixed(1)}h
                  </span>
                </div>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Study Hours
                </p>
              </div>

              <div className={`rounded-xl p-6 border transition-all duration-300 ${
                isDarkMode
                  ? 'bg-white/5 border-white/10'
                  : 'bg-white/80 border-purple-200 backdrop-blur-sm'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <Target className={`w-5 h-5 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`} />
                  <span className={`text-2xl font-black ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {statistics.topics_count}
                  </span>
                </div>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Topics
                </p>
              </div>

              <div className={`rounded-xl p-6 border transition-all duration-300 ${
                isDarkMode
                  ? 'bg-white/5 border-white/10'
                  : 'bg-white/80 border-pink-200 backdrop-blur-sm'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <BarChart3 className={`w-5 h-5 ${isDarkMode ? 'text-pink-400' : 'text-pink-600'}`} />
                  <span className={`text-2xl font-black ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {statistics.total_logs > 0 ? Math.round((statistics.total_hours / statistics.total_logs) * 10) / 10 : 0}h
                  </span>
                </div>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Avg per Log
                </p>
              </div>
            </motion.div>
          )}

          {/* Create Form */}
          <AnimatePresence>
            {showForm && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mb-8 overflow-hidden"
              >
                <motion.form
                  initial={{ y: -20 }}
                  animate={{ y: 0 }}
                  exit={{ y: -20 }}
                  onSubmit={handleSubmit} 
                  className={`rounded-2xl border p-8 space-y-6 transition-all duration-300 ${
                    isDarkMode
                      ? 'bg-white/5 border-white/10 backdrop-blur-xl'
                      : 'bg-white/80 border-blue-200 backdrop-blur-sm'
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h2 className={`text-2xl font-black ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      Create New Study Log
                    </h2>
                    <button
                      type="button"
                      onClick={() => setShowForm(false)}
                      className={`p-2 rounded-lg transition-colors ${
                        isDarkMode
                          ? 'hover:bg-white/10 text-gray-400 hover:text-white'
                          : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className={`block text-sm font-semibold mb-2 transition-colors duration-300 ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        Topic <span className="text-red-500">*</span>
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
                        placeholder="e.g., Algebra, Physics, Chemistry"
                      />
                    </div>

                    <div>
                      <label className={`block text-sm font-semibold mb-2 transition-colors duration-300 ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        Log Type <span className="text-red-500">*</span>
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
                        <option value="hours" className={isDarkMode ? 'bg-gray-900' : 'bg-white'}>Study Hours</option>
                        <option value="difficulty" className={isDarkMode ? 'bg-gray-900' : 'bg-white'}>Difficulty Level</option>
                        <option value="text" className={isDarkMode ? 'bg-gray-900' : 'bg-white'}>Text Note</option>
                        <option value="checkbox" className={isDarkMode ? 'bg-gray-900' : 'bg-white'}>Checkbox</option>
                      </select>
                    </div>
                  </div>

                  {formData.log_type === 'difficulty' && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="grid grid-cols-3 gap-4"
                    >
                      {['easy', 'medium', 'hard'].map((level) => (
                        <button
                          key={level}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, difficulty: level }))}
                          className={`px-4 py-3 rounded-xl font-semibold transition-all duration-300 border-2 ${
                            formData.difficulty === level
                              ? isDarkMode
                                ? 'bg-purple-500/20 border-purple-500 text-purple-300'
                                : 'bg-blue-100 border-blue-500 text-blue-700'
                              : isDarkMode
                                ? 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20'
                                : 'bg-gray-50 border-gray-300 text-gray-600 hover:border-gray-400'
                          }`}
                        >
                          {level.charAt(0).toUpperCase() + level.slice(1)}
                        </button>
                      ))}
                    </motion.div>
                  )}

                  {formData.log_type === 'hours' && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <label className={`block text-sm font-semibold mb-2 transition-colors duration-300 ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        Study Hours <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        name="hours"
                        value={formData.hours}
                        onChange={handleChange}
                        step="0.5"
                        min="0"
                        required
                        className={`w-full px-4 py-3 rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:border-transparent ${
                          isDarkMode
                            ? 'bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:ring-purple-500'
                            : 'bg-blue-50 border border-blue-300 text-gray-900 placeholder-gray-400 focus:ring-blue-500'
                        }`}
                        placeholder="2.5"
                      />
                    </motion.div>
                  )}

                  <div>
                    <label className={`block text-sm font-semibold mb-2 transition-colors duration-300 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Notes (Optional)
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
                      placeholder="Add your notes, insights, or observations..."
                    />
                  </div>

                  {submitStatus && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-4 rounded-xl border flex items-center gap-3 ${
                        submitStatus.success
                          ? isDarkMode
                            ? 'bg-green-500/10 text-green-400 border-green-500/30'
                            : 'bg-green-100 text-green-700 border-green-400'
                          : isDarkMode
                            ? 'bg-red-500/10 text-red-400 border-red-500/30'
                            : 'bg-red-100 text-red-700 border-red-400'
                      }`}
                    >
                      {submitStatus.success ? (
                        <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                      ) : (
                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                      )}
                      <p className="text-sm font-medium">{submitStatus.message}</p>
                    </motion.div>
                  )}

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={submitting}
                    className={`relative w-full px-6 py-4 rounded-xl font-semibold text-white overflow-hidden transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg ${
                      isDarkMode
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 shadow-purple-500/30'
                        : 'bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-500 hover:to-green-500 shadow-blue-500/30'
                    }`}
                  >
                    {submitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Creating...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        <Plus className="w-5 h-5" />
                        Create Study Log
                      </span>
                    )}
                  </motion.button>
                </motion.form>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Study Logs List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className={`rounded-2xl border p-8 transition-all duration-300 ${
              isDarkMode
                ? 'bg-white/5 border-white/10 backdrop-blur-xl'
                : 'bg-white/80 border-blue-200 backdrop-blur-sm'
            }`}
          >
            {studyLogs.length > 0 && (
              <div className="flex justify-end mb-6">
                <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {studyLogs.length} {studyLogs.length === 1 ? 'entry' : 'entries'}
                </span>
              </div>
            )}

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className={`h-8 w-8 border-2 border-t-transparent rounded-full animate-spin ${
                  isDarkMode ? 'border-purple-500' : 'border-blue-600'
                }`} />
              </div>
            ) : studyLogs.length === 0 ? (
              <div className="text-center py-12">
                <BookOpen className={`w-16 h-16 mx-auto mb-4 ${
                  isDarkMode ? 'text-gray-600' : 'text-gray-400'
                }`} />
                <p className={`text-lg font-medium mb-2 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  No study logs yet
                </p>
                <p className={`text-sm ${
                  isDarkMode ? 'text-gray-500' : 'text-gray-500'
                }`}>
                  Click "New Log" to start tracking your study progress
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <AnimatePresence>
                  {studyLogs.slice().reverse().map((log, index) => (
                    <motion.div
                      key={log.id || index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      whileHover={{ y: -2 }}
                      className={`p-6 rounded-xl border transition-all duration-300 ${
                        isDarkMode
                          ? 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-purple-500/50'
                          : 'bg-white/80 border-blue-200 hover:bg-white hover:border-blue-300 backdrop-blur-sm'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-3">
                            <div className={`p-2 rounded-lg ${
                              isDarkMode ? 'bg-purple-500/20' : 'bg-blue-100'
                            }`}>
                              {getLogTypeIcon(log.log_type)}
                            </div>
                            <div>
                              <h3 className={`font-bold text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                {log.topic || 'Untitled'}
                              </h3>
                              <div className="flex items-center gap-2 mt-1">
                                <Calendar className={`w-4 h-4 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`} />
                                <span className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-600'}`}>
                                  {formatDate(log.created_at)}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center gap-3">
                            {log.hours && (
                              <div className={`flex items-center gap-2 px-3 py-1 rounded-lg ${
                                isDarkMode ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-700'
                              }`}>
                                <Clock className="w-4 h-4" />
                                <span className="text-sm font-medium">{log.hours}h</span>
                              </div>
                            )}
                            {log.difficulty && (
                              <div className={`px-3 py-1 rounded-lg text-sm font-medium ${getDifficultyColor(log.difficulty)}`}>
                                {log.difficulty.charAt(0).toUpperCase() + log.difficulty.slice(1)}
                              </div>
                            )}
                            <div className={`px-3 py-1 rounded-lg text-xs font-medium ${
                              isDarkMode ? 'bg-white/10 text-gray-400' : 'bg-gray-100 text-gray-600'
                            }`}>
                              {log.log_type}
                            </div>
                          </div>

                          {log.notes && (
                            <p className={`mt-3 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                              {log.notes}
                            </p>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </motion.div>
        </div>
      </main>
    </div>
  )
}

export default StudyLogs
