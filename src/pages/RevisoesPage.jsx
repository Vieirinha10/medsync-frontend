import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FiArrowRight,
  FiBookOpen,
  FiCheck,
  FiCheckCircle,
  FiClock,
  FiEye,
  FiImage,
  FiRepeat,
  FiTarget,
  FiTrendingUp,
  FiX,
} from 'react-icons/fi';
import { ApiError, api } from '../services/api';

const RATINGS = [
  { id: 'errei', key: '1', label: 'Errei novamente', helper: 'Rever amanhã', icon: FiX },
  { id: 'dificil', key: '2', label: 'Difícil', helper: 'Intervalo menor', icon: FiRepeat },
  { id: 'bom', key: '3', label: 'Lembrei bem', helper: 'Avançar revisão', icon: FiCheck },
  { id: 'facil', key: '4', label: 'Fácil', helper: 'Intervalo maior', icon: FiTrendingUp },
];

const intervalLabel = (days) => {
  if (days === 1) return 'amanhã';
  if (days < 7) return `em ${days} dias`;
  if (days === 7) return 'em 1 semana';
  if (days < 30) return `em ${days} dias`;
  if (days === 30) return 'em 1 mês';
  return `em ${days} dias`;
};

const RevisoesPage = () => {
  const navigate = useNavigate();
  const [queue, setQueue] = useState([]);
  const [initialTotal, setInitialTotal] = useState(0);
  const [completed, setCompleted] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [lastSchedule, setLastSchedule] = useState('');
  const current = queue[0];

  useEffect(() => {
    api.getDueReviews()
      .then((entries) => {
        setQueue(entries);
        setInitialTotal(entries.length);
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

  const progress = useMemo(
    () => (initialTotal ? Math.round((completed / initialTotal) * 100) : 100),
    [completed, initialTotal],
  );

  const submitRating = async (rating) => {
    if (!current || isSubmitting) return;
    setIsSubmitting(true);
    setError('');
    try {
      const updated = await api.submitSpacedReview(current.id, rating);
      setLastSchedule(`Conteúdo reagendado ${intervalLabel(updated.intervalo_dias)}.`);
      setQueue((entries) => entries.slice(1));
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

  if (isLoading) {
    return <div className="page-container review-loading"><span /><p>Preparando sua revisão de hoje...</p></div>;
  }

  if (!current) {
    return (
      <div className="page-container review-page">
        <section className="review-complete">
          <div className="review-complete-icon"><FiCheckCircle /></div>
          <span>{completed ? 'SESSÃO CONCLUÍDA' : 'TUDO EM DIA'}</span>
          <h1>{completed ? 'Revisão finalizada!' : 'Nenhuma revisão pendente'}</h1>
          <p>{completed
            ? `Você revisou ${completed} ${completed === 1 ? 'conteúdo' : 'conteúdos'}. O MedSync já organizou quando cada um voltará.`
            : 'Seus conteúdos estão agendados para o momento certo. Continue praticando para alimentar seu plano de estudos.'}</p>
          {lastSchedule && <div className="review-schedule-message"><FiClock /> {lastSchedule}</div>}
          <div>
            <Link to="/caderno-erros">Abrir Caderno de Erros <FiArrowRight /></Link>
            <Link to="/trilhas" className="secondary">Explorar trilhas</Link>
          </div>
        </section>
      </div>
    );
  }

  const details = current.detalhes || {};

  return (
    <div className="page-container review-page">
      <header className="review-header">
        <div>
          <span><FiRepeat /> REVISÃO ESPAÇADA</span>
          <h1>Revisão de hoje</h1>
          <p>Recupere a resposta de memória antes de revelar a explicação.</p>
        </div>
        <div className="review-session-stat"><strong>{queue.length}</strong><span>restantes</span></div>
      </header>

      <section className="review-progress" aria-label={`${progress}% da sessão concluída`}>
        <div><span>Sessão diária</span><strong>{completed} de {initialTotal}</strong></div>
        <div className="review-progress-track"><span style={{ width: `${progress}%` }} /></div>
      </section>

      {lastSchedule && <p className="review-inline-message"><FiClock /> {lastSchedule}</p>}
      {error && <p className="review-alert" role="alert">{error}</p>}

      <article className={`review-card ${revealed ? 'is-revealed' : ''}`}>
        <div className="review-card-meta">
          <span>{current.tipo_origem === 'desafio_visual' ? <FiImage /> : <FiBookOpen />}{current.tipo_origem === 'desafio_visual' ? 'Desafio visual' : 'Caso clínico'}</span>
          <span>{current.especialidade} · {current.dificuldade || 'Revisão'}</span>
        </div>

        <div className="review-question">
          {details.imagem && <img src={details.imagem} alt={`Imagem para revisar: ${current.titulo}`} />}
          <div>
            <small>CONTEÚDO {completed + 1}</small>
            <h2>{current.titulo}</h2>
            <p>{current.pergunta}</p>
          </div>
        </div>

        {!revealed ? (
          <div className="review-recall">
            <FiTarget />
            <p><strong>Pense na sua resposta</strong>Recupere o diagnóstico ou a conduta sem consultar materiais.</p>
            <button type="button" onClick={() => setRevealed(true)}><FiEye /> Mostrar resposta</button>
          </div>
        ) : (
          <div className="review-answer">
            <div className="review-answer-comparison">
              <section><span>VOCÊ RESPONDEU</span><p>{current.resposta_usuario}</p></section>
              <section><span>RESPOSTA CORRETA</span><p>{current.resposta_correta}</p></section>
            </div>
            <section className="review-explanation"><span>POR QUE ESSA É A RESPOSTA?</span><p>{current.explicacao}</p></section>
            <div className="review-rating-heading"><div><strong>Como foi lembrar?</strong><span>Sua resposta define quando este conteúdo voltará.</span></div><small>ATALHOS 1–4</small></div>
            <div className="review-ratings">
              {RATINGS.map((rating) => {
                const RatingIcon = rating.icon;
                return <button type="button" className={rating.id} key={rating.id} disabled={isSubmitting} onClick={() => submitRating(rating.id)}><kbd>{rating.key}</kbd><RatingIcon /><strong>{rating.label}</strong><span>{rating.helper}</span></button>;
              })}
            </div>
          </div>
        )}
      </article>
    </div>
  );
};

export default RevisoesPage;
