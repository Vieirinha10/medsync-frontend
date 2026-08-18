import { useEffect, useMemo, useState } from 'react';
import {
  FiAlertCircle,
  FiCheckCircle,
  FiCpu,
  FiEdit3,
  FiEye,
  FiEyeOff,
  FiFlag,
  FiHelpCircle,
  FiRefreshCw,
  FiSearch,
  FiShield,
} from 'react-icons/fi';

import { api } from '../services/api';

const TOPICS = [
  'Aparelho digestivo',
  'Cabeça e pescoço',
  'Cirurgia geral',
  'Cirurgia pediátrica',
  'Cirurgia torácica',
  'Cirurgia vascular',
  'Neurocirurgia',
  'Ortopedia',
  'Perioperatório',
  'Transplantes',
  'Trauma e emergência',
  'Urologia',
];

const STATUS_LABELS = {
  publicada: 'Publicada',
  oculta: 'Oculta',
  revisao: 'Em revisão',
  aberto: 'Aberto',
  em_analise: 'Em análise',
  resolvido: 'Resolvido',
};

const emptyQuestions = {
  resumo: {
    total: 0,
    publicadas: 0,
    explicacoes_pendentes: 0,
    explicacoes_geradas: 0,
    relatos_abertos: 0,
    tentativas: 0,
  },
  questoes: [],
  relatos: [],
};

