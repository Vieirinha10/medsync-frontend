import React from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';

// Importação das páginas e componentes
import HomePage from './pages/HomePage';
import CasosListPage from './pages/CasosListPage';
import SimulacaoCaso from './pages/SimulacaoCaso';
import DashboardPage from './pages/DashboardPage';
import CadastroPage from './pages/CadastroPage';
import LoginPage from './pages/LoginPage';
import PlanosPage from './pages/PlanosPage';
import ProtectedRoute from './components/ProtectedRoute';

import './App.css';

function App() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    alert('Você saiu da sua conta.');
    navigate('/login');
  };

  return (
    <div className="App">
      {/* Componente de Fundo de Vídeo */}
      <div className="video-background">
        <video autoPlay loop muted playsInline>
          <source src="/background-video.mp4" type="video/mp4" />
          Seu navegador não suporta vídeos em HTML5.
        </video>
      </div>

      <header className="App-header">
        <nav className="App-nav">
          <Link to="/" className="logo-link">
            <img src="/logo-medsync.png" alt="Logo da MedSync" className="logo-image" />
          </Link>
          <div className="nav-links">
            <Link to="/casos">Casos Clínicos</Link>
            <Link to="/dashboard">Meu Painel</Link>
            <Link to="/assinatura">Planos</Link>
            <Link to="/login">Entrar</Link>
            <button onClick={handleLogout} className="logout-button">Sair</button>
            <Link to="/cadastro" className="login-button">Cadastre-se Grátis</Link>
          </div>
        </nav>
      </header>

      <main className="App-main">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/cadastro" element={<CadastroPage />} />
          <Route path="/assinatura" element={<PlanosPage />} />
          <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/casos" element={<ProtectedRoute><CasosListPage /></ProtectedRoute>} />
          <Route path="/casos/:casoId" element={<ProtectedRoute><SimulacaoCaso /></ProtectedRoute>} />
        </Routes>
      </main>

      <footer className="App-footer">
        <p>&copy; 2025 MEDSYNC. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}

export default App;