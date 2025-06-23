import React from 'react'
import { useNavigate } from 'react-router-dom'

const NavBar = () => {
  const navigate = useNavigate()
  return (
    <nav className="flex justify-between items-center px-6 py-4 bg-[#0f172a] border-b border-[#1e293b] shadow-lg">
      <h1
        className="text-2xl font-[Orbitron] text-[#38bdf8]"
        onClick={() => {
          navigate('/')
        }}
      >
        {' '}
        Stud-Bud
      </h1>
      <div className="flex gap-3">
        <button
          className="px-6 py-3 rounded-full bg-[#38bdf8] text-[#0f172a] font-[Orbitron]  hover:bg-[#0ea5e9] transition"
          onClick={() => {
            navigate('/register')
          }}
        >
          Register
        </button>
        <button
          className="px-6 py-3 rounded-full bg-[#38bdf8] text-[#0f172a] font-[Orbitron]  hover:bg-[#0ea5e9] transition"
          onClick={() => {
            navigate('/login')
          }}
        >
          Login
        </button>
      </div>
    </nav>
  )
}

export default NavBar
