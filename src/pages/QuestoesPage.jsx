import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/questions.css';
import {
  FiAlertCircle,
  FiArrowLeft,
  FiArrowRight,
  FiAward,
  FiBarChart2,
  FiBookOpen,
  FiCheck,
  FiCheckCircle,
  FiClock,
  FiFilter,
  FiFlag,
  FiLayers,
  FiLock,
  FiPlay,
  FiRefreshCw,
  FiRotateCcw,
  FiTarget,
  FiTrendingUp,
  FiX,
  FiZap,
} from 'react-icons/fi';

import { api } from '../services/api';

const INITIAL_FILTERS = {
  especialidade: '',
  assunto: '',
  ano: '',
  instituicao: '',
  quantidade: 10,
};

const REPORT_REASONS = {
  gabarito: 'Possível erro no gabarito',
  enunciado: 'Problema no enunciado',
  explicacao: 'Problema na explicação',
  desatualizada: 'Conteúdo possivelmente desatualizado',
  outro: 'Outro problema',
};

const formatSeconds = (value) => {
  if (value == null) return '—';
  const minutes = Math.floor(value / 60);
  const seconds = value % 60;
  return minutes ? `${minutes}min ${seconds}s` : `${seconds}s`;
};

const formatPercentage = (value) => {
  const numericValue = Number(value || 0);
  return `${numericValue.toLocaleString('pt-BR', { maximumFractionDigits: 1 })}%`;
};

