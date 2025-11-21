import { useState } from 'react';

export default function LandingPage() {
  const [isHovered, setIsHovered] = useState(null);

  const features = [
    {
      icon: "📊",
      title: "Smart Pattern Analysis",
      description: "AI analyzes 3-5 years of past papers to identify recurring exam patterns and high-probability topics."
    },
    {
      icon: "📝",
      title: "Expected Paper Generation",
      description: "Get AI-generated expected papers based on historical data and topic frequency analysis."
    },
    {
      icon: "🎯",
      title: "Personalized Study Plans",
      description: "Receive customized study plans that adapt to your strengths, weaknesses, and available time."
    },
    {
      icon: "📈",
      title: "Progress Tracking",
      description: "Monitor your study progress with detailed analytics and confidence scoring."
    },
    {
      icon: "🔍",
      title: "Weak Area Detection",
      description: "Automatically identify topics that need more attention based on your study logs."
    },
    {
      icon: "⚡",
      title: "Quick OCR Upload",
      description: "Upload past papers as PDFs or images and let AI extract questions instantly."
    }
  ];

  const stats = [
    { number: "5+", label: "Years Analyzed" },
    { number: "95%", label: "Accuracy Rate" },
    { number: "10K+", label: "Questions Processed" },
    { number: "24/7", label: "AI Assistant" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-green-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">EP</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                ExamPulse
              </span>
            </div>
            <div className="hidden md:flex space-x-8">
              <a href="#features" className="text-gray-700 hover:text-blue-600 transition">Features</a>
              <a href="#how-it-works" className="text-gray-700 hover:text-blue-600 transition">How It Works</a>
              <a href="#about" className="text-gray-700 hover:text-blue-600 transition">About</a>
            </div>
            <button className="bg-gradient-to-r from-blue-500 to-green-500 text-white px-6 py-2 rounded-lg font-semibold hover:shadow-lg transition transform hover:scale-105">
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="inline-block">
              <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold">
                🚀 AI-Powered Exam Preparation
              </span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
              Study <span className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">Smarter</span>,
              Not Harder
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              ExamPulse uses advanced AI to analyze past papers, predict exam patterns, and create personalized study plans tailored to your needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-gradient-to-r from-blue-500 to-green-500 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:shadow-xl transition transform hover:scale-105">
                Start Analyzing Papers
              </button>
              <button className="bg-white text-gray-700 px-8 py-4 rounded-lg font-semibold text-lg border-2 border-gray-200 hover:border-blue-500 transition">
                Watch Demo
              </button>
            </div>
            {/* Stats */}
            <div className="grid grid-cols-4 gap-4 pt-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{stat.number}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="relative bg-gradient-to-br from-blue-400 to-green-400 rounded-2xl p-8 shadow-2xl transform rotate-3 hover:rotate-0 transition duration-500">
              <div className="bg-white rounded-xl p-6 space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">🎯</span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Expected Paper Ready</div>
                    <div className="text-sm text-gray-500">20 high-priority questions</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Confidence Score</span>
                    <span className="font-semibold text-green-600">92%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full" style={{ width: '92%' }}></div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 pt-2">
                  <div className="bg-blue-50 p-3 rounded-lg text-center">
                    <div className="text-lg font-bold text-blue-600">15</div>
                    <div className="text-xs text-gray-600">Topics</div>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg text-center">
                    <div className="text-lg font-bold text-green-600">8</div>
                    <div className="text-xs text-gray-600">High Priority</div>
                  </div>
                  <div className="bg-purple-50 p-3 rounded-lg text-center">
                    <div className="text-lg font-bold text-purple-600">5</div>
                    <div className="text-xs text-gray-600">Papers</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Powerful Features for <span className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">Exam Success</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to ace your exams, powered by cutting-edge AI technology
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                onMouseEnter={() => setIsHovered(index)}
                onMouseLeave={() => setIsHovered(null)}
                className={`bg-gradient-to-br ${
                  isHovered === index ? 'from-blue-50 to-green-50' : 'from-gray-50 to-white'
                } p-6 rounded-xl border-2 ${
                  isHovered === index ? 'border-blue-300' : 'border-gray-200'
                } transition duration-300 hover:shadow-xl transform hover:-translate-y-2`}
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-gradient-to-br from-blue-50 to-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">Simple, fast, and effective</p>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: "1", title: "Upload Papers", desc: "Upload past exam papers as PDF or images", icon: "📤" },
              { step: "2", title: "AI Analysis", desc: "Our AI extracts and categorizes questions", icon: "🤖" },
              { step: "3", title: "Get Insights", desc: "Receive pattern analysis and expected papers", icon: "💡" },
              { step: "4", title: "Study Smart", desc: "Follow your personalized study plan", icon: "🎓" }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-green-500 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4 shadow-lg">
                  {item.icon}
                </div>
                <div className="bg-white rounded-lg p-6 shadow-md">
                  <div className="text-sm font-semibold text-blue-600 mb-2">STEP {item.step}</div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600 text-sm">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-green-600 py-20">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Transform Your Exam Preparation?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of students who are studying smarter with ExamPulse
          </p>
          <button className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:shadow-2xl transition transform hover:scale-105">
            Get Started Free
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-green-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">EP</span>
                </div>
                <span className="text-xl font-bold">ExamPulse</span>
              </div>
              <p className="text-gray-400">AI-powered exam preparation platform</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition">Features</a></li>
                <li><a href="#" className="hover:text-white transition">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition">Demo</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition">About</a></li>
                <li><a href="#" className="hover:text-white transition">Team</a></li>
                <li><a href="#" className="hover:text-white transition">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition">Terms</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>© 2025 ExamPulse. Built with ❤️ for students.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
