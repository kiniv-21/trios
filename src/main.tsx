import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { Admin } from './pages/Admin.tsx';
import './index.css';

const isAdminPath = /\/admin\/?$/.test(window.location.pathname);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {isAdminPath ? <Admin /> : <App />}
  </StrictMode>
);