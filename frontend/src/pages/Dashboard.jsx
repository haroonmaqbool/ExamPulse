/**
 * Dashboard Page
 * Modern dashboard with unique design
 */

import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useTheme } from '../components/ThemeContext'
import Background from '../components/Background'
import ShaderBackground from '../components/ShaderBackground'
import { Upload, BarChart3, FileText, Brain, BookOpen, TrendingUp, Calendar, Zap, Clock } from 'lucide-react'
import { motion } from 'framer-motion'

function Dashboard() {
  const [isVisible, setIsVisible] = useState(false)
  const { theme } = useTheme()
  const isDarkMode = theme === 'dark'

  // Mock data
  const [dashboardData] = useState({
    accuracyScore: 95,
    predictedQuestions: 48,
    daysUntilExam: 12,
    studyProgress: 67,
    totalPapersUploaded: 5,
    topicsAnalyzed: 12,
    studyStreak: 7,
    lastActivity: '2 hours ago'
  })

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <div className={`min-h-screen relative overflow-hidden transition-colors duration-500 ${
      isDarkMode 
        ? '' 
        : 'bg-gradient-to-br from-blue-50 via-white to-green-50'
    }`}>
      {isDarkMode && <ShaderBackground />}
      {!isDarkMode && <Background />}

      <main className="relative z-10 pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className={`max-w-7xl mx-auto transition-all duration-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
          
          {/* Header with Stats Bar */}
          <div className="mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-6">
              <div>
                <h1 className={`text-5xl font-black mb-1 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  Dashboard
                </h1>
                <p className={`text-sm flex items-center gap-2 ${
                  isDarkMode ? 'text-gray-500' : 'text-gray-600'
                }`}>
                  <Clock className="w-4 h-4" />
                  Last activity {dashboardData.lastActivity}
                </p>
              </div>
              
              {/* Quick Stats Bar */}
              <div className="flex flex-wrap gap-4">
                <div className={`px-4 py-2 rounded-xl backdrop-blur-sm ${
                  isDarkMode ? 'bg-white/5 border border-white/10' : 'bg-white/80 border border-blue-200 shadow-sm'
                }`}>
                  <div className={`text-xs mb-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-600'}`}>
                    Papers
                  </div>
                  <div className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {dashboardData.totalPapersUploaded}
                  </div>
                </div>
                <div className={`px-4 py-2 rounded-xl backdrop-blur-sm ${
                  isDarkMode ? 'bg-white/5 border border-white/10' : 'bg-white/80 border border-blue-200 shadow-sm'
                }`}>
                  <div className={`text-xs mb-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-600'}`}>
                    Topics
                  </div>
                  <div className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {dashboardData.topicsAnalyzed}
                  </div>
                </div>
                <div className={`px-4 py-2 rounded-xl backdrop-blur-sm ${
                  isDarkMode ? 'bg-white/5 border border-white/10' : 'bg-white/80 border border-blue-200 shadow-sm'
                }`}>
                  <div className={`text-xs mb-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-600'}`}>
                    Streak
                  </div>
                  <div className={`text-lg font-bold flex items-center gap-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {dashboardData.studyStreak} <span className="text-sm">🔥</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            
            {/* Left Column - Large Cards */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Exam Countdown Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className={`relative overflow-hidden rounded-2xl p-8 ${
                isDarkMode
                  ? 'bg-gradient-to-br from-purple-900/40 to-pink-900/40 border border-purple-500/20'
                  : 'bg-gradient-to-br from-blue-600 to-green-600'
              }`}>
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
                <div className="relative">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <p className={`text-sm font-medium mb-2 ${
                        isDarkMode ? 'text-purple-300' : 'text-white/80'
                      }`}>
                        Your Next Exam
                      </p>
                      <h2 className="text-5xl font-black text-white mb-2">
                        {dashboardData.daysUntilExam}
                      </h2>
                      <p className="text-white/80 text-sm">days remaining</p>
                    </div>
                    <div className={`p-3 rounded-xl ${
                      isDarkMode ? 'bg-white/10' : 'bg-white/20'
                    }`}>
                      <Calendar className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <Link
                      to="/smart-plan"
                      className={`px-6 py-3 rounded-lg font-semibold text-sm transition-all ${
                        isDarkMode
                          ? 'bg-white text-purple-600 hover:bg-gray-100'
                          : 'bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm'
                      }`}
                    >
                      View Study Plan
                    </Link>
                    <Link
                      to="/expected-paper"
                      className="text-white text-sm font-medium hover:underline"
                    >
                      See predictions →
                    </Link>
                  </div>
                </div>
              </motion.div>

              {/* Quick Actions Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <motion.div
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.2 }}
                  className="h-full"
                >
                  <Link
                    to="/upload"
                    className={`group relative p-6 rounded-xl transition-all h-full flex flex-col ${
                      isDarkMode
                        ? 'bg-white/5 border border-white/10 hover:bg-white/10 hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/30'
                        : 'bg-white/80 border border-blue-200 hover:border-blue-400 hover:shadow-lg hover:shadow-blue-200/50 backdrop-blur-sm'
                    }`}
                  >
                    <Upload className={`w-8 h-8 mb-3 ${
                      isDarkMode ? 'text-blue-400' : 'text-blue-600'
                    }`} strokeWidth={1.5} />
                    <h3 className={`font-semibold text-sm ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      Upload
                    </h3>
                    <p className={`text-xs mt-1 ${
                      isDarkMode ? 'text-gray-500' : 'text-gray-600'
                    }`}>
                      Add papers
                    </p>
                  </Link>
                </motion.div>

                <motion.div
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.2 }}
                  className="h-full"
                >
                  <Link
                    to="/analysis"
                    className={`group relative p-6 rounded-xl transition-all h-full flex flex-col ${
                      isDarkMode
                        ? 'bg-white/5 border border-white/10 hover:bg-white/10 hover:border-green-500/50 hover:shadow-lg hover:shadow-green-500/30'
                        : 'bg-white/80 border border-green-200 hover:border-green-400 hover:shadow-lg hover:shadow-green-200/50 backdrop-blur-sm'
                    }`}
                  >
                    <BarChart3 className={`w-8 h-8 mb-3 ${
                      isDarkMode ? 'text-green-400' : 'text-green-600'
                    }`} strokeWidth={1.5} />
                    <h3 className={`font-semibold text-sm ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      Patterns
                    </h3>
                    <p className={`text-xs mt-1 ${
                      isDarkMode ? 'text-gray-500' : 'text-gray-600'
                    }`}>
                      View insights
                    </p>
                  </Link>
                </motion.div>

                <motion.div
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.2 }}
                  className="h-full"
                >
                  <Link
                    to="/expected-paper"
                    className={`group relative p-6 rounded-xl transition-all h-full flex flex-col ${
                      isDarkMode
                        ? 'bg-white/5 border border-white/10 hover:bg-white/10 hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/30'
                        : 'bg-white/80 border border-purple-200 hover:border-purple-400 hover:shadow-lg hover:shadow-purple-200/50 backdrop-blur-sm'
                    }`}
                  >
                    <FileText className={`w-8 h-8 mb-3 ${
                      isDarkMode ? 'text-purple-400' : 'text-purple-600'
                    }`} strokeWidth={1.5} />
                    <h3 className={`font-semibold text-sm ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      Expected
                    </h3>
                    <p className={`text-xs mt-1 ${
                      isDarkMode ? 'text-gray-500' : 'text-gray-600'
                    }`}>
                      AI predictions
                    </p>
                  </Link>
                </motion.div>

                <motion.div
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.2 }}
                  className="h-full"
                >
                  <Link
                    to="/smart-plan"
                    className={`group relative p-6 rounded-xl transition-all h-full flex flex-col ${
                      isDarkMode
                        ? 'bg-white/5 border border-white/10 hover:bg-white/10 hover:border-pink-500/50 hover:shadow-lg hover:shadow-pink-500/30'
                        : 'bg-white/80 border border-pink-200 hover:border-pink-400 hover:shadow-lg hover:shadow-pink-200/50 backdrop-blur-sm'
                    }`}
                  >
                    <Brain className={`w-8 h-8 mb-3 ${
                      isDarkMode ? 'text-pink-400' : 'text-pink-600'
                    }`} strokeWidth={1.5} />
                    <h3 className={`font-semibold text-sm ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      Smart Plan
                    </h3>
                    <p className={`text-xs mt-1 ${
                      isDarkMode ? 'text-gray-500' : 'text-gray-600'
                    }`}>
                      Study guide
                    </p>
                  </Link>
                </motion.div>

                <motion.div
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.2 }}
                  className="h-full"
                >
                  <Link
                    to="/study-logs"
                    className={`group relative p-6 rounded-xl transition-all h-full flex flex-col ${
                      isDarkMode
                        ? 'bg-white/5 border border-white/10 hover:bg-white/10 hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/30'
                        : 'bg-white/80 border border-cyan-200 hover:border-cyan-400 hover:shadow-lg hover:shadow-cyan-200/50 backdrop-blur-sm'
                    }`}
                  >
                    <BookOpen className={`w-8 h-8 mb-3 ${
                      isDarkMode ? 'text-cyan-400' : 'text-cyan-600'
                    }`} strokeWidth={1.5} />
                    <h3 className={`font-semibold text-sm ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      Study Logs
                    </h3>
                    <p className={`text-xs mt-1 ${
                      isDarkMode ? 'text-gray-500' : 'text-gray-600'
                    }`}>
                      Track progress
                    </p>
                  </Link>
                </motion.div>
              </div>
            </div>

            {/* Right Column - Stats */}
            <div className="space-y-6">
              
              {/* Accuracy Score */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className={`rounded-2xl p-6 ${
                isDarkMode
                  ? 'bg-white/5 border border-white/10'
                  : 'bg-white/80 border border-blue-200 backdrop-blur-sm'
              }`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className={`text-sm font-medium ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Accuracy
                  </h3>
                  <Zap className={`w-4 h-4 ${
                    isDarkMode ? 'text-yellow-400' : 'text-yellow-500'
                  }`} />
                </div>
                <div className="mb-4">
                  <div className="text-4xl font-black mb-1">
                    <span className={isDarkMode ? 'text-white' : 'text-gray-900'}>
                      {dashboardData.accuracyScore}
                    </span>
                    <span className={`text-2xl ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                      %
                    </span>
                  </div>
                  <p className={`text-xs ${
                    isDarkMode ? 'text-green-400' : 'text-green-600'
                  }`}>
                    ↑ 5% from last week
                  </p>
                </div>
                <div className={`h-2 rounded-full overflow-hidden ${
                  isDarkMode ? 'bg-white/10' : 'bg-gray-200'
                }`}>
                  <div 
                    className="h-full bg-gradient-to-r from-green-500 to-emerald-500"
                    style={{ width: `${dashboardData.accuracyScore}%` }}
                  />
                </div>
              </motion.div>

              {/* Predicted Questions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className={`rounded-2xl p-6 ${
                isDarkMode
                  ? 'bg-white/5 border border-white/10'
                  : 'bg-white/80 border border-green-200 backdrop-blur-sm'
              }`}>
                <h3 className={`text-sm font-medium mb-4 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  AI Predictions
                </h3>
                <div className="text-4xl font-black mb-2">
                  <span className={isDarkMode ? 'text-white' : 'text-gray-900'}>
                    {dashboardData.predictedQuestions}
                  </span>
                </div>
                <p className={`text-sm ${
                  isDarkMode ? 'text-gray-500' : 'text-gray-600'
                }`}>
                  questions identified
                </p>
                <Link
                  to="/expected-paper"
                  className={`inline-block mt-4 text-xs font-medium ${
                    isDarkMode ? 'text-purple-400 hover:text-purple-300' : 'text-purple-600 hover:text-purple-700'
                  }`}
                >
                  View all →
                </Link>
              </motion.div>

              {/* Study Progress */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className={`rounded-2xl p-6 ${
                isDarkMode
                  ? 'bg-white/5 border border-white/10'
                  : 'bg-white/80 border border-purple-200 backdrop-blur-sm'
              }`}>
                <h3 className={`text-sm font-medium mb-4 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Study Progress
                </h3>
                
                {/* Circular Progress */}
                <div className="flex items-center justify-center mb-4">
                  <div className="relative w-32 h-32">
                    <svg className="w-32 h-32 transform -rotate-90">
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="none"
                        className={isDarkMode ? 'text-white/10' : 'text-gray-200'}
                      />
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="none"
                        strokeDasharray={`${2 * Math.PI * 56}`}
                        strokeDashoffset={`${2 * Math.PI * 56 * (1 - dashboardData.studyProgress / 100)}`}
                        className="text-purple-500"
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className={`text-2xl font-black ${
                        isDarkMode ? 'text-white' : 'text-gray-900'
                      }`}>
                        {dashboardData.studyProgress}%
                      </span>
                    </div>
                  </div>
                </div>
                
                <p className={`text-xs text-center ${
                  isDarkMode ? 'text-gray-500' : 'text-gray-600'
                }`}>
                  Keep going! You're doing great.
                </p>
              </motion.div>
            </div>
          </div>

          {/* Bottom Tip Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className={`rounded-2xl p-6 backdrop-blur-sm ${
            isDarkMode
              ? 'bg-gradient-to-r from-blue-900/20 to-cyan-900/20 border border-blue-500/20'
              : 'bg-gradient-to-r from-blue-100/50 to-green-100/50 border border-blue-300'
          }`}>
            <div className="flex items-start gap-4">
              <div className={`p-2 rounded-lg ${
                isDarkMode ? 'bg-blue-500/20' : 'bg-blue-100'
              }`}>
                <TrendingUp className={`w-5 h-5 ${
                  isDarkMode ? 'text-blue-400' : 'text-blue-600'
                }`} />
              </div>
              <div>
                <h4 className={`font-semibold mb-1 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  Pro Tip
                </h4>
                <p className={`text-sm ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-700'
                }`}>
                  Upload at least 3-5 years of past papers for more accurate AI predictions and better pattern recognition.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  )
}

export default Dashboard