const QuestoesPage = () => {
  const [metadata, setMetadata] = useState(null);
  const [performance, setPerformance] = useState(null);
  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedId, setSelectedId] = useState('');
  const [answers, setAnswers] = useState({});
  const [stage, setStage] = useState('setup');
  const [startedAt, setStartedAt] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAnswering, setIsAnswering] = useState(false);
  const [error, setError] = useState('');
  const [reportOpen, setReportOpen] = useState(false);
  const [reportReason, setReportReason] = useState('gabarito');
  const [reportDescription, setReportDescription] = useState('');
  const [reportMessage, setReportMessage] = useState('');

  const loadOverview = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const [meta, stats] = await Promise.all([
        api.getQuestionMetadata(),
        api.getQuestionPerformance(),
      ]);
      setMetadata(meta);
      setPerformance(stats);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { loadOverview(); }, [loadOverview]);

  const currentQuestion = questions[currentIndex] || null;
  const currentAnswer = currentQuestion ? answers[currentQuestion.id] : null;
  const correctCount = Object.values(answers).filter((answer) => answer.correta).length;
  const availableTopics = useMemo(() => metadata?.assuntos || [], [metadata]);

  const startSession = async () => {
    setIsLoading(true);
    setError('');
    try {
      const items = await api.getQuestions(filters);
      if (!items.length) {
        setError(metadata?.restantes_hoje === 0
          ? 'Você concluiu as questões gratuitas de hoje. O Premium libera novas listas sem limite diário.'
          : 'Não encontramos questões inéditas com estes filtros. Tente ampliar sua seleção.');
        return;
      }
      setQuestions(items);
      setAnswers({});
      setCurrentIndex(0);
      setSelectedId('');
      setStartedAt(Date.now());
      setStage('session');
      setReportMessage('');
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsLoading(false);
    }
  };

  const submitAnswer = async () => {
    if (!selectedId || !currentQuestion || currentAnswer) return;
    setIsAnswering(true);
    setError('');
    const seconds = startedAt ? Math.max(0, Math.round((Date.now() - startedAt) / 1000)) : null;
    try {
      const correction = await api.answerQuestion(currentQuestion.id, selectedId, seconds);
      setAnswers((current) => ({ ...current, [currentQuestion.id]: { ...correction, selectedId } }));
      setMetadata((current) => current ? {
        ...current,
        respondidas_hoje: correction.respondidas_hoje,
        restantes_hoje: correction.restantes_hoje,
      } : current);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsAnswering(false);
    }
  };

  const nextQuestion = () => {
    if (currentIndex >= questions.length - 1) {
      setStage('result');
      void api.getQuestionPerformance().then(setPerformance).catch(() => {});
      return;
    }
    setCurrentIndex((index) => index + 1);
    setSelectedId('');
    setStartedAt(Date.now());
    setReportOpen(false);
    setReportMessage('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const sendReport = async (event) => {
    event.preventDefault();
    if (!currentQuestion) return;
    try {
      await api.reportQuestion(currentQuestion.id, {
        motivo: reportReason,
        descricao: reportDescription || null,
      });
      setReportMessage('Relato enviado. A questão será revisada pela equipe MedSync.');
      setReportOpen(false);
      setReportDescription('');
    } catch (requestError) {
      setReportMessage(requestError.message);
    }
  };

  const resetSession = () => {
    setStage('setup');
    setQuestions([]);
    setAnswers({});
    setCurrentIndex(0);
    setSelectedId('');
    setError('');
    void loadOverview();
  };

  if (isLoading && !metadata) {
    return <div className="page-container questions-state"><FiRefreshCw /> Preparando o banco de questões...</div>;
  }

  return (
    <div className="page-container questions-page">
      <header className="questions-hero">
        <div>
          <span className="questions-kicker"><FiBookOpen /> TREINO COMPLEMENTAR</span>
          <h1>Questões de provas</h1>
          <p>Pratique questões de residência e concursos sem desviar do foco principal: desenvolver raciocínio clínico.</p>
          <div className="questions-hero-tags"><span><FiCheckCircle /> Itens completos e sem repetição</span><span><FiLayers /> Organizado por assunto</span><span><FiZap /> Gabarito e correção imediata</span></div>
        </div>
        <div className="questions-catalog-card" aria-label={`${metadata?.respondidas_hoje || 0} questões realizadas hoje`}><small>QUESTÕES REALIZADAS HOJE</small><strong>{metadata?.respondidas_hoje || 0}</strong><span>respondidas neste dia</span></div>
      </header>

      <section className="questions-guidance">
        <div><span><FiTarget /></span><p><strong>Um recurso complementar</strong><small>As respostas ficam somente nesta área e não alimentam revisões nem o caderno de erros.</small></p></div>
        <div><span><FiCheck /></span><p><strong>Gabarito só após responder</strong><small>Escolha com calma, confirme e então veja o acerto/erro e o gabarito oficial.</small></p></div>
        <div><span><FiFlag /></span><p><strong>Revisão colaborativa</strong><small>Encontrou algo duvidoso? Envie um relato diretamente à equipe editorial.</small></p></div>
      </section>

      {error && <p className="questions-alert" role="alert"><FiAlertCircle /> {error}</p>}

      {stage === 'setup' && metadata && (
        <div className="questions-home-grid">
          <section className="questions-setup-card">
            <div className="questions-section-heading"><span><FiFilter /></span><div><small>MONTE SEU TREINO</small><h2>Escolha como deseja praticar</h2><p>As questões serão sorteadas dentro dos filtros selecionados.</p></div></div>
            <div className="questions-filter-grid">
              <FilterSelect label="Especialidade" value={filters.especialidade} onChange={(value) => setFilters({ ...filters, especialidade: value })} items={metadata.especialidades} allLabel="Todas as especialidades" />
              <FilterSelect label="Assunto" value={filters.assunto} onChange={(value) => setFilters({ ...filters, assunto: value })} items={availableTopics} allLabel="Todos os assuntos" />
              <FilterSelect label="Ano" value={filters.ano} onChange={(value) => setFilters({ ...filters, ano: value })} items={metadata.anos} allLabel="Todos os anos" />
              <FilterDatalist label="Instituição / banca" value={filters.instituicao} onChange={(value) => setFilters({ ...filters, instituicao: value })} items={metadata.instituicoes} placeholder="Todas ou pesquise pelo nome" />
            </div>
            <div className="questions-size-picker">
              <span>TAMANHO DA LISTA</span>
              <div>{[10, 20, 30].map((size) => { const locked = !metadata.premium_ativo && size > 10; return <button type="button" key={size} disabled={locked} className={Number(filters.quantidade) === size ? 'is-active' : ''} onClick={() => setFilters({ ...filters, quantidade: size })}>{locked && <FiLock />}{size} questões</button>; })}</div>
            </div>
            <button type="button" className="questions-start-button" onClick={startSession} disabled={isLoading || metadata.restantes_hoje === 0}><FiPlay /> {isLoading ? 'Montando lista...' : 'Iniciar lista aleatória'} <FiArrowRight /></button>
            <p className="questions-access-note">{metadata.premium_ativo ? <><FiZap /> Premium ativo: listas ilimitadas de até 30 questões.</> : <><FiClock /> Plano gratuito: {metadata.restantes_hoje} de {metadata.limite_diario} questões disponíveis hoje.</>}</p>
          </section>

          <aside className="questions-performance-card">
            <div className="questions-section-heading compact"><span><FiBarChart2 /></span><div><small>DESEMPENHO PRÓPRIO</small><h2>Seu histórico nesta área</h2></div></div>
            <div className="questions-performance-main"><strong>{performance?.percentual || 0}%</strong><span>de acertos</span></div>
            <div className="questions-performance-metrics"><p><b>{performance?.respondidas || 0}</b><small>respondidas</small></p><p><b>{performance?.acertos || 0}</b><small>acertos</small></p><p><b>{formatSeconds(performance?.tempo_medio_segundos)}</b><small>tempo médio</small></p></div>
            {performance?.assuntos?.length ? <div className="questions-topic-performance">{performance.assuntos.slice(0, 5).map((item) => <div key={item.assunto}><span><strong>{item.assunto}</strong><small>{item.respondidas} respondida(s)</small></span><b>{item.percentual}%</b><i><em style={{ width: `${item.percentual}%` }} /></i></div>)}</div> : <div className="questions-empty-performance"><FiTrendingUp /><strong>Seu histórico começa hoje</strong><p>Conclua uma lista para visualizar seus resultados por assunto.</p></div>}
          </aside>
        </div>
      )}

      {stage === 'session' && currentQuestion && (
        <section className="questions-session">
          <div className="questions-session-topbar"><button type="button" onClick={resetSession}><FiArrowLeft /> Sair da lista</button><div><span>Questão {currentIndex + 1} de {questions.length}</span><i><em style={{ width: `${((currentIndex + (currentAnswer ? 1 : 0)) / questions.length) * 100}%` }} /></i></div><strong>{correctCount} acerto(s)</strong></div>
          <article className="questions-question-card">
            <header><div><span>{currentQuestion.especialidade}</span><span>{currentQuestion.assunto}</span></div><p><strong>{currentQuestion.instituicao}</strong><small>{currentQuestion.ano}</small></p></header>
            <div className="questions-statement"><small>ENUNCIADO</small><h2>{currentQuestion.enunciado}</h2></div>
            <div className="questions-alternatives">
              {currentAnswer && <div className="questions-community-distribution"><FiBarChart2 /><p><strong>Como os estudantes responderam</strong><span>{currentAnswer.total_respondentes === 1 ? '1 resposta registrada' : `${currentAnswer.total_respondentes || 0} respostas registradas`} · cada estudante conta uma vez</span></p></div>}
              {currentQuestion.alternativas.map((alternative) => {
                const isSelected = selectedId === alternative.id;
                const isCorrect = currentAnswer?.alternativa_correta_id === alternative.id;
                const isWrongSelection = currentAnswer && isSelected && !isCorrect;
                const distribution = currentAnswer?.distribuicao_alternativas || [];
                const selectionStats = distribution.find((item) => item.id === alternative.id);
                const highestDistractorPercentage = Math.max(
                  0,
                  ...distribution
                    .filter((item) => item.id !== currentAnswer?.alternativa_correta_id)
                    .map((item) => item.percentual),
                );
                const isMostSelectedDistractor = Boolean(
                  currentAnswer
                  && !isCorrect
                  && selectionStats?.percentual > 0
                  && selectionStats.percentual === highestDistractorPercentage,
                );
                return (
                  <button type="button" key={alternative.id} aria-pressed={isSelected} disabled={Boolean(currentAnswer)} onClick={() => setSelectedId(alternative.id)} className={`${isSelected ? 'is-selected' : ''} ${isCorrect ? 'is-correct' : ''} ${isWrongSelection ? 'is-wrong' : ''}`}>
                    <b>{alternative.id}</b>
                    <div className="questions-alternative-copy">
                      <span>{alternative.texto}</span>
                      {selectionStats && <div className="questions-selection-share"><i><em style={{ width: `${selectionStats.percentual}%` }} /></i><small><strong>{formatPercentage(selectionStats.percentual)}</strong> escolheram esta alternativa{isMostSelectedDistractor ? <mark>Distrator mais escolhido</mark> : null}</small></div>}
                    </div>
                    {isCorrect && <FiCheckCircle />}
                    {isWrongSelection && <FiX />}
                  </button>
                );
              })}
            </div>
            {!currentAnswer ? <button type="button" className={`questions-confirm-button ${isAnswering ? 'is-loading' : ''}`} onClick={submitAnswer} disabled={!selectedId || isAnswering}>{isAnswering ? <><FiRefreshCw className="spinning" /> Confirmando resposta...</> : <><FiCheck /> Confirmar resposta</>}</button> : <QuestionFeedback answer={currentAnswer} questionId={currentQuestion.id} />}
          </article>

          {currentAnswer && <div className="questions-after-answer"><button type="button" className="questions-report-trigger" onClick={() => setReportOpen((value) => !value)}><FiFlag /> Reportar problema</button><button type="button" className="questions-next-button" onClick={nextQuestion}>{currentIndex === questions.length - 1 ? 'Ver resultado' : 'Próxima questão'} <FiArrowRight /></button></div>}
          {reportOpen && <form className="questions-report-form" onSubmit={sendReport}><div><strong>Ajude a manter o banco confiável</strong><button type="button" aria-label="Fechar relato" onClick={() => setReportOpen(false)}><FiX /></button></div><select aria-label="Motivo do relato" value={reportReason} onChange={(event) => setReportReason(event.target.value)}>{Object.entries(REPORT_REASONS).map(([value, label]) => <option value={value} key={value}>{label}</option>)}</select><textarea aria-label="Detalhes do relato" value={reportDescription} onChange={(event) => setReportDescription(event.target.value)} placeholder="Descreva o que precisa ser revisado (opcional)" maxLength="1000" /><button type="submit"><FiFlag /> Enviar relato</button></form>}
          {reportMessage && <p className="questions-report-message">{reportMessage}</p>}
        </section>
      )}

      {stage === 'result' && (
        <section className="questions-result-card">
          <span><FiAward /></span><small>LISTA CONCLUÍDA</small><h2>Treino finalizado</h2><strong>{correctCount}<em>/{questions.length}</em></strong><p>Você acertou {questions.length ? Math.round((correctCount / questions.length) * 100) : 0}% desta lista. Esse resultado permanece apenas no histórico de questões.</p><div><button type="button" onClick={resetSession}><FiRotateCcw /> Montar nova lista</button><Link to="/dashboard">Voltar ao painel <FiArrowRight /></Link></div>
        </section>
      )}
    </div>
  );
};

