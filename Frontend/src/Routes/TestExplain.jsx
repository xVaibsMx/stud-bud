import React, { useState } from 'react'

const Explain = () => {
  const [topic, setTopic] = useState('')
  const [answer, setAnswer] = useState('')
  const [loading, setLoading] = useState(false)

  const handleExplain = async () => {
    if (!topic.trim()) return
    setLoading(true)
    setAnswer('')

    try {
      const res = await fetch('http://localhost:3000/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic }),
      })
      const data = await res.json()
      setAnswer(data.result || 'No explanation found.')
    } catch (err) {
      setAnswer('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="max-w-3xl mx-auto px-6 py-12 text-white font-[Orbitron]">
      {/* Back link */}
      <button
        onClick={() => window.history.back()}
        className="text-indigo-400 hover:underline mb-6"
      >
        ← Back to Dashboard
      </button>

      {/* Title */}
      <h1 className="text-4xl font-bold mb-2">Explain Like I’m 5</h1>
      <p className="text-slate-400 mb-8">
        Type a topic and get a super simple explanation.
      </p>

      {/* Input */}
      <div className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="e.g., Black holes"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          className="w-full p-4 rounded-xl bg-[#0f172a] border border-indigo-500 placeholder-slate-400 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        <button
          onClick={handleExplain}
          disabled={loading}
          className={`px-6 py-3 rounded-full bg-indigo-500 hover:bg-indigo-600 text-white font-semibold transition ${
            loading && 'opacity-50 cursor-not-allowed'
          }`}
        >
          {loading ? 'Explaining...' : 'Explain it!'}
        </button>
      </div>

      {/* Result */}
      {answer && (
        <div className="mt-10 bg-[#1e293b] p-6 rounded-xl shadow-lg border border-indigo-400/30">
          <h2 className="text-xl font-bold mb-2 text-indigo-300">
            Like you’re 5:
          </h2>
          <p className="text-slate-200 leading-relaxed">{answer}</p>
        </div>
      )}
    </main>
  )
}

export default Explain
