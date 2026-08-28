import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';

// Importa um CSS global que deixaremos vazio por enquanto.
import './index.css';

// O tema escuro é a identidade visual oficial do MedSync.
document.documentElement.dataset.theme = 'dark';
document.documentElement.style.colorScheme = 'dark';

// Configura o React para rodar dentro do roteador de navegação.
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);