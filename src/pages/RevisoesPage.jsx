import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FiArrowRight,
  FiBookOpen,
  FiCalendar,
  FiCheck,
  FiCheckCircle,
  FiClock,
  FiEye,
  FiImage,
  FiInfo,
  FiList,
  FiRepeat,
  FiSearch,
  FiTarget,
  FiTrendingUp,
  FiX,
} from 'react-icons/fi';
import { ApiError, api } from '../services/api';

const DAY_IN_MS = 24 * 60 * 60 * 1000;
const ALL_SPECIALTIES = 'todas';
const RATINGS = [
  {
    id: 'errei',
    key: '1',
    label: 'Não lembrei',
    fallback: 'Volta amanhã',
    explanation: 'Reinicia a sequência para fortalecer a base.',
    icon: FiX,
  },
  {
    id: 'dificil',
    key: '2',
    label: 'Lembrei com dificuldade',
    fallback: 'Intervalo curto',
    explanation: 'Aumenta o intervalo com mais cautela.',
    icon: FiRepeat,
  },
  {
    id: 'bom',
    key: '3',
    label: 'Lembrei bem',
    fallback: 'Intervalo padrão',
    explanation: 'Avança progressivamente conforme a memória se consolida.',
    icon: FiCheck,
  },
  {
    id: 'facil',
    key: '4',
    label: 'Muito fácil',
    fallback: 'Intervalo maior',
    explanation: 'Leva o conteúdo mais rapidamente para manutenção.',
    icon: FiTrendingUp,
  },
];

const SOURCE_LABELS = {
  desafio_visual: 'Desafio visual',
  caso_clinico: 'Caso clínico',
};

const startOfDay = (value = new Date()) => {
  const date = new Date(value);
  date.setHours(0, 0, 0, 0);
  return date;
};

const getDayOffset = (value) => Math.round(
  (startOfDay(value).getTime() - startOfDay().getTime()) / DAY_IN_MS,
);

const isDue = (entry) => new Date(entry.proxima_revisao_em) <= new Date();

const formatDate = (value, includeYear = false) => new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: 'short',
  ...(includeYear ? { year: 'numeric' } : {}),
}).format(new Date(value));

const relativeDateLabel = (value) => {
  const offset = getDayOffset(value);
  if (offset < 0) return `${Math.abs(offset)} ${Math.abs(offset) === 1 ? 'dia' : 'dias'} atrasada`;
  if (offset === 0) return 'Hoje';
  if (offset === 1) return 'Amanhã';
  if (offset <= 7) return `Em ${offset} dias`;
  return formatDate(value, true);
};

const intervalLabel = (days) => {
  if (days === 1) return '1 dia';
  if (days === 7) return '1 semana';
  if (days === 30) return '1 mês';
  return `${days} dias`;
};

const getLearningStage = (entry) => {
  if (entry.status === 'dominado' || entry.sequencia_acertos >= 3) return 'Manutenção';
  if (entry.sequencia_acertos > 0 || entry.revisoes_realizadas > 0) return 'Consolidação';
  return 'Início';
};

const getForecastLabel = (forecast, fallback) => {
  if (!forecast) return fallback;
  return `${relativeDateLabel(forecast.proxima_revisao_em)} · ${formatDate(forecast.proxima_revisao_em)}`;
};

const sortByNextReview = (first, second) => (
  new Date(first.proxima_revisao_em) - new Date(second.proxima_revisao_em)
);

