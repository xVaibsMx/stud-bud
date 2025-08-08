import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const QuickRevision = () => {
  const [topic, setTopic] = useState('')
  const [revision, setRevision] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'

  const handleRevision = async (e) => {
    e.preventDefault()
    if (!topic.trim()) return

    const token = localStorage.getItem('token')
    if (!token) {
      setError('You must be logged in to use this feature.')
      return navigate('/login')
    }

    setLoading(true)
    setError('')
    setRevision('')

    try {
      const res = await axios.post(
        `${backendUrl}/revision`,
        { content: topic },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      setRevision(res.data.message)
    } catch (err) {
      console.error('❌ Quick Revision Error:', err)
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0d162c] to-[#15203d] px-6 py-12 flex flex-col items-center">
      <section className="w-full max-w-3xl bg-[#1e2a4d] rounded-2xl p-8 shadow-lg">
        <h2 className="text-4xl font-extrabold text-teal-400 mb-8 text-center select-none">
          ⏱️ Quick Revision
        </h2>

        <form
          onSubmit={handleRevision}
          className="flex flex-col sm:flex-row gap-4"
        >
          <input
            type="text"
            placeholder="Enter a topic (e.g., Photosynthesis)"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="flex-grow px-5 py-3 rounded-lg border border-teal-400 bg-[#0f1833] text-white placeholder-teal-300 focus:outline-none focus:ring-4 focus:ring-teal-500 transition"
            spellCheck={false}
            aria-label="Topic for quick revision"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3 rounded-lg bg-gradient-to-r from-teal-400 to-teal-500 text-gray-900 font-semibold hover:from-teal-500 hover:to-teal-600 transition disabled:opacity-50"
            aria-busy={loading}
          >
            {loading ? 'Fetching...' : 'Get Revision'}
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

        {revision && (
          <article className="mt-10 bg-[#132544] text-white p-6 rounded-xl shadow-inner prose prose-teal max-w-none whitespace-pre-wrap leading-relaxed">
            <h3 className="text-2xl font-bold mb-4 select-none">
              Quick Revision
            </h3>
            <p>{revision}</p>
          </article>
        )}
      </section>
    </main>
  )
}

export default QuickRevision
