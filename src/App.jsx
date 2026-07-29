import { useEffect, useState } from 'react';
import {
  Routes,
  Route,
  Link,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import { FiLogOut, FiMenu, FiX } from 'react-icons/fi';

// Importação de todas as nossas páginas e componentes
import HomePage from './pages/HomePage';
import CasosListPage from './pages/CasosListPage';
import SimulacaoCaso from './pages/SimulacaoCaso';
import DashboardPage from './pages/DashboardPage';
import CadastroPage from './pages/CadastroPage';
import LoginPage from './pages/LoginPage';
import PlanosPage from './pages/PlanosPage';
import DesafiosPage from './pages/DesafiosPage'; // 1. Importar a nova página
import ProtectedRoute from './components/ProtectedRoute';
import { clearAuthToken, getAuthToken } from './services/api';

// Importa o arquivo de estilo principal
import './App.css';
import './styles/refresh.css';
import './styles/vibrance.css';

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isAuthenticated = Boolean(getAuthToken());

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    clearAuthToken();
    navigate('/login');
  };

  return (
    <div className="App">
      <header className="App-header">
        <nav className="App-nav">
          <Link to="/" className="logo-link">
            <span className="logo-crop">
              <img src="/logo-medsync.png" alt="MedSync" className="logo-image" />
            </span>
          </Link>

          <button
            type="button"
            className="nav-toggle"
            aria-label={isMenuOpen ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen((current) => !current)}
          >
            {isMenuOpen ? <FiX /> : <FiMenu />}
          </button>

          <div className={`nav-links ${isMenuOpen ? 'is-open' : ''}`}>
            <Link to="/casos">Casos clínicos</Link>
            <Link to="/desafios">Desafios</Link>
            <Link to="/dashboard">Meu painel</Link>
            <Link to="/assinatura">Planos</Link>
            {isAuthenticated ? (
              <button onClick={handleLogout} className="logout-button">
                <FiLogOut aria-hidden="true" />
                Sair
              </button>
            ) : (
              <>
                <Link to="/login">Entrar</Link>
                <Link to="/cadastro" className="login-button">
                  Criar conta grátis
                </Link>
              </>
            )}
          </div>
        </nav>
      </header>

      <main className="App-main">
        <Routes>
          {/* --- Rotas Públicas --- */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/cadastro" element={<CadastroPage />} />
          <Route path="/assinatura" element={<PlanosPage />} />

          {/* --- Rotas Protegidas --- */}
          <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/casos" element={<ProtectedRoute><CasosListPage /></ProtectedRoute>} />
          <Route path="/casos/:casoId" element={<ProtectedRoute><SimulacaoCaso /></ProtectedRoute>} />
          <Route path="/desafios" element={<ProtectedRoute><DesafiosPage /></ProtectedRoute>} /> {/* 3. Adicionar a nova rota */}
        </Routes>
      </main>

      <footer className="App-footer">
        <div className="footer-content">
          <div>
            <strong>MEDSYNC</strong>
            <p>Prática clínica guiada para quem aprende medicina.</p>
          </div>
          <p>&copy; 2026 MEDSYNC. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
