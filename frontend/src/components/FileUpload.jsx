/**
 * FileUpload Component
 * Handles file upload for past exam papers (PDF or images)
 */

function FileUpload({ onFileSelect }) {
  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      onFileSelect(file)
    }
  }

  return (
    <div className="relative border-2 border-dashed border-white/20 rounded-2xl p-12 text-center bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl hover:border-purple-500/50 transition-all duration-300 group">
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
          <div className="absolute inset-0 bg-purple-500/20 blur-2xl rounded-full scale-150 group-hover:scale-175 transition-transform duration-300"></div>
          <svg
            className="relative w-16 h-16 text-purple-400 group-hover:text-purple-300 transition-colors duration-300"
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
        <span className="text-white font-semibold text-lg mb-2 group-hover:text-purple-300 transition-colors duration-300">
          Click to upload or drag and drop
        </span>
        <span className="text-gray-400 text-sm">
          PDF, PNG, JPG (MAX. 10MB)
        </span>
      </label>
    </div>
  )
}

export default FileUpload

