import React from 'react'
import ReactDOM from 'react-dom/client'
import { ThemeProvider } from './components/theme-provider'
import './global.css'
import { Toaster } from './components/ui/toaster'
import App from './App'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Toaster />
      <App />
    </ThemeProvider>
  </React.StrictMode>
)
