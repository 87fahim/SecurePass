import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './main.css';
import App from './App.jsx';
import { AuthProvider } from './components/context/AuthProvider';

const theme = ['light', 'dark', 'purple', 'green'];
document.querySelector('body').setAttribute('data-theme', theme[Math.floor(Math.random() * theme.length)]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/*" element={<App />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
