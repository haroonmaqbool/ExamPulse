/**
 * Home Page
 * Award-winning dark AI-style landing page for ExamPulse
 */

import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'

function Home() {
  const currentYear = new Date().getFullYear()
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <div className="min-h-screen bg-[#0a0a0a] relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="fixed inset-0 bg-gradient-to-br from-purple-900/20 via-black to-pink-900/20" />
      <div className="fixed inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/30 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-600/30 rounded-full blur-[120px] animate-pulse delay-700" />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] animate-pulse delay-1000" />
      </div>

      {/* Grid pattern overlay */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]" />

      <main className="relative z-10">
        {/* Hero section */}
        <section className="relative pt-32 sm:pt-40 pb-24 px-6 sm:px-8 lg:px-12">
          <div className={`max-w-5xl mx-auto text-center transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            {/* Floating badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-600/10 to-pink-600/10 border border-purple-500/20 backdrop-blur-xl mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
              </span>
              <span className="text-sm font-medium bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Powered by AI
              </span>
            </div>

            {/* Main heading with animated gradient */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight mb-6">
              <span className="block bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
                Welcome to
              </span>
              <span className="block mt-2 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-500 bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
                ExamPulse
              </span>
            </h1>

            <p className="mt-6 text-xl sm:text-2xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
              AI-powered exam preparation platform
            </p>

            {/* CTA Buttons with premium styling */}
            <div className="mt-12 flex flex-wrap justify-center gap-4">
              <Link
                to="/upload"
                className="group relative px-8 py-4 rounded-xl font-semibold text-white overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(168,85,247,0.4)]"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600" />
                <span className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="relative flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  Upload Exam Paper
                </span>
              </Link>

              <Link
                to="/smart-plan"
                className="group relative px-8 py-4 rounded-xl font-semibold text-white border border-purple-500/30 overflow-hidden transition-all duration-300 hover:scale-105 hover:border-purple-500/60 hover:shadow-[0_0_40px_rgba(168,85,247,0.2)]"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-pink-600/10" />
                <span className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="relative flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  View Smart Plan
                </span>
              </Link>
            </div>

            {/* Supporting text with glow effect */}
            <p className="mt-8 text-sm sm:text-base text-gray-500 max-w-2xl mx-auto">
              Start by uploading <span className="text-purple-400 font-medium">3–5 years</span> of past papers or jump directly to your <span className="text-pink-400 font-medium">AI-generated</span> Smart Plan.
            </p>
          </div>
        </section>

        {/* Feature cards with glassmorphism */}
        <section className={`pb-24 px-6 sm:px-8 lg:px-12 transition-all duration-1000 delay-300 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="group relative bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl rounded-2xl border border-white/10 p-8 hover:border-purple-500/30 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_0_50px_rgba(168,85,247,0.15)]">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/0 to-purple-600/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600/20 to-pink-600/20 border border-purple-500/30 flex items-center justify-center text-lg font-bold text-purple-400 mb-6 group-hover:scale-110 transition-transform duration-300">
                  1
                </div>
                
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-purple-300 transition-colors duration-300">
                  Upload Past Papers
                </h3>
                
                <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                  Upload past exam papers in PDF or image format for comprehensive AI-powered analysis
                </p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="group relative bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl rounded-2xl border border-white/10 p-8 hover:border-pink-500/30 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_0_50px_rgba(236,72,153,0.15)]">
              <div className="absolute inset-0 bg-gradient-to-br from-pink-600/0 to-pink-600/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-600/20 to-purple-600/20 border border-pink-500/30 flex items-center justify-center text-lg font-bold text-pink-400 mb-6 group-hover:scale-110 transition-transform duration-300">
                  2
                </div>
                
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-pink-300 transition-colors duration-300">
                  See Exam Patterns
                </h3>
                
                <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                  Get AI-powered insights on topics, frequencies, and recurring patterns in your exams
                </p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="group relative bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl rounded-2xl border border-white/10 p-8 hover:border-purple-500/30 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_0_50px_rgba(168,85,247,0.15)]">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/0 to-pink-600/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600/20 to-pink-600/20 border border-purple-500/30 flex items-center justify-center text-lg font-bold text-purple-400 mb-6 group-hover:scale-110 transition-transform duration-300">
                  3
                </div>
                
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-purple-300 transition-colors duration-300">
                  Get Smart Study Plans
                </h3>
                
                <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                  Receive personalized AI study plans based on your progress and identified weaknesses
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="relative border-t border-white/5 py-8 px-6">
          <div className="max-w-6xl mx-auto text-center">
            <p className="text-sm text-gray-600">
              © {currentYear} <span className="text-purple-400 font-medium">ExamPulse</span>. All rights reserved.
            </p>
          </div>
        </footer>
      </main>
    </div>
  )
}

export default Home

