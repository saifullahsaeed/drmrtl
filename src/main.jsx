import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import ErrorBoundary from './ErrorBoundary'
import './index.css'

// Get base path from import.meta.env.BASE_URL (set by Vite)
// React Router basename should NOT have a trailing slash
const basePath = import.meta.env.BASE_URL || '/'
const normalizedBasePath = basePath === '/' ? '/' : basePath.replace(/\/$/, '')

// Ensure root element exists before rendering
const rootElement = document.getElementById('root')
if (!rootElement) {
  console.error('Root element not found!')
} else {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <ErrorBoundary>
        <BrowserRouter basename={normalizedBasePath}>
          <App />
        </BrowserRouter>
      </ErrorBoundary>
    </React.StrictMode>,
  )
}
