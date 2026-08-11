import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  FiAlertTriangle,
  FiArrowRight,
  FiCheck,
  FiRefreshCw,
  FiTarget,
} from 'react-icons/fi';
import { ApiError, api } from '../services/api';

const ScoreCard = ({ label, value, total }) => (
  <div className="score-breakdown-card">
    <span>{label}</span>
    <strong>{value}<small>/{total}</small></strong>
    <div className="score-progress" aria-hidden="true">
      <span style={{ width: `${(value / total) * 100}%` }} />
    </div>
  </div>
);

const FeedbackList = ({ items, emptyText, tone = 'positive' }) => (
  items.length > 0 ? (
    <ul className={`feedback-list ${tone}`}>
      {items.map((item) => (
        <li key={item}>
          {tone === 'positive' ? <FiCheck /> : <FiAlertTriangle />}
          <span>{item}</span>
        </li>
      ))}
    </ul>
  ) : <p className="feedback-empty">{emptyText}</p>
);

const ResultadoSimulacaoPage = () => {
  const { progressoId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [result, setResult] = useState(location.state?.result || null);
  const [isLoading, setIsLoading] = useState(!location.state?.result);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (result) return;

    api.getSimulationResult(progressoId)
      .then((data) => {
        setResult(data);
        setIsLoading(false);
      })
      .catch((requestError) => {
        if (requestError instanceof ApiError && requestError.status === 401) {
          navigate('/login', { replace: true });
          return;
        }
        setError(requestError.message);
        setIsLoading(false);
      });
  }, [navigate, progressoId, result]);

  useEffect(() => {
    if (!result) return;
    const params = new URLSearchParams(window.location.search);
    const pathId = params.get('trilha');
    const activityId = params.get('atividade');
    if (!pathId || !activityId) return;

    const storageKey = `medsync:trail-result:${progressoId}:${pathId}:${activityId}`;
    if (window.sessionStorage.getItem(storageKey)) return;
    window.sessionStorage.setItem(storageKey, 'syncing');
    void api.completeLearningPathActivity(
      pathId,
      activityId,
      result.pontuacao_total,
    ).then(() => {
      window.sessionStorage.setItem(storageKey, 'completed');
    }).catch(() => {
      window.sessionStorage.removeItem(storageKey);
    });
  }, [progressoId, result]);

  if (isLoading) {
    return <div className="page-container result-state">Carregando sua avaliação...</div>;
  }
  if (error || !result) {
    return (
      <div className="page-container result-state">
        <h1>Não foi possível carregar o resultado</h1>
        <p>{error}</p>
        <Link to="/casos">Voltar aos casos</Link>
      </div>
    );
  }

  const sourceLabel = result.fonte_feedback === 'openai'
    ? 'Feedback aprimorado por IA'
    : 'Avaliação estruturada pela rubrica clínica';

  return (
    <div className="page-container simulation-result-page">
      <header className="result-hero">
        <div className="result-heading">
          <span className="simulation-kicker">AVALIAÇÃO CONCLUÍDA</span>
          <h1>{result.caso_titulo}</h1>
          <p>{result.feedback.resumo}</p>
          <span className="feedback-source">{sourceLabel}</span>
        </div>
        <div
          className="total-score"
          style={{ '--score': `${result.pontuacao_total * 3.6}deg` }}
          aria-label={`Pontuação total: ${result.pontuacao_total} de 100`}
        >
          <div>
            <strong>{result.pontuacao_total}</strong>
            <span>de 100</span>
          </div>
        </div>
      </header>

      {result.diagnostico_referencia && (
        <section className="result-diagnosis-reveal" aria-label="Diagnóstico de referência">
          <span>DIAGNÓSTICO DE REFERÊNCIA</span>
          <h2>{result.diagnostico_referencia}</h2>
          <p>Compare o diagnóstico final com a hipótese enviada durante a simulação.</p>
        </section>
      )}

      <section className="score-breakdown" aria-label="Detalhamento da pontuação">
        <ScoreCard label="Exames" value={result.pontuacao.exames} total={40} />
        <ScoreCard label="Hipótese" value={result.pontuacao.hipotese} total={30} />
        <ScoreCard label="Conduta" value={result.pontuacao.conduta} total={30} />
      </section>

      <div className="result-grid">
        <section className="result-panel">
          <div className="result-panel-title">
            <FiTarget />
            <div>
              <span>Análise da rubrica</span>
              <h2>O que você fez bem</h2>
            </div>
          </div>
          <FeedbackList
            items={result.feedback.acertos}
            emptyText="Nenhum acerto específico foi identificado."
          />
        </section>

        <section className="result-panel">
          <div className="result-panel-title warning">
            <FiAlertTriangle />
            <div>
              <span>Próximo passo</span>
              <h2>Como melhorar</h2>
            </div>
          </div>
          <FeedbackList
            items={result.feedback.pontos_melhoria}
            emptyText="Nenhum ponto crítico de melhoria foi identificado."
            tone="warning"
          />
        </section>
      </div>

      <section className="result-panel exam-analysis">
        <div className="result-panel-title">
          <FiTarget />
          <div>
            <span>Valor diagnóstico</span>
            <h2>Análise dos exames solicitados</h2>
          </div>
        </div>
        <div className="exam-feedback-grid">
          <div>
            <h3>Adequados</h3>
            <FeedbackList
              items={result.exames.adequados}
              emptyText="Nenhum exame essencial foi selecionado."
            />
          </div>
          <div>
            <h3>Essenciais ausentes</h3>
            <FeedbackList
              items={result.exames.essenciais_ausentes}
              emptyText="Você solicitou todos os exames essenciais."
              tone="warning"
            />
          </div>
          <div>
            <h3>Desnecessários</h3>
            <FeedbackList
              items={result.exames.desnecessarios}
              emptyText="Nenhum exame de baixo valor foi solicitado."
              tone="warning"
            />
          </div>
        </div>
        <p className="exam-comment">{result.exames.comentario}</p>
      </section>

      <section className="reasoning-feedback">
        <article className="reasoning-card">
          <span>HIPÓTESE DIAGNÓSTICA</span>
          <p>{result.feedback.feedback_hipotese}</p>
        </article>
        <article className="reasoning-card">
          <span>CONDUTA</span>
          <p>{result.feedback.feedback_conduta}</p>
        </article>
        <article className="reasoning-card safety">
          <span>SEGURANÇA DO PACIENTE</span>
          <p>{result.feedback.feedback_seguranca}</p>
        </article>
      </section>

      <section className="study-recommendations">
        <div>
          <span className="simulation-kicker">RECOMENDAÇÕES</span>
          <h2>O que revisar agora</h2>
        </div>
        <div className="study-chips">
          {result.feedback.recomendacoes_estudo.map((topic) => (
            <span key={topic}>{topic}</span>
          ))}
        </div>
      </section>

      <p className="educational-notice">{result.aviso_educacional}</p>

      <div className="result-actions">
        <Link to={`/casos/${result.caso_id}`} className="secondary-result-action">
          <FiRefreshCw /> Refazer este caso
        </Link>
        <Link to="/casos" className="primary-result-action">
          Explorar outros casos <FiArrowRight />
        </Link>
      </div>
    </div>
  );
};

export default ResultadoSimulacaoPage;
