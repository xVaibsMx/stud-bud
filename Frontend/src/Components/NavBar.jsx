import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { BookOpen } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const NavBar = () => {
  const navigate = useNavigate()
  // undefined = loading, null = logged out, object = logged in
  const [user, setUser] = useState(undefined)
  const [isOpen, setIsOpen] = useState(false)

  const fetchUser = async () => {
    const token = localStorage.getItem('token')
    if (!token) {
      setUser(null)
      return
    }
    try {
      const res = await axios.get('https://stud-bud-backend.onrender.com/me', {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.data.success && res.data.data.user) {
        setUser(res.data.data.user)
      } else {
        localStorage.removeItem('token')
        setUser(null)
      }
    } catch (err) {
      console.error('fetchUser failed:', err)
      localStorage.removeItem('token')
      setUser(null)
    }
  }

  useEffect(() => {
    fetchUser()

    // Listen to both storage (cross-tab) and custom login event
    const handleStorage = () => fetchUser()
    window.addEventListener('storage', handleStorage)
    window.addEventListener('auth-changed', handleStorage)

    return () => {
      window.removeEventListener('storage', handleStorage)
      window.removeEventListener('auth-changed', handleStorage)
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    setUser(null)
    navigate('/login')
    // trigger update in all tabs
    window.dispatchEvent(new Event('auth-changed'))
  }

  const btnBase =
    'px-6 py-2.5 rounded-full font-[Poppins] font-semibold text-sm sm:text-base tracking-wide transition-all duration-300'
  const btnPrimary = `${btnBase} bg-teal-400 text-gray-900 shadow-md hover:bg-teal-500 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0`
  const btnOutline = `${btnBase} border border-teal-400 text-teal-400 hover:bg-teal-400 hover:text-gray-900 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0`
  const btnDanger = `${btnBase} bg-red-500 text-white shadow-md hover:bg-red-600 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0`

  const renderLinks = () => {
    if (user === undefined) {
      // loading
      return null
    }
    if (user && user.id) {
      // logged in
      return (
        <>
          <Link to="/dashboard" className={btnOutline}>
            Dashboard
          </Link>
          <button onClick={handleLogout} className={btnDanger}>
            Logout
          </button>
        </>
      )
    }
    // logged out
    return (
      <>
        <Link to="/register" className={btnOutline}>
          Register
        </Link>
        <Link to="/login" className={btnPrimary}>
          Login
        </Link>
      </>
    )
  }

  return (
    <nav className="w-full max-w-7xl mx-auto sticky top-0 z-50 px-5 sm:px-8 py-3 sm:py-4 bg-[#0b1224]/95 backdrop-blur-md border-b border-white/5 shadow-lg rounded-b-2xl flex items-center justify-between">
      {/* Logo */}
      <Link to="/" className="flex items-center gap-3">
        <motion.div
          whileHover={{ rotate: 8, scale: 1.05 }}
          className="flex items-center justify-center w-11 h-11 rounded-xl bg-teal-400/10 border border-teal-400/40 shadow-md"
        >
          <BookOpen className="w-6 h-6 text-teal-400" />
        </motion.div>
        <span className="font-[Anton] text-2xl sm:text-3xl tracking-wide text-slate-100">
          STUD<span className="text-teal-400">BUD</span>
        </span>
      </Link>

      {/* Desktop Links */}
      <div className="hidden sm:flex space-x-5 md:space-x-7">
        {renderLinks()}
      </div>

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
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="sm:hidden absolute top-full left-0 w-full bg-[#0b1224]/95 backdrop-blur-md border-t border-white/10 rounded-b-2xl shadow-xl mt-1 px-6 py-6 flex flex-col space-y-5 z-40"
          >
            {renderLinks()}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}

export default NavBar
