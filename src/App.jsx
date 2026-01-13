import React, { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import HomePage from './pages/HomePage'
import ReportPage from './pages/ReportPage'
import './App.css'

function App() {
  const location = useLocation()

  // Handle GitHub Pages 404.html redirect
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search)
    if (searchParams.has('/')) {
      const path = searchParams.get('/')
      if (path) {
        window.history.replaceState({}, '', path)
        window.location.reload()
      }
    }
  }, [location])

  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/report" element={<ReportPage />} />
      </Routes>
    </div>
  )
}

export default App
