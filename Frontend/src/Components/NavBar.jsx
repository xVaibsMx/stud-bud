import React, { useState } from 'react'

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="w-full max-w-6xl mx-auto sticky top-0 bg-[#15203d]/90 backdrop-blur-sm z-50 rounded-b-xl px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
      <h1 className="text-teal-400 font-extrabold text-2xl select-none">
        Stud-Bud
      </h1>

      {/* Desktop buttons */}
      <div className="hidden sm:flex space-x-4">
        <button
          type="button"
          className="text-teal-400 border border-teal-400 px-4 py-2 rounded-full font-semibold hover:bg-teal-400 hover:text-gray-900 transition"
        >
          Register
        </button>
        <button
          type="button"
          className="bg-teal-400 px-4 py-2 rounded-full font-semibold text-gray-900 hover:bg-teal-500 transition"
        >
          Login
        </button>
      </div>

      {/* Mobile menu button */}
      <button
        aria-label="Toggle menu"
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

      {/* Mobile menu */}
      {isOpen && (
        <div className="sm:hidden absolute top-full left-0 w-full bg-[#15203d]/90 backdrop-blur-sm rounded-b-xl shadow-lg mt-1 px-4 py-4 z-40 flex flex-col space-y-3">
          <button
            type="button"
            className="text-teal-400 border border-teal-400 px-4 py-2 rounded-full font-semibold hover:bg-teal-400 hover:text-gray-900 transition"
          >
            Register
          </button>
          <button
            type="button"
            className="bg-teal-400 px-4 py-2 rounded-full font-semibold text-gray-900 hover:bg-teal-500 transition"
          >
            Login
          </button>
        </div>
      )}
    </nav>
  )
}

export default NavBar
