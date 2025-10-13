import React from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';

// Importação de todas as nossas páginas e componentes
import HomePage from './pages/HomePage';
import CasosListPage from './pages/CasosListPage';
import SimulacaoCaso from './pages/SimulacaoCaso';
import DashboardPage from './pages/DashboardPage';
import CadastroPage from './pages/CadastroPage';
import LoginPage from './pages/LoginPage';
import PlanosPage from './pages/PlanosPage';
import ProtectedRoute from './components/ProtectedRoute'; // Nosso "segurança"

// Importa o arquivo de estilo principal
import './App.css';

function App() {
  const navigate = useNavigate();

  // Função para fazer logout
  const handleLogout = () => {
    localStorage.removeItem('authToken');
    alert('Você saiu da sua conta.');
    navigate('/login');
  };

  return (
    <div className="App">
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
          {/* --- Rotas Públicas (acessíveis por todos) --- */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} /> {/* A ROTA DE LOGIN ESTÁ AQUI, NO LUGAR CERTO */}
          <Route path="/cadastro" element={<CadastroPage />} />
          <Route path="/assinatura" element={<PlanosPage />} />

          {/* --- Rotas Protegidas (apenas para usuários logados) --- */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/casos" 
            element={
              <ProtectedRoute>
                <CasosListPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/casos/:casoId" 
            element={
              <ProtectedRoute>
                <SimulacaoCaso />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </main>

      <footer className="App-footer">
        <p>&copy; 2025 MEDSYNC. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}

export default App;

