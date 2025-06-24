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
    navigate('/login')
    window.location.reload()
  }

  return (
    <nav className="flex justify-between items-center px-8 py-3 bg-[#0f172a]/90 backdrop-blur-md border-b border-[#1e293b] shadow-md shadow-cyan-500/10 w-full z-50">
      {/* Logo */}
      <div
        className="w-[240px] cursor-pointer flex items-center"
        onClick={() => navigate('/')}
      >
        <svg
          viewBox="0 0 360 100"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto"
        >
          <defs>
            {/* <!-- Gradient for stroke and text --> */}
            <linearGradient id="textGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#ec4899" />
            </linearGradient>
          </defs>

          {/* <!-- Robot Icon (bigger, brighter) --> */}
          <g>
            <rect
              x="10"
              y="20"
              width="60"
              height="60"
              rx="14"
              fill="#0f172a"
              stroke="url(#textGradient)"
              strokeWidth="3.5"
            />
            <circle cx="28" cy="40" r="6" fill="#06b6d4" />
            <circle cx="52" cy="40" r="6" fill="#ec4899" />
            <rect x="28" y="56" width="24" height="5" rx="2.5" fill="#f1f5f9" />
          </g>

          {/* <!-- Logo Text --> */}
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
            className="px-5 py-2 rounded-md bg-red-500/90 hover:bg-red-600 text-white font-[Orbitron] tracking-wide transition duration-300 shadow-md hover:shadow-red-500/30"
            onClick={handleLogout}
          >
            Logout
          </button>
        ) : (
          <>
            <button
              className="px-5 py-2 rounded-md bg-gradient-to-r from-cyan-400 to-cyan-600 text-[#0f172a] font-[Orbitron] tracking-wide border border-cyan-500 hover:from-cyan-300 hover:to-cyan-500 transition duration-300 shadow-md hover:shadow-cyan-400/40"
              onClick={() => navigate('/register')}
            >
              Register
            </button>
            <button
              className="px-5 py-2 rounded-md bg-gradient-to-r from-pink-400 to-pink-600 text-[#0f172a] font-[Orbitron] tracking-wide border border-pink-500 hover:from-pink-300 hover:to-pink-500 transition duration-300 shadow-md hover:shadow-pink-400/40"
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
