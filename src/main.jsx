import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

console.log('Firebase Config Check:', {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY ? 'Found' : 'Missing',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ? 'Found' : 'Missing',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID ? 'Found' : 'Missing'
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
