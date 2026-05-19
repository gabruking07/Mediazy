import React from 'react';
import ReactDOM from 'react-dom/client';
import { Toaster } from 'react-hot-toast';
import App from './App.jsx';
import './styles.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
    <Toaster
      position="top-center"
      toastOptions={{
        style: {
          background: '#101826',
          border: '1px solid rgba(255,255,255,0.14)',
          color: '#eef6ff'
        }
      }}
    />
  </React.StrictMode>
);
