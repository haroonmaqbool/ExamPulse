import { useState, useEffect, useRef } from 'react'

const Chatbot = ({ isChatOpen, toggleChat }) => {
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
      const response = await fetch('http://localhost:8000/chatbot/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: currentInput,
          userName: userName || currentInput
        }),
      })

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`)
      }

      const data = await response.json()

      const botMessage = {
        role: 'bot',
        text: data.response || "Sorry, I couldn't get a response."
      }
      setMessages((prev) => [...prev, botMessage])
    } catch (error) {
      console.error('Error fetching chatbot response:', error)
      const errorMessage = {
        role: 'bot',
        text: 'Sorry, I am having trouble connecting. Please make sure the backend server is running and try again.'
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  if (!isChatOpen) return null

  return (
    <div className="fixed bottom-24 right-6 w-96 z-50">
      <div className="bg-gray-800/80 backdrop-blur-md border border-purple-500/30 rounded-lg shadow-xl flex flex-col h-[60vh]">
        <header className="flex items-center justify-between p-4 border-b border-white/10">
          <h2 className="text-lg font-bold text-white">ExamPulse Assistant</h2>
          <button onClick={toggleChat} className="p-2 rounded-full text-gray-400 hover:bg-white/10 hover:text-white transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </header>
        
        <div className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-4">
            {messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${msg.role === 'user' ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-200'}`}>
                  <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="max-w-xs lg:max-w-md px-4 py-2 rounded-lg bg-gray-700 text-gray-200">
                  <div className="flex items-center space-x-2">
                    <div className="h-2 w-2 bg-purple-400 rounded-full animate-pulse [animation-delay:-0.3s]"></div>
                    <div className="h-2 w-2 bg-purple-400 rounded-full animate-pulse [animation-delay:-0.15s]"></div>
                    <div className="h-2 w-2 bg-purple-400 rounded-full animate-pulse"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        <form onSubmit={sendMessage} className="p-4 border-t border-white/10">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything..."
              className="flex-1 bg-gray-700/50 border border-transparent focus:border-purple-500 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-0 transition-colors"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="p-2 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-500 hover:to-pink-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
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
