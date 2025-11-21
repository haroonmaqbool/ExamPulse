/**
 * Upload Page
 * Page for uploading past exam papers
 */

import { useState } from 'react'
import FileUpload from '../components/FileUpload'
import axios from 'axios'

function Upload() {
  const [uploading, setUploading] = useState(false)
  const [uploadStatus, setUploadStatus] = useState(null)

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
    <div className="max-w-2xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold text-white mb-8 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
        Upload Exam Paper
      </h1>
      <FileUpload onFileSelect={handleFileSelect} />
      
      {uploading && (
        <div className="mt-4 text-center text-gray-400">Uploading...</div>
      )}
      
      {uploadStatus && (
        <div
          className={`mt-4 p-4 rounded-xl border ${
            uploadStatus.success
              ? 'bg-green-500/10 text-green-400 border-green-500/30'
              : 'bg-red-500/10 text-red-400 border-red-500/30'
          }`}
        >
          {uploadStatus.message}
        </div>
      )}
    </div>
  )
}

export default Upload

