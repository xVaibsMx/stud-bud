import React from 'react'

const Landing = () => {
  return (
    <section className="text-center py-24 px-6 max-w-3xl mx-auto">
      <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-400 to-purple-600 text-transparent bg-clip-text mb-4">
        Meet Stud-Bud
      </h1>
      <p className="text-xl text-slate-300 mb-8">
        Your AI-powered companion to learn faster, better, and smarter.
      </p>
      <div className="flex justify-center gap-6">
        <button className="px-6 py-3 rounded-full bg-indigo-500 hover:bg-indigo-600 text-white font-semibold transition">
          Login
        </button>
        <button className="px-6 py-3 rounded-full bg-purple-500 hover:bg-purple-600 text-white font-semibold transition">
          Register
        </button>
      </div>
    </section>
  )
}

export default Landing
