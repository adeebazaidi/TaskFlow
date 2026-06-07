import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import App from './App';
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3500,
            style: {
              background: '#FFFFFF',
              color: '#0F172A',
              border: '1px solid #E2E8F0',
              borderRadius: '12px',
              fontSize: '14px',
              fontFamily: 'Inter, system-ui, sans-serif',
              padding: '12px 16px',
              boxShadow: '0 4px 24px -4px rgba(0,0,0,0.12), 0 2px 8px -4px rgba(0,0,0,0.08)',
            },
            success: {
              iconTheme: { primary: '#22C55E', secondary: '#FFFFFF' },
            },
            error: {
              iconTheme: { primary: '#EF4444', secondary: '#FFFFFF' },
            },
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
