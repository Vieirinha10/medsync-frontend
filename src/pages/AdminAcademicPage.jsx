import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FiAlertTriangle,
  FiArrowLeft,
  FiBookOpen,
  FiCalendar,
  FiCheckCircle,
  FiRefreshCw,
  FiShield,
  FiUsers,
} from 'react-icons/fi';

import { api, ApiError } from '../services/api';

const AdminAcademicPage = () => {
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const loadAnalytics = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      setAnalytics(await api.getAcademicAnalytics());
    } catch (requestError) {
      if (requestError instanceof ApiError && requestError.status === 401) {
        navigate('/login', { replace: true });
        return;
      }
      setError(requestError.message);
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    loadAnalytics();
  }, [loadAnalytics]);

  const maxPeriod = useMemo(() => (
    Math.max(...(analytics?.periodos || []).map((item) => item.total), 1)
  ), [analytics]);

  if (isLoading) {
    return <div className="page-container admin-academic-state"><FiRefreshCw /> Preparando os indicadores acadêmicos...</div>;
  }

  if (error) {
    return (
      <div className="page-container admin-academic-error">
        <FiAlertTriangle />
        <h1>Acesso ao painel indisponível</h1>
        <p>{error}</p>
        <div><Link to="/dashboard"><FiArrowLeft /> Voltar ao meu painel</Link><button type="button" onClick={loadAnalytics}><FiRefreshCw /> Tentar novamente</button></div>
      </div>
    );
  }

  return (
    <div className="page-container admin-academic-page">
      <Link to="/dashboard" className="admin-back-link"><FiArrowLeft /> Meu painel</Link>
      <header className="admin-academic-hero">
        <div><span><FiShield /> ÁREA ADMINISTRATIVA</span><h1>Panorama acadêmico</h1><p>Uma visão agregada da comunidade MedSync para apoiar decisões de conteúdo, pesquisa e ações institucionais.</p></div>
        <span className="admin-data-badge"><FiCheckCircle /> Sem dados pessoais expostos</span>
      </header>

      <section className="admin-summary-grid" aria-label="Resumo acadêmico">
        <AdminMetric icon={FiUsers} label="Usuários cadastrados" value={analytics.total_usuarios} helper="base total da plataforma" />
        <AdminMetric icon={FiBookOpen} label="Perfis preenchidos" value={analytics.perfis_academicos_preenchidos} helper={`${analytics.cobertura_percentual}% de cobertura`} />
        <AdminMetric icon={FiCalendar} label="Novos em 30 dias" value={analytics.novos_ultimos_30_dias} helper="cadastros recentes" />
      </section>

      <div className="admin-analytics-grid">
        <section className="admin-analytics-panel">
          <div className="admin-panel-heading"><span>DISTRIBUIÇÃO</span><h2>Usuários por período</h2><p>Compare a presença de estudantes do início ao internato.</p></div>
          {analytics.periodos.length ? (
            <div className="admin-period-chart">
              {analytics.periodos.map((item) => (
                <div className="admin-period-row" key={item.periodo}>
                  <strong>{item.periodo}º</strong>
                  <div><span style={{ width: `${(item.total / maxPeriod) * 100}%` }} /></div>
                  <p><b>{item.total}</b><small>{item.percentual}%</small></p>
                </div>
              ))}
            </div>
          ) : <AdminEmptyState />}
        </section>

        <section className="admin-analytics-panel">
          <div className="admin-panel-heading"><span>INSTITUIÇÕES</span><h2>Faculdades representadas</h2><p>Ranking agregado das instituições informadas no cadastro.</p></div>
          {analytics.faculdades.length ? (
            <div className="admin-faculty-list">
              {analytics.faculdades.map((item, index) => (
                <article key={item.faculdade}>
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <div><strong>{item.faculdade}</strong><small>{item.percentual}% dos perfis acadêmicos</small></div>
                  <b>{item.total}</b>
                </article>
              ))}
            </div>
          ) : <AdminEmptyState />}
        </section>
      </div>

      <p className="admin-privacy-footnote"><FiShield /> Indicadores apresentados de forma agregada. E-mails, senhas e respostas individuais não são exibidos nesta área.</p>
    </div>
  );
};

const AdminMetric = ({ icon, label, value, helper }) => {
  const Icon = icon;
  return <article className="admin-summary-card"><span><Icon /></span><div><small>{label}</small><strong>{value}</strong><p>{helper}</p></div></article>;
};

const AdminEmptyState = () => <div className="admin-empty-state"><FiUsers /><strong>Ainda não há dados suficientes</strong><p>Os novos cadastros preencherão esta análise automaticamente.</p></div>;

export default AdminAcademicPage;
