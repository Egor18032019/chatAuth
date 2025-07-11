import React from 'react';
import ReactDOM from 'react-dom/client'; 
 
import './index.css';
import App from './App';
import { AuthProvider } from "./providers/AuthProvider"
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider> {/* Обёртка для глобального состояния */}
      <App />
    </AuthProvider>
  </React.StrictMode>,

);

