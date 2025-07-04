import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Landing from './Pages/Landing'
import NavBar from './Components/NavBar'
import Register from './Pages/Register'
import Login from './Pages/Login.jsx'
import Dashboard from './Pages/Dashboard.jsx'
function App() {
  return (
    <>
      <Router>
        <NavBar />
        <Routes>
          <Route path="/" element={<Landing />}></Route>
          <Route path="/register" element={<Register />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/dashboard" element={<Dashboard />}></Route>
        </Routes>
      </Router>
    </>
  )
}

export default App
