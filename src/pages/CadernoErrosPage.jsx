import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/error-notebook.css';
import {
  FiAlertCircle,
  FiArrowRight,
  FiBookOpen,
  FiCheckCircle,
  FiChevronDown,
  FiChevronUp,
  FiClipboard,
  FiClock,
  FiFilter,
  FiImage,
  FiRefreshCw,
  FiRepeat,
  FiTarget,
  FiTrash2,
} from 'react-icons/fi';
import { ApiError, api } from '../services/api';

const ALL = 'todos';
const STATUS_LABELS = {
  pendente: 'Pendente',
  revisando: 'Revisando',
  dominado: 'Dominado',
};
const SOURCE_LABELS = {
  desafio_visual: 'Desafio visual',
  caso_clinico: 'Caso clínico',
};

const formatDate = (value) => new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
}).format(new Date(value));

const isDue = (entry) => entry.proxima_revisao_em
  && new Date(entry.proxima_revisao_em) <= new Date();

const ErrorMetric = ({ icon, label, value, helper, tone }) => {
  const MetricIcon = icon;
  return (
    <article className={`error-metric ${tone}`}>
      <span><MetricIcon aria-hidden="true" /></span>
      <div><small>{label}</small><strong>{value}</strong><p>{helper}</p></div>
    </article>
  );
};

