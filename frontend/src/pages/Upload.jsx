/**
 * Upload Page
 * Page for uploading past exam papers
 */

import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import FileUpload from '../components/FileUpload'
import { useTheme } from '../components/ThemeContext'
import { useNavigate } from 'react-router-dom'
import api from '../utils/api'
import Navbar from '../components/Navbar'
import Background from '../components/Background'
import ShaderBackground from '../components/ShaderBackground'

function Upload() {
  const [uploading, setUploading] = useState(false)
  const [uploadStatus, setUploadStatus] = useState(null)
  const [uploadedFiles, setUploadedFiles] = useState([])
  const [uploadProgress, setUploadProgress] = useState({})
  const { theme } = useTheme()
  const isDarkMode = theme === 'dark'
  const navigate = useNavigate()
  const fileInputRef = useRef(null)

  const handleFileSelect = async (files) => {
    if (!files || files.length === 0) return

    setUploading(true)
    setUploadStatus(null)
    
    const maxSize = 10 * 1024 * 1024 // 10MB
    const validFiles = []
    const invalidFiles = []

    // Validate all files first
    for (const file of files) {
      if (file.size > maxSize) {
        invalidFiles.push({ name: file.name, error: `File is too large (${(file.size / (1024 * 1024)).toFixed(2)}MB). Maximum is 10MB.` })
      } else if (file.size === 0) {
        invalidFiles.push({ name: file.name, error: 'File is empty.' })
      } else {
        validFiles.push(file)
      }
    }

    if (invalidFiles.length > 0) {
      setUploadStatus({
        success: false,
        message: `${invalidFiles.length} file(s) failed validation. ${invalidFiles.map(f => f.name).join(', ')}`
      })
      if (validFiles.length === 0) {
        setUploading(false)
        return
      }
    }

    // Upload valid files
    const newUploadedFiles = []
    const errors = []

    for (const file of validFiles) {
      try {
        setUploadProgress(prev => ({ ...prev, [file.name]: 0 }))
        
        const formData = new FormData()
        formData.append('file', file)

        console.log('Uploading file:', file.name, 'Size:', file.size, 'bytes')

        const response = await api.post('/upload/', formData, {
          timeout: 30000,
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
              setUploadProgress(prev => ({ ...prev, [file.name]: percentCompleted }))
            }
          }
        })

        console.log('Upload response:', response.data)
        const { file_id, filename } = response.data
        newUploadedFiles.push({ file_id, filename, originalName: file.name })
        setUploadProgress(prev => {
          const newProgress = { ...prev }
          delete newProgress[file.name]
          return newProgress
        })
      } catch (error) {
        console.error('Upload error for', file.name, ':', error)
        errors.push({ name: file.name, error: error.message || 'Upload failed' })
        setUploadProgress(prev => {
          const newProgress = { ...prev }
          delete newProgress[file.name]
          return newProgress
        })
      }
    }

    // Update uploaded files list
    setUploadedFiles(prev => [...prev, ...newUploadedFiles])

    // Set status
    if (newUploadedFiles.length > 0) {
      setUploadStatus({
        success: true,
        message: `${newUploadedFiles.length} file(s) uploaded successfully!`,
        uploaded: newUploadedFiles,
        errors: errors.length > 0 ? errors : null
      })
    } else {
      setUploadStatus({
        success: false,
        message: errors.length > 0 
          ? `All uploads failed: ${errors.map(e => e.name).join(', ')}`
          : 'Upload failed. Please try again.'
      })
    }

    setUploading(false)
  }

  const handleAnalyze = () => {
    if (uploadedFiles.length > 0) {
      const fileIds = uploadedFiles.map(f => f.file_id)
      navigate(`/analysis?file_ids=${encodeURIComponent(JSON.stringify(fileIds))}`)
    }
  }

  const handleRemoveFile = (fileIdToRemove) => {
    setUploadedFiles(prev => prev.filter(f => f.file_id !== fileIdToRemove))
    if (uploadedFiles.length === 1) {
      setUploadStatus(null)
    }
  }

  const handleAddMore = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
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
      <main className="pt-16 md:pt-20 relative z-10">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
          {/* Page Title with Animation */}
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className={`text-3xl sm:text-4xl md:text-5xl font-black mb-6 sm:mb-8 bg-gradient-to-r bg-clip-text text-transparent transition-all duration-300 py-2 ${
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
            <FileUpload onFileSelect={handleFileSelect} inputRef={fileInputRef} />
          </motion.div>
          
          {/* Uploading Status */}
          {uploading && Object.keys(uploadProgress).length > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-6"
            >
              <div className={`rounded-xl p-4 border ${
                isDarkMode 
                  ? 'bg-white/5 border-white/10' 
                  : 'bg-blue-50 border-blue-200'
              }`}>
                <p className={`font-medium mb-3 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Uploading files...
                </p>
                {Object.entries(uploadProgress).map(([fileName, progress]) => (
                  <div key={fileName} className="mb-2 last:mb-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-sm truncate flex-1 ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        {fileName}
                      </span>
                      <span className={`text-sm ml-2 ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        {progress}%
                      </span>
                    </div>
                    <div className={`h-2 rounded-full overflow-hidden ${
                      isDarkMode ? 'bg-white/10' : 'bg-blue-200'
                    }`}>
                      <div 
                        className={`h-full transition-all duration-300 ${
                          isDarkMode 
                            ? 'bg-gradient-to-r from-purple-500 to-pink-500'
                            : 'bg-gradient-to-r from-blue-500 to-green-500'
                        }`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
          
          {/* Uploaded Files List */}
          {uploadedFiles.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="mt-6"
            >
              <div className={`p-5 rounded-xl border transition-all duration-300 ${
                isDarkMode
                  ? 'bg-green-500/10 border-green-500/30'
                  : 'bg-green-50 border-green-300'
              }`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className={`font-bold text-base ${
                    isDarkMode ? 'text-green-400' : 'text-green-700'
                  }`}>
                    Uploaded Files ({uploadedFiles.length})
                  </h3>
                  <button
                    onClick={handleAddMore}
                    className={`text-xs px-3 py-1 rounded-lg font-medium transition-all ${
                      isDarkMode
                        ? 'bg-white/10 hover:bg-white/20 text-green-300'
                        : 'bg-green-200 hover:bg-green-300 text-green-700'
                    }`}
                  >
                    + Add More
                  </button>
                </div>
                <div className="space-y-2">
                  {uploadedFiles.map((file) => (
                    <div
                      key={file.file_id}
                      className={`flex items-center justify-between p-3 rounded-lg ${
                        isDarkMode
                          ? 'bg-white/5 border border-white/10'
                          : 'bg-white border border-green-200'
                      }`}
                    >
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium truncate ${
                          isDarkMode ? 'text-white' : 'text-gray-900'
                        }`}>
                          {file.originalName || file.filename}
                        </p>
                        <p className={`text-xs mt-1 font-mono ${
                          isDarkMode ? 'text-gray-500' : 'text-gray-600'
                        }`}>
                          ID: {file.file_id}
                        </p>
                      </div>
                      <button
                        onClick={() => handleRemoveFile(file.file_id)}
                        className={`ml-3 p-1 rounded hover:bg-red-500/20 transition-colors ${
                          isDarkMode ? 'text-red-400' : 'text-red-600'
                        }`}
                        title="Remove file"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
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
                      {uploadStatus.message}
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

              {/* Partial Errors */}
              {uploadStatus.success && uploadStatus.errors && uploadStatus.errors.length > 0 && (
                <div className={`mt-3 pt-3 border-t ${
                  isDarkMode ? 'border-green-500/20' : 'border-green-300'
                }`}>
                  <p className={`text-xs font-medium mb-2 ${
                    isDarkMode ? 'text-yellow-400' : 'text-yellow-700'
                  }`}>
                    Some files failed to upload:
                  </p>
                  <ul className="space-y-1">
                    {uploadStatus.errors.map((err, idx) => (
                      <li key={idx} className={`text-xs ${
                        isDarkMode ? 'text-yellow-300' : 'text-yellow-600'
                      }`}>
                        • {err.name}: {err.error}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </motion.div>
          )}

          {/* Analyze Button - Centered Below Upload Status */}
          {uploadedFiles.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
              className="mt-8 flex justify-center"
            >
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAnalyze}
                className={`group relative px-8 py-4 rounded-xl font-bold text-base text-white overflow-hidden transition-all duration-300 shadow-lg ${
                  isDarkMode
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 shadow-purple-500/30'
                    : 'bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-500 hover:to-green-500 shadow-blue-500/30'
                }`}
              >
                <span className="relative flex items-center gap-2">
                  Analyze {uploadedFiles.length} File{uploadedFiles.length > 1 ? 's' : ''}
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </motion.button>
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
                  <span>Supported formats: PDF, PNG, JPG (max 10MB each) - You can select multiple files at once</span>
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