import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import NavBar from './Components/NavBar'
import Register from './Routes/Register'
import Login from './Routes/Login'
import Landing from './Routes/Landing'
import Dashboard from './Routes/Dashboard'
import Explain from './Routes/Explain'

const App = () => {
  return (
    <>
      <Router>
        <NavBar />
        <Routes>
          <Route path="/" element={<Landing />}></Route>
          <Route path="/register" element={<Register />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/dashboard" element={<Dashboard />}></Route>
          <Route path="/explain" element={<Explain />}></Route>
        </Routes>
      </Router>
    </>
  )
}

export default App