const AdminQuestionsManager = ({ initialData }) => {
  const [data, setData] = useState(initialData || emptyQuestions);
  const [view, setView] = useState('catalog');
  const [filters, setFilters] = useState({ busca: '', situacao: '', assunto: '' });
  const [topicDrafts, setTopicDrafts] = useState({});
  const [busyAction, setBusyAction] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    setData(initialData || emptyQuestions);
  }, [initialData]);

  const visibleTopics = useMemo(() => {
    const values = new Set(TOPICS);
    data.questoes.forEach((item) => values.add(item.assunto));
    return [...values].sort((left, right) => left.localeCompare(right, 'pt-BR'));
  }, [data.questoes]);

  const fetchData = async (nextFilters = filters) => {
    setBusyAction('search');
    setError('');
    try {
      const response = await api.getAdminQuestions({ ...nextFilters, limite: 200 });
      setData(response);
      setTopicDrafts({});
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setBusyAction('');
    }
  };

  const submitSearch = (event) => {
    event.preventDefault();
    setMessage('');
    void fetchData();
  };

  const clearFilters = () => {
    const nextFilters = { busca: '', situacao: '', assunto: '' };
    setFilters(nextFilters);
    setMessage('');
    void fetchData(nextFilters);
  };

  const updateQuestion = async (question, payload, actionLabel) => {
    const actionId = `question-${question.id}`;
    setBusyAction(actionId);
    setError('');
    setMessage('');
    try {
      await api.updateAdminQuestion(question.id, payload);
      setData((current) => ({
        ...current,
        resumo: {
          ...current.resumo,
          publicadas: payload.status
            ? current.resumo.publicadas
              + (payload.status === 'publicada' && question.status !== 'publicada' ? 1 : 0)
              - (payload.status !== 'publicada' && question.status === 'publicada' ? 1 : 0)
            : current.resumo.publicadas,
        },
        questoes: current.questoes.map((item) => (
          item.id === question.id ? { ...item, ...payload } : item
        )),
      }));
      setTopicDrafts((current) => {
        const next = { ...current };
        delete next[question.id];
        return next;
      });
      setMessage(actionLabel);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setBusyAction('');
    }
  };

  const generateExplanation = async (question) => {
    const actionId = `explanation-${question.id}`;
    setBusyAction(actionId);
    setError('');
    setMessage('');
    try {
      await api.generateAdminQuestionExplanation(question.id);
      await fetchData(filters);
      setMessage(`Explicação própria da questão #${question.id} gerada pela Synapse.`);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setBusyAction('');
    }
  };

  const updateReport = async (report, status) => {
    const actionId = `report-${report.id}`;
    setBusyAction(actionId);
    setError('');
    setMessage('');
    try {
      await api.updateAdminQuestionReport(report.id, status);
      setData((current) => ({
        ...current,
        resumo: {
          ...current.resumo,
          relatos_abertos: current.resumo.relatos_abertos
            + (status !== 'resolvido' && report.status === 'resolvido' ? 1 : 0)
            - (status === 'resolvido' && report.status !== 'resolvido' ? 1 : 0),
        },
        relatos: current.relatos.map((item) => (
          item.id === report.id ? { ...item, status } : item
        )),
      }));
      setMessage(`Relato #${report.id} atualizado.`);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setBusyAction('');
    }
  };

  return (
    <div className="admin-questions-manager">
      <section className="admin-question-kpis" aria-label="Resumo do banco de questões">
        <QuestionMetric icon={FiHelpCircle} label="Catálogo validado" value={data.resumo.total} helper={`${data.resumo.publicadas} publicadas`} tone="blue" />
        <QuestionMetric icon={FiCpu} label="Explicações próprias" value={data.resumo.explicacoes_geradas} helper={`${data.resumo.explicacoes_pendentes} sob demanda`} tone="cyan" />
        <QuestionMetric icon={FiFlag} label="Relatos abertos" value={data.resumo.relatos_abertos} helper="fila editorial" tone={data.resumo.relatos_abertos ? 'orange' : 'green'} />
        <QuestionMetric icon={FiCheckCircle} label="Tentativas" value={data.resumo.tentativas} helper="histórico independente" tone="green" />
      </section>

      <section className="admin-question-control">
        <header>
          <div>
            <span><FiShield /> CONTROLE EDITORIAL</span>
            <h2>Banco de questões</h2>
            <p>Pesquise o catálogo inteiro, corrija a classificação, suspenda uma questão e trate os relatos sem afetar revisões ou o caderno de erros.</p>
          </div>
          <div className="admin-question-view-switch" role="tablist" aria-label="Área de questões">
            <button type="button" role="tab" aria-selected={view === 'catalog'} className={view === 'catalog' ? 'is-active' : ''} onClick={() => setView('catalog')}><FiHelpCircle /> Catálogo</button>
            <button type="button" role="tab" aria-selected={view === 'reports'} className={view === 'reports' ? 'is-active' : ''} onClick={() => setView('reports')}><FiFlag /> Relatos {data.resumo.relatos_abertos ? <b>{data.resumo.relatos_abertos}</b> : null}</button>
          </div>
        </header>

        {message && <p className="admin-question-message"><FiCheckCircle /> {message}</p>}
        {error && <p className="admin-question-error"><FiAlertCircle /> {error}</p>}

        {view === 'catalog' ? (
          <>
            <form className="admin-question-filters" onSubmit={submitSearch}>
              <label><span>Busca</span><div><FiSearch /><input value={filters.busca} onChange={(event) => setFilters({ ...filters, busca: event.target.value })} placeholder="ID, prova, instituição ou trecho" /></div></label>
              <label><span>Situação</span><select value={filters.situacao} onChange={(event) => setFilters({ ...filters, situacao: event.target.value })}><option value="">Todas</option><option value="publicada">Publicadas</option><option value="revisao">Em revisão</option><option value="oculta">Ocultas</option></select></label>
              <label><span>Assunto</span><select value={filters.assunto} onChange={(event) => setFilters({ ...filters, assunto: event.target.value })}><option value="">Todos</option>{visibleTopics.map((topic) => <option key={topic}>{topic}</option>)}</select></label>
              <button type="submit" disabled={busyAction === 'search'}>{busyAction === 'search' ? <FiRefreshCw className="spinning" /> : <FiSearch />} Pesquisar</button>
              {(filters.busca || filters.situacao || filters.assunto) && <button type="button" className="is-secondary" onClick={clearFilters}>Limpar</button>}
            </form>

            <div className="admin-question-list-heading">
              <p><strong>{data.questoes.length}</strong> resultado(s) exibido(s)</p>
              <small>As buscas são feitas em todo o catálogo; até 200 resultados aparecem por consulta.</small>
            </div>

            <div className="admin-question-list">
              {data.questoes.length ? data.questoes.map((question) => {
                const draftTopic = topicDrafts[question.id] ?? question.assunto;
                const isBusy = busyAction === `question-${question.id}` || busyAction === `explanation-${question.id}`;
                return (
                  <article key={question.id} className={`status-${question.status}`}>
                    <div className="admin-question-card-top">
                      <div className="admin-question-card-status">
                        <span>{STATUS_LABELS[question.status] || question.status}</span>
                        <span className={`explanation-${question.explicacao_status}`}>{question.explicacao_status === 'pendente' ? 'Explicação sob demanda' : 'Explicação pronta'}</span>
                        {question.relatos_abertos ? <span className="has-reports"><FiFlag /> {question.relatos_abertos}</span> : null}
                      </div>
                      <strong>#{question.id}</strong>
                    </div>
                    <div className="admin-question-card-copy">
                      <small>{question.cabecalho}</small>
                      <h3>{question.enunciado}</h3>
                      <p>{question.especialidade} · Gabarito {question.alternativa_correta_id}</p>
                    </div>
                    <div className="admin-question-card-stats">
                      <span><b>{question.tentativas}</b> tentativas</span>
                      <span><b>{question.percentual_acerto}%</b> de acerto</span>
                    </div>
                    <details className="admin-question-review-details">
                      <summary>Revisar conteúdo e gabarito</summary>
                      <div className="admin-question-review-body">
                        <div className="admin-question-review-options">
                          {(question.alternativas || []).map((alternative) => <p key={alternative.id} className={alternative.id === question.alternativa_correta_id ? 'is-correct' : ''}><b>{alternative.id}</b><span>{alternative.texto}</span></p>)}
                        </div>
                        {question.explicacao ? <div className="admin-question-review-explanation"><strong>Explicação própria</strong><p>{question.explicacao.resumo}</p><p>{question.explicacao.porque_correta}</p><small>{question.explicacao.ponto_chave}</small></div> : <p className="admin-question-review-pending">A explicação será criada somente quando solicitada, reduzindo custo e evitando conteúdo externo.</p>}
                        {question.explicacao_status === 'gerada' && <button type="button" disabled={isBusy} onClick={() => updateQuestion(question, { explicacao_status: 'revisada' }, `Explicação da questão #${question.id} marcada como revisada.`)}><FiCheckCircle /> Aprovar revisão editorial</button>}
                      </div>
                    </details>
                    <div className="admin-question-topic-editor">
                      <label htmlFor={`question-topic-${question.id}`}>Classificação</label>
                      <select id={`question-topic-${question.id}`} value={draftTopic} disabled={isBusy} onChange={(event) => setTopicDrafts({ ...topicDrafts, [question.id]: event.target.value })}>{visibleTopics.map((topic) => <option key={topic}>{topic}</option>)}</select>
                      <button type="button" disabled={isBusy || draftTopic === question.assunto} onClick={() => updateQuestion(question, { assunto: draftTopic }, `Classificação da questão #${question.id} atualizada.`)}><FiEdit3 /> Salvar</button>
                    </div>
                    <div className="admin-question-card-actions">
                      <button type="button" disabled={isBusy} onClick={() => updateQuestion(question, { status: question.status === 'publicada' ? 'oculta' : 'publicada' }, question.status === 'publicada' ? `Questão #${question.id} ocultada.` : `Questão #${question.id} publicada.`)}>{question.status === 'publicada' ? <><FiEyeOff /> Ocultar</> : <><FiEye /> Publicar</>}</button>
                      {question.status === 'publicada' && <button type="button" disabled={isBusy} onClick={() => updateQuestion(question, { status: 'revisao' }, `Questão #${question.id} retirada temporariamente para revisão.`)}><FiAlertCircle /> Enviar para revisão</button>}
                      <button type="button" disabled={isBusy} onClick={() => generateExplanation(question)}>{busyAction === `explanation-${question.id}` ? <FiRefreshCw className="spinning" /> : <FiCpu />} {question.explicacao_status === 'pendente' ? 'Gerar explicação' : 'Refazer explicação'}</button>
                    </div>
                  </article>
                );
              }) : <AdminQuestionEmpty icon={FiSearch} title="Nenhuma questão encontrada" text="Ajuste os filtros para consultar outro trecho do catálogo." />}
            </div>
          </>
        ) : (
          <div className="admin-question-reports">
            <div className="admin-question-list-heading"><p><strong>{data.relatos.length}</strong> relato(s) recente(s)</p><small>Identificação visível somente no painel administrativo para permitir acompanhamento.</small></div>
            {data.relatos.length ? data.relatos.map((report) => (
              <article key={report.id}>
                <div className="admin-question-report-heading"><span className={`status-${report.status}`}>{STATUS_LABELS[report.status] || report.status}</span><small>{new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(report.created_at))}</small></div>
                <h3>Questão #{report.questao_id} · {report.questao_cabecalho}</h3>
                <strong>{report.motivo}</strong>
                <p>{report.descricao || 'O usuário não adicionou detalhes.'}</p>
                <footer><span>Enviado por {report.usuario_nome} · {report.usuario_email}</span><label>Andamento<select value={report.status} disabled={busyAction === `report-${report.id}`} onChange={(event) => updateReport(report, event.target.value)}><option value="aberto">Aberto</option><option value="em_analise">Em análise</option><option value="resolvido">Resolvido</option></select></label></footer>
              </article>
            )) : <AdminQuestionEmpty icon={FiCheckCircle} title="Fila editorial em dia" text="Nenhum relato foi enviado até o momento." />}
          </div>
        )}
      </section>
    </div>
  );
};

const QuestionMetric = ({ icon, label, value, helper, tone }) => {
  const Icon = icon;
  return <article className={`admin-question-kpi ${tone}`}><span><Icon /></span><div><small>{label}</small><strong>{value}</strong><p>{helper}</p></div></article>;
};

const AdminQuestionEmpty = ({ icon, title, text }) => {
  const Icon = icon;
  return <div className="admin-question-empty"><Icon /><strong>{title}</strong><p>{text}</p></div>;
};

export default AdminQuestionsManager;
