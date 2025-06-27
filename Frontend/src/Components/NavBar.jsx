import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const NavBar = () => {
  const [user, setUser] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) return

    fetch('http://localhost:3000/me', {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + token,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.username) setUser(data.username)
      })
      .catch((err) => {
        console.error('Auth check failed:', err)
      })
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    setUser('')
    window.location = '/'
  }

  return (
    <nav className="flex justify-between items-center px-8 py-3 bg-[#0f172a]/90 backdrop-blur-md border-b border-indigo-400/30 shadow-md shadow-blue-300/10 w-full z-50">
      {/* Logo */}
      <div
        className="w-[250px] cursor-pointer flex items-center"
        onClick={() => navigate('/')}
      >
        <svg
          viewBox="0 0 360 100"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto"
        >
          <defs>
            <linearGradient id="textGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="100%" stopColor="#a855f7" />
            </linearGradient>
          </defs>

          <g>
            <rect
              x="10"
              y="20"
              width="60"
              height="60"
              rx="14"
              fill="#1e293b"
              stroke="url(#textGradient)"
              strokeWidth="3.5"
            />
            <circle cx="28" cy="40" r="6" fill="#6366f1" />
            <circle cx="52" cy="40" r="6" fill="#a855f7" />
            <rect x="28" y="56" width="24" height="5" rx="2.5" fill="#e2e8f0" />
          </g>

          <text
            x="85"
            y="60"
            fontSize="42"
            fontFamily="Orbitron, sans-serif"
            fontWeight="800"
            fill="url(#textGradient)"
            letterSpacing="1.5"
          >
            Stud-Bud
          </text>
        </svg>
      </div>

      {/* Auth Buttons */}
      <div className="flex gap-4">
        {user ? (
          <button
            className="px-5 py-2 rounded-md bg-rose-600 text-white font-[Orbitron] tracking-wide transition duration-300 hover:bg-rose-700 shadow-md hover:shadow-rose-500/30"
            onClick={handleLogout}
          >
            Logout
          </button>
        ) : (
          <>
            <button
              className="px-5 py-2 rounded-md bg-gradient-to-r from-indigo-400 to-blue-500 text-white font-[Orbitron] tracking-wide hover:from-indigo-300 hover:to-blue-400 transition duration-300 shadow-md hover:shadow-indigo-400/40"
              onClick={() => navigate('/register')}
            >
              Register
            </button>
            <button
              className="px-5 py-2 rounded-md bg-gradient-to-r from-purple-500 to-violet-600 text-white font-[Orbitron] tracking-wide hover:from-purple-400 hover:to-violet-500 transition duration-300 shadow-md hover:shadow-violet-400/40"
              onClick={() => navigate('/login')}
            >
              Login
            </button>
          </>
        )}
      </div>
    </nav>
  )
}

export default NavBar