const RevisoesPage = () => {
  const navigate = useNavigate();
  const [plan, setPlan] = useState([]);
  const [initialTotal, setInitialTotal] = useState(0);
  const [completed, setCompleted] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [activeView, setActiveView] = useState('hoje');
  const [agendaSearch, setAgendaSearch] = useState('');
  const [specialtyFilter, setSpecialtyFilter] = useState(ALL_SPECIALTIES);
  const [sessionSchedules, setSessionSchedules] = useState([]);

  useEffect(() => {
    api.getSpacedReviewPlan()
      .then((entries) => {
        setPlan(entries);
        setInitialTotal(entries.filter(isDue).length);
      })
      .catch((requestError) => {
        if (requestError instanceof ApiError && requestError.status === 401) {
          navigate('/login', { replace: true });
          return;
        }
        setError(requestError.message);
      })
      .finally(() => setIsLoading(false));
  }, [navigate]);

  const dueEntries = useMemo(() => plan.filter(isDue), [plan]);
  const current = dueEntries[0];
  const progress = initialTotal
    ? Math.min(100, Math.round((completed / initialTotal) * 100))
    : 100;
  const nextSevenDaysCount = plan.filter((entry) => {
    const offset = getDayOffset(entry.proxima_revisao_em);
    return offset >= 1 && offset <= 7;
  }).length;
  const nextScheduled = [...plan].filter((entry) => !isDue(entry)).sort(sortByNextReview)[0];
  const specialties = useMemo(
    () => [...new Set(plan.map((entry) => entry.especialidade))]
      .sort((first, second) => first.localeCompare(second, 'pt-BR')),
    [plan],
  );
  const filteredAgenda = useMemo(() => {
    const normalizedSearch = agendaSearch.trim().toLocaleLowerCase('pt-BR');
    return plan.filter((entry) => (
      (specialtyFilter === ALL_SPECIALTIES || entry.especialidade === specialtyFilter)
      && (!normalizedSearch || `${entry.titulo} ${entry.especialidade}`
        .toLocaleLowerCase('pt-BR')
        .includes(normalizedSearch))
    ));
  }, [agendaSearch, plan, specialtyFilter]);
  const agendaGroups = useMemo(() => [
    { id: 'atrasadas', label: 'Atrasadas', helper: 'Prioridade para hoje', items: filteredAgenda.filter((entry) => getDayOffset(entry.proxima_revisao_em) < 0) },
    { id: 'hoje', label: 'Hoje', helper: 'Programadas para hoje', items: filteredAgenda.filter((entry) => getDayOffset(entry.proxima_revisao_em) === 0) },
    { id: 'amanha', label: 'Amanhã', helper: 'Próximo ciclo', items: filteredAgenda.filter((entry) => getDayOffset(entry.proxima_revisao_em) === 1) },
    { id: 'semana', label: 'Próximos 7 dias', helper: 'Planejamento da semana', items: filteredAgenda.filter((entry) => {
      const offset = getDayOffset(entry.proxima_revisao_em);
      return offset >= 2 && offset <= 7;
    }) },
    { id: 'adiante', label: 'Mais adiante', helper: 'Consolidação e manutenção', items: filteredAgenda.filter((entry) => getDayOffset(entry.proxima_revisao_em) > 7) },
  ].filter((group) => group.items.length), [filteredAgenda]);

  const submitRating = async (rating) => {
    if (!current || isSubmitting) return;
    setIsSubmitting(true);
    setError('');
    try {
      const updated = await api.submitSpacedReview(current.id, rating);
      const ratingDetails = RATINGS.find((item) => item.id === rating);
      setPlan((entries) => entries.map((entry) => (
        entry.id === current.id
          ? { ...entry, ...updated }
          : entry
      )).sort(sortByNextReview));
      setSessionSchedules((items) => [...items, {
        id: updated.id,
        title: updated.titulo,
        rating: ratingDetails?.label || rating,
        interval: updated.intervalo_dias,
        nextReviewAt: updated.proxima_revisao_em,
      }]);
      setCompleted((value) => value + 1);
      setRevealed(false);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (!revealed || isSubmitting) return;
      const rating = RATINGS.find((item) => item.key === event.key);
      if (rating) submitRating(rating.id);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  const reviewAgendaEntry = (entryId) => {
    setPlan((entries) => {
      const selected = entries.find((entry) => entry.id === entryId);
      if (!selected) return entries;
      return [selected, ...entries.filter((entry) => entry.id !== entryId)];
    });
    setRevealed(false);
    setActiveView('hoje');
  };

  if (isLoading) {
    return <div className="page-container review-loading"><span /><p>Organizando sua agenda de revisões...</p></div>;
  }

  const details = current?.detalhes || {};

  return (
    <div className="page-container review-page review-center-page">
      <header className="review-header review-center-hero">
        <div className="review-center-heading">
          <span><FiRepeat /> MEMÓRIA EM LONGO PRAZO</span>
          <h1>Central de revisões</h1>
          <p>Revise no momento certo e acompanhe quando cada conteúdo voltará.</p>
        </div>
        <div className="review-overview" aria-label="Resumo das revisões">
          <div className="is-today"><strong>{dueEntries.length}</strong><span>para hoje</span></div>
          <div><strong>{nextSevenDaysCount}</strong><span>nos próximos 7 dias</span></div>
          <div><strong>{plan.length}</strong><span>agendadas no total</span></div>
        </div>
      </header>

      <section className="review-method" aria-labelledby="review-method-title">
        <div className="review-method-heading">
          <span><FiInfo aria-hidden="true" /></span>
          <div>
            <small>ENTENDA O MÉTODO</small>
            <h2 id="review-method-title">Como funciona a revisão espaçada?</h2>
            <p>O intervalo cresce quando você lembra e encurta quando a memória precisa de reforço.</p>
          </div>
        </div>
        <div className="review-method-ratings">
          {RATINGS.map((rating) => {
            const RatingIcon = rating.icon;
            return (
              <article className={rating.id} key={rating.id}>
                <RatingIcon aria-hidden="true" />
                <div><strong>{rating.label}</strong><p>{rating.explanation}</p></div>
              </article>
            );
          })}
        </div>
        <div className="review-method-note">
          <FiTrendingUp aria-hidden="true" />
          <p><strong>O objetivo é consolidar, não decorar.</strong> Após três lembranças sem erro, o conteúdo entra em manutenção. Os intervalos continuam crescendo até o limite de 180 dias.</p>
        </div>
      </section>

      <nav className="review-view-tabs" aria-label="Visualização das revisões">
        <button type="button" className={activeView === 'hoje' ? 'is-active' : ''} onClick={() => setActiveView('hoje')} aria-pressed={activeView === 'hoje'}>
          <FiTarget /> Revisar hoje <span>{dueEntries.length}</span>
        </button>
        <button type="button" className={activeView === 'agenda' ? 'is-active' : ''} onClick={() => setActiveView('agenda')} aria-pressed={activeView === 'agenda'}>
          <FiCalendar /> Agenda completa <span>{plan.length}</span>
        </button>
        {nextScheduled && <p><FiClock /> Próxima: <strong>{relativeDateLabel(nextScheduled.proxima_revisao_em)}</strong></p>}
      </nav>

      {error && <p className="review-alert" role="alert">{error}</p>}

      {activeView === 'hoje' ? (
        <section className="review-today-view" aria-label="Revisões de hoje">
          {initialTotal > 0 && (
            <section className="review-progress" aria-label={`${progress}% da sessão concluída`}>
              <div><span>Sessão de hoje</span><strong>{completed} de {initialTotal}</strong></div>
              <div className="review-progress-track"><span style={{ width: `${progress}%` }} /></div>
            </section>
          )}

          {current ? (
            <article className={`review-card ${revealed ? 'is-revealed' : ''}`} key={current.id}>
              <div className="review-card-meta">
                <span>{current.tipo_origem === 'desafio_visual' ? <FiImage /> : <FiBookOpen />}{SOURCE_LABELS[current.tipo_origem]}</span>
                <span>{current.especialidade} · {current.dificuldade || 'Revisão'}</span>
                <span className="review-current-stage">{getLearningStage(current)}</span>
              </div>

              <div className="review-question">
                {details.imagem && <img src={details.imagem} alt={`Imagem para revisar: ${current.titulo}`} />}
                <div>
                  <small>CONTEÚDO {completed + 1} DE {initialTotal}</small>
                  <h2>{current.titulo}</h2>
                  <p>{current.pergunta}</p>
                  <span className="review-due-label"><FiClock /> Disponível para revisão agora</span>
                </div>
              </div>

              {!revealed ? (
                <div className="review-recall">
                  <FiTarget />
                  <p><strong>Pense antes de revelar</strong>Recupere o diagnóstico ou a conduta sem consultar materiais. O esforço de lembrar faz parte do aprendizado.</p>
                  <button type="button" onClick={() => setRevealed(true)}><FiEye /> Mostrar resposta</button>
                </div>
              ) : (
                <div className="review-answer">
                  <div className="review-answer-comparison">
                    <section><span>VOCÊ RESPONDEU</span><p>{current.resposta_usuario}</p></section>
                    <section><span>RESPOSTA CORRETA</span><p>{current.resposta_correta}</p></section>
                  </div>
                  <section className="review-explanation"><span>POR QUE ESSA É A RESPOSTA?</span><p>{current.explicacao}</p></section>
                  <div className="review-rating-heading">
                    <div><strong>Como foi lembrar?</strong><span>Veja abaixo a data exata que cada escolha produzirá.</span></div>
                    <small>ATALHOS 1–4</small>
                  </div>
                  <div className="review-ratings">
                    {RATINGS.map((rating) => {
                      const RatingIcon = rating.icon;
                      const forecast = current.previsoes?.[rating.id];
                      return (
                        <button type="button" className={rating.id} key={rating.id} disabled={isSubmitting} onClick={() => submitRating(rating.id)} aria-label={`${rating.label}: ${getForecastLabel(forecast, rating.fallback)}`}>
                          <kbd>{rating.key}</kbd>
                          <RatingIcon />
                          <strong>{rating.label}</strong>
                          <span>{getForecastLabel(forecast, rating.fallback)}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </article>
          ) : (
            <>
              <section className="review-complete">
                <div className="review-complete-icon"><FiCheckCircle /></div>
                <span>{completed ? 'SESSÃO CONCLUÍDA' : 'TUDO EM DIA'}</span>
                <h1>{completed ? 'Revisão finalizada!' : 'Nenhuma revisão para hoje'}</h1>
                <p>{completed
                  ? `Você revisou ${completed} ${completed === 1 ? 'conteúdo' : 'conteúdos'}. Confira abaixo quando cada um voltará.`
                  : nextScheduled
                    ? `Seu próximo conteúdo aparece ${relativeDateLabel(nextScheduled.proxima_revisao_em).toLocaleLowerCase('pt-BR')}, em ${formatDate(nextScheduled.proxima_revisao_em, true)}.`
                    : 'Quando um conteúdo entrar no seu plano, a próxima data aparecerá aqui.'}</p>
                <div>
                  <button type="button" onClick={() => setActiveView('agenda')}><FiCalendar /> Ver agenda completa</button>
                  <Link to="/caderno-erros" className="secondary">Abrir Caderno de Erros</Link>
                </div>
              </section>

              {sessionSchedules.length > 0 && (
                <section className="review-session-recap" aria-labelledby="review-session-recap-title">
                  <div className="review-session-recap-heading">
                    <span><FiCalendar /></span>
                    <div><small>SEU NOVO PLANO</small><h2 id="review-session-recap-title">Quando estes conteúdos voltarão</h2></div>
                  </div>
                  <div className="review-session-recap-list">
                    {sessionSchedules.map((schedule) => (
                      <article key={schedule.id}>
                        <div><strong>{schedule.title}</strong><span>{schedule.rating} · intervalo de {intervalLabel(schedule.interval)}</span></div>
                        <p><small>PRÓXIMA REVISÃO</small><strong>{relativeDateLabel(schedule.nextReviewAt)}</strong><span>{formatDate(schedule.nextReviewAt, true)}</span></p>
                      </article>
                    ))}
                  </div>
                </section>
              )}
            </>
          )}
        </section>
      ) : (
        <section className="review-agenda" aria-labelledby="review-agenda-title">
          <div className="review-agenda-heading">
            <div><small>PLANEJAMENTO</small><h2 id="review-agenda-title">Todos os conteúdos agendados</h2><p>Consulte a próxima data sem alterar o intervalo definido pelo método.</p></div>
            <div className="review-agenda-filters">
              <label><FiSearch aria-hidden="true" /><input type="search" value={agendaSearch} onChange={(event) => setAgendaSearch(event.target.value)} placeholder="Buscar assunto" aria-label="Buscar assunto na agenda" /></label>
              <label><span>ESPECIALIDADE</span><select value={specialtyFilter} onChange={(event) => setSpecialtyFilter(event.target.value)} aria-label="Filtrar agenda por especialidade"><option value={ALL_SPECIALTIES}>Todas</option>{specialties.map((specialty) => <option key={specialty} value={specialty}>{specialty}</option>)}</select></label>
            </div>
          </div>

          {agendaGroups.length ? (
            <div className="review-agenda-groups">
              {agendaGroups.map((group) => (
                <section className={`review-agenda-group is-${group.id}`} key={group.id}>
                  <div className="review-agenda-group-heading"><div><span>{group.label}</span><small>{group.helper}</small></div><strong>{group.items.length}</strong></div>
                  <div className="review-agenda-list">
                    {group.items.map((entry) => (
                      <article key={entry.id}>
                        <span className="review-agenda-source">{entry.tipo_origem === 'desafio_visual' ? <FiImage /> : <FiBookOpen />}</span>
                        <div className="review-agenda-content">
                          <span>{SOURCE_LABELS[entry.tipo_origem]} · {entry.especialidade}</span>
                          <h3>{entry.titulo}</h3>
                          <p>{entry.intervalo_dias ? `Intervalo atual: ${intervalLabel(entry.intervalo_dias)}` : 'Primeira revisão'} · {entry.revisoes_realizadas || 0} {entry.revisoes_realizadas === 1 ? 'revisão realizada' : 'revisões realizadas'}</p>
                        </div>
                        <span className={`review-stage is-${entry.status}`}>{getLearningStage(entry)}</span>
                        <div className="review-agenda-date"><small>PRÓXIMA REVISÃO</small><strong>{relativeDateLabel(entry.proxima_revisao_em)}</strong><span>{formatDate(entry.proxima_revisao_em, true)}</span></div>
                        {isDue(entry) && <button type="button" onClick={() => reviewAgendaEntry(entry.id)}>Revisar agora <FiArrowRight /></button>}
                      </article>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          ) : (
            <div className="review-agenda-empty"><FiList /><h3>Nenhum conteúdo encontrado</h3><p>Ajuste a busca ou o filtro de especialidade.</p></div>
          )}
        </section>
      )}
    </div>
  );
};

export default RevisoesPage;
