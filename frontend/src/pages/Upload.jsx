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
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Upload Exam Paper</h1>
      <FileUpload onFileSelect={handleFileSelect} />
      
      {uploading && (
        <div className="mt-4 text-center text-gray-600">Uploading...</div>
      )}
      
      {uploadStatus && (
        <div
          className={`mt-4 p-4 rounded ${
            uploadStatus.success
              ? 'bg-green-100 text-green-700'
              : 'bg-red-100 text-red-700'
          }`}
        >
          {uploadStatus.message}
        </div>
      )}
    </div>
  )
}

export default Upload

