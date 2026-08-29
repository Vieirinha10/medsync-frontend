import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  FiAlertTriangle,
  FiArrowRight,
  FiAward,
  FiBookOpen,
  FiCheck,
  FiChevronDown,
  FiExternalLink,
  FiHeart,
  FiInfo,
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

const formatScore = (value) => Number(value).toLocaleString('pt-BR', {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

const scoreFromHundred = (value) => Math.max(0, Math.min(10, value / 10));

const scoreFromSection = (value, total) => Math.max(0, Math.min(10, (value / total) * 10));

const getScoreProfile = (score) => {
  if (score >= 9) return {
    label: 'Excelente resultado',
    message: 'Seu raciocínio está muito bem consolidado neste caso.',
    tone: 'excellent',
  };
  if (score >= 7.5) return {
    label: 'Muito bom',
    message: 'Você tomou decisões consistentes e clinicamente seguras.',
    tone: 'great',
  };
  if (score >= 6) return {
    label: 'Bom raciocínio',
    message: 'Você construiu uma boa linha clínica e já sabe onde evoluir.',
    tone: 'good',
  };
  if (score >= 4) return {
    label: 'Em desenvolvimento',
    message: 'Você identificou parte do caminho. Use o plano para avançar.',
    tone: 'developing',
  };
  return {
    label: 'Vamos revisar juntos',
    message: 'Este resultado é um ponto de partida para rever as prioridades com calma.',
    tone: 'review',
  };
};

const getPatientStatus = (result) => {
  const state = result.consequencias?.estado_paciente || result.nivel_conduta;
  const clinicalText = [
    result.feedback?.reacao_paciente,
    result.feedback?.desfecho_clinico,
    ...(result.consequencias?.reavaliacao || []).flatMap((item) => [
      item.indicador,
      item.depois,
    ]),
  ].filter(Boolean).join(' ').toLocaleLowerCase('pt-BR');

  if (
    state === 'deterioracao'
    && /(risco de (morte|óbito)|óbito|parada card|choque|colapso|estado crítico)/i.test(clinicalText)
  ) {
    return {
      emoji: '😵',
      label: 'Estado crítico',
      helper: 'A decisão aumenta o risco de uma complicação grave.',
      tone: 'critical',
    };
  }

  if (
    /(febril|febre|temperatura elevada)/i.test(clinicalText)
    && !/(afebril|sem febre|febre (cede|resolve)|temperatura normal)/i.test(clinicalText)
  ) {
    return {
      emoji: '🤒',
      label: 'Paciente febril',
      helper: 'A febre continua sendo um sinal importante na reavaliação.',
      tone: 'fever',
    };
  }

  if (state === 'deterioracao' || result.nivel_conduta === 'insegura') {
    return {
      emoji: '😰',
      label: 'Quadro em deterioração',
      helper: 'A conduta oferece risco e precisa ser revista com prioridade.',
      tone: 'danger',
    };
  }

  if (state === 'resposta_parcial' || result.nivel_conduta === 'parcial') {
    return {
      emoji: '😟',
      label: 'Resposta parcial',
      helper: 'O paciente pode melhorar, mas ainda existem cuidados importantes pendentes.',
      tone: 'partial',
    };
  }

  if (state === 'estabilizado' || result.nivel_conduta === 'adequada') {
    return {
      emoji: '🙂',
      label: 'Paciente estabilizado',
      helper: 'As prioridades da conduta favorecem uma evolução clínica segura.',
      tone: 'stable',
    };
  }

  return {
    emoji: '😐',
    label: 'Estado em observação',
    helper: 'A evolução depende das próximas decisões e da reavaliação.',
    tone: 'watching',
  };
};

const friendlyEventTitle = (event) => {
  if (event.tipo === 'tempo') return 'Exames de baixo valor desviaram o foco';
  if (event.tipo === 'atraso') return 'Exames importantes não foram solicitados';
  return event.titulo;
};

const ScoreCard = ({ label, value, total }) => (
  <div className="score-breakdown-card">
    <span>{label}</span>
    <strong>{formatScore(value)}<small>/{formatScore(total)}</small></strong>
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
  const scoreOutOfTen = scoreFromHundred(result.pontuacao_total);
  const scoreProfile = getScoreProfile(scoreOutOfTen);
  const patientStatus = getPatientStatus(result);
  const relevantConsequences = (result.consequencias?.eventos || []).filter(
    (event) => event.tipo !== 'resposta' && event.tipo !== 'seguranca',
  );

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
          <p>{result.feedback.resumo || result.feedback.sintese_raciocinio}</p>
          <span className="feedback-source">{sourceLabel}</span>
        </div>
        <aside
          className={`score-celebration is-${scoreProfile.tone}`}
          aria-label={`Pontuação total: ${formatScore(scoreOutOfTen)} de 10`}
        >
          <div className="score-card-heading">
            <FiAward />
            <span>Seu resultado</span>
          </div>
          <div className="score-orbit">
            <span className="score-orbit-track" aria-hidden="true"><i /><i /></span>
            <svg viewBox="0 0 128 128" aria-hidden="true">
              <circle className="score-ring-track" cx="64" cy="64" r="52" />
              <circle
                className="score-ring-value"
                cx="64"
                cy="64"
                r="52"
                style={{ '--score-offset': 326.73 * (1 - scoreOutOfTen / 10) }}
              />
            </svg>
            <div className="score-core">
              <strong>{formatScore(scoreOutOfTen)}</strong>
              <span>de 10</span>
            </div>
          </div>
          <div className="score-celebration-copy">
            <strong>{scoreProfile.label}</strong>
            <p>{scoreProfile.message}</p>
          </div>
        </aside>
      </header>

      <section className="clinical-core-summary" aria-label="Resumo da hipótese e da conduta">
        <article className="clinical-core-card hypothesis">
          <div className="clinical-core-card-title">
            <span><FiTarget /></span>
            <div>
              <small>ENTENDA RAPIDAMENTE</small>
              <h2>Qual era a hipótese?</h2>
            </div>
          </div>
          <p>{result.feedback.feedback_hipotese}</p>
          {result.diagnostico_referencia && (
            <div className="diagnosis-reference-inline">
              <span>Diagnóstico de referência</span>
              <strong>{result.diagnostico_referencia}</strong>
            </div>
          )}
        </article>

        <article className="clinical-core-card conduct">
          <div className="clinical-core-card-title">
            <span><FiHeart /></span>
            <div>
              <small>PRIORIDADES DO CUIDADO</small>
              <h2>Como conduzir o caso?</h2>
            </div>
          </div>
          <p>{result.feedback.feedback_conduta}</p>
        </article>
      </section>

      <section className={`patient-impact-card is-${patientStatus.tone}`} aria-label="Impacto das suas decisões no paciente">
        <div className="patient-status-summary">
          <span
            className="patient-status-emoji"
            role="img"
            aria-label={patientStatus.label}
          >
            {patientStatus.emoji}
          </span>
          <div>
            <span className="simulation-kicker">IMPACTO DAS SUAS DECISÕES</span>
            <h2>{patientStatus.label}</h2>
            <p>{patientStatus.helper}</p>
            {result.nivel_conduta && (
              <span className={`conduct-level is-${result.nivel_conduta}`}>
                {result.nivel_conduta === 'insegura'
                  ? 'Atenção: esta conduta oferece risco'
                  : result.nivel_conduta === 'adequada'
                    ? 'Conduta clinicamente adequada'
                    : 'Conduta ainda incompleta'}
              </span>
            )}
          </div>
        </div>

        <div className="patient-impact-grid">
          <article>
            <span><FiHeart /></span>
            <div>
              <small>O QUE ACONTECE AGORA</small>
              <h3>Reação imediata</h3>
              <p>{result.feedback.reacao_paciente || 'A reação do paciente não foi registrada nesta avaliação.'}</p>
            </div>
          </article>
          <article>
            <span><FiTrendingUp /></span>
            <div>
              <small>O QUE ESPERAR DEPOIS</small>
              <h3>Desfecho clínico</h3>
              <p>{result.feedback.desfecho_clinico || 'O desfecho clínico não foi registrado nesta avaliação.'}</p>
            </div>
          </article>
        </div>

        {relevantConsequences.length > 0 && (
          <div className="decision-factors">
            <div><FiInfo /><h3>O que influenciou esse resultado?</h3></div>
            <div>
              {relevantConsequences.map((event, index) => (
                <article key={`${event.tipo}-${index}`}>
                  <FiArrowRight />
                  <div><strong>{friendlyEventTitle(event)}</strong><p>{event.descricao}</p></div>
                </article>
              ))}
            </div>
          </div>
        )}

      </section>

      <details className="detailed-clinical-analysis">
        <summary>
          <span><FiBookOpen /></span>
          <div>
            <small>QUER ENTENDER MELHOR?</small>
            <h2>Ver análise clínica completa</h2>
            <p>Abra para conferir a composição da nota, seus acertos, as avaliações e exames e os pontos de segurança.</p>
          </div>
          <FiChevronDown className="details-chevron" />
        </summary>

        <div className="detailed-analysis-body">
          <section className="section-score-analysis" aria-label="Desempenho em cada etapa">
            <div>
              <span className="simulation-kicker">COMO A NOTA FOI FORMADA</span>
              <h2>Seu desempenho em cada etapa</h2>
              <p>Cada etapa foi convertida para a mesma escala de 0 a 10.</p>
            </div>
            <div className="score-breakdown">
              <ScoreCard label="Avaliações e exames" value={scoreFromSection(result.pontuacao.exames, 40)} total={10} />
              <ScoreCard label="Hipótese" value={scoreFromSection(result.pontuacao.hipotese, 30)} total={10} />
              <ScoreCard label="Conduta" value={scoreFromSection(result.pontuacao.conduta, 30)} total={10} />
            </div>
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
                  <h2>Onde você pode evoluir</h2>
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
                <h2>Entenda as avaliações e exames solicitados</h2>
              </div>
            </div>
            <div className="exam-feedback-grid">
              <div>
                <h3>Boas escolhas</h3>
                <FeedbackList
                  items={result.exames.adequados}
                  emptyText="Nenhum exame essencial foi selecionado."
                />
              </div>
              <div>
                <h3>Avaliações ou exames importantes que faltaram</h3>
                <FeedbackList
                  items={result.exames.essenciais_ausentes}
                  emptyText="Você solicitou todas as avaliações e exames importantes."
                  tone="warning"
                />
              </div>
              <div>
                <h3>Avaliações ou exames de baixo valor</h3>
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

          <article className="reasoning-card safety">
            <span>SEGURANÇA DO PACIENTE</span>
            <h2>{result.nivel_conduta === 'insegura' ? 'Atenção: revise esta conduta' : 'Ponto de segurança'}</h2>
            <p>{result.feedback.feedback_seguranca}</p>
          </article>

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

        </div>
      </details>

      <section className="study-recommendations is-standalone" aria-label="Plano rápido de melhoria">
        <div>
          <span className="simulation-kicker">SEU PRÓXIMO PASSO</span>
          <h2>Plano rápido de melhoria</h2>
          <p>Leve estes pontos para o próximo caso e transforme o feedback em prática.</p>
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
