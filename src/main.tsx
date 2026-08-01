import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { appliquerTheme } from './hooks/useTheme'

// Avant le premier rendu, pour éviter un éclair de thème clair au chargement.
appliquerTheme()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
