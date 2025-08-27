import React from 'react'
import { useNavigate } from 'react-router-dom'

const Features = () => {
  const navigate = useNavigate()

  const features = [
    {
      icon: (
        <svg
          className="w-12 h-12 mb-6 text-teal-400"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 20v-6m0 0V4m0 10h6m-6 0H6"
          />
        </svg>
      ),
      title: 'Explain Simply',
      description:
        'Complex ideas broken down into easy, bite-sized explanations anyone can understand.',
      path: '/explain',
    },
    {
      icon: (
        <svg
          className="w-12 h-12 mb-6 text-violet-400"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M12 6v6l4 2" />
        </svg>
      ),
      title: 'Quick Revision',
      description:
        'Refresh your knowledge in just one minute with concise, focused summaries.',
      path: '/revise',
    },
    {
      icon: (
        <svg
          className="w-12 h-12 mb-6 text-cyan-400"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path d="M9 12h6M12 9v6" />
        </svg>
      ),
      title: 'Instant Quizzes',
      description:
        'Challenge yourself immediately with smart quizzes to check what you’ve learned.',
      path: '/quiz',
    },
  ]

  const featureShadows = [
    'hover:shadow-teal-400/40',
    'hover:shadow-violet-400/40',
    'hover:shadow-cyan-400/40',
  ]

  const handleFeatureClick = (path) => {
    const token = localStorage.getItem('token')
    if (token) {
      navigate(path)
    } else {
      alert('Please register or login first.')
      navigate('/register')
    }
  }

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 w-full max-w-6xl mt-20">
      {features.map(({ icon, title, description, path }, index) => (
        <article
          key={index}
          onClick={() => handleFeatureClick(path)}
          className={`bg-[#172036] rounded-2xl p-8 shadow-lg transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 cursor-pointer ${featureShadows[index]}`}
          style={{
            fontFamily: 'Inter, sans-serif',
          }}
        >
          {icon}
          <h3
            className="text-xl font-semibold mb-3"
            style={{ fontFamily: 'Poppins, sans-serif' }}
          >
            {title}
          </h3>
          <p className="text-slate-300 text-sm leading-relaxed">
            {description}
          </p>
        </article>
      ))}
    </section>
  )
}

export default Features
