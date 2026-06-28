import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import './index.css';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { CartProvider } from './context/CartContext.jsx';
import { LocationProvider } from './context/LocationContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <LocationProvider>
          <CartProvider>
            <App />
            <Toaster
              position="top-center"
              toastOptions={{
                style: {
                  background: '#15201B',
                  color: '#FAF7F0',
                  fontSize: '14px',
                  borderRadius: '10px',
                },
              }}
            />
          </CartProvider>
        </LocationProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
