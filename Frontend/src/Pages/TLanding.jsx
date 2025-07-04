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
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
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
  },
  {
    icon: (
      <svg
        className="w-12 h-12 mb-5 text-violet-400"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        viewBox="0 0 24 24"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          cx="12"
          cy="12"
          r="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" />
      </svg>
    ),
    title: 'Quick Revision',
    description:
      'Refresh your knowledge in just one minute with concise, focused summaries.',
  },
  {
    icon: (
      <svg
        className="w-12 h-12 mb-5 text-cyan-400"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        viewBox="0 0 24 24"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6M12 9v6" />
      </svg>
    ),
    title: 'Instant Quizzes',
    description:
      'Challenge yourself immediately with smart quizzes to check what you’ve learned.',
  },
  {
    icon: (
      <svg
        className="w-12 h-12 mb-5 text-pink-400"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        viewBox="0 0 24 24"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4 6h16M4 12h8m-8 6h16"
        />
      </svg>
    ),
    title: 'Progress Tracking',
    description:
      'Keep a clear history of your studies and see your progress over time.',
  },
]

const featureShadows = [
  'hover:shadow-teal-400/50',
  'hover:shadow-violet-400/50',
  'hover:shadow-cyan-400/50',
  'hover:shadow-pink-400/50',
]

const TLanding = () => {
  return (
    <main className="flex flex-col justify-center items-center text-center max-w-6xl mx-auto mt-12 mb-20 px-4 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <section className="max-w-4xl mb-16">
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight tracking-tight mb-6">
          Meet <span className="text-teal-400">Stud-Bud</span>
          <br />
          Your AI-Powered Study Buddy
        </h2>
        <p className="text-base sm:text-lg text-slate-300 max-w-xl mx-auto mb-8 leading-relaxed">
          Simplify learning, master topics quickly, and track your progress{' '}
          <br className="hidden sm:block" />
          effortlessly with Stud-Bud’s smart AI tools.
        </p>
        <button
          className="bg-teal-400 hover:bg-teal-500 active:bg-teal-600 text-gray-900 font-semibold px-8 sm:px-10 py-3 sm:py-4 rounded-full shadow-lg transition duration-300"
          aria-label="Get started with Stud-Bud"
          onClick={() => alert('Welcome to Stud-Bud!')}
        >
          Get Started
        </button>
      </section>
      <section className="mt-12 text-center">
        <h3 className="text-3xl font-bold mb-4">
          Start Your Journey with Stud-Bud
        </h3>
        <p className="text-lg text-slate-300 mb-6">
          Sign up today to experience smarter learning!
        </p>
        <button
          className="bg-teal-400 hover:bg-teal-500 active:bg-teal-600 text-gray-900 font-semibold px-8 py-3 rounded-full shadow-lg transition duration-300"
          aria-label="Sign up for Stud-Bud"
          onClick={() => alert('Sign up clicked!')}
        >
          Sign Up
        </button>
      </section>

      {/* Features Section */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 w-full max-w-6xl">
        {features.map(({ icon, title, description }, index) => (
          <article
            key={index}
            className={`bg-[#1e293b] rounded-xl p-6 sm:p-8 shadow-lg transition transform hover:-translate-y-1 cursor-pointer ${featureShadows[index]}`}
          >
            {icon}
            <h3 className="text-lg sm:text-xl font-semibold mb-2">{title}</h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              {description}
            </p>
          </article>
        ))}
      </section>
      <footer className="bg-[#1e293b] text-center py-6 mt-12">
        <p className="text-slate-300">© 2025 Stud-Bud. All rights reserved.</p>
        <div className="mt-4">
          <a href="#" className="text-teal-400 mx-4">
            Privacy Policy
          </a>
          <a href="#" className="text-teal-400 mx-4">
            Terms of Service
          </a>
          <a href="#" className="text-teal-400 mx-4">
            Contact
          </a>
        </div>
      </footer>
    </main>
  )
}

export default TLanding
