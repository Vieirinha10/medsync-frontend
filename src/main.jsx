import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';

// Importa um CSS global que deixaremos vazio por enquanto.
import './index.css';

// Aplica a preferência antes da montagem para evitar mudança visual durante o carregamento.
try {
  const savedTheme = window.localStorage.getItem('medsync-theme');
  document.documentElement.dataset.theme = savedTheme === 'dark' ? 'dark' : 'light';
  document.documentElement.style.colorScheme = savedTheme === 'dark' ? 'dark' : 'light';
} catch {
  document.documentElement.dataset.theme = 'light';
}

// Configura o React para rodar dentro do roteador de navegação.
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);