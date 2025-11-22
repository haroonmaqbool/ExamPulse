/**
 * Upload Page
 * Page for uploading past exam papers
 */

import { useState } from 'react'
import FileUpload from '../components/FileUpload'
import { useTheme } from '../components/ThemeContext'
import axios from 'axios'

function Upload() {
  const [uploading, setUploading] = useState(false)
  const [uploadStatus, setUploadStatus] = useState(null)
  const { theme } = useTheme()
  const isDarkMode = theme === 'dark'

  const handleFileSelect = async (file) => {
    setUploading(true)
    setUploadStatus(null)

    try {
      const formData = new FormData()
      formData.append('file', file)

      // TODO: Implement actual API call
      const response = await axios.post('/api/upload/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      setUploadStatus({ success: true, message: 'File uploaded successfully' })
    } catch (error) {
      setUploadStatus({ success: false, message: 'Upload failed' })
    } finally {
      setUploading(false)
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
          </div>
        )}
      </div>
    </div>
  )
}

export default Upload

