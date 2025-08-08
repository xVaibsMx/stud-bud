import React from 'react'
import { useNavigate } from 'react-router-dom'
import { FaLightbulb, FaBrain, FaClock } from 'react-icons/fa'

const Dashboard = () => {
  const navigate = useNavigate()
  const token = localStorage.getItem('token')

  const handleFeatureClick = (path) => {
    if (!token) {
      alert('Please log in to access this feature.')
      navigate('/login')
      return
    }
    navigate(path)
  }

  const features = [
    {
      icon: <FaLightbulb className="w-12 h-12 text-teal-400 mb-4" />,
      title: 'Explain Like I’m 5',
      desc: 'Understand complex topics in simple terms.',
      path: '/explain',
      shadow: 'hover:shadow-[0_0_20px_#14b8a6]',
    },
    {
      icon: <FaClock className="w-12 h-12 text-yellow-400 mb-4" />,
      title: '1-Minute Revision',
      desc: 'Quick recaps to boost retention.',
      path: '/revise',
      shadow: 'hover:shadow-[0_0_20px_#facc15]',
    },
    {
      icon: <FaBrain className="w-12 h-12 text-pink-400 mb-4" />,
      title: 'Quiz Me',
      desc: 'Test yourself and stay sharp.',
      path: '/quiz',
      shadow: 'hover:shadow-[0_0_20px_#f472b6]',
    },
  ]

  return (
    <main className="min-h-screen bg-slate-900 text-white px-6 sm:px-12 lg:px-24 py-12">
      {/* Welcome Header */}
      <section className="mb-16 text-center max-w-3xl mx-auto">
        <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">
          Welcome back, <span className="text-teal-400">Learner!</span>
        </h1>
        <p className="text-lg text-slate-300">
          Let’s make today productive. What would you like to explore?
        </p>
      </section>

      {/* Feature Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto mb-16">
        {features.map(({ icon, title, desc, path, shadow }, index) => (
          <div
            key={index}
            onClick={() => handleFeatureClick(path)}
            className={`bg-slate-800 rounded-2xl p-8 cursor-pointer shadow-md group transition duration-300 ${shadow} flex flex-col items-center text-center`}
            role="button"
            tabIndex={0}
            onKeyDown={(e) =>
              e.key === 'Enter' || e.key === ' '
                ? handleFeatureClick(path)
                : null
            }
          >
            {icon}
            <h3 className="text-2xl font-semibold mb-3 group-hover:text-teal-300 transition">
              {title}
            </h3>
            <p className="text-base text-slate-400">{desc}</p>
          </div>
        ))}
      </section>

      {/* Motivation Card */}
      <section className="text-center bg-gradient-to-r from-teal-500 to-cyan-500 text-slate-900 p-8 rounded-2xl shadow-xl max-w-3xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold mb-3">
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
