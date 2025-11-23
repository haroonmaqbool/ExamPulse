import { useState, useEffect, useRef } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { useTheme } from './ThemeContext'
import '../styles/markdown.css'

// Get API URL from environment variable or use proxy for development
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api'

const Chatbot = ({ isChatOpen, toggleChat }) => {
  const { theme } = useTheme()
  const isDarkMode = theme === 'dark'
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [userName, setUserName] = useState('')
  const [hasAskedName, setHasAskedName] = useState(false)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(scrollToBottom, [messages])

  // Ask for user's name when chat opens
  useEffect(() => {
    if (isChatOpen && !hasAskedName && messages.length === 0) {
      const welcomeMessage = {
        role: 'bot',
        text: "Hello! I'm ExamPulse Assistant, here to help you with your studies and exam preparation. What's your name?"
      }
      setMessages([welcomeMessage])
      setHasAskedName(true)
    }
  }, [isChatOpen, hasAskedName, messages.length])

  const sendMessage = async (e) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage = { role: 'user', text: input }
    setMessages((prev) => [...prev, userMessage])
    const currentInput = input
    setInput('')
    setIsLoading(true)

    // If user hasn't provided their name yet, save it
    if (!userName) {
      setUserName(currentInput)
    }

    try {
      // Add timeout to prevent hanging
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 60000) // 60 second timeout

      // Use API_BASE_URL from environment variable or proxy
      const chatbotUrl = `${API_BASE_URL}/chatbot/`
      
      const response = await fetch(chatbotUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: currentInput,
          userName: userName || currentInput
        }),
        signal: controller.signal
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        const errorText = await response.text()
        console.error('Server error:', response.status, errorText)
        throw new Error(`Server error: ${response.status}`)
      }

      const data = await response.json()

      if (!data || !data.response) {
        throw new Error('Invalid response from server')
      }

      const botMessage = {
        role: 'bot',
        text: data.response || "Sorry, I couldn't get a response."
      }
      setMessages((prev) => [...prev, botMessage])
    } catch (error) {
      console.error('Error fetching chatbot response:', error)
      
      let errorMessage = {
        role: 'bot',
        text: ''
      }

      if (error.name === 'AbortError') {
        errorMessage.text = 'The request took too long. The AI service might be slow. Please try again with a shorter question.'
      } else if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
        errorMessage.text = 'Cannot connect to the server. Please check your internet connection and try again.'
      } else if (error.message.includes('Server error')) {
        errorMessage.text = 'Server error occurred. Please check the backend logs and try again.'
      } else {
        errorMessage.text = 'Sorry, I am having trouble connecting. Please make sure the backend server is running and try again.'
      }

      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  if (!isChatOpen) return null

  return (
    <div className="fixed bottom-24 right-6 w-96 z-50">
      <div className={`backdrop-blur-md rounded-lg shadow-xl flex flex-col h-[60vh] transition-colors duration-500 ${
        isDarkMode
          ? 'bg-gray-800/90 border border-purple-500/30'
          : 'bg-white/95 border border-blue-400/40'
      }`}>
        <header className={`flex items-center justify-between p-4 border-b transition-colors duration-500 ${
          isDarkMode ? 'border-white/10' : 'border-gray-200'
        }`}>
          <h2 className={`text-lg font-bold transition-colors duration-500 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>ExamPulse Assistant</h2>
          <button onClick={toggleChat} className={`p-2 rounded-full transition-colors duration-300 ${
            isDarkMode
              ? 'text-gray-400 hover:bg-white/10 hover:text-white'
              : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
          }`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </header>

        <div className={`flex-1 p-4 overflow-y-auto chatbot-scrollbar ${
          isDarkMode ? 'chatbot-scrollbar-dark' : 'chatbot-scrollbar-light'
        }`}>
          <div className="space-y-4">
            {messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg transition-colors duration-300 ${
                  msg.role === 'user'
                    ? isDarkMode
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                      : 'bg-gradient-to-r from-blue-600 to-green-600 text-white'
                    : isDarkMode
                      ? 'bg-gray-700 text-gray-200'
                      : 'bg-gray-100 text-gray-900'
                }`}>
                  {msg.role === 'bot' ? (
                    <div className="markdown-content">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {msg.text}
                      </ReactMarkdown>
                    </div>
                  ) : (
                    <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg transition-colors duration-300 ${
                  isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
                }`}>
                  <div className="flex items-center space-x-2">
                    <div className={`h-2 w-2 rounded-full animate-pulse [animation-delay:-0.3s] ${
                      isDarkMode ? 'bg-purple-400' : 'bg-blue-500'
                    }`}></div>
                    <div className={`h-2 w-2 rounded-full animate-pulse [animation-delay:-0.15s] ${
                      isDarkMode ? 'bg-purple-400' : 'bg-blue-500'
                    }`}></div>
                    <div className={`h-2 w-2 rounded-full animate-pulse ${
                      isDarkMode ? 'bg-purple-400' : 'bg-blue-500'
                    }`}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        <form onSubmit={sendMessage} className={`p-4 border-t transition-colors duration-500 ${
          isDarkMode ? 'border-white/10' : 'border-gray-200'
        }`}>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything..."
              className={`flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-0 transition-colors duration-300 ${
                isDarkMode
                  ? 'bg-gray-700/50 border-transparent focus:border-purple-500 text-white placeholder-gray-400'
                  : 'bg-gray-50 border-gray-200 focus:border-blue-500 text-gray-900 placeholder-gray-500'
              }`}
            />
            <button
              type="submit"
              disabled={isLoading}
              className={`p-2 rounded-full text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 ${
                isDarkMode
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500'
                  : 'bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-500 hover:to-green-500'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Chatbot
