import React, { useState } from 'react'
import { data, Link } from 'react-router-dom' // Import Link from react-router-dom

const Register = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Registering user:', { username, password })
    fetch('http://localhost:3000/register', {
      method: 'POST',
      body: JSON.stringify({
        username,
        password,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        return res.json()
      })
      .then((data) => {
        console.log(data)
      })
  }

  return (
    <div className="flex justify-center px-4 py-10">
      <form
        onSubmit={handleSubmit}
        className="bg-[#1e293b] p-8 rounded-xl shadow-lg w-full max-w-md"
      >
        <h2 className="text-3xl font-semibold mb-6 text-teal-400 text-center">
          Create Your Account
        </h2>

        <div className="mb-4">
          <label
            htmlFor="username"
            className="block text-lg font-medium mb-1 text-slate-300"
          >
            Username
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-3 rounded-lg border border-gray-600 bg-[#15212b] text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-400"
            placeholder="Enter your username"
            required
          />
        </div>

        <div className="mb-6">
          <label
            htmlFor="password"
            className="block text-lg font-medium mb-1 text-slate-300"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 rounded-lg border border-gray-600 bg-[#15212b] text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-400"
            placeholder="Enter your password"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-teal-400 text-gray-900 font-semibold rounded-full hover:bg-teal-500 transition duration-300"
        >
          Register
        </button>

        {/* Login option */}
        <div className="mt-4 text-center text-sm text-slate-300">
          <p>
            Already have an account?{' '}
            <Link to="/login" className="text-teal-400 hover:underline">
              Login here
            </Link>
          </p>
        </div>
      </form>
    </div>
  )
}

export default Register
