import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const Quiz = () => {
  const [topic, setTopic] = useState('')
  const [quiz, setQuiz] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)
  const navigate = useNavigate()

  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'

  const handleQuiz = async (e) => {
    e.preventDefault()
    if (!topic.trim()) return

    const token = localStorage.getItem('token')
    if (!token) {
      setError('⚠️ You must be logged in to use this feature.')
      return navigate('/login')
    }

    setLoading(true)
    setError('')
    setQuiz([])
    setCopied(false)

    try {
      const res = await axios.post(
        `${backendUrl}/quiz`,
        { content: topic },
        { headers: { Authorization: `Bearer ${token}` } }
      )

      const rawText = res.data.message

      const parsed = rawText
        .split(/\d+\.\s/)
        .filter(Boolean)
        .map((q) => {
          const [question, ...rest] = q.split('Answer:')
          return {
            question: question.trim(),
            answer: rest.join('Answer:').trim(),
          }
        })

      setQuiz(parsed)
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
    const quizText = quiz
      .map((q, i) => `Q${i + 1}: ${q.question}\nAnswer: ${q.answer}`)
      .join('\n\n')
    navigator.clipboard.writeText(quizText)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0d162c] to-[#15203d] px-6 py-12 flex flex-col items-center">
      <section className="w-full max-w-3xl bg-[#1e2a4d] rounded-2xl p-8 shadow-xl">
        <h2 className="text-4xl font-bold text-teal-400 mb-8 text-center">
          📝 Quiz Me
        </h2>

        <form onSubmit={handleQuiz} className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            placeholder="Enter a topic (e.g., Newton's Laws)"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="flex-grow px-5 py-3 rounded-lg border border-teal-400 bg-[#0f1833] text-white placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-teal-500 transition"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !topic.trim()}
            className="px-8 py-3 rounded-lg bg-gradient-to-r from-teal-400 to-teal-500 text-gray-900 font-semibold shadow-md hover:from-teal-500 hover:to-teal-600 disabled:opacity-50 transition"
          >
            {loading ? 'Generating...' : 'Generate'}
          </button>
        </form>

        {error && (
          <p className="mt-6 text-red-400 font-medium text-center">{error}</p>
        )}

        {quiz.length > 0 && (
          <article className="mt-10 bg-[#132544] text-white p-6 rounded-xl shadow-inner leading-relaxed relative">
            <h3 className="text-2xl font-bold mb-6 text-teal-300">📚 Quiz</h3>
            <ul className="space-y-6">
              {quiz.map((item, index) => (
                <li key={index} className="border-l-4 border-teal-400 pl-4">
                  <p className="font-semibold text-lg text-teal-300">
                    Q{index + 1}: {item.question}
                  </p>
                  <p className="text-gray-300 mt-2">
                    <span className="text-teal-400 font-medium">Answer:</span>{' '}
                    {item.answer}
                  </p>
                </li>
              ))}
            </ul>
            <button
              onClick={handleCopy}
              className="absolute top-4 right-4 px-3 py-1 rounded bg-teal-500 text-gray-900 text-sm font-semibold hover:bg-teal-600 transition"
            >
              {copied ? 'Copied!' : 'Copy All'}
            </button>
          </article>
        )}
      </section>
    </main>
  )
}

export default Quiz
