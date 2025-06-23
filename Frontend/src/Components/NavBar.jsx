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
    window.location.reload() // ensures NavBar resets properly
  }

  return (
    <nav className="flex justify-between items-center px-6 py-4 bg-[#0f172a] border-b border-[#1e293b] shadow-lg">
      <h1
        className="text-2xl font-[Orbitron] text-[#38bdf8] cursor-pointer"
        onClick={() => navigate('/')}
      >
        Stud-Bud
      </h1>

      <div className="flex gap-3">
        {user ? (
          <>
            <button
              className="px-6 py-3 rounded-full bg-red-500 text-white font-[Orbitron] hover:bg-red-600 transition"
              onClick={handleLogout}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <button
              className="px-6 py-3 rounded-full bg-[#38bdf8] text-[#0f172a] font-[Orbitron] hover:bg-[#0ea5e9] transition"
              onClick={() => navigate('/register')}
            >
              Register
            </button>
            <button
              className="px-6 py-3 rounded-full bg-[#38bdf8] text-[#0f172a] font-[Orbitron] hover:bg-[#0ea5e9] transition"
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
