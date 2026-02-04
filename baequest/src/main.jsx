import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './components/App.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'
import './index.css'
import { BrowserRouter } from "react-router-dom";
import { GoogleOAuthProvider } from '@react-oauth/google';
import { initGA } from './utils/analytics.js';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

// Initialize Google Analytics
initGA();

ReactDOM.createRoot(document.getElementById('root')).render(

  <React.StrictMode>
    <ErrorBoundary>
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </GoogleOAuthProvider>
    </ErrorBoundary>
  </React.StrictMode>,
)
