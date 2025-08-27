import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Features from '../Components/Features'
import { motion, AnimatePresence } from 'framer-motion'

const Landing = () => {
  const navigate = useNavigate()
  const [showWarning, setShowWarning] = useState(false)

  const handleGetStarted = () => {
    const token = localStorage.getItem('token')
    if (token) {
      navigate('/dashboard')
    } else {
      setShowWarning(true)
    }
  }

  const closeWarning = () => {
    setShowWarning(false)
    navigate('/register')
  }

  return (
    <main className="flex flex-col justify-center items-center text-center max-w-6xl mx-auto mt-16 sm:mt-20 mb-24 px-4 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <section className="max-w-4xl mb-20">
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight tracking-tight mb-6 text-slate-100">
          Meet <span className="text-teal-400">Stud-Bud</span>
          <br />
          Your AI-Powered Study Buddy
        </h2>
        <p className="text-base sm:text-lg md:text-xl text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed">
          Simplify learning, master topics quickly, and track your progress
          effortlessly with{' '}
          <span className="text-teal-300 font-medium">Stud-Bud</span>’s smart AI
          tools.
        </p>
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          className="bg-teal-400 hover:bg-teal-500 active:bg-teal-600 text-gray-900 font-semibold px-10 sm:px-12 py-4 sm:py-5 rounded-full shadow-xl transition duration-300 focus:outline-none focus:ring-4 focus:ring-teal-300 text-lg sm:text-xl"
          onClick={handleGetStarted}
        >
          Get Started
        </motion.button>
      </section>

      {/* Features Section */}
      <Features />

      {/* Warning Modal */}
      <AnimatePresence>
        {showWarning && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-slate-800 text-white rounded-2xl p-8 shadow-2xl max-w-sm w-full text-center border border-slate-700"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <h3 className="text-xl font-bold mb-3 text-teal-300">Hold on!</h3>
              <p className="text-slate-300 mb-6 text-sm sm:text-base leading-relaxed">
                You need to{' '}
                <span className="text-teal-400 font-medium">register</span> or
                log in first to start using Stud-Bud.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.9 }}
                className="bg-teal-400 hover:bg-teal-500 active:bg-teal-600 text-gray-900 font-semibold px-8 py-3 rounded-full shadow-lg transition duration-300"
                onClick={closeWarning}
              >
                Go to Register
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}

export default Landing
