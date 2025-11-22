/**
 * FileUpload Component
 * Handles file upload for past exam papers (PDF or images)
 */

import { useTheme } from './ThemeContext'

function FileUpload({ onFileSelect }) {
  const { theme } = useTheme()
  const isDarkMode = theme === 'dark'

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      onFileSelect(file)
    }
  }

  return (
    <div className={`relative border-2 border-dashed rounded-2xl p-12 text-center backdrop-blur-xl transition-all duration-300 group ${
      isDarkMode
        ? 'border-white/20 bg-gradient-to-br from-white/5 to-white/[0.02] hover:border-purple-500/50'
        : 'border-blue-400 bg-blue-50/40 hover:border-blue-500'
    }`}>
      <input
        type="file"
        accept=".pdf,.png,.jpg,.jpeg"
        onChange={handleFileChange}
        className="hidden"
        id="file-upload"
      />
      <label
        htmlFor="file-upload"
        className="cursor-pointer flex flex-col items-center"
      >
        <div className="relative mb-6">
          <div className={`absolute inset-0 blur-2xl rounded-full scale-150 group-hover:scale-175 transition-transform duration-300 ${
            isDarkMode
              ? 'bg-purple-500/20'
              : 'bg-blue-400/20'
          }`}></div>
          <svg
            className={`relative w-16 h-16 transition-colors duration-300 ${
              isDarkMode
                ? 'text-purple-400 group-hover:text-purple-300'
                : 'text-blue-500 group-hover:text-blue-600'
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
        </div>
        <span className={`font-semibold text-lg mb-2 transition-colors duration-300 ${
          isDarkMode
            ? 'text-white group-hover:text-purple-300'
            : 'text-gray-900 group-hover:text-blue-600'
        }`}>
          Click to upload or drag and drop
        </span>
        <span className={`text-sm ${
          isDarkMode ? 'text-gray-400' : 'text-gray-700'
        }`}>
          PDF, PNG, JPG (MAX. 10MB)
        </span>
      </label>
    </div>
  )
}

export default FileUpload

