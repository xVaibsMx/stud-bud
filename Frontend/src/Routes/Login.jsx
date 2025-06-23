import React, { useState } from 'react'

const Login = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const handleSubmit = () => {
    fetch('http://localhost:3000/login', {
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
        window.alert(data.message)
        localStorage.setItem('token', data.token)
      })
  }
  return (
    <form
      className="max-w-md mx-auto mt-10 p-8 bg-[#1e293b] bg-opacity-70 rounded-2xl shadow-2xl backdrop-blur-md"
      onSubmit={handleSubmit}
    >
      <h2 className="text-3xl font-[Orbitron] text-[#38bdf8] mb-4">Login</h2>
      <input
        type="text"
        placeholder="Username"
        required
        onChange={(e) => {
          setUsername(e.target.value)
        }}
        className="w-full mb-4 p-3 rounded-md bg-[#0f172a] text-white border border-[#334155] focus:outline-none focus:ring-2 focus:ring-[#38bdf8]"
      />
      <input
        type="password"
        placeholder="Pasword"
        required
        onChange={(e) => {
          setPassword(e.target.value)
        }}
        className="w-full mb-4 p-3 rounded-md bg-[#0f172a] text-white border border-[#334155] focus:outline-none focus:ring-2 focus:ring-[#38bdf8]"
      />
      <button
        className="px-6 py-3 rounded-full bg-[#38bdf8] text-[#0f172a] font-[Orbitron]  hover:bg-[#0ea5e9] transition"
        type="submit"
      >
        Submit
      </button>
    </form>
  )
}

export default Login
