import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './assets/css/index.css'

const root = createRoot(document.getElementById('root') as HTMLElement)
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
