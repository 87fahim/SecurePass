import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './main.css'
import App from './App.jsx'
const theme = ['light', 'dark', 'purple']
document.querySelector('body').setAttribute('data-theme', theme[Math.floor(Math.random()* theme.length)])


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
