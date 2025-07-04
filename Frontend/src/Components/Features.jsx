import React from 'react'

const features = [
  {
    icon: (
      <svg
        className="w-12 h-12 mb-5 text-teal-400"
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
    onClick: () => console.log('Explain Simply clicked!'),
  },
  {
    icon: (
      <svg
        className="w-12 h-12 mb-5 text-violet-400"
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
    onClick: () => console.log('Quick Revision clicked!'),
  },
  {
    icon: (
      <svg
        className="w-12 h-12 mb-5 text-cyan-400"
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
    onClick: () => console.log('Instant Quizzes clicked!'),
  },
  {
    icon: (
      <svg
        className="w-12 h-12 mb-5 text-pink-400"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        viewBox="0 0 24 24"
      >
        <path d="M4 6h16M4 12h8m-8 6h16" />
      </svg>
    ),
    title: 'Progress Tracking',
    description:
      'Keep a clear history of your studies and see your progress over time.',
    onClick: () => console.log('Progress Tracking clicked!'),
  },
]

const featureShadows = [
  'hover:shadow-teal-400/50',
  'hover:shadow-violet-400/50',
  'hover:shadow-cyan-400/50',
  'hover:shadow-pink-400/50',
]

const Features = () => {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 w-full max-w-6xl mt-16">
      {features.map(({ icon, title, description, onClick }, index) => (
        <article
          key={index}
          className={`bg-[#1e293b] rounded-xl p-6 sm:p-8 shadow-lg transition transform hover:-translate-y-1 cursor-pointer ${featureShadows[index]}`}
          onClick={onClick} // onClick functionality passed here
        >
          {icon}
          <h3 className="text-lg sm:text-xl font-semibold mb-2">{title}</h3>
          <p className="text-slate-300 text-sm leading-relaxed">
            {description}
          </p>
        </article>
      ))}
    </section>
  )
}

export default Features
