import React, { useEffect, useState } from 'react'
import { Brain, Clock, HelpCircle, BarChart3 } from 'lucide-react'

const Dashboard = () => {
  const [username, setUsername] = useState('')

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
        if (data.username) setUsername(data.username)
      })
      .catch((err) => {
        console.error('Auth check failed:', err)
      })
  }, [])

  return (
    <main className="flex flex-col items-center px-4 py-10 text-white font-[Orbitron]">
      {/* Welcome */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl md:text-5xl font-bold">
          Welcome to Stud-Bud, {username}!
        </h1>
        <p className="text-xl text-slate-400">Here’s your learning cockpit.</p>
      </div>

      {/* Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10 w-full max-w-4xl">
        {/* Card 1 */}
        <div className="p-6 rounded-xl bg-gradient-to-br from-cyan-600 via-cyan-500 to-cyan-700/80 shadow-lg hover:shadow-cyan-400/30 transition duration-300">
          <div className="flex gap-4 items-center">
            <Brain className="w-10 h-10 text-white" />
            <div>
              <h2 className="text-xl font-semibold text-white">
                Explain Like I'm 5
              </h2>
              <p className="text-slate-100 text-sm">Simplify complex topics.</p>
            </div>
          </div>
        </div>

        {/* Card 2 */}
        <div className="p-6 rounded-xl bg-gradient-to-br from-pink-600 via-pink-500 to-pink-700/80 shadow-lg hover:shadow-pink-400/30 transition duration-300">
          <div className="flex gap-4 items-center">
            <Clock className="w-10 h-10 text-white" />
            <div>
              <h2 className="text-xl font-semibold text-white">
                Quick Revision
              </h2>
              <p className="text-slate-100 text-sm">Speed-revise in 60s.</p>
            </div>
          </div>
        </div>

        {/* Card 3 */}
        <div className="p-6 rounded-xl bg-gradient-to-br from-yellow-500 via-yellow-400 to-yellow-600/80 shadow-lg hover:shadow-yellow-300/30 transition duration-300">
          <div className="flex gap-4 items-center">
            <HelpCircle className="w-10 h-10 text-white" />
            <div>
              <h2 className="text-xl font-semibold text-white">Quiz Me</h2>
              <p className="text-slate-100 text-sm">Test your understanding.</p>
            </div>
          </div>
        </div>

        {/* Card 4 */}
        <div className="p-6 rounded-xl bg-gradient-to-br from-green-500 via-green-400 to-green-600/80 shadow-lg hover:shadow-green-300/30 transition duration-300">
          <div className="flex gap-4 items-center">
            <BarChart3 className="w-10 h-10 text-white" />
            <div>
              <h2 className="text-xl font-semibold text-white">
                Study History
              </h2>
              <p className="text-slate-100 text-sm">
                Track your learning progress.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default Dashboard
