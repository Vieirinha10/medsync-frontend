import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  FiActivity,
  FiAlertTriangle,
  FiArrowRight,
  FiCheck,
  FiClipboard,
  FiClock,
  FiExternalLink,
  FiHeart,
  FiMessageCircle,
  FiRefreshCw,
  FiSend,
  FiShield,
  FiTarget,
  FiTrendingUp,
  FiZap,
} from 'react-icons/fi';
import { ApiError, api } from '../services/api';

const resultTabs = [
  { id: 'resultado', label: 'Resultado', mobileLabel: 'Resultado', icon: FiActivity },
  { id: 'decisoes', label: 'Decisões', mobileLabel: 'Decisões', icon: FiClipboard },
  { id: 'impacto', label: 'Impacto clínico', mobileLabel: 'Impacto', icon: FiHeart },
  { id: 'evoluir', label: 'Como evoluir', mobileLabel: 'Evoluir', icon: FiTrendingUp },
];

const suggestedQuestions = [
  'Por que a conduta teve esse peso?',
  'Qual era a principal prioridade de segurança?',
  'Como diferenciar os diagnósticos mais prováveis?',
];

const formatScore = (value) => Number(value).toLocaleString('pt-BR', {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

const scoreFromHundred = (value) => Math.max(0, Math.min(10, value / 10));

const sectionPercentage = (value, total) => Math.round(
  Math.max(0, Math.min(100, (Number(value || 0) / total) * 100)),
);

const getScoreProfile = (score, { exams, hypothesis, conduct, unsafe }) => {
  if (unsafe) return { label: 'Há risco na conduta proposta', tone: 'review' };
  if (conduct === 0 && hypothesis >= 80) return { label: 'Bom diagnóstico, mas conduta inadequada', tone: 'review' };
  if (conduct < 50) return { label: 'A conduta precisa de revisão', tone: 'developing' };
  if (hypothesis < 50) return { label: 'A hipótese precisa ser reformulada', tone: 'developing' };
  if (exams < 50) return { label: 'A investigação precisa ser revista', tone: 'developing' };
  if (score >= 9) return { label: 'Excelente resultado', tone: 'excellent' };
  if (score >= 7.5) return { label: 'Muito bom', tone: 'great' };
  if (score >= 6) return { label: 'Bom raciocínio', tone: 'good' };
  if (score >= 4) return { label: 'Em desenvolvimento', tone: 'developing' };
  return { label: 'Vamos revisar juntos', tone: 'review' };
};

const buildExamFeedback = (result) => {
  if (result.feedback.feedback_exames) return result.feedback.feedback_exames;
  const parts = [];
  if (result.exames.adequados?.length) parts.push(`Boas escolhas: ${result.exames.adequados.join(', ')}.`);
  if (result.exames.essenciais_ausentes?.length) parts.push(`Faltaram exames essenciais: ${result.exames.essenciais_ausentes.join(', ')}.`);
  if (result.exames.desnecessarios?.length) parts.push(`Tiveram baixo valor neste cenário: ${result.exames.desnecessarios.join(', ')}.`);
  return parts.join(' ') || result.exames.comentario;
};

const getPatientStatus = (result) => {
  const state = result.consequencias?.estado_paciente || result.nivel_conduta;
  const clinicalText = [
    result.feedback?.reacao_paciente,
    result.feedback?.desfecho_clinico,
    ...(result.consequencias?.reavaliacao || []).flatMap((item) => [item.indicador, item.depois]),
  ].filter(Boolean).join(' ').toLocaleLowerCase('pt-BR');

  if (
    state === 'deterioracao'
    && /(risco de (morte|óbito)|óbito|parada card|choque|colapso|estado crítico)/i.test(clinicalText)
  ) {
    return { emoji: '😵', label: 'Estado crítico', helper: 'A decisão aumenta o risco de uma complicação grave.', tone: 'critical' };
  }
  if (
    /(febril|febre|temperatura elevada)/i.test(clinicalText)
    && !/(afebril|sem febre|febre (cede|resolve)|temperatura normal)/i.test(clinicalText)
  ) {
    return { emoji: '🤒', label: 'Paciente febril', helper: 'A febre continua sendo um sinal importante na reavaliação.', tone: 'fever' };
  }
  if (state === 'deterioracao' || result.nivel_conduta === 'insegura') {
    return { emoji: '😰', label: 'Quadro em deterioração', helper: 'A conduta oferece risco e precisa ser revista com prioridade.', tone: 'danger' };
  }
  if (state === 'resposta_parcial' || result.nivel_conduta === 'parcial') {
    return { emoji: '😟', label: 'Resposta parcial', helper: 'Ainda existem cuidados importantes pendentes.', tone: 'partial' };
  }
  if (state === 'estabilizado' || result.nivel_conduta === 'adequada') {
    return { emoji: '🙂', label: 'Paciente estabilizado', helper: 'As prioridades favorecem uma evolução clínica segura.', tone: 'stable' };
  }
  return { emoji: '😐', label: 'Estado em observação', helper: 'A evolução depende das próximas decisões e da reavaliação.', tone: 'watching' };
};

const uniqueItems = (...collections) => {
  const seen = new Set();
  return collections.flat().filter((item) => {
    const value = String(item || '').trim();
    const key = value.toLocaleLowerCase('pt-BR');
    if (!value || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

const joinClinicalItems = (items, fallback) => (items?.length ? items.join(', ') : fallback);

const friendlyEventTitle = (event) => {
  if (event.tipo === 'tempo') return 'Tempo consumido por decisões de baixo valor';
  if (event.tipo === 'atraso') return 'Atraso na investigação prioritária';
  if (event.tipo === 'seguranca') return 'Repercussão sobre a segurança';
  return event.titulo;
};

const useAnimatedScore = (targetScore, duration = 800) => {
  const [displayScore, setDisplayScore] = useState(0);

  useEffect(() => {
    if (typeof window === 'undefined') {
      setDisplayScore(targetScore);
      return;
    }
    const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
    if (prefersReducedMotion || typeof window.requestAnimationFrame !== 'function') {
      setDisplayScore(targetScore);
      return;
    }

    let startTime = null;
    let animationFrameId;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      setDisplayScore(easeProgress * targetScore);

      if (progress < 1) {
        animationFrameId = window.requestAnimationFrame(animate);
      } else {
        setDisplayScore(targetScore);
      }
    };

    animationFrameId = window.requestAnimationFrame(animate);
    return () => {
      if (animationFrameId) window.cancelAnimationFrame(animationFrameId);
    };
  }, [targetScore, duration]);

  return displayScore;
};

const AnimatedScore = ({ value }) => {
  const animatedScore = useAnimatedScore(value);
  return <strong>{formatScore(animatedScore)}</strong>;
};

const ClinicalDecisionProfile = ({ score }) => {
  const values = [
    sectionPercentage(score.exames, 40),
    sectionPercentage(score.hipotese, 30),
    sectionPercentage(score.conduta, 30),
  ];
  const axes = [
    { label: 'Avaliações e exames', shortLabel: 'Exames', angle: -90 },
    { label: 'Hipótese', shortLabel: 'Hipótese', angle: 30 },
    { label: 'Conduta', shortLabel: 'Conduta', angle: 150 },
  ];
  const pointAt = (angle, percentage, radius = 68) => {
    const radians = (angle * Math.PI) / 180;
    const distance = radius * (percentage / 100);
    return `${100 + Math.cos(radians) * distance},${92 + Math.sin(radians) * distance}`;
  };
  const polygon = (percentage) => axes.map((axis) => pointAt(axis.angle, percentage)).join(' ');
  const resultPolygon = axes.map((axis, index) => pointAt(axis.angle, values[index])).join(' ');

  return (
    <div className="decision-profile">
      <div className="decision-profile-chart" aria-hidden="true">
        <svg viewBox="0 0 200 184">
          {[33, 66, 100].map((level) => <polygon key={level} className="profile-grid" points={polygon(level)} />)}
          {axes.map((axis) => {
            const [x2, y2] = pointAt(axis.angle, 100).split(',');
            return <line key={axis.label} className="profile-axis" x1="100" y1="92" x2={x2} y2={y2} />;
          })}
          <polygon className="profile-result" points={resultPolygon} />
          {axes.map((axis, index) => {
            const [cx, cy] = pointAt(axis.angle, values[index]).split(',');
            return <circle key={axis.label} className="profile-point" cx={cx} cy={cy} r="4" />;
          })}
          <text x="100" y="12" textAnchor="middle">Exames</text>
          <text x="177" y="151" textAnchor="end">Hipótese</text>
          <text x="23" y="151">Conduta</text>
        </svg>
      </div>
      <ul aria-label="Desempenho por dimensão clínica">
        {axes.map((axis, index) => (
          <li key={axis.label}>
            <div className="profile-dimension-header">
              <span>{axis.shortLabel}</span>
              <strong>{values[index]}%</strong>
            </div>
            <div className="profile-bar" aria-hidden="true">
              <span style={{ width: `${values[index]}%` }} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

const DecisionStatus = ({ tone, children }) => (
  <span className={`decision-status is-${tone}`}>
    {tone === 'adequada' ? <FiCheck /> : <FiAlertTriangle />}{children}
  </span>
);

const ResultadoSimulacaoPage = () => {
  const { progressoId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const tabRefs = useRef([]);
  const [activeTab, setActiveTab] = useState('resultado');
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
      .then((data) => { setResult(data); setIsLoading(false); })
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
    void api.completeLearningPathActivity(pathId, activityId, result.pontuacao_total)
      .then(() => window.sessionStorage.setItem(storageKey, 'completed'))
      .catch(() => window.sessionStorage.removeItem(storageKey));
  }, [progressoId, result]);

  if (isLoading) return <div className="page-container result-state">Carregando sua avaliação...</div>;
  if (error || !result) {
    return <div className="page-container result-state"><h1>Não foi possível carregar o resultado</h1><p>{error}</p><Link to="/casos">Voltar aos casos</Link></div>;
  }

  const sourceLabel = result.fonte_feedback === 'openai'
    ? 'Feedback personalizado pela Synapse'
    : 'Feedback estruturado pela rubrica clínica';
  const scoreOutOfTen = scoreFromHundred(result.pontuacao_total);
  const patientStatus = getPatientStatus(result);
  const isUnsafe = result.nivel_conduta === 'insegura' || result.consequencias?.estado_paciente === 'deterioracao';
  const examHasGaps = result.exames.essenciais_ausentes?.length > 0 || result.exames.desnecessarios?.length > 0;
  const examsPercentage = sectionPercentage(result.pontuacao.exames, 40);
  const hypothesisPercentage = sectionPercentage(result.pontuacao.hipotese, 30);
  const conductPercentage = sectionPercentage(result.pontuacao.conduta, 30);
  const scoreProfile = getScoreProfile(scoreOutOfTen, {
    exams: examsPercentage,
    hypothesis: hypothesisPercentage,
    conduct: conductPercentage,
    unsafe: isUnsafe,
  });
  const mainFeedback = [
    { label: 'Exames', icon: FiActivity, text: buildExamFeedback(result), percentage: examsPercentage },
    { label: 'Hipótese', icon: FiTarget, text: result.feedback.feedback_hipotese, percentage: hypothesisPercentage },
    { label: 'Conduta', icon: FiHeart, text: result.feedback.feedback_conduta, percentage: conductPercentage },
  ];
  const priorities = uniqueItems(
    result.feedback.plano_pessoal_melhoria || [],
    result.feedback.pontos_melhoria || [],
    result.feedback.omissoes || [],
  ).slice(0, 3);
  const studyTopics = uniqueItems(result.feedback.recomendacoes_estudo || []);
  const impactEvents = (result.consequencias?.eventos || []).filter((event) => event.tipo !== 'resposta');

  const selectTab = (tabId, { focus = false } = {}) => {
    setActiveTab(tabId);
    if (focus) window.requestAnimationFrame(() => tabRefs.current[resultTabs.findIndex((tab) => tab.id === tabId)]?.focus());
  };

  const handleTabKeyDown = (event, currentIndex) => {
    let nextIndex = currentIndex;
    if (event.key === 'ArrowRight') nextIndex = (currentIndex + 1) % resultTabs.length;
    else if (event.key === 'ArrowLeft') nextIndex = (currentIndex - 1 + resultTabs.length) % resultTabs.length;
    else if (event.key === 'Home') nextIndex = 0;
    else if (event.key === 'End') nextIndex = resultTabs.length - 1;
    else return;
    event.preventDefault();
    selectTab(resultTabs[nextIndex].id, { focus: true });
  };

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
    <div className="page-container simulation-result-page debrief-page">
      <header className="debrief-heading debrief-hero result-hero">
        <div className="debrief-hero-content">
          <div className="debrief-hero-kicker">
            <FiZap /> <span>SYNAPSE · DEBRIEFING CLÍNICO</span>
          </div>
          <h1>{result.caso_titulo}</h1>
          <p>Análise estruturada do seu raciocínio diagnóstico, tomada de decisão e impacto na evolução do paciente.</p>
        </div>
        <div className="debrief-hero-side">
          <span className="feedback-source">
            <FiShield /> {sourceLabel}
          </span>
        </div>
      </header>

      <nav className="debrief-tabs" aria-label="Etapas do feedback">
        <div role="tablist" aria-label="Feedback do caso">
          {resultTabs.map((tab, index) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                ref={(element) => { tabRefs.current[index] = element; }}
                type="button"
                role="tab"
                id={`tab-${tab.id}`}
                aria-label={tab.label}
                aria-controls={`panel-${tab.id}`}
                aria-selected={activeTab === tab.id}
                tabIndex={activeTab === tab.id ? 0 : -1}
                className={activeTab === tab.id ? 'is-active' : ''}
                onClick={() => selectTab(tab.id)}
                onKeyDown={(event) => handleTabKeyDown(event, index)}
              >
                <Icon className="tab-icon" />
                <span className="tab-label-desktop">{tab.label}</span>
                <span className="tab-label-mobile">{tab.mobileLabel || tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {isUnsafe && (
        <section className="debrief-safety-alert" role="alert">
          <FiAlertTriangle />
          <div><strong>A conduta oferece risco ao paciente</strong><span>Revise o impacto clínico antes de prosseguir para outro caso.</span></div>
          <button type="button" onClick={() => selectTab('impacto', { focus: true })}>Ver impacto <FiArrowRight /></button>
        </section>
      )}

      {activeTab === 'resultado' && (
        <section id="panel-resultado" role="tabpanel" aria-labelledby="tab-resultado" className="debrief-panel result-overview-panel">
          <ClinicalDecisionProfile score={result.pontuacao} />
          <div className="result-overview-copy">
            <span>Nota geral</span>
            <div className="result-score-line" aria-label={`Pontuação total: ${formatScore(scoreOutOfTen)} de 10`}><AnimatedScore value={scoreOutOfTen} /><small>/10</small></div>
            <h2>{scoreProfile.label}</h2>
            <p className="main-feedback-summary">{result.feedback.resumo || result.feedback.sintese_raciocinio}</p>
            <div className="main-feedback-axes" aria-label="Síntese personalizada das decisões">
              {mainFeedback.map((item) => {
                const Icon = item.icon;
                return (
                  <article className={item.percentage < 50 ? 'needs-attention' : ''} key={item.label}>
                    <strong><Icon /> {item.label} <span>{item.percentage}%</span></strong>
                    <p>{item.text}</p>
                  </article>
                );
              })}
            </div>
            <button type="button" onClick={() => selectTab('decisoes', { focus: true })}>Entender minhas decisões <FiArrowRight /></button>
          </div>
        </section>
      )}

      {activeTab === 'decisoes' && (
        <section id="panel-decisoes" role="tabpanel" aria-labelledby="tab-decisoes" className="debrief-panel decisions-panel">
          <header className="debrief-panel-heading">
            <span><FiClipboard /></span><div><h2>Suas decisões e a referência clínica</h2><p>Cada etapa tem um único lugar de análise, sem repetir o mesmo ponto em vários cards.</p></div>
          </header>
          <div className="decision-comparison" aria-label="Comparação clínica por etapa">
            <article>
              <div className="decision-stage"><FiActivity /><strong>Avaliações e exames</strong></div>
              <div className="decision-reading"><span>Leitura da decisão</span><p>Boas escolhas: {joinClinicalItems(result.exames.adequados, 'nenhuma escolha essencial reconhecida')}.</p></div>
              <div className="decision-reference"><span>Referência do caso</span><p>{result.exames.comentario}</p><DecisionStatus tone={examHasGaps ? 'parcial' : 'adequada'}>{examHasGaps ? 'Requer revisão' : 'Adequada'}</DecisionStatus></div>
            </article>
            <article>
              <div className="decision-stage"><FiTarget /><strong>Hipótese</strong></div>
              <div className="decision-reading"><span>Análise clínica</span><p>{result.feedback.feedback_hipotese}</p></div>
              <div className="decision-reference"><span>Diagnóstico de referência</span><p>{result.diagnostico_referencia || 'Não informado nesta versão do caso.'}</p><DecisionStatus tone={hypothesisPercentage >= 80 ? 'adequada' : hypothesisPercentage >= 50 ? 'parcial' : 'insegura'}>{hypothesisPercentage >= 80 ? 'Compatível' : hypothesisPercentage >= 50 ? 'Parcial' : 'Reformular'}</DecisionStatus></div>
            </article>
            <article>
              <div className="decision-stage"><FiHeart /><strong>Conduta</strong></div>
              <div className="decision-reading"><span>Análise clínica</span><p>{result.feedback.feedback_conduta}</p></div>
              <div className="decision-reference"><span>Segurança e prioridade</span><p>{result.feedback.feedback_seguranca}</p><DecisionStatus tone={result.nivel_conduta === 'adequada' ? 'adequada' : result.nivel_conduta === 'insegura' ? 'insegura' : 'parcial'}>{result.nivel_conduta === 'adequada' ? 'Adequada' : result.nivel_conduta === 'insegura' ? 'Insegura' : 'Incompleta'}</DecisionStatus></div>
            </article>
          </div>
          <details className="decision-details">
            <summary>Ver detalhes das avaliações, exames e justificativas</summary>
            <div className="exam-decision-groups">
              <div><strong>Boas escolhas</strong><p>{joinClinicalItems(result.exames.adequados, 'Nenhuma identificada.')}</p></div>
              <div><strong>Essenciais ausentes</strong><p>{joinClinicalItems(result.exames.essenciais_ausentes, 'Nenhum.')}</p></div>
              <div><strong>Baixo valor</strong><p>{joinClinicalItems(result.exames.desnecessarios, 'Nenhum.')}</p></div>
            </div>
            {result.feedback.justificativas_exames?.length > 0 && (
              <div className="rationale-compact-list">
                {result.feedback.justificativas_exames.map((item) => (
                  <article key={item.exame_id}><header><strong>{item.exame}</strong><span>{item.compreensao === 'nao_justificada' ? 'Não justificada' : item.compreensao}</span></header>{item.justificativa_estudante && <p><b>Você escreveu:</b> {item.justificativa_estudante}</p>}<small>{item.feedback}</small></article>
                ))}
              </div>
            )}
          </details>
        </section>
      )}

      {activeTab === 'impacto' && (
        <section id="panel-impacto" role="tabpanel" aria-labelledby="tab-impacto" className={`debrief-panel impact-panel is-${patientStatus.tone}`}>
          <header className="impact-summary">
            <span className="impact-patient-emoji" role="img" aria-label={patientStatus.label}>{patientStatus.emoji}</span>
            <div><span>IMPACTO CLÍNICO SIMULADO</span><h2>{patientStatus.label}</h2><p>{patientStatus.helper}</p></div>
          </header>
          <ol className="clinical-impact-timeline">
            <li><span><FiHeart /></span><div><strong>Reação imediata</strong><p>{result.feedback.reacao_paciente || 'Não registrada nesta avaliação.'}</p></div></li>
            {impactEvents.map((event, index) => (
              <li key={`${event.tipo}-${index}`}><span>{event.tipo === 'tempo' || event.tipo === 'atraso' ? <FiClock /> : <FiShield />}</span><div><strong>{friendlyEventTitle(event)}</strong><p>{event.descricao}</p>{event.minutos > 0 && <small>Impacto educacional: +{event.minutos} min</small>}</div></li>
            ))}
            {(result.consequencias?.reavaliacao || []).map((item) => (
              <li key={`${item.indicador}-${item.depois}`}><span><FiActivity /></span><div><strong>Reavaliação: {item.indicador}</strong><p>{item.antes} → {item.depois}</p><small className={`trend-${item.tendencia}`}>{item.tendencia}</small></div></li>
            ))}
            <li><span><FiTarget /></span><div><strong>Desfecho simulado</strong><p>{result.feedback.desfecho_clinico || 'Não registrado nesta avaliação.'}</p></div></li>
          </ol>
          <p className="impact-disclaimer"><FiShield /> {result.consequencias?.aviso_tempo || 'Evolução educacional simulada; não representa previsão para um paciente real.'}</p>
        </section>
      )}

      {activeTab === 'evoluir' && (
        <section id="panel-evoluir" role="tabpanel" aria-labelledby="tab-evoluir" className="debrief-panel evolve-panel">
          <header className="debrief-panel-heading"><span><FiTarget /></span><div><h2>Prioridades para o próximo caso</h2><p>Três ações práticas para transformar o feedback em desempenho.</p></div></header>
          <ol className="improvement-priorities">
            {(priorities.length ? priorities : ['Revisar a hipótese, a conduta e os critérios de segurança deste caso.']).map((priority, index) => <li key={priority}><span>{index + 1}</span><p>{priority}</p></li>)}
          </ol>
          {studyTopics.length > 0 && <div className="study-topic-tags" aria-label="Temas recomendados para estudo">{studyTopics.map((topic) => <span key={topic}>{topic}</span>)}</div>}
          {(result.objetivos_aprendizagem?.length > 0 || result.fontes_clinicas?.length > 0) && (
            <details className="learning-evidence">
              <summary>Objetivos e referências deste caso</summary>
              <div>
                {result.objetivos_aprendizagem?.length > 0 && <ul>{result.objetivos_aprendizagem.map((objective) => <li key={objective}><FiCheck /> {objective}</li>)}</ul>}
                {result.fontes_clinicas?.length > 0 && <div className="debrief-sources">{result.fontes_clinicas.map((source) => <a key={source.url} href={source.url} target="_blank" rel="noreferrer"><span><strong>{source.titulo}</strong><small>{source.organizacao} · {source.ano}</small></span><FiExternalLink /></a>)}</div>}
              </div>
            </details>
          )}
          <section className="synapse-follow-up debrief-synapse" aria-label="Pergunte à Synapse">
            <div className="follow-up-heading"><span><FiMessageCircle /></span><div><small>APROFUNDE COM A SYNAPSE</small><h2>Ficou alguma dúvida?</h2><p>A resposta usa somente este caso, sua resolução e a rubrica revisada.</p></div></div>
            <div className="suggested-questions">{suggestedQuestions.map((item) => <button key={item} type="button" onClick={() => askSynapse(item)} disabled={isAsking}>{item}</button>)}</div>
            <form onSubmit={(event) => { event.preventDefault(); askSynapse(); }}>
              <label><span>Sua pergunta sobre o caso</span><textarea rows="3" maxLength="500" value={question} onChange={(event) => setQuestion(event.target.value)} placeholder="Pergunte sobre avaliações, exames, hipótese, conduta ou segurança..." /></label>
              <button type="submit" disabled={isAsking || question.trim().length < 5}>{isAsking ? 'Synapse analisando...' : <><FiSend /> Perguntar</>}</button>
            </form>
            {questionError && <p className="follow-up-error" role="alert">{questionError}</p>}
            {questionAnswer && <article className="synapse-answer"><header><FiMessageCircle /><div><strong>Synapse</strong><small>{questionAnswer.fonte_feedback === 'openai' ? 'Resposta personalizada por IA' : 'Resposta estruturada pela rubrica'}</small></div></header><p>{questionAnswer.resposta}</p><small>{questionAnswer.aviso_educacional}</small></article>}
          </section>
        </section>
      )}

      <p className="educational-notice">{result.aviso_educacional}</p>
      <div className="result-actions">
        <Link to={`/casos/${result.caso_id}`} className="secondary-result-action"><FiRefreshCw /> Refazer este caso</Link>
        <Link to="/casos" className="primary-result-action">Explorar outros casos <FiArrowRight /></Link>
      </div>
    </div>
  );
};

export default ResultadoSimulacaoPage;
