import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { AuthProvider } from './store/auth.jsx';
import { MantineProvider } from '@mantine/core';

ReactDOM.createRoot(document.getElementById('root')).render(
  <AuthProvider>
  <React.StrictMode>
  <MantineProvider>
    <App />
  </MantineProvider>
  </React.StrictMode>
  </AuthProvider>
)
