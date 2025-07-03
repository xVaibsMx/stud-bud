import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Landing from './Pages/Landing'
import NavBar from './Components/NavBar'
function App() {
  return (
    <>
      <Router>
        <NavBar />
        <Routes>
          <Route path="/" element={<Landing />}></Route>
        </Routes>
      </Router>
    </>
  )
}

export default App
