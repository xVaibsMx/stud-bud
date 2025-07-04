import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

const Login = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    try {
      const res = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.message || 'Login failed')
        return
      }

      localStorage.setItem('token', data.token)
      window.location = '/dashboard'
    } catch (err) {
      setError('Server not responding. Please try again later.')
    }
  }

  return (
    <div className="flex justify-center items-start px-4 py-20 bg-slate-900 min-h-[calc(100vh-64px)]">
      <form
        onSubmit={handleSubmit}
        className="bg-[#1e293b] w-full max-w-md p-8 rounded-xl shadow-lg"
      >
        <h2 className="text-3xl font-semibold mb-6 text-teal-400 text-center">
          Login to Your Account
        </h2>

        {error && (
          <p className="text-red-400 mb-4 text-sm text-center">{error}</p>
        )}

        <div className="mb-4">
          <label htmlFor="username" className="block text-slate-300 mb-1">
            Username
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-3 rounded-md border border-gray-600 bg-[#15212b] text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-400"
            placeholder="Enter your username"
            required
          />
        </div>

        <div className="mb-6">
          <label htmlFor="password" className="block text-slate-300 mb-1">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 rounded-md border border-gray-600 bg-[#15212b] text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-400"
            placeholder="Enter your password"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-teal-400 text-gray-900 font-semibold rounded-full hover:bg-teal-500 transition duration-300"
        >
          Login
        </button>

        <p className="mt-4 text-center text-sm text-slate-300">
          Don’t have an account?{' '}
          <Link to="/register" className="text-teal-400 hover:underline">
            Register here
          </Link>
        </p>
      </form>
    </div>
  )
}

export default Login
