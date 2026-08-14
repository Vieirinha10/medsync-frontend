import { useEffect, useState } from 'react';
import {
  Routes,
  Route,
  Link,
  NavLink,
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
import PagamentoRetornoPage from './pages/PagamentoRetornoPage';
import CheckoutPage from './pages/CheckoutPage';
import DesafiosPage from './pages/DesafiosPage'; // 1. Importar a nova página
import ResultadoSimulacaoPage from './pages/ResultadoSimulacaoPage';
import AdminAcademicPage from './pages/AdminAcademicPage';
import CadernoErrosPage from './pages/CadernoErrosPage';
import TrilhasPage from './pages/TrilhasPage';
import RevisoesPage from './pages/RevisoesPage';
import { InstitutionalPage, LegalPage } from './pages/InstitutionalPage';
import SiteFooter from './components/SiteFooter';
import ProtectedRoute from './components/ProtectedRoute';
import AnnouncementBanner from './components/AnnouncementBanner';
import { clearAuthToken, getAuthToken } from './services/api';

// Importa o arquivo de estilo principal
import './App.css';
import './styles/refresh.css';
import './styles/vibrance.css';
import './styles/simulation-v2.css';
import './styles/challenges.css';
import './styles/dashboard.css';
import './styles/footer.css';
import './styles/institutional.css';
import './styles/pricing.css';
import './styles/admin-academic.css';
import './styles/atmosphere.css';
import './styles/error-notebook.css';
import './styles/learning-paths.css';
import './styles/spaced-review.css';
import './styles/clinical-cards.css';
import './styles/admin-operations.css';
import './styles/challenge-cards.css';
import './styles/home-solid.css';
import './styles/platform-solid.css';
import './styles/checkout.css';
import './styles/visual-challenges-v2.css';
import './styles/review-center.css';

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isAuthenticated = Boolean(getAuthToken());

  useEffect(() => {
    setIsMenuOpen(false);
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
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
            <NavLink to="/casos">Casos clínicos</NavLink>
            <NavLink to="/desafios">Desafios</NavLink>
            <NavLink to="/trilhas">Trilhas</NavLink>
            <NavLink to="/revisoes">Revisões</NavLink>
            <NavLink to="/caderno-erros">Caderno de erros</NavLink>
            <NavLink to="/dashboard">Meu painel</NavLink>
            <NavLink to="/assinatura">Planos</NavLink>
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

      <AnnouncementBanner />

      <main className="App-main">
        <Routes>
          {/* --- Rotas Públicas --- */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/cadastro" element={<CadastroPage />} />
          <Route path="/assinatura" element={<PlanosPage />} />
          <Route path="/pagamento/retorno" element={<ProtectedRoute><PagamentoRetornoPage /></ProtectedRoute>} />
          <Route path="/checkout/:planId" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
          <Route path="/sobre" element={<InstitutionalPage page="sobre" />} />
          <Route path="/diferenciais" element={<InstitutionalPage page="diferenciais" />} />
          <Route path="/embaixadores" element={<InstitutionalPage page="embaixadores" />} />
          <Route path="/termos" element={<LegalPage page="termos" />} />
          <Route path="/privacidade" element={<LegalPage page="privacidade" />} />

          {/* --- Rotas Protegidas --- */}
          <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/casos" element={<ProtectedRoute><CasosListPage /></ProtectedRoute>} />
          <Route path="/casos/:casoId" element={<ProtectedRoute><SimulacaoCaso /></ProtectedRoute>} />
          <Route path="/resultados/:progressoId" element={<ProtectedRoute><ResultadoSimulacaoPage /></ProtectedRoute>} />
          <Route path="/desafios" element={<ProtectedRoute><DesafiosPage /></ProtectedRoute>} /> {/* 3. Adicionar a nova rota */}
          <Route path="/caderno-erros" element={<ProtectedRoute><CadernoErrosPage /></ProtectedRoute>} />
          <Route path="/trilhas" element={<ProtectedRoute><TrilhasPage /></ProtectedRoute>} />
          <Route path="/trilhas/:trilhaId" element={<ProtectedRoute><TrilhasPage /></ProtectedRoute>} />
          <Route path="/revisoes" element={<ProtectedRoute><RevisoesPage /></ProtectedRoute>} />
          <Route path="/admin/academico" element={<ProtectedRoute><AdminAcademicPage /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute><AdminAcademicPage /></ProtectedRoute>} />
        </Routes>
      </main>

      <SiteFooter />
    </div>
  );
}

export default App;
