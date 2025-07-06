import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const Quiz = () => {
  const [topic, setTopic] = useState('')
  const [quiz, setQuiz] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleQuiz = async () => {
    if (!topic.trim()) return

    const token = localStorage.getItem('token')
    if (!token) {
      setError('You must be logged in to use this feature.')
      return navigate('/login')
    }

    setLoading(true)
    setError('')
    setQuiz([])

    try {
      const res = await axios.post(
        'https://stud-bud-backend.onrender.com/quiz', // <-- change this URL to your deployed backend URL
        { content: topic },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
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
    } catch (err) {
      console.error('❌ Quiz Error:', err)
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0d162c] to-[#15203d] px-6 py-12 flex flex-col items-center">
      <section className="w-full max-w-3xl bg-[#1e2a4d] rounded-2xl p-8 shadow-lg">
        <h2 className="text-4xl font-extrabold text-teal-400 mb-8 text-center select-none">
          📝 Quiz Me
        </h2>

        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            placeholder="Enter a topic (e.g., Newton's Laws)"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="flex-grow px-5 py-3 rounded-lg border border-teal-400 bg-[#0f1833] text-white placeholder-teal-300 focus:outline-none focus:ring-4 focus:ring-teal-500 transition"
            spellCheck={false}
          />
          <button
            onClick={handleQuiz}
            disabled={loading}
            className="px-8 py-3 rounded-lg bg-gradient-to-r from-teal-400 to-teal-500 text-gray-900 font-semibold hover:from-teal-500 hover:to-teal-600 transition disabled:opacity-50"
          >
            {loading ? 'Generating...' : 'Generate'}
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

        {quiz.length > 0 && (
          <article className="mt-10 bg-[#132544] text-white p-6 rounded-xl shadow-inner max-w-none whitespace-pre-wrap leading-relaxed">
            <h3 className="text-2xl font-bold mb-6 select-none">Your Quiz</h3>
            <ul className="space-y-6">
              {quiz.map((item, index) => (
                <li key={index} className="border-l-4 border-teal-400 pl-4">
                  <p className="font-semibold text-lg text-teal-300">
                    Q{index + 1}: {item.question}
                  </p>
                  <p className="text-sm text-gray-300 mt-2">
                    <strong className="text-teal-400">Answer:</strong>{' '}
                    {item.answer}
                  </p>
                </li>
              ))}
            </ul>
          </article>
        )}
      </section>
    </main>
  )
}

export default Quiz
