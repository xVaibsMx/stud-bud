import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [user, setUser] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token')
        if (!token) return setUser(null)

        const res = await axios.get(
          'https://stud-bud-backend.onrender.com/me',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        setUser(res.data.user)
      } catch (err) {
        console.log('User not logged in')
        setUser(null)
      }
    }

    fetchUser()

    // 🔁 Listen for login/logout token updates
    window.addEventListener('storage', fetchUser)

    return () => {
      window.removeEventListener('storage', fetchUser)
    }
  }, [])

  const handleLinkClick = () => setIsOpen(false)

  const handleLogout = () => {
    localStorage.removeItem('token')
    setUser(null)
    navigate('/login')

    // 📢 Notify other components about logout
    window.dispatchEvent(new Event('storage'))
  }

  const renderLinks = () => {
    if (user) {
      return (
        <>
          <Link
            to="/dashboard"
            onClick={handleLinkClick}
            className="text-teal-400 border border-teal-400 px-5 py-2 rounded-full font-semibold hover:bg-teal-400 hover:text-gray-900 transition"
          >
            Dashboard
          </Link>
          <button
            onClick={handleLogout}
            className="bg-red-500 px-5 py-2 rounded-full font-semibold text-white hover:bg-red-600 transition"
          >
            Logout
          </button>
        </>
      )
    } else {
      return (
        <>
          <Link
            to="/register"
            onClick={handleLinkClick}
            className="text-teal-400 border border-teal-400 px-5 py-2 rounded-full font-semibold hover:bg-teal-400 hover:text-gray-900 transition"
          >
            Register
          </Link>
          <Link
            to="/login"
            onClick={handleLinkClick}
            className="bg-teal-400 px-5 py-2 rounded-full font-semibold text-gray-900 hover:bg-teal-500 transition"
          >
            Login
          </Link>
        </>
      )
    }
  }

  return (
    <nav className="w-full max-w-6xl mx-auto sticky top-0 bg-[#15203d]/90 backdrop-blur-sm z-50 rounded-b-xl px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
      <Link to="/">
        <h1 className="text-teal-400 font-extrabold text-2xl select-none">
          Stud-Bud
        </h1>
      </Link>

      {/* Desktop Links */}
      <div className="hidden sm:flex space-x-6">{renderLinks()}</div>

      {/* Mobile Toggle */}
      <button
        aria-label="Toggle menu"
        aria-expanded={isOpen}
        className="sm:hidden text-teal-400 focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <svg
          className="w-8 h-8"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          {isOpen ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 8h16M4 16h16"
            />
          )}
        </svg>
      </button>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="sm:hidden absolute top-full left-0 w-full max-w-6xl bg-[#15203d]/90 backdrop-blur-sm rounded-b-xl shadow-lg mt-1 px-6 py-5 z-40 flex flex-col space-y-4">
          {user ? (
            <>
              <Link
                to="/dashboard"
                onClick={handleLinkClick}
                className="text-teal-400 border border-teal-400 px-6 py-3 rounded-full font-semibold text-center hover:bg-teal-400 hover:text-gray-900 transition"
              >
                Dashboard
              </Link>
              <button
                onClick={() => {
                  handleLogout()
                  handleLinkClick()
                }}
                className="bg-red-500 px-6 py-3 rounded-full font-semibold text-white text-center hover:bg-red-600 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/register"
                onClick={handleLinkClick}
                className="text-teal-400 border border-teal-400 px-6 py-3 rounded-full font-semibold text-center hover:bg-teal-400 hover:text-gray-900 transition"
              >
                Register
              </Link>
              <Link
                to="/login"
                onClick={handleLinkClick}
                className="bg-teal-400 px-6 py-3 rounded-full font-semibold text-gray-900 text-center hover:bg-teal-500 transition"
              >
                Login
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  )
}

export default NavBar
