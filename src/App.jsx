import { lazy, Suspense, useEffect, useState } from 'react';
import {
  Routes,
  Route,
  Link,
  NavLink,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import {
  FiBookOpen,
  FiChevronDown,
  FiCreditCard,
  FiGrid,
  FiLayers,
  FiLogOut,
  FiMenu,
  FiUser,
  FiX,
} from 'react-icons/fi';

import HomePage from './pages/HomePage';
import SiteFooter from './components/SiteFooter';
import ProtectedRoute from './components/ProtectedRoute';
import AnnouncementBanner from './components/AnnouncementBanner';
import { clearAuthToken, getAuthToken } from './services/api';

const CasosListPage = lazy(() => import('./pages/CasosListPage'));
const SimulacaoCaso = lazy(() => import('./pages/SimulacaoCaso'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const CadastroPage = lazy(() => import('./pages/CadastroPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const VerificarEmailPage = lazy(() => import('./pages/VerificarEmailPage'));
const RecuperarSenhaPage = lazy(() => import('./pages/RecuperarSenhaPage'));
const RedefinirSenhaPage = lazy(() => import('./pages/RedefinirSenhaPage'));
const PlanosPage = lazy(() => import('./pages/PlanosPage'));
const PagamentoRetornoPage = lazy(() => import('./pages/PagamentoRetornoPage'));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'));
const DesafiosPage = lazy(() => import('./pages/DesafiosPage'));
const ResultadoSimulacaoPage = lazy(() => import('./pages/ResultadoSimulacaoPage'));
const AdminAcademicPage = lazy(() => import('./pages/AdminAcademicPage'));
const CadernoErrosPage = lazy(() => import('./pages/CadernoErrosPage'));
const TrilhasPage = lazy(() => import('./pages/TrilhasPage'));
const RevisoesPage = lazy(() => import('./pages/RevisoesPage'));
const QuestoesPage = lazy(() => import('./pages/QuestoesPage'));
const InstitutionalPage = lazy(() => import('./pages/InstitutionalPage').then((module) => ({
  default: module.InstitutionalPage,
})));
const LegalPage = lazy(() => import('./pages/InstitutionalPage').then((module) => ({
  default: module.LegalPage,
})));

// Importa o arquivo de estilo principal
import './App.css';
import './styles/refresh.css';
import './styles/vibrance.css';
import './styles/footer.css';
import './styles/atmosphere.css';
import './styles/platform-solid.css';
import './styles/theme.css';


function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openNavMenu, setOpenNavMenu] = useState(null);
  const isAuthenticated = Boolean(getAuthToken());
  const isMoreActive = ['/trilhas', '/caderno-erros'].some((path) => location.pathname.startsWith(path));
  const isAccountActive = location.pathname.startsWith('/dashboard');

  useEffect(() => {
    setIsMenuOpen(false);
    setOpenNavMenu(null);
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [location.pathname]);

  useEffect(() => {
    if (!openNavMenu) return undefined;

    const closeDropdown = (event) => {
      if (!event.target.closest('.nav-dropdown')) setOpenNavMenu(null);
    };
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setOpenNavMenu(null);
    };

    document.addEventListener('pointerdown', closeDropdown);
    document.addEventListener('keydown', closeOnEscape);

    return () => {
      document.removeEventListener('pointerdown', closeDropdown);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [openNavMenu]);

  const handleLogout = () => {
    clearAuthToken();
    setOpenNavMenu(null);
    navigate('/login');
  };

  const toggleNavMenu = (menu) => {
    setOpenNavMenu((current) => (current === menu ? null : menu));
  };

  return (
    <div className="App">
      <header className="App-header">
        <nav className="App-nav">
          <Link to="/" className="logo-link">
            <img src="/logo-medsync.png" alt="MedSync" className="logo-image" />
          </Link>

          <button
            type="button"
            className="nav-toggle"
            aria-label={isMenuOpen ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={isMenuOpen}
            onClick={() => {
              setIsMenuOpen((current) => !current);
              setOpenNavMenu(null);
            }}
          >
            {isMenuOpen ? <FiX /> : <FiMenu />}
          </button>

          <div className={`nav-links ${isMenuOpen ? 'is-open' : ''}`}>
            <div className="nav-primary-links" aria-label="Treinamento">
              <NavLink to="/casos" className="nav-main-link">Casos clínicos</NavLink>
              <NavLink to="/desafios" className="nav-main-link">Desafios</NavLink>
              <NavLink to="/questoes" className="nav-main-link">Questões</NavLink>
              <NavLink to="/revisoes" className="nav-main-link">Revisões</NavLink>

              <div className={`nav-dropdown nav-more ${openNavMenu === 'more' ? 'is-open' : ''}`}>
                <button
                  type="button"
                  className={`nav-dropdown-trigger ${isMoreActive ? 'active' : ''}`}
                  aria-expanded={openNavMenu === 'more'}
                  aria-controls="more-navigation-menu"
                  onClick={() => toggleNavMenu('more')}
                >
                  Mais
                  <FiChevronDown aria-hidden="true" />
                </button>
                <div id="more-navigation-menu" className="nav-dropdown-panel">
                  <NavLink to="/trilhas">
                    <span className="nav-dropdown-icon"><FiLayers aria-hidden="true" /></span>
                    <span><strong>Trilhas</strong><small>Percursos guiados de aprendizagem</small></span>
                  </NavLink>
                  <NavLink to="/caderno-erros">
                    <span className="nav-dropdown-icon"><FiBookOpen aria-hidden="true" /></span>
                    <span><strong>Caderno de erros</strong><small>Revise seus pontos mais frágeis</small></span>
                  </NavLink>
                </div>
              </div>
            </div>

            <div className="nav-account-actions" aria-label="Conta e assinatura">

              <NavLink to="/assinatura" className="plans-nav-button">
                Planos
              </NavLink>

              {isAuthenticated ? (
                <div className={`nav-dropdown nav-account ${openNavMenu === 'account' ? 'is-open' : ''}`}>
                  <button
                    type="button"
                    className={`account-menu-trigger ${isAccountActive ? 'active' : ''}`}
                    aria-label="Abrir menu da conta"
                    aria-expanded={openNavMenu === 'account'}
                    aria-controls="account-navigation-menu"
                    onClick={() => toggleNavMenu('account')}
                  >
                    <span className="account-avatar"><FiUser aria-hidden="true" /></span>
                    <span className="account-label">Conta</span>
                    <FiChevronDown className="account-chevron" aria-hidden="true" />
                  </button>
                  <div id="account-navigation-menu" className="nav-dropdown-panel account-dropdown-panel">
                    <NavLink to="/dashboard">
                      <span className="nav-dropdown-icon"><FiGrid aria-hidden="true" /></span>
                      <span><strong>Meu painel</strong><small>Progresso e atividades</small></span>
                    </NavLink>
                    <NavLink to="/assinatura">
                      <span className="nav-dropdown-icon"><FiCreditCard aria-hidden="true" /></span>
                      <span><strong>Minha assinatura</strong><small>Plano e pagamentos</small></span>
                    </NavLink>
                    <button type="button" onClick={handleLogout} className="logout-button">
                      <span className="nav-dropdown-icon"><FiLogOut aria-hidden="true" /></span>
                      <span><strong>Sair</strong><small>Encerrar esta sessão</small></span>
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <Link to="/login" className="nav-login-link">Entrar</Link>
                  <Link to="/cadastro" className="login-button">
                    Criar conta grátis
                  </Link>
                </>
              )}
            </div>
          </div>
        </nav>
      </header>

      <AnnouncementBanner />

      <main className="App-main">
        <Suspense fallback={(
          <div className="route-loading" role="status" aria-live="polite">
            <img src="/logo-medsync.png" alt="" />
            <span>Carregando experiência MedSync…</span>
          </div>
        )}>
          <Routes>
          {/* --- Rotas Públicas --- */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/cadastro" element={<CadastroPage />} />
          <Route path="/verificar-email" element={<VerificarEmailPage />} />
          <Route path="/recuperar-senha" element={<RecuperarSenhaPage />} />
          <Route path="/redefinir-senha" element={<RedefinirSenhaPage />} />
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
          <Route path="/desafios" element={<ProtectedRoute><DesafiosPage /></ProtectedRoute>} />
          <Route path="/questoes" element={<ProtectedRoute><QuestoesPage /></ProtectedRoute>} />
          <Route path="/caderno-erros" element={<ProtectedRoute><CadernoErrosPage /></ProtectedRoute>} />
          <Route path="/trilhas" element={<ProtectedRoute><TrilhasPage /></ProtectedRoute>} />
          <Route path="/trilhas/:trilhaId" element={<ProtectedRoute><TrilhasPage /></ProtectedRoute>} />
          <Route path="/revisoes" element={<ProtectedRoute><RevisoesPage /></ProtectedRoute>} />
          <Route path="/admin/academico" element={<ProtectedRoute><AdminAcademicPage /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute><AdminAcademicPage /></ProtectedRoute>} />
          </Routes>
        </Suspense>
      </main>

      <SiteFooter />
    </div>
  );
}

export default App;
