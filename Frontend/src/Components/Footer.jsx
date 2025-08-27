import React from 'react'
import { BookOpen, Twitter, Github, Linkedin } from 'lucide-react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const Footer = () => {
  return (
    <footer className="bg-[#0b1224] text-gray-300 py-12 mt-16 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between gap-8">
        {/* Brand */}
        <div className="flex flex-col gap-3">
          <Link to="/" className="flex items-center gap-3">
            <motion.div
              whileHover={{ rotate: 8, scale: 1.05 }}
              className="flex items-center justify-center w-10 h-10 rounded-xl bg-teal-400/10 border border-teal-400/40 shadow-md"
            >
              <BookOpen className="w-5 h-5 text-teal-400" />
            </motion.div>
            <span className="font-[Anton] text-2xl text-slate-100">
              STUD<span className="text-teal-400">BUD</span>
            </span>
          </Link>
          <p className="text-sm text-gray-400 max-w-xs">
            Stud-Bud is a smart, interactive, and personalized AI study
            assistant built using the MERN Stack and Gemini API. Learn smarter,
            faster, better with bite-sized explanations, quizzes, and revision
            tools.
          </p>
        </div>

        {/* Quick Links */}
        <div className="flex flex-col gap-2">
          <h4 className="text-teal-400 font-semibold mb-2">Quick Links</h4>
          <Link to="/" className="hover:text-teal-400 transition">
            Home
          </Link>
          <Link to="/dashboard" className="hover:text-teal-400 transition">
            Dashboard
          </Link>
          <Link to="/login" className="hover:text-teal-400 transition">
            Login
          </Link>
          <Link to="/register" className="hover:text-teal-400 transition">
            Register
          </Link>
        </div>

        {/* Social Links */}
        <div className="flex flex-col gap-2">
          <h4 className="text-teal-400 font-semibold mb-2">Follow Me</h4>
          <div className="flex gap-4 mt-1">
            <motion.a
              whileHover={{ scale: 1.2 }}
              href="https://twitter.com/xVaibsMx"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-300 hover:text-teal-400 transition"
            >
              <Twitter className="w-5 h-5" />
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.2 }}
              href="https://github.com/xVaibsMx"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-300 hover:text-teal-400 transition"
            >
              <Github className="w-5 h-5" />
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.2 }}
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-300 hover:text-teal-400 transition"
            >
              <Linkedin className="w-5 h-5" />
            </motion.a>
          </div>
        </div>
      </div>

      {/* Built & Maintained */}
      <div className="mt-12 text-center text-gray-500 text-sm border-t border-white/10 pt-6 flex flex-col gap-1">
        <span>
          &copy; {new Date().getFullYear()} STUDBUD. All rights reserved.
        </span>
        <span>
          Built and maintained by{' '}
          <a
            href="https://github.com/xVaibsMx"
            target="_blank"
            rel="noopener noreferrer"
            className="text-teal-400 hover:underline"
          >
            Vaibhav.M
          </a>
        </span>
        <span>
          Follow on{' '}
          <a
            href="https://x.com/xVaibsMx"
            target="_blank"
            rel="noopener noreferrer"
            className="text-teal-400 hover:underline"
          >
            X (Twitter)
          </a>
        </span>
      </div>
    </footer>
  )
}

export default Footer
