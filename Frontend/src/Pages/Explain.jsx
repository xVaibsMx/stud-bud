import React, { useState } from 'react'
import axios from 'axios'

const Explain = () => {
  const [topic, setTopic] = useState('')
  const [explanation, setExplanation] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'

  const handleExplain = async (e) => {
    e.preventDefault()
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
      // Optional: clear input after success
      setTopic('')
    } catch (err) {
      console.error('❌ Frontend Error:', err.message)
      // Show backend error message if available
      const msg =
        err.response?.data?.message || 'Something went wrong. Please try again.'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0d162c] to-[#15203d] px-6 py-12 flex flex-col items-center">
      <section className="w-full max-w-3xl bg-[#1e2a4d] rounded-2xl p-8 shadow-lg">
        <h2
          className="text-4xl font-extrabold text-teal-400 mb-8 text-center select-none"
          tabIndex={-1}
        >
          🧠 Explain Like I'm 5
        </h2>

        <form
          onSubmit={handleExplain}
          className="flex flex-col sm:flex-row gap-4"
          aria-label="Explain Like I'm 5 form"
        >
          <label htmlFor="topicInput" className="sr-only">
            Topic to explain
          </label>
          <input
            id="topicInput"
            type="text"
            aria-required="true"
            aria-describedby="topicHelp"
            placeholder="Enter a topic (e.g., Gravity)"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="flex-grow px-5 py-3 rounded-lg border border-teal-400 bg-[#0f1833] text-white placeholder-teal-300 focus:outline-none focus:ring-4 focus:ring-teal-500 transition"
            spellCheck={false}
            autoComplete="off"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !topic.trim()}
            className="px-8 py-3 rounded-lg bg-gradient-to-r from-teal-400 to-teal-500 text-gray-900 font-semibold hover:from-teal-500 hover:to-teal-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
            aria-busy={loading}
            aria-disabled={loading || !topic.trim()}
          >
            {loading ? 'Explaining...' : 'Explain'}
          </button>
        </form>

        {error && (
          <p
            role="alert"
            className="mt-6 text-red-400 font-semibold text-center select-none"
          >
            {error}
          </p>
        )}

        {explanation && (
          <article
            className="mt-10 bg-[#132544] text-white p-6 rounded-xl shadow-inner prose prose-teal max-w-none whitespace-pre-wrap leading-relaxed"
            tabIndex={0}
            aria-live="polite"
          >
            <h3 className="text-2xl font-bold mb-4 select-none">Explanation</h3>
            <p>{explanation}</p>
          </article>
        )}
      </section>
    </main>
  )
}

export default Explain
