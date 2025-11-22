import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../components/ThemeContext';
import { Link } from 'react-router-dom';
import ShaderBackground from '../components/ShaderBackground';
import { TestimonialsColumn } from '../components/TestimonialsColumn';
import { ThemeToggle } from '../components/ThemeToggle';
import Logo from '../components/Logo';
import { Target, BarChart3, Rocket, Upload, Brain, TrendingUp, HelpCircle } from 'lucide-react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import FAQ from '../components/FAQ';

// Number counter hook
function useCounter(end, duration = 2000, startOnView = false) {
  const [count, setCount] = useState(startOnView ? 0 : end);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (!startOnView || inView) {
      let startTime = null;
      const endStr = end.toString();
      const isPercentage = endStr.includes('%');
      const isFraction = endStr.includes('/');
      const hasKPlus = endStr.includes('K+');
      const hasPlus = endStr.includes('+') && !hasKPlus;
      
      let numericEnd = 0;
      let suffix = '';
      
      if (isFraction) {
        const [num, den] = endStr.split('/');
        numericEnd = parseFloat(num);
        suffix = '/' + den;
      } else if (isPercentage) {
        numericEnd = parseFloat(endStr.replace('%', ''));
        suffix = '%';
      } else if (hasKPlus) {
        numericEnd = parseFloat(endStr.replace('K+', '')) * 1000;
        suffix = 'K+';
      } else if (hasPlus) {
        numericEnd = parseFloat(endStr.replace('+', ''));
        suffix = '+';
      } else {
        numericEnd = parseFloat(endStr) || 0;
      }

      const animate = (timestamp) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const current = easeOutQuart * numericEnd;
        
        if (isFraction) {
          setCount(Math.floor(current) + suffix);
        } else if (hasKPlus) {
          setCount(Math.floor(current / 1000) + suffix);
        } else {
          setCount(Math.floor(current) + suffix);
        }

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setCount(end);
        }
      };

      requestAnimationFrame(animate);
    }
  }, [end, duration, inView, startOnView]);

  return [count, ref];
}

