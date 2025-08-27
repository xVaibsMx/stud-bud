import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Landing from './Pages/Landing'
import NavBar from './Components/NavBar'
import Footer from './Components/Footer'
import Register from './Pages/Register'
import Login from './Pages/Login'
import Dashboard from './Pages/Dashboard'
import Explain from './Pages/Explain'
import Quiz from './Pages/Quiz'
import QuickRevision from './Pages/QuickRevision'

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <NavBar />

        {/* Main content grows to fill space */}
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/explain" element={<Explain />} />
            <Route path="/quiz" element={<Quiz />} />
            <Route path="/revise" element={<QuickRevision />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App
