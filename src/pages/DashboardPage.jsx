import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/dashboard.css';
import {
  FiActivity,
  FiAlertTriangle,
  FiArrowRight,
  FiAward,
  FiBarChart2,
  FiBookOpen,
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiHelpCircle,
  FiRefreshCw,
  FiShield,
  FiStar,
  FiTarget,
  FiTrash2,
  FiTrendingUp,
  FiUser,
  FiX,
  FiZap,
} from 'react-icons/fi';
import { api, ApiError } from '../services/api';

const formatDate = (value, options = {}) => {
  if (!value) return 'Data não disponível';
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    ...options,
  }).format(new Date(value));
};

const getInitials = (name = '') => name
  .split(' ')
  .filter(Boolean)
  .slice(0, 2)
  .map((part) => part[0])
  .join('')
  .toUpperCase();

const premiumPlanLabels = {
  avulso: 'Mensal avulso',
  recorrente: 'Mensal recorrente',
  trimestral: 'Trimestral',
};

const calculateStreak = (progress) => {
  const dayKeys = [...new Set(progress
    .filter((entry) => entry.created_at)
    .map((entry) => new Date(entry.created_at).toISOString().slice(0, 10)))]
    .sort()
    .reverse();

  if (!dayKeys.length) return 0;
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  const latest = new Date(`${dayKeys[0]}T00:00:00Z`);
  const distanceFromToday = Math.round((today - latest) / 86_400_000);
  if (distanceFromToday > 1) return 0;

  let streak = 1;
  for (let index = 1; index < dayKeys.length; index += 1) {
    const previous = new Date(`${dayKeys[index - 1]}T00:00:00Z`);
    const current = new Date(`${dayKeys[index]}T00:00:00Z`);
    if (Math.round((previous - current) / 86_400_000) !== 1) break;
    streak += 1;
  }
  return streak;
};

const DashboardPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [progress, setProgress] = useState([]);
  const [cases, setCases] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [resetConfirmation, setResetConfirmation] = useState('');
  const [isResetting, setIsResetting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const loadDashboard = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [userData, progressData, casesData] = await Promise.all([
        api.getCurrentUser(),
        api.getProgress(),
        api.getCases(),
      ]);
      setUser(userData);
      setProgress(progressData);
      setCases(casesData);
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
    loadDashboard();
  }, [loadDashboard]);

  const dashboard = useMemo(() => {
    const caseMap = new Map(cases.map((clinicalCase) => [clinicalCase.id, clinicalCase]));
    const attempts = [...progress].sort((a, b) => b.id - a.id);
    const totalAttempts = attempts.length;
    const uniqueCases = new Set(attempts.map((entry) => entry.id_caso)).size;
    const averageScore = totalAttempts
      ? Math.round(attempts.reduce((sum, entry) => sum + entry.pontuacao, 0) / totalAttempts)
      : 0;
    const bestScore = totalAttempts ? Math.max(...attempts.map((entry) => entry.pontuacao)) : 0;
    const streak = calculateStreak(attempts);
    const lastSevenDays = Date.now() - (7 * 86_400_000);
    const weeklyAttempts = attempts.filter((entry) => (
      entry.created_at && new Date(entry.created_at).getTime() >= lastSevenDays
    )).length;

    const specialties = new Map();
    attempts.forEach((entry) => {
      const clinicalCase = caseMap.get(entry.id_caso);
      const specialty = clinicalCase?.especialidade || 'Outras áreas';
      const current = specialties.get(specialty) || { total: 0, attempts: 0, caseIds: new Set() };
      current.total += entry.pontuacao;
      current.attempts += 1;
      current.caseIds.add(entry.id_caso);
      specialties.set(specialty, current);
    });

    const specialtyStats = [...specialties.entries()]
      .map(([name, value]) => ({
        name,
        average: Math.round(value.total / value.attempts),
        attempts: value.attempts,
        cases: value.caseIds.size,
      }))
      .sort((a, b) => b.attempts - a.attempts || b.average - a.average);

    const strongestSpecialty = [...specialtyStats].sort((a, b) => b.average - a.average)[0];
    const focusSpecialty = [...specialtyStats].sort((a, b) => a.average - b.average)[0];
    const recentActivity = attempts.slice(0, 5).map((entry) => ({
      ...entry,
      clinicalCase: caseMap.get(entry.id_caso),
      hasStructuredResult: Boolean(entry.respostas_usuario?._avaliacao),
    }));

    const achievements = [
      { icon: FiBookOpen, label: 'Primeiro caso', description: 'Concluiu a primeira simulação', unlocked: totalAttempts >= 1 },
      { icon: FiZap, label: 'Em ritmo', description: 'Concluiu 5 casos clínicos', unlocked: uniqueCases >= 5 },
      { icon: FiTrendingUp, label: 'Alto desempenho', description: 'Média geral de pelo menos 80%', unlocked: averageScore >= 80 && totalAttempts > 0 },
      { icon: FiAward, label: 'Raciocínio preciso', description: 'Alcançou uma pontuação perfeita', unlocked: bestScore === 100 },
    ];

    return {
      totalAttempts,
      uniqueCases,
      averageScore,
      bestScore,
      streak,
      weeklyAttempts,
      specialtyStats,
      strongestSpecialty,
      focusSpecialty,
      recentActivity,
      achievements,
    };
  }, [cases, progress]);

  const handleResetProgress = async () => {
    if (resetConfirmation !== 'RESETAR') return;
    setIsResetting(true);
    setError(null);
    try {
      await api.resetProgress();
      setProgress([]);
      setShowResetDialog(false);
      setResetConfirmation('');
      setSuccessMessage('Suas estatísticas foram redefinidas. Sua conta continua ativa.');
    } catch (requestError) {
      if (requestError instanceof ApiError && requestError.status === 401) {
        navigate('/login', { replace: true });
        return;
      }
      setError(requestError.message);
    } finally {
      setIsResetting(false);
    }
  };

  if (isLoading) {
    return <div className="page-container dashboard-state"><FiActivity /> Preparando seu painel...</div>;
  }

  if (error && !user) {
    return (
      <div className="page-container dashboard-state dashboard-error-state">
        <FiAlertTriangle />
        <h1>Não foi possível carregar seu painel</h1>
        <p>{error}</p>
        <button type="button" onClick={loadDashboard}><FiRefreshCw /> Tentar novamente</button>
      </div>
    );
  }

  const firstName = user?.nome?.split(' ')[0] || 'Estudante';

  return (
    <div className="page-container user-dashboard-page">
      <header className="user-dashboard-hero">
        <div className="dashboard-profile">
          <div className="dashboard-avatar" aria-hidden="true">{getInitials(user?.nome)}</div>
          <div>
            <span className="dashboard-kicker">MEU PAINEL MEDSYNC</span>
            <h1>Olá, {firstName}!</h1>
            <p>Acompanhe sua evolução clínica e escolha o melhor próximo passo para estudar.</p>
          </div>
        </div>
        <div className="dashboard-user-details">
          <span><FiUser /> {user?.nome}</span>
          <span>{user?.email}</span>
          {user?.periodo_curso ? <span><FiBookOpen /> {user.periodo_curso}º período</span> : null}
          {user?.faculdade ? <span>{user.faculdade}</span> : null}
          <span><FiCalendar /> Membro desde {formatDate(user?.created_at, { month: 'long' })}</span>
        </div>
      </header>

      {successMessage && (
        <div className="dashboard-toast" role="status">
          <FiCheckCircle /> <span>{successMessage}</span>
          <button type="button" onClick={() => setSuccessMessage('')} aria-label="Fechar mensagem"><FiX /></button>
        </div>
      )}
      {error && <p className="dashboard-inline-error" role="alert">{error}</p>}

      <section
        className={`dashboard-membership ${user?.premium_ativo ? 'is-premium' : 'is-free'}`}
        aria-label="Status da assinatura"
      >
        <div className="dashboard-membership-icon" aria-hidden="true">
          {user?.premium_ativo ? <FiStar /> : <FiShield />}
        </div>
        <div className="dashboard-membership-copy">
          <span>{user?.premium_ativo ? 'MEDSYNC PREMIUM' : 'PLANO ATUAL'}</span>
          <h2>{user?.premium_ativo ? 'Seu acesso Premium está ativo' : 'Você está no plano gratuito'}</h2>
          <p>
            {user?.premium_ativo
              ? 'Todos os recursos Premium estão liberados para sua jornada clínica.'
              : 'Evolua seus estudos com acesso completo aos recursos Premium.'}
          </p>
        </div>
        <div className="dashboard-membership-status">
          {user?.premium_ativo ? (
            <>
              <strong><FiCheckCircle /> Premium ativo</strong>
              <span>{premiumPlanLabels[user.premium_plano] || 'Plano Premium'}</span>
              <small>Válido até {formatDate(user.premium_valido_ate)}</small>
            </>
          ) : (
            <>
              <strong>Gratuito</strong>
              <span>Recursos essenciais</span>
            </>
          )}
        </div>
        <Link to="/assinatura" className="dashboard-membership-action">
          {user?.premium_ativo ? 'Ver meu plano' : 'Conhecer o Premium'} <FiArrowRight />
        </Link>
      </section>

      <section className="dashboard-metrics" aria-label="Resumo do desempenho">
        <MetricCard icon={FiBookOpen} label="Casos concluídos" value={dashboard.uniqueCases} helper={`${dashboard.totalAttempts} tentativa(s)`} tone="blue" />
        <MetricCard icon={FiTarget} label="Pontuação média" value={`${dashboard.averageScore}%`} helper={dashboard.totalAttempts ? `Melhor nota: ${dashboard.bestScore}%` : 'Comece seu primeiro caso'} tone="cyan" />
        <MetricCard icon={FiZap} label="Sequência atual" value={`${dashboard.streak} dia${dashboard.streak === 1 ? '' : 's'}`} helper={`${dashboard.weeklyAttempts} tentativa(s) nesta semana`} tone="violet" />
        <MetricCard icon={FiBarChart2} label="Áreas praticadas" value={dashboard.specialtyStats.length} helper={`${cases.length} casos disponíveis`} tone="green" />
      </section>

      <div className="dashboard-main-grid">
        <section className="dashboard-panel performance-panel">
          <PanelTitle icon={FiBarChart2} eyebrow="DESEMPENHO REAL" title="Progresso por especialidade" />
          {dashboard.specialtyStats.length ? (
            <div className="specialty-performance-list">
              {dashboard.specialtyStats.slice(0, 6).map((specialty) => (
                <div className="specialty-performance" key={specialty.name}>
                  <div>
                    <strong>{specialty.name}</strong>
                    <span>{specialty.attempts} tentativa(s) · {specialty.cases} caso(s)</span>
                  </div>
                  <div className="specialty-score"><strong>{specialty.average}%</strong></div>
                  <div className="specialty-track" aria-hidden="true"><span style={{ width: `${specialty.average}%` }} /></div>
                </div>
              ))}
            </div>
          ) : <DashboardEmptyState title="Seu gráfico começa com o primeiro caso" text="Conclua uma simulação para visualizar seu desempenho por especialidade." />}
        </section>

        <section className="dashboard-panel insights-panel">
          <PanelTitle icon={FiTrendingUp} eyebrow="LEITURA DO PROGRESSO" title="Seus insights" />
          <div className="dashboard-insights">
            <InsightCard
              tone="positive"
              label="Ponto forte"
              value={dashboard.strongestSpecialty?.name || 'Em construção'}
              description={dashboard.strongestSpecialty ? `Média de ${dashboard.strongestSpecialty.average}% nesta área.` : 'Pratique para identificar sua área de melhor desempenho.'}
            />
            <InsightCard
              tone="focus"
              label="Área para reforçar"
              value={dashboard.focusSpecialty?.name || 'Ainda não definida'}
              description={dashboard.focusSpecialty ? `Média de ${dashboard.focusSpecialty.average}%. Uma nova tentativa pode melhorar esse resultado.` : 'Seus próximos resultados gerarão uma recomendação personalizada.'}
            />
          </div>
          <Link to="/casos" className="dashboard-primary-link">Praticar novo caso <FiArrowRight /></Link>
        </section>

        <section className="dashboard-panel recent-activity-panel">
          <PanelTitle icon={FiClock} eyebrow="HISTÓRICO" title="Atividade recente" />
          {dashboard.recentActivity.length ? (
            <div className="recent-activity-list">
              {dashboard.recentActivity.map((entry) => (
                <article className="recent-activity-item" key={entry.id}>
                  <div className={`activity-score ${entry.pontuacao >= 70 ? 'good' : 'needs-work'}`}>{entry.pontuacao}</div>
                  <div className="activity-copy">
                    <strong>{entry.clinicalCase?.titulo || `Caso clínico ${entry.id_caso}`}</strong>
                    <span>{entry.clinicalCase?.especialidade || 'Clínica'} · {formatDate(entry.created_at)}</span>
                  </div>
                  {entry.hasStructuredResult ? (
                    <Link to={`/resultados/${entry.id}`} aria-label={`Rever resultado de ${entry.clinicalCase?.titulo || 'caso clínico'}`}>Rever <FiArrowRight /></Link>
                  ) : (
                    <Link to={`/casos/${entry.id_caso}`}>Refazer <FiRefreshCw /></Link>
                  )}
                </article>
              ))}
            </div>
          ) : <DashboardEmptyState title="Nenhuma atividade registrada" text="Seus casos concluídos aparecerão aqui com nota e data." />}
        </section>

        <section className="dashboard-panel achievements-panel">
          <PanelTitle icon={FiAward} eyebrow="MARCOS DE ESTUDO" title="Conquistas" />
          <div className="dashboard-achievements">
            {dashboard.achievements.map((achievement) => {
              const AchievementIcon = achievement.icon;
              return (
                <article className={`achievement-card ${achievement.unlocked ? 'unlocked' : 'locked'}`} key={achievement.label}>
                  <span><AchievementIcon /></span>
                  <div><strong>{achievement.label}</strong><p>{achievement.description}</p></div>
                  {achievement.unlocked && <FiCheckCircle className="achievement-check" />}
                </article>
              );
            })}
          </div>
        </section>
      </div>

      <section className="dashboard-quick-actions">
        <div>
          <span className="dashboard-kicker">CONTINUE EVOLUINDO</span>
          <h2>O que você quer treinar agora?</h2>
        </div>
        <div className="quick-action-links">
          <Link to="/casos"><FiBookOpen /><span><strong>Casos clínicos</strong><small>Raciocínio completo</small></span><FiArrowRight /></Link>
          <Link to="/desafios"><FiZap /><span><strong>Desafios visuais</strong><small>Diagnóstico rápido</small></span><FiArrowRight /></Link>
          <Link to="/questoes"><FiHelpCircle /><span><strong>Questões de provas</strong><small>Treino complementar</small></span><FiArrowRight /></Link>
          {user?.is_admin ? <Link to="/admin"><FiShield /><span><strong>Centro administrativo</strong><small>Operação e conteúdo</small></span><FiArrowRight /></Link> : null}
        </div>
      </section>

      <section className="dashboard-danger-zone">
        <div>
          <span><FiAlertTriangle /> ZONA DE CUIDADO</span>
          <h2>Redefinir estatísticas</h2>
          <p>Apaga notas, tentativas e resultados para você recomeçar. Sua conta e seus dados de acesso serão mantidos.</p>
        </div>
        <button type="button" className="reset-statistics-button" onClick={() => setShowResetDialog(true)}>
          <FiTrash2 /> Resetar minhas estatísticas
        </button>
      </section>

      {showResetDialog && (
        <div className="reset-dialog-backdrop" role="presentation" onMouseDown={(event) => {
          if (event.target === event.currentTarget && !isResetting) setShowResetDialog(false);
        }}>
          <div className="reset-dialog" role="dialog" aria-modal="true" aria-labelledby="reset-dialog-title">
            <button type="button" className="reset-dialog-close" onClick={() => setShowResetDialog(false)} aria-label="Fechar" disabled={isResetting}><FiX /></button>
            <span className="reset-dialog-icon"><FiTrash2 /></span>
            <h2 id="reset-dialog-title">Resetar todo o seu progresso?</h2>
            <p>Esta ação é permanente e removerá {dashboard.totalAttempts} tentativa(s), notas e avaliações salvas.</p>
            <label htmlFor="reset-confirmation">Digite <strong>RESETAR</strong> para confirmar</label>
            <input
              id="reset-confirmation"
              value={resetConfirmation}
              onChange={(event) => setResetConfirmation(event.target.value.toUpperCase())}
              placeholder="RESETAR"
              autoComplete="off"
              autoFocus
            />
            <div className="reset-dialog-actions">
              <button type="button" className="reset-cancel-button" onClick={() => setShowResetDialog(false)} disabled={isResetting}>Cancelar</button>
              <button type="button" className="reset-confirm-button" onClick={handleResetProgress} disabled={resetConfirmation !== 'RESETAR' || isResetting}>
                {isResetting ? <><FiRefreshCw className="spinning" /> Redefinindo...</> : <><FiTrash2 /> Apagar estatísticas</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const MetricCard = ({ icon, label, value, helper, tone }) => {
  const MetricIcon = icon;
  return (
    <article className={`dashboard-metric-card ${tone}`}>
      <span className="metric-icon"><MetricIcon /></span>
      <div><span>{label}</span><strong>{value}</strong><small>{helper}</small></div>
    </article>
  );
};

const PanelTitle = ({ icon, eyebrow, title }) => {
  const TitleIcon = icon;
  return (
    <div className="dashboard-panel-title">
      <span><TitleIcon /></span>
      <div><small>{eyebrow}</small><h2>{title}</h2></div>
    </div>
  );
};

const InsightCard = ({ tone, label, value, description }) => (
  <article className={`dashboard-insight ${tone}`}>
    <span>{label}</span><strong>{value}</strong><p>{description}</p>
  </article>
);

const DashboardEmptyState = ({ title, text }) => (
  <div className="dashboard-empty-state"><FiActivity /><strong>{title}</strong><p>{text}</p></div>
);

export default DashboardPage;