export default function LandingPage() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';
  const [scrollY, setScrollY] = useState(0);
  const [activeFeature, setActiveFeature] = useState(0);
  const [showHelpFAQ, setShowHelpFAQ] = useState(false);
  const heroRef = useRef(null);
  const testimonialsRef = useRef(null);
  const statsRef = useRef(null);
  const testimonialsInView = useInView(testimonialsRef, { once: true, margin: "-100px" });
  const statsInView = useInView(statsRef, { once: true, margin: "-100px" });

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 3);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: Target,
      title: "AI Pattern Recognition",
      description: "Analyzes 5+ years of exam papers to identify recurring patterns and high-probability topics.",
      stat: "95%",
      statLabel: "Accuracy"
    },
    {
      icon: BarChart3,
      title: "Smart Analytics",
      description: "Real-time insights into topic frequencies, question types, and difficulty levels with visualizations.",
      stat: "10K+",
      statLabel: "Questions"
    },
    {
      icon: Rocket,
      title: "Personalized Plans",
      description: "AI-generated study plans that adapt to your learning pace, strengths, and exam timeline.",
      stat: "24/7",
      statLabel: "AI Support"
    }
  ];

  const testimonials = [
    { 
      name: "Sarah M.", 
      role: "Medical Student", 
      text: "ExamPulse helped me ace my finals. The AI predictions were spot-on! I went from struggling to top of my class.", 
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
      rating: 5 
    },
    { 
      name: "Ahmed K.", 
      role: "Engineering Student", 
      text: "Best study tool I've ever used. Saved me countless hours of guesswork. The pattern analysis is mind-blowing!", 
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ahmed",
      rating: 5 
    },
    { 
      name: "Lisa P.", 
      role: "Law Student", 
      text: "The pattern analysis is incredible. Highly recommend to anyone serious about their exams!", 
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa",
      rating: 4 
    },
    { 
      name: "Marcus T.", 
      role: "Business Student", 
      text: "Game changer! The AI predicted 80% of my exam questions. Worth every penny.", 
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus",
      rating: 5 
    },
    { 
      name: "Priya S.", 
      role: "Computer Science", 
      text: "As a CS student, I appreciate the tech behind this. The AI predictions are incredibly accurate!", 
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya",
      rating: 4 
    },
    { 
      name: "David L.", 
      role: "Medical Student", 
      text: "Reduced my study time by 40% while improving my grades. This is the future of learning.", 
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
      rating: 5 
    }
  ];

  const testimonialsColumn1 = testimonials.slice(0, 3);
  const testimonialsColumn2 = testimonials.slice(3, 6);

  return (
    <div className={`min-h-screen relative overflow-hidden ${isDark ? '' : 'bg-gradient-to-br from-blue-50 via-white to-green-50'}`}>
      {isDark && <ShaderBackground />}
      
      {/* Sticky Top Bar CTA */}
      {scrollY > 300 && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className={`fixed top-20 left-0 right-0 z-40 backdrop-blur-2xl border-b ${
            isDark 
              ? 'bg-black/90 border-white/10' 
              : 'bg-white/95 border-gray-200 shadow-sm'
          }`}
          style={isDark ? { 
            boxShadow: '0 1px 0 0 rgba(255,255,255,0.05), 0 4px 12px 0 rgba(0,0,0,0.5)'
          } : {}}
        >
          <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-center sm:justify-between">
            <div className="hidden sm:flex items-center gap-2.5">
              <span className={`text-[13px] font-semibold tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Limited time
              </span>
              <span className="text-gray-600">—</span>
              <span className={`text-[13px] font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Get AI predictions free
              </span>
            </div>
            <Link
              to="/home"
              className={`group inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-[13px] font-semibold tracking-tight transition-all duration-200 ease-out shadow-lg ${
                isDark
                  ? 'bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-400 hover:to-purple-500 text-white shadow-purple-500/30'
                  : 'bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-500 hover:to-green-500 text-white shadow-blue-500/30'
              }`}
            >
              <span>Try free</span>
              <svg className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </motion.div>
      )}

      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrollY > 50
          ? isDark
            ? 'bg-black/80 backdrop-blur-2xl border-b border-white/10 shadow-2xl'
            : 'bg-white/90 backdrop-blur-2xl border-b border-gray-200 shadow-lg'
          : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Logo />

            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className={`font-medium transition-colors duration-300 relative group ${
                isDark ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-blue-600'
              }`}>
                Features
                <span className={`absolute -bottom-1 left-0 w-0 h-0.5 group-hover:w-full transition-all duration-300 ${
                  isDark ? 'bg-gradient-to-r from-purple-500 to-pink-500' : 'bg-gradient-to-r from-blue-600 to-green-600'
                }`}></span>
              </a>
              <a href="#how-it-works" className={`font-medium transition-colors duration-300 relative group ${
                isDark ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-blue-600'
              }`}>
                How It Works
                <span className={`absolute -bottom-1 left-0 w-0 h-0.5 group-hover:w-full transition-all duration-300 ${
                  isDark ? 'bg-gradient-to-r from-purple-500 to-pink-500' : 'bg-gradient-to-r from-blue-600 to-green-600'
                }`}></span>
              </a>
              <a href="#testimonials" className={`font-medium transition-colors duration-300 relative group ${
                isDark ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-blue-600'
              }`}>
                Testimonials
                <span className={`absolute -bottom-1 left-0 w-0 h-0.5 group-hover:w-full transition-all duration-300 ${
                  isDark ? 'bg-gradient-to-r from-purple-500 to-pink-500' : 'bg-gradient-to-r from-blue-600 to-green-600'
                }`}></span>
              </a>
            </div>

            <div className="flex items-center">
              <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section ref={heroRef} className="relative z-10 min-h-screen flex items-center justify-center px-6 lg:px-8 pt-20 pb-16">
        <div className="max-w-6xl mx-auto w-full">
          <div className="text-center space-y-6">
            <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black leading-[1.1] tracking-tight">
              <span className={`block ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Know What's Coming
              </span>
              <span className="block">
                <span className={`bg-clip-text text-transparent ${
                  isDark
                    ? 'bg-gradient-to-r from-purple-400 via-purple-300 to-purple-400'
                    : 'bg-gradient-to-r from-blue-600 via-blue-500 to-green-600'
                }`}>
                  Before the Exam Does
                </span>
              </span>
            </h1>

            <p className={`text-base sm:text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-light px-4 ${
              isDark ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Upload your papers. Get instant patterns, predictions, and a study plan built for you.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-2 px-4">
              <Link
                to="/home"
                className={`group w-full sm:w-auto px-8 sm:px-10 py-4 sm:py-5 rounded-lg sm:rounded-xl font-black text-base sm:text-lg text-white border shadow-md transform hover:scale-[1.03] transition-all duration-300 ${
                  isDark
                    ? 'bg-gradient-to-r from-purple-500 to-purple-400 hover:from-purple-400 hover:to-purple-300 border-purple-300/40 shadow-purple-400/20 hover:shadow-lg hover:shadow-purple-400/40'
                    : 'bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-500 hover:to-green-500 border-blue-400/40 shadow-blue-400/30 hover:shadow-lg hover:shadow-blue-400/50'
                }`}
              >
                <span className="flex items-center justify-center gap-2 sm:gap-2.5">
                  Get Predictions Now
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </Link>
              
              <a
                href="#features"
                className={`w-full sm:w-auto px-8 sm:px-10 py-4 sm:py-5 rounded-lg sm:rounded-xl font-extrabold text-base sm:text-lg transform hover:scale-[1.03] transition-all duration-300 text-center ${
                  isDark
                    ? 'bg-white/5 backdrop-blur-xl border border-white/15 text-white hover:bg-white/8 hover:border-white/25 hover:shadow-lg hover:shadow-white/10'
                    : 'bg-white border-2 border-gray-200 text-gray-900 hover:bg-gray-50 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-100'
                }`}
              >
                See How It Works
              </a>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-5 pt-6">
              <div className={`flex items-center gap-3 px-4 py-2 rounded-full border ${
                isDark
                  ? 'bg-white/5 border-white/10'
                  : 'bg-white border-gray-200 shadow-sm'
              }`}>
                <div className="flex -space-x-3">
                  {[
                    "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
                    "https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka",
                    "https://api.dicebear.com/7.x/avataaars/svg?seed=Jasmine",
                    "https://api.dicebear.com/7.x/avataaars/svg?seed=Oliver"
                  ].map((src, i) => (
                    <img key={i} src={src} alt="" className={`w-8 h-8 rounded-full border-2 ${
                      isDark ? 'border-black' : 'border-white'
                    }`} />
                  ))}
                </div>
                <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  1,000+ students
                </span>
              </div>
              <div className={`flex items-center gap-2 px-4 py-2 rounded-full border ${
                isDark
                  ? 'bg-white/5 border-white/10'
                  : 'bg-white border-gray-200 shadow-sm'
              }`}>
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  4.9 out of 5
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 py-16 px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className={`inline-block px-4 py-2 rounded-full border mb-6 ${
              isDark
                ? 'bg-purple-500/10 border-purple-500/30'
                : 'bg-blue-50 border-blue-200'
            }`}>
              <span className={`text-sm font-semibold uppercase tracking-wide ${
                isDark ? 'text-purple-300' : 'text-blue-700'
              }`}>
                Features
              </span>
            </div>
            <h2 className={`text-3xl sm:text-4xl md:text-5xl font-black mb-4 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              Everything You Need to
              <span className={`block bg-clip-text text-transparent ${
                isDark
                  ? 'bg-gradient-to-r from-purple-400 to-pink-400'
                  : 'bg-gradient-to-r from-blue-600 to-green-600'
              }`}>
                Excel in Your Exams
              </span>
            </h2>
            <p className={`text-base sm:text-lg max-w-2xl mx-auto font-light px-4 ${
              isDark ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Advanced AI technology that analyzes patterns across thousands of exam papers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -4 }}
                className={`group relative p-6 rounded-2xl border transition-all duration-300 cursor-pointer ${
                  isDark
                    ? 'bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border-white/10 hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/30'
                    : 'bg-white border-gray-200 hover:border-blue-400 hover:shadow-lg hover:shadow-blue-200/50'
                } ${
                  activeFeature === index 
                    ? isDark
                      ? 'ring-2 ring-purple-500/50 shadow-[0_0_50px_rgba(168,85,247,0.3)]'
                      : 'ring-2 ring-blue-500/50 shadow-[0_0_30px_rgba(59,130,246,0.3)]'
                    : ''
                }`}
                onMouseEnter={() => setActiveFeature(index)}
              >
                <div className={`absolute inset-0 rounded-2xl transition-all duration-300 ${
                  isDark
                    ? 'bg-gradient-to-br from-purple-600/0 to-pink-600/0 group-hover:from-purple-600/10 group-hover:to-pink-600/10'
                    : 'bg-gradient-to-br from-blue-600/0 to-green-600/0 group-hover:from-blue-600/5 group-hover:to-green-600/5'
                }`}></div>
                
                <div className="relative z-10">
                  <div className={`w-16 h-16 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-2xl ${
                    isDark
                      ? 'bg-gradient-to-br from-purple-600 to-pink-600'
                      : 'bg-gradient-to-br from-blue-600 to-green-600'
                  }`}>
                    <feature.icon className="w-8 h-8 text-white" strokeWidth={2.5} />
                  </div>

                  <h3 className={`text-xl font-black mb-3 transition-colors duration-300 ${
                    isDark
                      ? 'text-white group-hover:text-purple-300'
                      : 'text-gray-900 group-hover:text-blue-600'
                  }`}>
                    {feature.title}
                  </h3>
                  <p className={`leading-relaxed mb-6 text-sm transition-colors duration-300 ${
                    isDark
                      ? 'text-gray-400 group-hover:text-gray-300'
                      : 'text-gray-600 group-hover:text-gray-700'
                  }`}>
                    {feature.description}
                  </p>

                  <div className={`flex items-center justify-center gap-3 px-6 py-4 h-20 rounded-xl border backdrop-blur-sm ${
                    isDark
                      ? 'bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-purple-500/30'
                      : 'bg-gradient-to-br from-blue-50 to-green-50 border-blue-200'
                  }`}>
                    <span className={`text-4xl font-black bg-clip-text text-transparent ${
                      isDark
                        ? 'bg-gradient-to-r from-purple-400 to-pink-400'
                        : 'bg-gradient-to-r from-blue-600 to-green-600'
                    }`}>
                      {feature.stat}
                    </span>
                    <span className={`text-sm font-bold uppercase tracking-wide whitespace-nowrap ${
                      isDark ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      {feature.statLabel}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Before/After Section */}
      <section className="relative z-10 py-16 px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className={`text-3xl sm:text-4xl md:text-5xl font-black mb-4 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              The Difference is Clear
            </h2>
            <p className={`text-base sm:text-lg font-light px-4 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              See how ExamPulse transforms your study experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {/* Before */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6 }}
              className={`p-8 rounded-2xl border-2 backdrop-blur-xl ${
                isDark
                  ? 'bg-gradient-to-br from-red-500/10 to-red-600/5 border-red-500/30'
                  : 'bg-gradient-to-br from-red-50 to-red-100/50 border-red-300'
              }`}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  isDark ? 'bg-red-500/20' : 'bg-red-200'
                }`}>
                  <svg className={`w-7 h-7 ${isDark ? 'text-red-400' : 'text-red-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <h3 className={`text-2xl font-black ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Before ExamPulse
                </h3>
              </div>
              
              <div className="space-y-4">
                {[
                  "Hours wasted guessing",
                  "No idea which topics repeat",
                  "Stress, randomness, uncertainty",
                  "Studying everything equally"
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center mt-0.5 ${
                      isDark ? 'bg-red-500/20' : 'bg-red-200'
                    }`}>
                      <svg className={`w-4 h-4 ${isDark ? 'text-red-400' : 'text-red-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </div>
                    <span className={`text-base leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* After */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6 }}
              className={`p-8 rounded-2xl border-2 backdrop-blur-xl relative overflow-hidden ${
                isDark
                  ? 'bg-gradient-to-br from-green-500/10 to-emerald-600/5 border-green-500/30'
                  : 'bg-gradient-to-br from-green-50 to-emerald-100/50 border-green-300'
              }`}
            >
              <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl ${
                isDark ? 'bg-green-500/10' : 'bg-green-200/50'
              }`}></div>
              
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    isDark ? 'bg-green-500/20' : 'bg-green-200'
                  }`}>
                    <svg className={`w-7 h-7 ${isDark ? 'text-green-400' : 'text-green-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className={`text-2xl font-black ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    After ExamPulse
                  </h3>
                </div>
                
                <div className="space-y-4">
                  {[
                    "Instant patterns",
                    "AI-predicted questions",
                    "Personalized plan",
                    "Better marks with less studying"
                  ].map((item, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center mt-0.5 ${
                        isDark ? 'bg-green-500/20' : 'bg-green-200'
                      }`}>
                        <svg className={`w-4 h-4 ${isDark ? 'text-green-400' : 'text-green-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className={`text-base leading-relaxed font-medium ${
                        isDark ? 'text-gray-100' : 'text-gray-800'
                      }`}>
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="relative z-10 py-16 px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className={`text-3xl sm:text-4xl md:text-5xl font-black mb-4 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              Simple. Fast. Effective.
            </h2>
            <p className={`text-base sm:text-lg font-light px-4 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              Get started in minutes, see results in days
            </p>
          </div>

          <div className="space-y-8">
            {[
              { num: "01", title: "Upload Past Papers", desc: "Drop your PDF or image files. Our OCR extracts every question instantly.", icon: Upload },
              { num: "02", title: "AI Analysis", desc: "AI identifies patterns, topics, and question types across years of past papers.", icon: Brain },
              { num: "03", title: "Get Predictions", desc: "Receive AI-generated expected papers with confidence scores.", icon: Target },
              { num: "04", title: "Study Smart", desc: "Follow your personalized plan and track progress in real-time.", icon: TrendingUp }
            ].map((step, index) => {
              const IconComponent = step.icon;
              return (
                <div key={index} className="flex gap-6 items-start group">
                  <div className="flex-shrink-0">
                    <div className={`w-16 h-16 rounded-xl flex items-center justify-center shadow-2xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 ${
                      isDark
                        ? 'bg-gradient-to-br from-purple-600 to-pink-600'
                        : 'bg-gradient-to-br from-blue-600 to-green-600'
                    }`}>
                      <IconComponent className="w-8 h-8 text-white" strokeWidth={2} />
                    </div>
                  </div>
                  <div className="flex-1 pt-1">
                    <div className={`text-xs font-bold mb-1.5 ${
                      isDark ? 'text-purple-400' : 'text-blue-600'
                    }`}>
                      {step.num}
                    </div>
                    <h3 className={`text-2xl font-black mb-2 transition-colors duration-300 ${
                      isDark
                        ? 'text-white group-hover:text-purple-300'
                        : 'text-gray-900 group-hover:text-blue-600'
                    }`}>
                      {step.title}
                    </h3>
                    <p className={`text-base transition-colors duration-300 ${
                      isDark
                        ? 'text-gray-400 group-hover:text-gray-300'
                        : 'text-gray-600 group-hover:text-gray-700'
                    }`}>
                      {step.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" ref={testimonialsRef} className="relative z-10 py-16 px-6 lg:px-8 overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={testimonialsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <div className={`inline-block px-4 py-2 rounded-full border mb-4 ${
              isDark
                ? 'bg-purple-500/10 border-purple-500/30'
                : 'bg-blue-50 border-blue-200'
            }`}>
              <span className={`text-sm font-semibold uppercase tracking-wide ${
                isDark ? 'text-purple-300' : 'text-blue-700'
              }`}>
                Testimonials
              </span>
            </div>
            <h2 className={`text-4xl md:text-5xl font-black mb-4 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              Loved by Students
              <span className={`block bg-clip-text text-transparent ${
                isDark
                  ? 'bg-gradient-to-r from-purple-400 to-pink-400'
                  : 'bg-gradient-to-r from-blue-600 to-green-600'
              }`}>
                Worldwide
              </span>
            </h2>
            <p className={`text-lg max-w-2xl mx-auto font-light ${
              isDark ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Join thousands who aced their exams with ExamPulse
            </p>
          </motion.div>

          <div className="flex justify-center gap-5 max-h-[600px] overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_10%,black_90%,transparent)]">
            <TestimonialsColumn 
              testimonials={testimonialsColumn1} 
              duration={15}
              className="hidden md:block"
            />
            <TestimonialsColumn 
              testimonials={testimonialsColumn2} 
              duration={19}
              className="hidden md:block"
            />
            <TestimonialsColumn 
              testimonials={testimonials} 
              duration={17}
              className="md:hidden"
            />
          </div>

          <div ref={statsRef} className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {[
              { value: "1000+", label: "Active Students" },
              { value: "50K+", label: "Questions Analyzed" },
              { value: "95%", label: "Success Rate" },
              { value: "4.9/5", label: "Average Rating" }
            ].map((stat, index) => {
              const [count, countRef] = useCounter(stat.value, 2000, true);
              return (
                <motion.div 
                  key={index} 
                  ref={countRef}
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={statsInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className={`text-4xl font-black bg-clip-text text-transparent mb-2 ${
                    isDark
                      ? 'bg-gradient-to-r from-purple-400 to-pink-400'
                      : 'bg-gradient-to-r from-blue-600 to-green-600'
                  }`}>
                    {count}
                  </div>
                  <div className={`text-sm font-medium ${
                    isDark ? 'text-gray-500' : 'text-gray-600'
                  }`}>
                    {stat.label}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-24 px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Subtle glow background */}
            <div className={`absolute inset-0 rounded-3xl blur-3xl ${
              isDark
                ? 'bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-purple-600/20'
                : 'bg-gradient-to-r from-blue-200/40 via-green-200/40 to-blue-200/40'
            }`}></div>
            
            {/* Main card */}
            <div className={`relative overflow-hidden rounded-3xl backdrop-blur-xl border ${
              isDark
                ? 'bg-gradient-to-br from-white/[0.07] to-white/[0.02] border-white/10'
                : 'bg-white border-gray-200 shadow-xl'
            }`}>
              {/* Subtle decorative gradient */}
              <div className={`absolute inset-0 ${
                isDark
                  ? 'bg-gradient-to-br from-purple-500/5 via-transparent to-pink-500/5'
                  : 'bg-gradient-to-br from-blue-50/50 via-transparent to-green-50/50'
              }`}></div>
              
              <div className="relative z-10 px-8 py-16 md:px-12 md:py-20 text-center">
                {/* Urgency Badge */}
                <motion.div 
                  initial={{ scale: 0.95, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3 }}
                  className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border mb-8 ${
                    isDark
                      ? 'bg-red-500/10 border-red-500/20'
                      : 'bg-red-50 border-red-200'
                  }`}
                >
                  <div className="relative flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping absolute"></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                  </div>
                  <span className={`text-[11px] font-bold uppercase tracking-wider ${
                    isDark ? 'text-red-400' : 'text-red-600'
                  }`}>
                    Time Sensitive
                  </span>
                </motion.div>

                {/* Headline */}
                <h2 className={`text-4xl md:text-5xl lg:text-6xl font-black mb-5 leading-[1.1] tracking-tight ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  Your Next Exam Is Closer
                  <span className={`block mt-2 bg-clip-text text-transparent ${
                    isDark
                      ? 'bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400'
                      : 'bg-gradient-to-r from-blue-600 via-green-600 to-blue-600'
                  }`}>
                    Than You Think
                  </span>
                </h2>
                
                {/* Subheadline */}
                <p className={`text-lg md:text-xl font-semibold mb-3 tracking-tight ${
                  isDark ? 'text-white/80' : 'text-gray-800'
                }`}>
                  Start Preparing Smarter.
                </p>
                
                <p className={`text-base mb-10 max-w-xl mx-auto font-light leading-relaxed ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Join 1,000+ students who stopped guessing and started winning
                </p>

                {/* CTA Button */}
                <div className="flex flex-col items-center gap-3">
                  <Link
                    to="/home"
                    className={`group inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl font-bold text-base hover:scale-[1.02] transform transition-all duration-200 shadow-xl ${
                      isDark
                        ? 'bg-white hover:bg-gray-50 text-black shadow-black/20'
                        : 'bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-500 hover:to-green-500 text-white shadow-blue-500/30'
                    }`}
                  >
                    Get Started Now
                    <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </Link>
                  
                  {/* Trust indicator */}
                  <div className={`flex items-center gap-1.5 text-[13px] ${
                    isDark ? 'text-gray-500' : 'text-gray-600'
                  }`}>
                    <svg className="w-3.5 h-3.5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="font-medium">No credit card required</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section with Modal */}
      <AnimatePresence>
        {showHelpFAQ && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowHelpFAQ(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className={`max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl max-w-2xl w-full ${
                isDark
                  ? 'bg-gradient-to-br from-white/[0.07] to-white/[0.02] border border-white/10'
                  : 'bg-white border border-gray-200'
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className={`sticky top-0 flex items-center justify-between p-6 border-b backdrop-blur-xl ${
                isDark
                  ? 'bg-white/5 border-white/10'
                  : 'bg-white border-gray-200'
              }`}>
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-lg ${
                    isDark
                      ? 'bg-purple-500/20'
                      : 'bg-blue-100'
                  }`}>
                    <HelpCircle size={24} className={isDark ? 'text-purple-400' : 'text-blue-600'} />
                  </div>
                  <h3 className={`text-2xl font-black ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Help Center
                  </h3>
                </div>
                <button
                  onClick={() => setShowHelpFAQ(false)}
                  className={`p-2 rounded-lg transition-colors duration-300 ${
                    isDark
                      ? 'hover:bg-white/10 text-gray-400'
                      : 'hover:bg-gray-100 text-gray-600'
                  }`}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Modal Content - FAQ Component */}
              <div className="p-6">
                <FAQ isDark={isDark} />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Help Button */}
      <motion.button
        onClick={() => setShowHelpFAQ(true)}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className={`fixed bottom-8 right-8 z-40 p-4 rounded-full shadow-2xl transition-all duration-300 group ${
          isDark
            ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 shadow-purple-500/30'
            : 'bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-500 hover:to-green-500 shadow-blue-500/30'
        }`}
      >
        <HelpCircle size={24} className="text-white" strokeWidth={2.5} />
        <span className={`absolute -top-12 right-0 px-3 py-2 rounded-lg text-sm font-semibold text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none ${
          isDark ? 'bg-gray-900' : 'bg-gray-800'
        }`}>
          Need Help?
        </span>
      </motion.button>

      {/* FAQ Section */}
      <section className={`relative z-10 py-16 px-6 lg:px-8 border-t ${
        isDark
          ? 'border-white/10 bg-gradient-to-b from-transparent via-purple-900/10 to-transparent'
          : 'border-gray-200 bg-gradient-to-b from-transparent via-blue-50/30 to-transparent'
      }`}>
        <FAQ isDark={isDark} />
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-16 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Logo and tagline */}
          <div className="flex flex-col items-center text-center mb-10">
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-lg ${
                isDark
                  ? 'bg-gradient-to-br from-purple-500 to-pink-500 shadow-purple-500/30'
                  : 'bg-gradient-to-br from-blue-600 to-green-600 shadow-blue-500/30'
              }`}>
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className={`text-xl font-black ${isDark ? 'text-white' : 'text-gray-900'}`}>
                ExamPulse
              </span>
            </div>
            <p className={`text-sm max-w-md ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>
              AI-powered exam preparation platform helping students ace their exams
            </p>
          </div>

          {/* Copyright */}
          <div className="text-center mb-6">
            <p className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>
              © 2025 ExamPulse. All rights reserved.
            </p>
          </div>

          {/* Hackathon credit */}
          <div className="flex flex-col items-center gap-3">
            <p className={`text-xs font-medium ${isDark ? 'text-gray-600' : 'text-gray-500'}`}>
              Developed during the HEC Generative AI Training Hackathon by:
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2 text-sm">
              {['Haroon', 'Azmeer', 'Saria', 'Soban', 'Basima', 'Mubashar'].map((name, index, array) => (
                <React.Fragment key={name}>
                  <span className={`font-medium transition-colors duration-200 ${
                    isDark
                      ? 'text-gray-400 hover:text-purple-400'
                      : 'text-gray-600 hover:text-blue-600'
                  }`}>
                    {name}
                  </span>
                  {index < array.length - 1 && (
                    <span className={isDark ? 'text-gray-700' : 'text-gray-400'}>·</span>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}