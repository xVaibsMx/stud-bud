import React from 'react'
import { useNavigate } from 'react-router-dom'
import { FaLightbulb, FaBrain, FaClock, FaChartLine } from 'react-icons/fa'

const Dashboard = () => {
  const navigate = useNavigate()

  const handleFeatureClick = (path) => {
    navigate(path)
  }

  const features = [
    {
      icon: <FaLightbulb className="w-10 h-10 text-teal-400 mb-4" />,
      title: 'Explain Like I’m 5',
      desc: 'Understand complex topics in simple terms.',
      path: '/explain',
      shadow: 'hover:shadow-[0_0_20px_#14b8a6]', // teal-500
    },
    {
      icon: <FaClock className="w-10 h-10 text-yellow-300 mb-4" />,
      title: '1-Minute Revision',
      desc: 'Quick recaps to boost retention.',
      path: '/revise',
      shadow: 'hover:shadow-[0_0_20px_#facc15]', // yellow-400
    },
    {
      icon: <FaBrain className="w-10 h-10 text-pink-400 mb-4" />,
      title: 'Quiz Me',
      desc: 'Test yourself and stay sharp.',
      path: '/quiz',
      shadow: 'hover:shadow-[0_0_20px_#f472b6]', // pink-400
    },
    {
      icon: <FaChartLine className="w-10 h-10 text-green-400 mb-4" />,
      title: 'My Progress',
      desc: 'Track your learning journey visually.',
      path: '/progress',
      shadow: 'hover:shadow-[0_0_20px_#4ade80]', // green-400
    },
  ]

  return (
    <main className="min-h-screen bg-slate-900 text-white px-6 sm:px-10 lg:px-20 py-12">
      {/* Welcome Header */}
      <section className="mb-14 text-center">
        <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 leading-tight">
          Welcome back, <span className="text-teal-400">Learner!</span>
        </h1>
        <p className="text-lg text-slate-300">
          Let’s make today productive. What would you like to explore?
        </p>
      </section>

      {/* Feature Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        {features.map(({ icon, title, desc, path, shadow }, index) => (
          <div
            key={index}
            onClick={() => handleFeatureClick(path)}
            className={`bg-slate-800 transition duration-300 rounded-2xl p-6 cursor-pointer shadow-md group ${shadow}`}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') handleFeatureClick(path)
            }}
          >
            <div className="flex flex-col items-center text-center">
              {icon}
              <h3 className="text-xl font-semibold mb-2 group-hover:text-teal-300 transition">
                {title}
              </h3>
              <p className="text-sm text-slate-400">{desc}</p>
            </div>
          </div>
        ))}
      </section>

      {/* Motivation Card */}
      <section className="text-center bg-gradient-to-r from-teal-500 to-cyan-500 text-slate-900 p-8 rounded-2xl shadow-xl max-w-3xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold mb-2">
          “Consistency is the key to mastery.”
        </h2>
        <p className="text-sm sm:text-base">
          Keep going. Even 1% better every day adds up!
        </p>
      </section>
    </main>
  )
}

export default Dashboard
