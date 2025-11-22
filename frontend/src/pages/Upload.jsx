/**
 * Upload Page
 * Page for uploading past exam papers
 */

import { useState, useRef } from 'react'
import FileUpload from '../components/FileUpload'
import { useTheme } from '../components/ThemeContext'
import { useNavigate } from 'react-router-dom'
import api from '../utils/api'
import Navbar from '../components/Navbar'
import Background from '../components/Background'

function Upload() {
  const [uploading, setUploading] = useState(false)
  const [uploadStatus, setUploadStatus] = useState(null)
  const [uploadedFiles, setUploadedFiles] = useState([])
  const { theme } = useTheme()
  const isDarkMode = theme === 'dark'
  const navigate = useNavigate()
  const fileInputRef = useRef(null)

  const handleFileSelect = async (file) => {
    setUploading(true)
    setUploadStatus(null)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await api.post('/upload/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      const { file_id, filename } = response.data
      setUploadedFiles(prev => [...prev, { file_id, filename }])
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

  const handleAddAnother = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const handleAnalyze = () => {
    if (uploadedFiles.length > 0) {
      const fileIds = uploadedFiles.map(f => f.file_id)
      navigate(`/analysis?file_ids=${encodeURIComponent(JSON.stringify(fileIds))}`)
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
          <h1 className={`text-4xl font-bold mb-8 bg-gradient-to-r bg-clip-text text-transparent transition-all duration-300 ${
            isDarkMode
              ? 'from-purple-400 to-pink-400'
              : 'from-blue-600 to-green-600'
          }`}>
            Upload Exam Papers
          </h1>
          
          <FileUpload onFileSelect={handleFileSelect} inputRef={fileInputRef} />
          
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

          {uploadedFiles.length > 0 && (
            <div className={`mt-6 p-6 rounded-xl border transition-all duration-300 ${
              isDarkMode
                ? 'bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border-white/10'
                : 'bg-white border-2 border-blue-200'
            }`}>
              <h2 className={`text-xl font-bold mb-4 transition-colors duration-300 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Uploaded Papers ({uploadedFiles.length})
              </h2>
              <ul className="space-y-2 mb-4">
                {uploadedFiles.map((file, index) => (
                  <li
                    key={file.file_id}
                    className={`flex items-center gap-3 p-3 rounded-lg transition-colors duration-300 ${
                      isDarkMode
                        ? 'bg-white/5 border border-white/10'
                        : 'bg-blue-50 border border-blue-200'
                    }`}
                  >
                    <span className={`font-medium transition-colors duration-300 ${
                      isDarkMode ? 'text-purple-400' : 'text-blue-600'
                    }`}>
                      {index + 1}.
                    </span>
                    <span className={`flex-1 transition-colors duration-300 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      {file.filename}
                    </span>
                  </li>
                ))}
              </ul>
              <p className={`text-sm mb-4 transition-colors duration-300 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Upload 3–5 papers for better trend analysis
              </p>
              <div className="flex gap-3">
                <button
                  onClick={handleAddAnother}
                  className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                    isDarkMode
                      ? 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
                      : 'bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-300'
                  }`}
                >
                  Add Another Paper
                </button>
                <button
                  onClick={handleAnalyze}
                  disabled={uploadedFiles.length === 0}
                  className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                    uploadedFiles.length === 0
                      ? isDarkMode
                        ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : isDarkMode
                        ? 'bg-purple-600 hover:bg-purple-700 text-white'
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  Analyze Papers
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default Upload
