import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Features from '../Components/Features'

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
    <main className="flex flex-col justify-center items-center text-center max-w-6xl mx-auto mt-12 mb-20 px-4 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <section className="max-w-4xl mb-16">
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight tracking-tight mb-6">
          Meet <span className="text-teal-400">Stud-Bud</span>
          <br />
          Your AI-Powered Study Buddy
        </h2>
        <p className="text-base sm:text-lg text-slate-300 max-w-xl mx-auto mb-8 leading-relaxed">
          Simplify learning, master topics quickly, and track your progress
          effortlessly with Stud-Bud’s smart AI tools.
        </p>
        <button
          className="bg-teal-400 hover:bg-teal-500 active:bg-teal-600 text-gray-900 font-semibold px-8 sm:px-10 py-3 sm:py-4 rounded-full shadow-lg transition duration-300 focus:outline-none focus:ring-4 focus:ring-teal-300"
          onClick={handleGetStarted}
        >
          Get Started
        </button>
      </section>

      {/* Features Section */}
      <Features />

      {/* Warning Modal */}
      {showWarning && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-slate-800 text-white rounded-2xl p-6 shadow-xl max-w-sm text-center">
            <h3 className="text-lg font-semibold mb-2">Hold on!</h3>
            <p className="text-slate-300 mb-4">
              Please register or log in first to start using Stud-Bud.
            </p>
            <button
              className="bg-teal-400 hover:bg-teal-500 text-gray-900 font-medium px-6 py-2 rounded-full transition duration-300"
              onClick={closeWarning}
            >
              Go to Register
            </button>
          </div>
        </div>
      )}
    </main>
  )
}

export default Landing
