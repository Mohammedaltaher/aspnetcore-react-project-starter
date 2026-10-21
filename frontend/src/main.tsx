import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './design.css'
import './reference-theme.css'
import './dashboard-reference.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
