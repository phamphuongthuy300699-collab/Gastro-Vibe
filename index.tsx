import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

// --- SYSTEM SAFETY NET ---
// Если приложение упадет до загрузки React, мы увидим ошибку
window.onerror = function(message, source, lineno, colno, error) {
  const root = document.getElementById('root');
  if (root) {
    root.innerHTML = `
      <div style="background:#1a1a1b; color:#C5A059; height:100%; padding:20px; font-family:monospace; display:flex; flex-direction:column; justify-content:center;">
        <h1 style="font-size:24px; margin-bottom:10px;">⚠️ APP CRASHED</h1>
        <p style="color:white; margin-bottom:20px;">Startup failed.</p>
        <div style="background:rgba(255,0,0,0.1); border:1px solid #ef4444; padding:15px; border-radius:8px; color:#fca5a5; overflow:auto;">
           <strong>Error:</strong> ${message}<br/>
           <small>${source}:${lineno}</small>
        </div>
        <button onclick="window.location.reload()" style="margin-top:20px; padding:15px; background:#C5A059; border:none; color:black; font-weight:bold; cursor:pointer;">RELOAD</button>
      </div>
    `;
  }
};

const rootElement = document.getElementById('root');

if (rootElement) {
  try {
    const root = createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  } catch (e) {
    console.error("React Mount Error:", e);
    throw e;
  }
} else {
  console.error("Root element not found");
}