/**
 * API Utility
 * Centralized API configuration and helper functions
 */

import axios from 'axios'

// Get API URL from environment variable or use proxy for development
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api'

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 600000, // 10 minutes for analysis operations
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Don't set Content-Type for FormData - let browser set it with boundary
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type']
    }
    // Add any auth tokens here if needed in the future
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle common errors
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response
      console.error(`API Error ${status}:`, data)
      
      if (status === 404) {
        error.message = 'Resource not found'
      } else if (status === 500) {
        error.message = 'Server error. Please try again later.'
      } else if (status === 400) {
        error.message = data.detail || 'Invalid request'
      }
    } else if (error.request) {
      // Request made but no response
      error.message = 'Cannot connect to server. Please make sure the backend is running.'
    } else {
      // Something else happened
      error.message = error.message || 'An unexpected error occurred'
    }
    
    return Promise.reject(error)
  }
)

export default api