const FilterSelect = ({ label, value, onChange, items, allLabel }) => <label className="questions-filter"><span>{label}</span><select value={value} onChange={(event) => onChange(event.target.value)}><option value="">{allLabel}</option>{items.map((item) => <option value={item.valor} key={item.valor}>{item.valor} ({item.total})</option>)}</select></label>;

const FilterDatalist = ({ label, value, onChange, items, placeholder }) => {
  const listId = `question-filter-${label.toLowerCase().replace(/\W+/g, '-')}`;
  return <label className="questions-filter"><span>{label}</span><input list={listId} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} /><datalist id={listId}>{items.map((item) => <option value={item.valor} key={item.valor}>{item.total} questão(ões)</option>)}</datalist></label>;
};

const QuestionFeedback = ({ answer, questionId }) => {
  const [explanation, setExplanation] = useState(answer.explicacao);
  const [isRetrying, setIsRetrying] = useState(false);
  const [retryError, setRetryError] = useState('');

  const isPending = !explanation || answer.explanation_status === 'PENDING';
  const explanationUnavailable = !isPending && explanation?.fonte === 'resumo_automatico';

  useEffect(() => {
    setExplanation(answer.explicacao);
    setRetryError('');
  }, [answer.explicacao]);

  const retryExplanation = async () => {
    setIsRetrying(true);
    setRetryError('');
    try {
      setExplanation(await api.retryQuestionExplanation(questionId));
    } catch (requestError) {
      setRetryError(requestError.message);
    } finally {
      setIsRetrying(false);
    }
  };

  return (
    <section className={`questions-feedback ${answer.correta ? 'is-correct' : 'is-wrong'}`}>
      <header>
        <span>{answer.correta ? <FiCheckCircle /> : <FiAlertCircle />}</span>
        <div>
          <small>{answer.correta ? 'RESPOSTA CORRETA' : 'RESPOSTA INCORRETA'}</small>
          <h3>
            {isPending
              ? `Gabarito: alternativa ${answer.alternativa_correta_id}.`
              : explanationUnavailable
                ? `Gabarito: alternativa ${answer.alternativa_correta_id}.`
                : explanation.resumo}
          </h3>
        </div>
      </header>

      {isPending ? (
        <div className="questions-explanation-pending" role="status" aria-live="polite">
          <FiClock />
          <div>
            <strong>Comentário detalhado em preparação</strong>
            <p>Comentário detalhado em preparação pela equipe editorial do MedSync.</p>
          </div>
        </div>
      ) : explanationUnavailable ? (
        <div className="questions-explanation-unavailable">
          <FiRefreshCw />
          <div>
            <strong>Explicação detalhada temporariamente indisponível</strong>
            <p>O gabarito foi preservado, mas a análise clínica completa não terminou de carregar. Tente novamente para ver o raciocínio da resposta e de cada alternativa.</p>
            {retryError && <small role="alert">{retryError}</small>}
            <button type="button" onClick={retryExplanation} disabled={isRetrying}>
              {isRetrying ? <><FiRefreshCw className="spinning" /> Preparando explicação...</> : <><FiRefreshCw /> Tentar novamente</>}
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="questions-correct-rationale">
            <strong>Por que essa é a resposta?</strong>
            <p>{explanation.porque_correta}</p>
          </div>
          <div className="questions-option-analysis">
            <strong>Análise das alternativas</strong>
            {explanation.analise_alternativas?.map((item) => (
              <article key={item.id} className={item.correta ? 'is-correct' : ''}>
                <b>{item.id}</b>
                <p>{item.explicacao}</p>
              </article>
            ))}
          </div>
          {explanation.alerta_atualizacao && (
            <div className="questions-update-alert">
              <FiClock />
              <p><strong>Atenção à atualização</strong><span>{explanation.alerta_atualizacao}</span></p>
            </div>
          )}
          <footer>
            Explicação educacional própria do MedSync · {explanation.fonte === 'synapse' ? 'Preparada pela Synapse' : 'Revisada pela equipe MedSync'}
          </footer>
        </>
      )}
    </section>
  );
};

export default QuestoesPage;
