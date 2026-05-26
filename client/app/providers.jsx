'use client';

import { Toaster } from 'react-hot-toast';

export default function Providers() {
  return (
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
  );
}
