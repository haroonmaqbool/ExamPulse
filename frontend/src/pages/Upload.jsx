/**
 * Upload Page
 * Page for uploading past exam papers
 */

import { useState } from 'react'
import FileUpload from '../components/FileUpload'
import { useTheme } from '../components/ThemeContext'
import { useNavigate } from 'react-router-dom'
import api from '../utils/api'

function Upload() {
  const [uploading, setUploading] = useState(false)
  const [uploadStatus, setUploadStatus] = useState(null)
  const [fileId, setFileId] = useState(null)
  const { theme } = useTheme()
  const isDarkMode = theme === 'dark'
  const navigate = useNavigate()

  const handleFileSelect = async (file) => {
    setUploading(true)
    setUploadStatus(null)
    setFileId(null)

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
      setUploadStatus({ 
        success: true, 
        message: `File "${filename}" uploaded successfully! File ID: ${file_id}` 
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
    <div className={`min-h-screen transition-colors duration-500 ${
      isDarkMode
        ? 'bg-[#0a0a0a]'
        : 'bg-gradient-to-br from-blue-50 via-white to-green-50'
    }`}>
      <div className="max-w-2xl mx-auto px-6 py-32">
        <h1 className={`text-4xl font-bold mb-8 bg-gradient-to-r bg-clip-text text-transparent transition-all duration-300 ${
          isDarkMode
            ? 'from-purple-400 to-pink-400'
            : 'from-blue-600 to-green-600'
        }`}>
          Upload Exam Paper
        </h1>
        <FileUpload onFileSelect={handleFileSelect} />
        
        {uploading && (
          <div className={`mt-4 text-center transition-colors duration-300 ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>Uploading...</div>
        )}
        
        {uploadStatus && (
          <div
            className={`mt-4 p-4 rounded-xl border transition-all duration-300 ${
              uploadStatus.success
                ? isDarkMode
                  ? 'bg-green-500/10 text-green-400 border-green-500/30'
                  : 'bg-green-100 text-green-700 border-green-400'
                : isDarkMode
                  ? 'bg-red-500/10 text-red-400 border-red-500/30'
                  : 'bg-red-100 text-red-700 border-red-400'
            }`}
          >
            {uploadStatus.message}
            {uploadStatus.success && fileId && (
              <button
                onClick={handleAnalyze}
                className={`mt-3 px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                  isDarkMode
                    ? 'bg-purple-600 hover:bg-purple-700 text-white'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                Analyze This File
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default Upload