const CadernoErrosPage = () => {
  const navigate = useNavigate();
  const [entries, setEntries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState(ALL);
  const [sourceFilter, setSourceFilter] = useState(ALL);
  const [specialtyFilter, setSpecialtyFilter] = useState(ALL);
  const [expandedId, setExpandedId] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    api.getStudyErrors()
      .then(setEntries)
      .catch((requestError) => {
        if (requestError instanceof ApiError && requestError.status === 401) {
          navigate('/login', { replace: true });
          return;
        }
        setError(requestError.message);
      })
      .finally(() => setIsLoading(false));
  }, [navigate]);

  const specialties = useMemo(
    () => [...new Set(entries.map((entry) => entry.especialidade))].sort(),
    [entries],
  );
  const filteredEntries = useMemo(() => entries.filter((entry) => (
    (statusFilter === ALL || entry.status === statusFilter)
    && (sourceFilter === ALL || entry.tipo_origem === sourceFilter)
    && (specialtyFilter === ALL || entry.especialidade === specialtyFilter)
  )), [entries, sourceFilter, specialtyFilter, statusFilter]);

  const pendingCount = entries.filter((entry) => entry.status === 'pendente').length;
  const reviewingCount = entries.filter((entry) => entry.status === 'revisando').length;
  const masteredCount = entries.filter((entry) => entry.status === 'dominado').length;
  const repeatedCount = entries.filter((entry) => entry.quantidade_erros > 1).length;
  const dueCount = entries.filter(isDue).length;

  const updateStatus = async (entryId, status) => {
    setUpdatingId(entryId);
    setError('');
    try {
      const updated = await api.updateStudyErrorStatus(entryId, status);
      setEntries((current) => current.map((entry) => (
        entry.id === entryId ? updated : entry
      )));
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setUpdatingId(null);
    }
  };

  const removeEntry = async (entry) => {
    const confirmed = window.confirm(`Remover “${entry.titulo}” do seu Caderno de Erros?`);
    if (!confirmed) return;
    setUpdatingId(entry.id);
    try {
      await api.deleteStudyError(entry.id);
      setEntries((current) => current.filter((item) => item.id !== entry.id));
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setUpdatingId(null);
    }
  };

  if (isLoading) {
    return <div className="page-container error-notebook-state">Organizando seu Caderno de Erros...</div>;
  }

  return (
    <div className="page-container error-notebook-page">
      <header className="error-notebook-hero">
        <div>
          <span className="error-notebook-kicker"><FiBookOpen /> APRENDIZADO PERSONALIZADO</span>
          <h1>Seu Caderno de Erros</h1>
          <p>Transforme cada dificuldade em um plano de revisão. Seus erros em desafios e casos clínicos aparecem automaticamente aqui.</p>
          <div className="error-notebook-hero-actions">
            <Link to="/revisoes"><FiClock /> Revisar agora {dueCount > 0 && <span>{dueCount}</span>}</Link>
            <small>O MedSync escolhe o melhor momento para cada conteúdo.</small>
          </div>
        </div>
        <div className="error-notebook-hero-progress" aria-label={`${masteredCount} conteúdos dominados`}>
          <strong>{entries.length ? Math.round((masteredCount / entries.length) * 100) : 0}%</strong>
          <span>dos conteúdos já dominados</span>
        </div>
      </header>

      <section className="error-metrics" aria-label="Resumo do Caderno de Erros">
        <ErrorMetric icon={FiAlertCircle} label="PENDENTES" value={pendingCount} helper="Pedem atenção agora" tone="orange" />
        <ErrorMetric icon={FiRefreshCw} label="EM REVISÃO" value={reviewingCount} helper="Conteúdos em estudo" tone="blue" />
        <ErrorMetric icon={FiRepeat} label="RECORRENTES" value={repeatedCount} helper="Errados mais de uma vez" tone="violet" />
        <ErrorMetric icon={FiCheckCircle} label="DOMINADOS" value={masteredCount} helper="Revisões concluídas" tone="green" />
      </section>

      {error && <p className="error-notebook-alert" role="alert">{error}</p>}

      <div className="error-notebook-layout">
        <aside className="error-notebook-filters" aria-label="Filtros do Caderno de Erros">
          <div className="error-filter-heading"><FiFilter /><div><strong>Organizar revisão</strong><small>{filteredEntries.length} conteúdo(s)</small></div></div>

          <label>
            <span>STATUS</span>
            <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
              <option value={ALL}>Todos os status</option>
              <option value="pendente">Pendentes</option>
              <option value="revisando">Em revisão</option>
              <option value="dominado">Dominados</option>
            </select>
          </label>

          <label>
            <span>ORIGEM</span>
            <select value={sourceFilter} onChange={(event) => setSourceFilter(event.target.value)}>
              <option value={ALL}>Todas as atividades</option>
              <option value="desafio_visual">Desafios visuais</option>
              <option value="caso_clinico">Casos clínicos</option>
            </select>
          </label>

          <label>
            <span>ESPECIALIDADE</span>
            <select value={specialtyFilter} onChange={(event) => setSpecialtyFilter(event.target.value)}>
              <option value={ALL}>Todas as áreas</option>
              {specialties.map((specialty) => <option value={specialty} key={specialty}>{specialty}</option>)}
            </select>
          </label>

          <button type="button" className="error-filter-reset" onClick={() => { setStatusFilter(ALL); setSourceFilter(ALL); setSpecialtyFilter(ALL); }}>
            <FiRefreshCw /> Limpar filtros
          </button>

          <div className="error-study-tip">
            <FiTarget />
            <p><strong>Dica de revisão</strong>Comece pelos erros recorrentes e marque como dominado apenas quando conseguir explicar o raciocínio.</p>
          </div>
        </aside>

        <section className="error-notebook-list" aria-label="Conteúdos para revisar">
          {filteredEntries.length ? filteredEntries.map((entry) => {
            const isExpanded = expandedId === entry.id;
            const details = entry.detalhes || {};
            return (
              <article className={`study-error-card status-${entry.status}`} key={entry.id}>
                <div className="study-error-card-heading">
                  <span className="study-error-source">
                    {entry.tipo_origem === 'desafio_visual' ? <FiImage /> : <FiClipboard />}
                    {SOURCE_LABELS[entry.tipo_origem]}
                  </span>
                  <span className={`study-error-status ${entry.status}`}>{STATUS_LABELS[entry.status]}</span>
                </div>

                <div className="study-error-title-row">
                  {details.imagem && <img src={details.imagem} alt="" />}
                  <div>
                    <span>{entry.especialidade}{entry.dificuldade ? ` · ${entry.dificuldade}` : ''}</span>
                    <h2>{entry.titulo}</h2>
                    <p>{entry.pergunta}</p>
                  </div>
                </div>

                <div className="study-error-history">
                  <span><FiRepeat /> {entry.quantidade_erros === 1 ? '1 ocorrência' : `${entry.quantidade_erros} ocorrências`}</span>
                  <span>Último registro: {formatDate(entry.visto_ultimo_em)}</span>
                  {entry.proxima_revisao_em && (
                    <span className={isDue(entry) ? 'is-due' : ''}>
                      <FiClock /> {isDue(entry) ? 'Revisão disponível' : `Próxima: ${formatDate(entry.proxima_revisao_em)}`}
                    </span>
                  )}
                </div>

                <button type="button" className="study-error-expand" onClick={() => setExpandedId(isExpanded ? null : entry.id)} aria-expanded={isExpanded}>
                  {isExpanded ? 'Ocultar explicação' : 'Revisar este conteúdo'}
                  {isExpanded ? <FiChevronUp /> : <FiChevronDown />}
                </button>

                {isExpanded && (
                  <div className="study-error-details">
                    <div className="answer-comparison">
                      <article className="user-answer"><span>SUA RESPOSTA</span><p>{entry.resposta_usuario}</p></article>
                      <article className="correct-answer"><span>REFERÊNCIA CORRETA</span><p>{entry.resposta_correta}</p></article>
                    </div>

                    <article className="study-explanation"><h3>Entenda o erro</h3><p>{entry.explicacao}</p></article>

                    {details.pontos_melhoria?.length > 0 && (
                      <div className="study-error-points"><h3>Pontos para melhorar</h3><ul>{details.pontos_melhoria.map((point) => <li key={point}>{point}</li>)}</ul></div>
                    )}

                    {details.recomendacoes_estudo?.length > 0 && (
                      <div className="study-recommendations"><h3>Revisar também</h3><div>{details.recomendacoes_estudo.map((topic) => <span key={topic}>{topic}</span>)}</div></div>
                    )}

                    <div className="study-error-actions">
                      <div role="group" aria-label={`Alterar status de ${entry.titulo}`}>
                        {Object.entries(STATUS_LABELS).map(([status, label]) => (
                          <button type="button" key={status} className={entry.status === status ? 'is-active' : ''} disabled={updatingId === entry.id} onClick={() => updateStatus(entry.id, status)}>{label}</button>
                        ))}
                      </div>
                      <Link to={entry.tipo_origem === 'caso_clinico' ? `/casos/${entry.id_origem}` : '/desafios'}>
                        Praticar novamente <FiArrowRight />
                      </Link>
                      <button type="button" className="study-error-delete" onClick={() => removeEntry(entry)} disabled={updatingId === entry.id} aria-label={`Remover ${entry.titulo}`}><FiTrash2 /></button>
                    </div>
                  </div>
                )}
              </article>
            );
          }) : (
            <div className="error-notebook-empty">
              <FiCheckCircle />
              <h2>{entries.length ? 'Nenhum conteúdo com esses filtros' : 'Seu caderno está limpo'}</h2>
              <p>{entries.length ? 'Ajuste os filtros para visualizar outros conteúdos.' : 'Quando você errar um desafio ou tiver pontos de melhoria em um caso, o conteúdo aparecerá aqui automaticamente.'}</p>
              {!entries.length && <Link to="/desafios">Começar um desafio <FiArrowRight /></Link>}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default CadernoErrosPage;
