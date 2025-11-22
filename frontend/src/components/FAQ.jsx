import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

export default function FAQ({ isDark }) {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "What is ExamPulse?",
      answer: "ExamPulse is an AI-powered exam preparation platform that analyzes past exam papers to identify patterns, predict likely questions, and generate personalized study plans to help you ace your exams."
    },
    {
      question: "How does the AI prediction work?",
      answer: "Our AI analyzes 5+ years of past exam papers to identify recurring topics, question types, and patterns. It then uses this analysis to predict which topics are most likely to appear in your next exam with 95% accuracy."
    },
    {
      question: "What file formats do you support?",
      answer: "We support PDF files and image formats (JPG, PNG) for uploading past exam papers. Our OCR technology extracts questions from both formats automatically."
    },
    {
      question: "How long does analysis take?",
      answer: "Typically, file analysis completes within 1-2 minutes depending on the file size. You'll see real-time updates as we extract questions and analyze patterns."
    },
    {
      question: "Can I upload multiple papers?",
      answer: "Yes! You can upload multiple exam papers and our system will aggregate the analysis across all papers to give you comprehensive insights about question patterns and topic frequencies."
    },
    {
      question: "What is the Smart Study Plan?",
      answer: "The Smart Study Plan is an AI-generated personalized study guide based on your uploaded papers and study logs. It prioritizes topics with highest exam probability and adapts to your learning pace."
    },
    {
      question: "How do Study Logs work?",
      answer: "Study Logs let you track your learning progress by recording topics you've studied, difficulty levels, and hours spent. This data helps the AI create more personalized study recommendations."
    },
    {
      question: "Is my data secure?",
      answer: "Yes, your data is encrypted and stored securely on Supabase. We never share your study materials or analysis with third parties. Your privacy is our top priority."
    },
    {
      question: "Can I export my analysis or study plan?",
      answer: "Yes, you can view your complete analysis including topic frequencies, extracted questions, and personalized study plans. Export features for documents are coming soon."
    }
  ];

  return (
    <div className="w-full py-12 px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h2 className={`text-3xl md:text-4xl font-black mb-3 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            Frequently Asked Questions
          </h2>
          <p className={`text-base font-light ${
            isDark ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Everything you need to know about ExamPulse
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              className={`rounded-xl border transition-all duration-300 overflow-hidden ${
                isDark
                  ? 'bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border-white/10 hover:border-purple-500/30'
                  : 'bg-white border-gray-200 hover:border-blue-300'
              }`}
              initial={false}
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className={`w-full px-6 py-4 flex items-center justify-between transition-all duration-300 ${
                  openIndex === index
                    ? isDark
                      ? 'bg-white/5'
                      : 'bg-blue-50'
                    : ''
                }`}
              >
                <span className={`text-left font-semibold transition-colors duration-300 ${
                  isDark
                    ? openIndex === index ? 'text-purple-300' : 'text-gray-200'
                    : openIndex === index ? 'text-blue-600' : 'text-gray-900'
                }`}>
                  {faq.question}
                </span>
                <motion.div
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex-shrink-0 ml-4 ${
                    isDark
                      ? 'text-purple-400'
                      : 'text-blue-600'
                  }`}
                >
                  <ChevronDown size={20} />
                </motion.div>
              </button>

              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`border-t transition-colors duration-300 ${
                      isDark ? 'border-white/10' : 'border-gray-200'
                    }`}
                  >
                    <p className={`px-6 py-4 font-light leading-relaxed ${
                      isDark ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      {faq.answer}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <p className={`text-sm font-medium ${
            isDark ? 'text-gray-500' : 'text-gray-600'
          }`}>
            Still have questions?{' '}
            <a href="mailto:support@exampulse.com" className={`transition-colors duration-300 ${
              isDark
                ? 'text-purple-400 hover:text-purple-300'
                : 'text-blue-600 hover:text-blue-700'
            }`}>
              Contact our support team
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
