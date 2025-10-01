import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './main.css';
import App from './App.jsx';
import { AuthProvider } from './components/context/AuthProvider';
import NotificationProvider from "./components/notifications/NotificationProvider";

const theme = ['light', 'dark'];
document.querySelector('body').setAttribute('data-theme', theme[Math.floor(Math.random() * theme.length)]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <NotificationProvider>
          <Routes>
            <Route path="/*" element={<App />} />
          </Routes>
        </NotificationProvider>
       
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
