import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Suppress noisy THREE.Clock and WebGL Context Lost warnings from dependencies
if (typeof window !== 'undefined') {
  const originalWarn = console.warn;
  console.warn = (...args: any[]) => {
    if (typeof args[0] === 'string') {
      const msg = args[0];
      if (
        msg.includes('THREE.Clock: This module has been deprecated.') ||
        msg.includes('THREE.WebGLRenderer: Context Lost.') ||
        msg.includes('using deprecated parameters for the initialization function')
      ) {
        return;
      }
    }
    originalWarn(...args);
  };
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
