import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Get repository name from environment variable or use default
// For GitHub Pages, the base should be '/REPOSITORY-NAME/'
// If deploying to a custom domain, set base to '/'
const repoName = process.env.VITE_REPO_NAME || 'drmrtl'
// Use production mode for GitHub Pages builds
// In dev mode, base is '/' for local development
// In production builds, base is '/REPOSITORY-NAME/' for GitHub Pages
const isProduction = process.env.NODE_ENV === 'production' || process.env.CI === 'true'
const base = isProduction ? `/${repoName}/` : '/'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: base,
  server: {
    port: 3000,
    open: true
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  }
})
