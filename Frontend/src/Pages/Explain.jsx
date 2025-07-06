import React, { useState } from 'react'
import axios from 'axios'

const Explain = () => {
  const [topic, setTopic] = useState('')
  const [explanation, setExplanation] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'

  const handleExplain = async () => {
    if (!topic.trim()) return

    setLoading(true)
    setError('')
    setExplanation('')

    try {
      const token = localStorage.getItem('token')
      if (!token) {
        setError('You must be logged in to use this feature.')
        setLoading(false)
        return
      }

      const res = await axios.post(
        `${backendUrl}/elia5`,
        { content: topic },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      setExplanation(res.data.message)
    } catch (err) {
      console.error('❌ Frontend Error:', err.message)
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0d162c] to-[#15203d] px-6 py-12 flex flex-col items-center">
      <section className="w-full max-w-3xl bg-[#1e2a4d] rounded-2xl p-8 shadow-lg">
        <h2 className="text-4xl font-extrabold text-teal-400 mb-8 text-center select-none">
          🧠 Explain Like I'm 5
        </h2>

        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            aria-label="Topic to explain"
            placeholder="Enter a topic (e.g., Gravity)"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="flex-grow px-5 py-3 rounded-lg border border-teal-400 bg-[#0f1833] text-white placeholder-teal-300 focus:outline-none focus:ring-4 focus:ring-teal-500 transition"
            spellCheck={false}
          />
          <button
            onClick={handleExplain}
            disabled={loading}
            className="px-8 py-3 rounded-lg bg-gradient-to-r from-teal-400 to-teal-500 text-gray-900 font-semibold hover:from-teal-500 hover:to-teal-600 transition disabled:opacity-50"
            aria-busy={loading}
          >
            {loading ? 'Explaining...' : 'Explain'}
          </button>
        </div>

        {error && (
          <p
            role="alert"
            className="mt-6 text-red-400 font-semibold text-center select-none"
          >
            {error}
          </p>
        )}

        {explanation && (
          <article className="mt-10 bg-[#132544] text-white p-6 rounded-xl shadow-inner prose prose-teal max-w-none whitespace-pre-wrap leading-relaxed">
            <h3 className="text-2xl font-bold mb-4 select-none">Explanation</h3>
            <p>{explanation}</p>
          </article>
        )}
      </section>
    </main>
  )
}

export default Explain
