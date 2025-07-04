import React from 'react'
import { useNavigate } from 'react-router-dom'
import Features from '../Components/Features'

const Landing = () => {
  const navigate = useNavigate()

  const handleGetStarted = () => {
    navigate('/register') // Navigate to the register page
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
          className="bg-teal-400 hover:bg-teal-500 active:bg-teal-600 text-gray-900 font-semibold px-8 sm:px-10 py-3 sm:py-4 rounded-full shadow-lg transition duration-300"
          onClick={handleGetStarted} // Navigate to register page
        >
          Get Started
        </button>
      </section>
      {/* Features Section */}
      <Features /> {/* Render the Features Component */}
    </main>
  )
}

export default Landing
