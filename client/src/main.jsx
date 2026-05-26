import React from 'react';
import ReactDOM from 'react-dom/client';
import { Toaster } from 'react-hot-toast';
import App from './App.jsx';
import './styles.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
    <Toaster
      gutter={12}
      position="top-right"
      toastOptions={{
        duration: 4200,
        style: {
          padding: 0,
          background: '#101826',
          border: '0',
          boxShadow: 'none',
          color: '#eef6ff',
          maxWidth: 'min(92vw, 420px)'
        }
      }}
    />
  </React.StrictMode>
);