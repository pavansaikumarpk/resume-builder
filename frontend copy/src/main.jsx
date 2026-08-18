import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { GoogleOAuthProvider } from '@react-oauth/google';

// Pull the Client ID from Vite Environment Variables
const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

// 🚀 CTO DEBUGGING CHECK: This will warn us in the live production console
if (!clientId || clientId === 'undefined') {
  console.error("🚨 CRITICAL FRONTEND ERROR: VITE_GOOGLE_CLIENT_ID is missing or undefined in Vercel!");
} else {
  console.log("✅ Google Client ID Loaded:", clientId.substring(0, 15) + "...");
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={clientId || "MISSING_ID"}>
      <App />
    </GoogleOAuthProvider>
  </React.StrictMode>,
);