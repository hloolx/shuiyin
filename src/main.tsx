import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { registerSW } from './hooks/usePWA'

// 注册 Service Worker（仅在生产环境）
if (import.meta.env.PROD) {
  registerSW();
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
