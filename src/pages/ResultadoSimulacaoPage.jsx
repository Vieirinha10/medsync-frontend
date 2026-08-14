import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  FiAlertTriangle,
  FiArrowRight,
  FiBookOpen,
  FiCheck,
  FiClock,
  FiExternalLink,
  FiHeart,
  FiMessageCircle,
  FiRefreshCw,
  FiSend,
  FiTarget,
  FiTrendingUp,
} from 'react-icons/fi';
import { ApiError, api } from '../services/api';

const suggestedQuestions = [
  'Por que este exame era desnecessário?',
  'Qual seria a conduta se o paciente estivesse instável?',
  'Como diferenciar os principais diagnósticos?',
];

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
  const [question, setQuestion] = useState('');
  const [questionAnswer, setQuestionAnswer] = useState(null);
  const [questionError, setQuestionError] = useState('');
  const [isAsking, setIsAsking] = useState(false);

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
    ? 'Synapse · feedback personalizado por IA'
    : 'Synapse · feedback estruturado pela rubrica clínica';

  const askSynapse = async (selectedQuestion = question) => {
    const cleanQuestion = selectedQuestion.trim();
    if (!cleanQuestion || isAsking) return;
    setQuestion(cleanQuestion);
    setQuestionError('');
    setIsAsking(true);
    try {
      setQuestionAnswer(await api.askSimulationQuestion(progressoId, cleanQuestion));
    } catch (requestError) {
      setQuestionError(requestError.message);
    } finally {
      setIsAsking(false);
    }
  };

  return (
    <div className="page-container simulation-result-page">
      <header className="result-hero">
        <div className="result-heading">
          <span className="simulation-kicker">SYNAPSE · AVALIAÇÃO CONCLUÍDA</span>
          <h1>{result.caso_titulo}</h1>
          <p>{result.feedback.sintese_raciocinio || result.feedback.resumo}</p>
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
              <span>Análise da Synapse</span>
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
              <span>Orientação da Synapse</span>
              <h2>O que precisa melhorar</h2>
            </div>
          </div>
          <FeedbackList
            items={result.feedback.omissoes?.length ? result.feedback.omissoes : result.feedback.pontos_melhoria}
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
        {result.feedback.justificativas_exames?.length > 0 && (
          <div className="exam-rationale-feedback">
            <div><span>COMPREENSÃO DA UTILIDADE</span><h3>Suas justificativas</h3></div>
            {result.feedback.justificativas_exames.map((item) => (
              <article key={item.exame_id} className={`is-${item.compreensao}`}>
                <header><strong>{item.exame}</strong><span>{item.compreensao === 'nao_justificada' ? 'Opcional não preenchida' : item.compreensao}</span></header>
                {item.justificativa_estudante && <p><b>Você escreveu:</b> {item.justificativa_estudante}</p>}
                <small>{item.feedback}</small>
              </article>
            ))}
          </div>
        )}
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

      {result.consequencias && (
        <section className="clinical-consequences" aria-label="Consequências clínicas simuladas">
          <div className="consequence-heading">
            <span className="simulation-kicker">CONSEQUÊNCIAS DAS DECISÕES</span>
            <h2>O caso reagiu ao que você decidiu</h2>
            <p>{result.consequencias.aviso_tempo}</p>
          </div>
          <div className="consequence-summary">
            <article><FiClock /><span>Impacto fictício</span><strong>{result.consequencias.tempo_total_impactado_minutos} min</strong></article>
            <article><FiHeart /><span>Estado após a conduta</span><strong>{result.consequencias.estado_paciente.replace('_', ' ')}</strong></article>
          </div>
          <div className="consequence-timeline">
            {result.consequencias.eventos.map((event, index) => (
              <article key={`${event.tipo}-${index}`} className={`is-${event.tipo}`}>
                <i>{index + 1}</i><div><span>{event.minutos > 0 ? `+${event.minutos} min fictícios` : 'Efeito clínico'}</span><h3>{event.titulo}</h3><p>{event.descricao}</p></div>
              </article>
            ))}
          </div>
          {result.consequencias.reavaliacao?.length > 0 && (
            <div className="vital-reassessment">
              <div><span>REAVALIAÇÃO</span><h3>Novos indicadores após a conduta</h3></div>
              <div>{result.consequencias.reavaliacao.map((item) => (
                <article key={item.indicador} className={`is-${item.tendencia}`}><strong>{item.indicador}</strong><small>Antes: {item.antes}</small><p>{item.depois}</p><span>{item.tendencia}</span></article>
              ))}</div>
            </div>
          )}
        </section>
      )}

      <section className="patient-outcome-section" aria-label="Resposta clínica simulada">
        <div className="patient-outcome-heading">
          <span className="simulation-kicker">IMPACTO DA SUA DECISÃO</span>
          <h2>Como o paciente responderia à sua conduta</h2>
          <p>Uma simulação educacional baseada na rubrica clínica deste caso.</p>
          {result.nivel_conduta && (
            <span className={`conduct-level is-${result.nivel_conduta}`}>
              Conduta {result.nivel_conduta}
            </span>
          )}
        </div>
        <div className="patient-outcome-grid">
          <article>
            <span><FiHeart /></span>
            <div>
              <small>REAÇÃO DO PACIENTE</small>
              <p>{result.feedback.reacao_paciente || 'A reação do paciente não foi registrada nesta avaliação.'}</p>
            </div>
          </article>
          <article>
            <span><FiTrendingUp /></span>
            <div>
              <small>DESFECHO CLÍNICO ESPERADO</small>
              <p>{result.feedback.desfecho_clinico || 'O desfecho clínico não foi registrado nesta avaliação.'}</p>
            </div>
          </article>
        </div>
      </section>

      {(result.objetivos_aprendizagem?.length > 0 || result.fontes_clinicas?.length > 0) && (
        <section className="rubric-evidence-section">
          <div className="rubric-learning-goals">
            <div className="result-panel-title">
              <FiBookOpen />
              <div><span>Rubrica Clínica 2.0</span><h2>Objetivos deste caso</h2></div>
            </div>
            <ul>
              {(result.objetivos_aprendizagem || []).map((objective) => (
                <li key={objective}><FiCheck /><span>{objective}</span></li>
              ))}
            </ul>
          </div>
          <div className="clinical-sources">
            <span>REFERÊNCIAS CLÍNICAS</span>
            {(result.fontes_clinicas || []).map((source) => (
              <a key={source.url} href={source.url} target="_blank" rel="noreferrer">
                <div><strong>{source.titulo}</strong><small>{source.organizacao} · {source.ano}</small></div>
                <FiExternalLink />
              </a>
            ))}
          </div>
        </section>
      )}

      <section className="study-recommendations">
        <div>
          <span className="simulation-kicker">RECOMENDAÇÕES</span>
          <h2>O que revisar agora</h2>
        </div>
        <div className="study-chips">
          {(result.feedback.plano_pessoal_melhoria || result.feedback.recomendacoes_estudo).map((topic) => (
            <span key={topic}>{topic}</span>
          ))}
        </div>
      </section>

      <section className="synapse-follow-up" aria-label="Pergunte à Synapse">
        <div className="follow-up-heading"><span><FiMessageCircle /></span><div><small>SYNAPSE · APROFUNDE O CASO</small><h2>Ficou alguma dúvida?</h2><p>A resposta usa somente este caso, sua resolução e a rubrica revisada.</p></div></div>
        <div className="suggested-questions">
          {suggestedQuestions.map((item) => <button key={item} type="button" onClick={() => askSynapse(item)} disabled={isAsking}>{item}</button>)}
        </div>
        <form onSubmit={(event) => { event.preventDefault(); askSynapse(); }}>
          <label><span>Sua pergunta sobre o caso</span><textarea rows="3" maxLength="500" value={question} onChange={(event) => setQuestion(event.target.value)} placeholder="Pergunte sobre exames, hipótese, conduta ou segurança..." /></label>
          <button type="submit" disabled={isAsking || question.trim().length < 5}>{isAsking ? 'Synapse analisando...' : <><FiSend /> Perguntar</>}</button>
        </form>
        {questionError && <p className="follow-up-error" role="alert">{questionError}</p>}
        {questionAnswer && <article className="synapse-answer"><header><FiMessageCircle /><div><strong>Synapse</strong><small>{questionAnswer.fonte_feedback === 'openai' ? 'Resposta personalizada por IA' : 'Resposta estruturada pela rubrica'}</small></div></header><p>{questionAnswer.resposta}</p><small>{questionAnswer.aviso_educacional}</small></article>}
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
