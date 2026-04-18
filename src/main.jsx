import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { Toaster } from 'react-hot-toast'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
    <Toaster 
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: '#FFFFFF',
          color: '#1A1A0F',
          border: '1px solid #D4C9A8',
          borderRadius: '12px',
          boxShadow: '0 4px 14px 0 rgba(0,0,0,0.05)',
        },
        success: {
          iconTheme: {
            primary: '#27AE60',
            secondary: '#FFFFFF',
          },
        },
        error: {
          iconTheme: {
            primary: '#C0392B',
            secondary: '#FFFFFF',
          },
        },
      }}
    />
  </React.StrictMode>,
)
