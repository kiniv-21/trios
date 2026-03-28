import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { Admin } from './pages/Admin.tsx';
import './index.css';

const path = window.location.pathname.replace('/trios-data', '');
const isAdminPath = path === '/admin';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {isAdminPath ? <Admin /> : <App />}
  </StrictMode>
);