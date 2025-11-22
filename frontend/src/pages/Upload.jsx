/**
 * Upload Page
 * Page for uploading past exam papers
 */

import { useState } from 'react'
import { motion } from 'framer-motion'
import FileUpload from '../components/FileUpload'
import { useTheme } from '../components/ThemeContext'
import { useNavigate } from 'react-router-dom'
import api from '../utils/api'
import Navbar from '../components/Navbar'
import Background from '../components/Background'

function Upload() {
  const [uploading, setUploading] = useState(false)
  const [uploadStatus, setUploadStatus] = useState(null)
  const [fileId, setFileId] = useState(null)
  const [fileName, setFileName] = useState('')
  const { theme } = useTheme()
  const isDarkMode = theme === 'dark'
  const navigate = useNavigate()

  const handleFileSelect = async (file) => {
    setUploading(true)
    setUploadStatus(null)
    setFileId(null)
    setFileName(file.name)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await api.post('/upload/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      const { file_id, filename } = response.data
      setFileId(file_id)
      setFileName(filename)
      setUploadStatus({ 
        success: true, 
        message: `File "${filename}" uploaded successfully!`
      })
    } catch (error) {
      setUploadStatus({ 
        success: false, 
        message: error.message || 'Upload failed. Please try again.' 
      })
    } finally {
      setUploading(false)
    }
  }

  const handleAnalyze = () => {
    if (fileId) {
      navigate(`/analysis?file_id=${fileId}`)
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
          {/* Page Title with Animation */}
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className={`text-4xl font-bold mb-8 bg-gradient-to-r bg-clip-text text-transparent transition-all duration-300 ${
              isDarkMode
                ? 'from-purple-400 to-pink-400'
                : 'from-blue-600 to-green-600'
            }`}
          >
            Upload Exam Paper
          </motion.h1>
          
          {/* Upload Container with Animation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
          >
            <FileUpload onFileSelect={handleFileSelect} />
          </motion.div>
          
          {/* Uploading Status */}
          {uploading && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-6 text-center"
            >
              <div className="flex items-center justify-center gap-3">
                <div className={`h-5 w-5 border-2 border-t-transparent rounded-full animate-spin ${
                  isDarkMode ? 'border-purple-500' : 'border-blue-500'
                }`}></div>
                <span className={`font-medium transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Uploading {fileName}...
                </span>
              </div>
            </motion.div>
          )}
          
          {/* Upload Status Message */}
          {uploadStatus && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className={`mt-6 p-5 rounded-xl border transition-all duration-300 ${
                uploadStatus.success
                  ? isDarkMode
                    ? 'bg-green-500/10 text-green-400 border-green-500/30'
                    : 'bg-green-50 text-green-700 border-green-300'
                  : isDarkMode
                    ? 'bg-red-500/10 text-red-400 border-red-500/30'
                    : 'bg-red-50 text-red-700 border-red-300'
              }`}
            >
              {/* Success Icon */}
              {uploadStatus.success && (
                <div className="flex items-start gap-3 mb-3">
                  <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${
                    isDarkMode ? 'bg-green-500/20' : 'bg-green-200'
                  }`}>
                    <svg className={`w-4 h-4 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-base mb-1">Upload Successful!</p>
                    <p className={`text-sm ${isDarkMode ? 'text-green-300' : 'text-green-600'}`}>
                      {fileName}
                    </p>
                  </div>
                </div>
              )}
              
              {/* Error Icon */}
              {!uploadStatus.success && (
                <div className="flex items-start gap-3 mb-3">
                  <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${
                    isDarkMode ? 'bg-red-500/20' : 'bg-red-200'
                  }`}>
                    <svg className={`w-4 h-4 ${isDarkMode ? 'text-red-400' : 'text-red-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-base mb-1">Upload Failed</p>
                    <p className={`text-sm ${isDarkMode ? 'text-red-300' : 'text-red-600'}`}>
                      {uploadStatus.message}
                    </p>
                  </div>
                </div>
              )}
              
              {/* File ID Display */}
              {uploadStatus.success && fileId && (
                <div className={`mt-3 pt-3 border-t text-xs font-mono ${
                  isDarkMode 
                    ? 'border-green-500/20 text-green-400/70' 
                    : 'border-green-300 text-green-600/70'
                }`}>
                  File ID: {fileId}
                </div>
              )}
            </motion.div>
          )}

          {/* Analyze Button - Centered Below Upload Status */}
          {uploadStatus?.success && fileId && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
              className="mt-8 flex justify-center"
            >
              <button
                onClick={handleAnalyze}
                className={`group relative px-8 py-4 rounded-xl font-bold text-base text-white overflow-hidden transition-all duration-300 hover:scale-[1.03] shadow-lg transform ${
                  isDarkMode
                    ? 'shadow-purple-500/30 hover:shadow-purple-500/50'
                    : 'shadow-blue-500/30 hover:shadow-blue-500/50'
                }`}
              >
                <span className={`absolute inset-0 bg-gradient-to-r transition-all duration-300 ${
                  isDarkMode
                    ? 'from-purple-600 to-pink-600 group-hover:from-purple-500 group-hover:to-pink-500'
                    : 'from-blue-600 to-green-600 group-hover:from-blue-500 group-hover:to-green-500'
                }`} />
                <span className="relative flex items-center gap-2">
                  Analyze This File
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </button>
            </motion.div>
          )}

          {/* Help Text */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-12"
          >
            <div className={`p-6 rounded-xl border transition-all duration-300 ${
              isDarkMode
                ? 'bg-white/5 border-white/10'
                : 'bg-blue-50/50 border-blue-200'
            }`}>
              <h3 className={`text-lg font-bold mb-3 flex items-center gap-2 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                <svg className={`w-5 h-5 ${isDarkMode ? 'text-purple-400' : 'text-blue-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Upload Tips
              </h3>
              <ul className={`space-y-2 text-sm ${
                isDarkMode ? 'text-gray-400' : 'text-gray-700'
              }`}>
                <li className="flex items-start gap-2">
                  <span className={`mt-1 ${isDarkMode ? 'text-purple-400' : 'text-blue-600'}`}>•</span>
                  <span>Supported formats: PDF, PNG, JPG (max 10MB)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className={`mt-1 ${isDarkMode ? 'text-purple-400' : 'text-blue-600'}`}>•</span>
                  <span>Upload past exam papers from the last 3-5 years for best results</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className={`mt-1 ${isDarkMode ? 'text-purple-400' : 'text-blue-600'}`}>•</span>
                  <span>Clear, high-quality scans work best for accurate analysis</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className={`mt-1 ${isDarkMode ? 'text-purple-400' : 'text-blue-600'}`}>•</span>
                  <span>After analysis, you can generate expected papers and study plans</span>
                </li>
              </ul>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  )
}

export default Upload