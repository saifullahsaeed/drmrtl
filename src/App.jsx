import React, { useEffect } from 'react'
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom'
import HomePage from './pages/HomePage'
import ReportPage from './pages/ReportPage'
import './App.css'

function App() {
  const location = useLocation()
  const navigate = useNavigate()

  // Handle GitHub Pages 404.html redirect
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search)
    if (searchParams.has('/')) {
      const path = searchParams.get('/')
      if (path) {
        // Use navigate instead of reload to avoid blank screen
        navigate(path, { replace: true })
      }
    }
  }, [location, navigate])

  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/report" element={<ReportPage />} />
        <Route path="*" element={<HomePage />} />
      </Routes>
    </div>
  )
}

export default App
