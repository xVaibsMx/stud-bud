import React, { useState } from 'react'

const Login = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('http://localhost:3000/login', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const data = await res.json()

      if (!res.ok) throw new Error(data.message || 'Login failed')

      localStorage.setItem('token', data.token)
      alert(data.message || 'Logged in successfully!')
      window.location = '/dashboard'
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto mt-16 p-8 rounded-3xl bg-[#1e293b] text-white shadow-2xl backdrop-blur-md border border-indigo-600/30"
    >
      <h2 className="text-4xl font-[Orbitron] text-indigo-400 mb-6 text-center">
        Welcome Back
      </h2>

      <input
        type="text"
        placeholder="Enter your username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
        className="w-full mb-4 p-3 rounded-lg bg-[#0f172a] border border-[#334155] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />

      <input
        type="password"
        placeholder="Enter your password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        className="w-full mb-4 p-3 rounded-lg bg-[#0f172a] border border-[#334155] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />

      {error && (
        <div className="mb-4 text-sm text-red-400 font-medium text-center">
          ⚠️ {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className={`w-full py-3 rounded-full font-[Orbitron] text-white bg-gradient-to-r from-indigo-500 to-purple-600 transition ${
          loading
            ? 'opacity-50 cursor-not-allowed'
            : 'hover:from-indigo-400 hover:to-purple-500'
        } shadow-lg hover:shadow-indigo-500/30`}
      >
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  )
}

export default Login
