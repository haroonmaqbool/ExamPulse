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
import { BookOpen, Clock, TrendingUp, Target, Plus, X, CheckCircle2, AlertCircle, Calendar, BarChart3, Trash2 } from 'lucide-react'

function StudyLogs() {
  const [formData, setFormData] = useState({
    topic: '',
    log_type: 'hours',
    difficulty: '',
    hours: '',
    notes: '',
    completed: false // For checkbox type
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [studyLogs, setStudyLogs] = useState([])
  const [statistics, setStatistics] = useState(null)
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState(null)
  const [showClearAllConfirm, setShowClearAllConfirm] = useState(false)
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
      if (response && response.data) {
        setStudyLogs(Array.isArray(response.data.logs) ? response.data.logs : [])
        setStatistics(response.data.statistics || null)
      }
    } catch (error) {
      console.error('Failed to fetch study logs:', error)
      // Set empty arrays to prevent crashes
      setStudyLogs([])
      setStatistics(null)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value,
      // Reset dependent fields when log_type changes
      ...(name === 'log_type' && {
        difficulty: '',
        hours: '',
        completed: false
      })
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setSubmitStatus(null)

    try {
      // Prepare data based on log type
      const submitData = {
        topic: formData.topic.trim(),
        log_type: formData.log_type,
        notes: formData.notes.trim() || null
      }

      // Add type-specific fields
      if (formData.log_type === 'hours') {
        if (!formData.hours || formData.hours === '' || isNaN(parseFloat(formData.hours)) || parseFloat(formData.hours) < 0) {
          setSubmitStatus({ 
            success: false, 
            message: 'Please enter a valid number of hours (0 or greater)' 
          })
          setSubmitting(false)
          return
        }
        submitData.hours = parseFloat(formData.hours)
      } else if (formData.log_type === 'difficulty') {
        if (!formData.difficulty) {
          setSubmitStatus({ 
            success: false, 
            message: 'Please select a difficulty level' 
          })
          setSubmitting(false)
          return
        }
        submitData.difficulty = formData.difficulty
      } else if (formData.log_type === 'text') {
        if (!formData.notes || !formData.notes.trim()) {
          setSubmitStatus({ 
            success: false, 
            message: 'Please enter your study note' 
          })
          setSubmitting(false)
          return
        }
        // For text type, notes is the main content
      } else if (formData.log_type === 'checkbox') {
        // For checkbox type, always set notes to indicate completion status
        submitData.notes = formData.completed ? 'Completed' : 'Not completed'
        // If user added additional notes, append them
        if (formData.notes && formData.notes.trim() && formData.notes.trim() !== 'Completed' && formData.notes.trim() !== 'Not completed') {
          submitData.notes = `${formData.completed ? 'Completed' : 'Not completed'}. ${formData.notes.trim()}`
        }
      }

      const response = await api.post('/study-logs/', submitData)
      
      // Only proceed if response is successful
      if (response && response.status >= 200 && response.status < 300) {
        setSubmitStatus({ 
          success: true, 
          message: 'Study log created successfully!' 
        })
        setFormData({
          topic: '',
          log_type: 'hours',
          difficulty: '',
          hours: '',
          notes: '',
          completed: false
        })
        setShowForm(false)
        
        // Refresh logs with error handling
        try {
          await fetchStudyLogs()
        } catch (fetchError) {
          console.error('Error refreshing study logs:', fetchError)
          // Don't show error to user, just log it
        }
      }
    } catch (error) {
      console.error('Error creating study log:', error)
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

  const handleDeleteLog = async (logId) => {
    if (!window.confirm('Are you sure you want to delete this study log? This action cannot be undone.')) {
      return
    }

    try {
      setDeletingId(logId)
      await api.delete(`/study-logs/${logId}`)
      // Refresh logs
      await fetchStudyLogs()
      setSubmitStatus({ 
        success: true, 
        message: 'Study log deleted successfully!' 
      })
      // Clear success message after 3 seconds
      setTimeout(() => setSubmitStatus(null), 3000)
    } catch (error) {
      console.error('Error deleting study log:', error)
      setSubmitStatus({ 
        success: false, 
        message: error.response?.data?.detail || error.message || 'Failed to delete study log. Please try again.' 
      })
    } finally {
      setDeletingId(null)
    }
  }

  const handleClearAll = async () => {
    if (!window.confirm('Are you sure you want to delete ALL study logs? This action cannot be undone.')) {
      setShowClearAllConfirm(false)
      return
    }

    try {
      await api.delete('/study-logs/')
      // Refresh logs
      await fetchStudyLogs()
      setSubmitStatus({ 
        success: true, 
        message: 'All study logs deleted successfully!' 
      })
      // Clear success message after 3 seconds
      setTimeout(() => setSubmitStatus(null), 3000)
    } catch (error) {
      console.error('Error deleting all study logs:', error)
      setSubmitStatus({ 
        success: false, 
        message: error.response?.data?.detail || error.message || 'Failed to delete all study logs. Please try again.' 
      })
    } finally {
      setShowClearAllConfirm(false)
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
              className={`group flex items-center justify-between px-3 py-2 rounded-full transition-all duration-300 border shadow-sm ${
                isDarkMode
                  ? 'bg-white/5 hover:bg-white/10 border-white/10 text-gray-300'
                  : 'bg-gray-50 hover:bg-gray-100 border-gray-200 text-gray-600'
              }`}
            >
              <div className="flex items-center gap-2">
                {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                <span className="font-medium">{showForm ? 'Cancel' : 'New Log'}</span>
              </div>
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

                  {/* Hours Input - for 'hours' log type */}
                  {formData.log_type === 'hours' && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-4"
                    >
                      <div>
                        <label className={`block text-sm font-semibold mb-2 transition-colors duration-300 ${
                          isDarkMode ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                          Study Hours <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            name="hours"
                            value={formData.hours}
                            onChange={handleChange}
                            step="0.5"
                            min="0"
                            required
                            className={`w-full px-4 py-3 pl-12 rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:border-transparent ${
                              isDarkMode
                                ? 'bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:ring-purple-500'
                                : 'bg-blue-50 border border-blue-300 text-gray-900 placeholder-gray-400 focus:ring-blue-500'
                            }`}
                            placeholder="2.5"
                          />
                          <Clock className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${
                            isDarkMode ? 'text-gray-500' : 'text-gray-400'
                          }`} />
                        </div>
                        <p className={`text-xs mt-2 ${isDarkMode ? 'text-gray-500' : 'text-gray-600'}`}>
                          Enter the number of hours you studied this topic
                        </p>
                      </div>
                    </motion.div>
                  )}

                  {/* Text Note Input - for 'text' log type */}
                  {formData.log_type === 'text' && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <label className={`block text-sm font-semibold mb-2 transition-colors duration-300 ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        Study Note <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        name="notes"
                        value={formData.notes}
                        onChange={handleChange}
                        rows="5"
                        required
                        className={`w-full px-4 py-3 rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:border-transparent resize-none ${
                          isDarkMode
                            ? 'bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:ring-purple-500'
                            : 'bg-blue-50 border border-blue-300 text-gray-900 placeholder-gray-400 focus:ring-blue-500'
                        }`}
                        placeholder="Write your study notes, key points, or observations about this topic..."
                      />
                      <p className={`text-xs mt-2 ${isDarkMode ? 'text-gray-500' : 'text-gray-600'}`}>
                        Document what you learned or important points about this topic
                      </p>
                    </motion.div>
                  )}

                  {/* Checkbox Input - for 'checkbox' log type */}
                  {formData.log_type === 'checkbox' && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-4"
                    >
                      <div className={`p-6 rounded-xl border-2 transition-all duration-300 cursor-pointer ${
                        formData.completed
                          ? isDarkMode
                            ? 'bg-green-500/20 border-green-500/50'
                            : 'bg-green-50 border-green-400'
                          : isDarkMode
                            ? 'bg-white/5 border-white/10 hover:border-white/20'
                            : 'bg-blue-50 border-blue-200 hover:border-blue-300'
                      }`}
                      onClick={() => setFormData(prev => ({ ...prev, completed: !prev.completed }))}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`flex-shrink-0 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-300 ${
                            formData.completed
                              ? isDarkMode
                                ? 'bg-green-500 border-green-500'
                                : 'bg-green-500 border-green-500'
                              : isDarkMode
                                ? 'bg-transparent border-white/30'
                                : 'bg-white border-gray-300'
                          }`}>
                            {formData.completed && (
                              <CheckCircle2 className={`w-4 h-4 ${isDarkMode ? 'text-white' : 'text-white'}`} />
                            )}
                          </div>
                          <div className="flex-1">
                            <h4 className={`font-semibold mb-1 ${
                              isDarkMode ? 'text-white' : 'text-gray-900'
                            }`}>
                              {formData.completed ? 'Topic Completed ✓' : 'Mark as Completed'}
                            </h4>
                            <p className={`text-sm ${
                              isDarkMode ? 'text-gray-400' : 'text-gray-600'
                            }`}>
                              {formData.completed 
                                ? 'You\'ve completed studying this topic' 
                                : 'Click to mark this topic as completed'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Notes Input - shown for all types except 'text' (where notes is the main field) */}
                  {formData.log_type !== 'text' && (
                    <div>
                      <label className={`block text-sm font-semibold mb-2 transition-colors duration-300 ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        Additional Notes {formData.log_type === 'checkbox' ? '(Optional)' : '(Optional)'}
                      </label>
                      <textarea
                        name="notes"
                        value={formData.notes}
                        onChange={handleChange}
                        rows={formData.log_type === 'checkbox' ? 3 : 4}
                        className={`w-full px-4 py-3 rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:border-transparent resize-none ${
                          isDarkMode
                            ? 'bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:ring-purple-500'
                            : 'bg-blue-50 border border-blue-300 text-gray-900 placeholder-gray-400 focus:ring-blue-500'
                        }`}
                        placeholder={
                          formData.log_type === 'checkbox' 
                            ? 'Add any additional notes or comments...'
                            : 'Add your notes, insights, or observations...'
                        }
                      />
                    </div>
                  )}

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
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleClearAll}
                  disabled={deletingId !== null}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${
                    isDarkMode
                      ? 'bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 hover:border-red-500/50'
                      : 'bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 hover:border-red-300'
                  }`}
                >
                  <Trash2 className="w-4 h-4" />
                  Clear All
                </motion.button>
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
                  {Array.isArray(studyLogs) && studyLogs.length > 0 && studyLogs.slice().reverse().map((log, index) => {
                    if (!log || typeof log !== 'object') return null
                    return (
                      <motion.div
                        key={log.id || `log-${index}`}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        whileHover={{ y: -2 }}
                        className={`p-6 rounded-xl border transition-all duration-300 ${
                          // Special styling for completed checkbox logs
                          log.log_type === 'checkbox' && log.notes && (
                            log.notes.trim().toLowerCase().startsWith('completed') ||
                            log.notes.trim() === 'Completed'
                          )
                            ? isDarkMode
                              ? 'bg-green-500/20 border-green-500/50 hover:bg-green-500/30 hover:border-green-500/70'
                              : 'bg-green-50 border-green-300 hover:bg-green-100 hover:border-green-400 backdrop-blur-sm'
                            : isDarkMode
                              ? 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-purple-500/50'
                              : 'bg-white/80 border-blue-200 hover:bg-white hover:border-blue-300 backdrop-blur-sm'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-lg transition-colors duration-300 ${
                                  // Green icon background for completed checkbox logs
                                  log.log_type === 'checkbox' && log.notes && (
                                    log.notes.trim().toLowerCase().startsWith('completed') ||
                                    log.notes.trim() === 'Completed'
                                  )
                                    ? isDarkMode ? 'bg-green-500/30' : 'bg-green-200'
                                    : isDarkMode ? 'bg-purple-500/20' : 'bg-blue-100'
                                }`}>
                                  {getLogTypeIcon(log.log_type || 'text')}
                                </div>
                                <div>
                                  <h3 className={`font-bold text-lg ${
                                    // Green text for completed checkbox logs
                                    log.log_type === 'checkbox' && log.notes && (
                                      log.notes.trim().toLowerCase().startsWith('completed') ||
                                      log.notes.trim() === 'Completed'
                                    )
                                      ? isDarkMode ? 'text-green-300' : 'text-green-700'
                                      : isDarkMode ? 'text-white' : 'text-gray-900'
                                  }`}>
                                    {log.topic || 'Untitled'}
                                    {log.log_type === 'checkbox' && log.notes && (
                                      log.notes.trim().toLowerCase().startsWith('completed') ||
                                      log.notes.trim() === 'Completed'
                                    ) && (
                                      <span className="ml-2 text-green-500">✓</span>
                                    )}
                                  </h3>
                                  <div className="flex items-center gap-2 mt-1">
                                    <Calendar className={`w-4 h-4 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`} />
                                    <span className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-600'}`}>
                                      {formatDate(log.created_at)}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              {/* Delete Button */}
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleDeleteLog(log.id)}
                                disabled={deletingId === log.id}
                                className={`p-2 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${
                                  isDarkMode
                                    ? 'text-red-400 hover:bg-red-500/20 hover:text-red-300'
                                    : 'text-red-600 hover:bg-red-50 hover:text-red-700'
                                }`}
                                title="Delete this log"
                              >
                                {deletingId === log.id ? (
                                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                ) : (
                                  <Trash2 className="w-4 h-4" />
                                )}
                              </motion.button>
                            </div>

                            <div className="flex flex-wrap items-center gap-3 mb-3">
                              {/* Hours badge - for 'hours' type */}
                              {log.log_type === 'hours' && log.hours && typeof log.hours === 'number' && (
                                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${
                                  isDarkMode ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-green-100 text-green-700 border border-green-300'
                                }`}>
                                  <Clock className="w-4 h-4" />
                                  <span className="text-sm font-semibold">{log.hours}h</span>
                                </div>
                              )}
                              
                              {/* Difficulty badge - for 'difficulty' type */}
                              {log.log_type === 'difficulty' && log.difficulty && typeof log.difficulty === 'string' && (
                                <div className={`px-3 py-1.5 rounded-lg text-sm font-semibold border ${getDifficultyColor(log.difficulty)} ${
                                  isDarkMode 
                                    ? log.difficulty.toLowerCase() === 'easy' ? 'border-green-500/30' 
                                      : log.difficulty.toLowerCase() === 'medium' ? 'border-yellow-500/30' 
                                      : 'border-red-500/30'
                                    : log.difficulty.toLowerCase() === 'easy' ? 'border-green-300' 
                                      : log.difficulty.toLowerCase() === 'medium' ? 'border-yellow-300' 
                                      : 'border-red-300'
                                }`}>
                                  {log.difficulty.charAt(0).toUpperCase() + log.difficulty.slice(1)}
                                </div>
                              )}
                              
                              {/* Checkbox completion badge - for 'checkbox' type */}
                              {log.log_type === 'checkbox' && (() => {
                                const isCompleted = log.notes && (
                                  log.notes.trim().toLowerCase().startsWith('completed') ||
                                  log.notes.trim() === 'Completed'
                                )
                                return (
                                  <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${
                                    isCompleted
                                      ? isDarkMode 
                                        ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                                        : 'bg-green-100 text-green-700 border border-green-300'
                                      : isDarkMode 
                                        ? 'bg-gray-500/20 text-gray-400 border border-gray-500/30' 
                                        : 'bg-gray-100 text-gray-600 border border-gray-300'
                                  }`}>
                                    <CheckCircle2 className={`w-4 h-4 ${
                                      isCompleted ? '' : 'opacity-50'
                                    }`} />
                                    <span className="text-sm font-semibold">
                                      {isCompleted ? 'Completed' : 'Pending'}
                                    </span>
                                  </div>
                                )
                              })()}
                              
                              {/* Text type indicator */}
                              {log.log_type === 'text' && (
                                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${
                                  isDarkMode ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'bg-blue-100 text-blue-700 border border-blue-300'
                                }`}>
                                  <BookOpen className="w-4 h-4" />
                                  <span className="text-sm font-semibold">Note</span>
                                </div>
                              )}
                            </div>

                            {/* Notes display - different styling based on log type */}
                            {log.notes && typeof log.notes === 'string' && log.notes.trim() && (
                              <div className={`mt-3 p-4 rounded-lg ${
                                log.log_type === 'text'
                                  ? isDarkMode 
                                    ? 'bg-blue-500/10 border border-blue-500/20' 
                                    : 'bg-blue-50 border border-blue-200'
                                  : isDarkMode 
                                    ? 'bg-white/5 border border-white/10' 
                                    : 'bg-gray-50 border border-gray-200'
                              }`}>
                                {log.log_type === 'text' ? (
                                  <p className={`text-sm leading-relaxed whitespace-pre-wrap ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                    {log.notes}
                                  </p>
                                ) : (
                                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                    {log.notes}
                                  </p>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )
                  })}
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
