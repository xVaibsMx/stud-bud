import React, { useState } from 'react'
import axios from 'axios'
import { motion, AnimatePresence } from 'framer-motion'

const Explain = () => {
  const [topic, setTopic] = useState('')
  const [explanation, setExplanation] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'

  const handleExplain = async (e) => {
    e.preventDefault()
    if (!topic.trim()) return

    setLoading(true)
    setError('')
    setExplanation('')
    setCopied(false)

    try {
      const token = localStorage.getItem('token')
      if (!token) {
        setError('⚠️ You must be logged in to use this feature.')
        return
      }

      const res = await axios.post(
        `${backendUrl}/elia5`,
        { content: topic },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )

      setExplanation(res.data.message)
      setTopic('')
    } catch (err) {
      const msg =
        err.response?.data?.message || 'Something went wrong. Please try again.'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(explanation)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0d162c] to-[#15203d] flex flex-col items-center px-6 py-12">
      <section className="w-full max-w-3xl bg-[#1e2a4d] rounded-3xl p-10 shadow-2xl border border-teal-700/30">
        <h2 className="text-4xl sm:text-5xl font-extrabold text-teal-400 mb-8 text-center select-none">
          🧠 Explain Like I'm 5
        </h2>

        <form
          onSubmit={handleExplain}
          className="flex flex-col sm:flex-row gap-4 mb-6"
        >
          <input
            type="text"
            placeholder="Enter a topic (e.g., Gravity)"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="flex-grow px-6 py-4 rounded-xl border border-teal-400 bg-[#0f1833] text-white placeholder-teal-300 focus:outline-none focus:ring-4 focus:ring-teal-500 transition shadow-inner"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !topic.trim()}
            className="px-8 py-4 rounded-xl bg-gradient-to-r from-teal-400 to-teal-500 text-gray-900 font-semibold shadow-lg hover:from-teal-500 hover:to-teal-600 disabled:opacity-50 transition-all"
          >
            {loading ? 'Explaining...' : 'Explain'}
          </button>
        </form>

        {error && (
          <p className="mt-4 text-red-400 font-semibold text-center select-none">
            {error}
          </p>
        )}

        <AnimatePresence>
          {explanation && (
            <motion.article
              key="explanation"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="mt-8 bg-[#132544] rounded-2xl p-6 shadow-inner relative border-l-4 border-teal-400"
            >
              <h3 className="text-2xl font-bold mb-4 text-teal-300 select-none">
                ✨ Explanation
              </h3>
              <p className="text-slate-100 whitespace-pre-wrap leading-relaxed">
                {explanation}
              </p>
              <button
                onClick={handleCopy}
                className="absolute top-4 right-4 px-3 py-1 rounded-lg bg-teal-500 text-gray-900 text-sm font-semibold hover:bg-teal-600 transition"
              >
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </motion.article>
          )}
        </AnimatePresence>
      </section>
    </main>
  )
}

export default Explain
