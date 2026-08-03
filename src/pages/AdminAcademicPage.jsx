import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FiActivity,
  FiAlertTriangle,
  FiArrowLeft,
  FiBarChart2,
  FiBell,
  FiBookOpen,
  FiCheckCircle,
  FiDownload,
  FiEdit3,
  FiEye,
  FiFileText,
  FiImage,
  FiPlus,
  FiRefreshCw,
  FiSave,
  FiShield,
  FiTrash2,
  FiTrendingUp,
  FiUsers,
  FiX,
} from 'react-icons/fi';
import { ApiError, api } from '../services/api';

const TABS = [
  { id: 'overview', label: 'Visão geral', icon: FiBarChart2 },
  { id: 'cases', label: 'Casos clínicos', icon: FiBookOpen },
  { id: 'challenges', label: 'Desafios', icon: FiImage },
  { id: 'audience', label: 'Usuários', icon: FiUsers },
  { id: 'announcements', label: 'Avisos', icon: FiBell },
];

const emptyCase = {
  titulo: '', especialidade: '', nivel_dificuldade: 'Médio', historia_clinica: '',
  exame_fisico: '', status: 'rascunho', premium: false, exames: [],
  diagnostico_referencia: '', diagnostico_termos: '', conduta_referencia: '',
  conduta_termos: '', temas_estudo: '',
};

const emptyChallenge = {
  id: '', titulo: '', especialidade: '', dificuldade: 'Médio', modalidade: 'Radiografia',
  pergunta: '', imagem_url: '', imagem_alt: '', alternativas: ['', '', '', ''],
  alternativa_correta: 0, diagnostico_correto: '', explicacao: '', achados_chave: '',
  fonte_credito: 'MedSync', fonte_licenca: 'Uso educacional', fonte_url: '#', status: 'rascunho',
};

const emptyAnnouncement = {
  titulo: '', mensagem: '', tom: 'informativo', link_texto: '', link_url: '', ativo: true,
};

const emptyAdminData = {
  overview: {
    total_usuarios: 0, ativos_7_dias: 0, ativos_30_dias: 0, novos_30_dias: 0,
    taxa_conclusao: 0, retencao_7_dias: 0, casos_publicados: 0,
    desafios_publicados: 0, avisos_ativos: 0, conteudos_populares: [], atividade_diaria: [],
  },
  academic: {
    total_usuarios: 0, perfis_academicos_preenchidos: 0, cobertura_percentual: 0,
    novos_ultimos_30_dias: 0, periodos: [], faculdades: [],
  },
  cases: [],
  challenges: [],
  announcements: [],
};

const listFromText = (value) => value.split(',').map((item) => item.trim()).filter(Boolean);

const AdminAcademicPage = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [caseForm, setCaseForm] = useState(emptyCase);
  const [caseId, setCaseId] = useState(null);
  const [challengeForm, setChallengeForm] = useState(emptyChallenge);
  const [challengeId, setChallengeId] = useState(null);
  const [announcementForm, setAnnouncementForm] = useState(emptyAnnouncement);
  const [announcementId, setAnnouncementId] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError('');
    const nextData = structuredClone(emptyAdminData);
    const failures = [];
    const requests = [
      ['overview', 'visão geral', api.getAdminOverview],
      ['academic', 'dados dos usuários', api.getAcademicAnalytics],
      ['cases', 'casos clínicos', api.getAdminCases],
      ['challenges', 'desafios', api.getAdminChallenges],
      ['announcements', 'avisos', api.getAdminAnnouncements],
    ];

    for (const [key, label, request] of requests) {
      try {
        nextData[key] = await request();
      } catch (requestError) {
        if (requestError instanceof ApiError && requestError.status === 401) {
          navigate('/login', { replace: true });
          return;
        }
        if (requestError instanceof ApiError && requestError.status === 403) {
          setError(requestError.message);
          setIsLoading(false);
          return;
        }
        failures.push(label);
      }
    }

    setData(nextData);
    if (failures.length) {
      setError(`Algumas informações não puderam ser carregadas: ${failures.join(', ')}. As demais ferramentas continuam disponíveis.`);
    }
    setIsLoading(false);
  }, [navigate]);

  useEffect(() => { load(); }, [load]);

  const saveCase = async (event) => {
    event.preventDefault();
    setIsSaving(true); setError(''); setMessage('');
    const essential = caseForm.exames.filter((exam) => exam.referencia_adequada).map((exam) => exam.codigo);
    const unnecessary = caseForm.exames.filter((exam) => !exam.referencia_adequada).map((exam) => exam.codigo);
    const hasRubric = caseForm.diagnostico_referencia && caseForm.conduta_referencia
      && listFromText(caseForm.diagnostico_termos).length
      && listFromText(caseForm.conduta_termos).length;
    const payload = {
      titulo: caseForm.titulo, especialidade: caseForm.especialidade,
      nivel_dificuldade: caseForm.nivel_dificuldade, historia_clinica: caseForm.historia_clinica,
      exame_fisico: caseForm.exame_fisico, status: caseForm.status, premium: caseForm.premium,
      exames: caseForm.exames,
      rubrica: hasRubric ? {
        diagnostico_referencia: caseForm.diagnostico_referencia,
        diagnostico_termos: listFromText(caseForm.diagnostico_termos), diagnostico_parcial: [],
        exames_essenciais: essential, exames_opcionais: [], exames_desnecessarios: unnecessary,
        justificativa_exames: {},
        conduta_criterios: [{ nome: 'Conduta principal', pontos: 30, termos: listFromText(caseForm.conduta_termos) }],
        conduta_referencia: caseForm.conduta_referencia,
        feedback_hipotese_parcial: 'A hipótese está próxima, mas precisa ser mais específica.',
        feedback_hipotese_incorreta: 'Revise os achados principais e reformule a hipótese diagnóstica.',
        feedback_seguranca: 'Considere estabilização, contraindicações e protocolos locais.',
        temas_estudo: listFromText(caseForm.temas_estudo).length ? listFromText(caseForm.temas_estudo) : [caseForm.especialidade],
      } : null,
    };
    try {
      await api.saveAdminCase(caseId, payload);
      setMessage(caseId ? 'Caso atualizado com sucesso.' : 'Novo caso criado com sucesso.');
      setCaseId(null); setCaseForm(emptyCase); await load();
    } catch (requestError) { setError(requestError.message); } finally { setIsSaving(false); }
  };

  const editCase = (item) => {
    const rubric = item.rubrica || {};
    setCaseId(item.id);
    setCaseForm({
      ...item,
      diagnostico_referencia: rubric.diagnostico_referencia || '',
      diagnostico_termos: (rubric.diagnostico_termos || []).join(', '),
      conduta_referencia: rubric.conduta_referencia || '',
      conduta_termos: (rubric.conduta_criterios || []).flatMap((criterion) => criterion.termos).join(', '),
      temas_estudo: (rubric.temas_estudo || []).join(', '),
    });
    setActiveTab('cases'); window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const saveChallenge = async (event) => {
    event.preventDefault(); setIsSaving(true); setError(''); setMessage('');
    try {
      await api.saveAdminChallenge(challengeId, {
        ...challengeForm,
        achados_chave: listFromText(challengeForm.achados_chave),
      });
      setMessage(challengeId ? 'Desafio atualizado.' : 'Novo desafio criado.');
      setChallengeId(null); setChallengeForm(emptyChallenge); await load();
    } catch (requestError) { setError(requestError.message); } finally { setIsSaving(false); }
  };

  const editChallenge = (item) => {
    setChallengeId(item.id);
    setChallengeForm({ ...item, achados_chave: item.achados_chave.join(', ') });
    setActiveTab('challenges'); window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const saveAnnouncement = async (event) => {
    event.preventDefault(); setIsSaving(true); setError(''); setMessage('');
    try {
      await api.saveAdminAnnouncement(announcementId, {
        ...announcementForm,
        link_texto: announcementForm.link_texto || null,
        link_url: announcementForm.link_url || null,
        inicia_em: announcementForm.inicia_em || null,
        termina_em: announcementForm.termina_em || null,
      });
      setMessage(announcementId ? 'Aviso atualizado.' : 'Aviso publicado.');
      setAnnouncementId(null); setAnnouncementForm(emptyAnnouncement); await load();
    } catch (requestError) { setError(requestError.message); } finally { setIsSaving(false); }
  };

  if (isLoading) return <div className="page-container admin-academic-state"><FiRefreshCw /> Carregando o centro administrativo...</div>;
  if (error && !data) return <AdminError error={error} reload={load} />;

  return (
    <div className="page-container admin-operations-page">
      <Link to="/dashboard" className="admin-back-link"><FiArrowLeft /> Meu painel</Link>
      <header className="admin-operations-hero">
        <div><span><FiShield /> CENTRO DE OPERAÇÕES</span><h1>Administração MedSync</h1><p>Conteúdo, audiência, desempenho e comunicação em um único ambiente seguro.</p></div>
        <div className="admin-health"><FiCheckCircle /><span><strong>Plataforma operacional</strong><small>Dados agregados e anonimizados</small></span></div>
      </header>

      <nav className="admin-tabs" aria-label="Seções administrativas">
        {TABS.map((tab) => { const Icon = tab.icon; return <button type="button" key={tab.id} className={activeTab === tab.id ? 'is-active' : ''} onClick={() => { setActiveTab(tab.id); setMessage(''); }}><Icon />{tab.label}</button>; })}
      </nav>

      {message && <p className="admin-operation-message"><FiCheckCircle /> {message}</p>}
      {error && <p className="admin-operation-error"><FiAlertTriangle /> {error}</p>}

      {activeTab === 'overview' && <Overview overview={data.overview} exportReport={() => api.downloadAnonymizedReport().catch((requestError) => setError(requestError.message))} />}
      {activeTab === 'cases' && <CasesManager items={data.cases} form={caseForm} setForm={setCaseForm} editingId={caseId} cancel={() => { setCaseId(null); setCaseForm(emptyCase); }} save={saveCase} edit={editCase} saving={isSaving} />}
      {activeTab === 'challenges' && <ChallengesManager items={data.challenges} form={challengeForm} setForm={setChallengeForm} editingId={challengeId} cancel={() => { setChallengeId(null); setChallengeForm(emptyChallenge); }} save={saveChallenge} edit={editChallenge} saving={isSaving} />}
      {activeTab === 'audience' && <Audience academic={data.academic} overview={data.overview} />}
      {activeTab === 'announcements' && <AnnouncementsManager items={data.announcements} form={announcementForm} setForm={setAnnouncementForm} editingId={announcementId} cancel={() => { setAnnouncementId(null); setAnnouncementForm(emptyAnnouncement); }} save={saveAnnouncement} edit={(item) => { setAnnouncementId(item.id); setAnnouncementForm(item); }} saving={isSaving} />}
    </div>
  );
};

const Overview = ({ overview, exportReport }) => (
  <>
    <section className="admin-kpi-grid">
      <Metric icon={FiUsers} label="Usuários ativos" value={overview.ativos_7_dias} helper={`${overview.ativos_30_dias} nos últimos 30 dias`} tone="blue" />
      <Metric icon={FiCheckCircle} label="Taxa de conclusão" value={`${overview.taxa_conclusao}%`} helper="usuários com caso concluído" tone="green" />
      <Metric icon={FiTrendingUp} label="Retenção em 7 dias" value={`${overview.retencao_7_dias}%`} helper="retorno após o cadastro" tone="violet" />
      <Metric icon={FiActivity} label="Novos usuários" value={overview.novos_30_dias} helper="nos últimos 30 dias" tone="cyan" />
    </section>
    <div className="admin-overview-grid">
      <section className="admin-operations-panel">
        <PanelHeading eyebrow="ENGAJAMENTO" title="Atividade dos últimos 14 dias" text="Usuários únicos e eventos registrados diariamente." />
        <div className="admin-activity-chart">{overview.atividade_diaria.map((day) => <div key={day.data} title={`${day.data}: ${day.eventos} eventos`}><span style={{ height: `${Math.max(8, Math.min(100, day.eventos * 12))}%` }} /><small>{day.data.slice(8)}</small></div>)}</div>
      </section>
      <section className="admin-operations-panel">
        <PanelHeading eyebrow="CONTEÚDO" title="Mais acessados" text="Ranking de casos e desafios com maior atividade." />
        <div className="admin-content-ranking">{overview.conteudos_populares.length ? overview.conteudos_populares.map((item, index) => <article key={`${item.tipo}-${item.id}`}><b>{index + 1}</b><div><strong>{item.titulo}</strong><small>{item.tipo === 'caso_clinico' ? 'Caso clínico' : 'Desafio visual'}</small></div><span>{item.acessos}</span></article>) : <Empty text="Os acessos começarão a aparecer aqui." />}</div>
      </section>
    </div>
    <section className="admin-toolkit">
      <div><FiDownload /><span><strong>Relatório anonimizado</strong><small>Período, instituição, atividade e médias sem nome ou e-mail.</small></span></div>
      <button type="button" onClick={exportReport}><FiFileText /> Exportar CSV</button>
      <div className="admin-inventory"><span><b>{overview.casos_publicados}</b> casos</span><span><b>{overview.desafios_publicados}</b> desafios</span><span><b>{overview.avisos_ativos}</b> avisos</span></div>
    </section>
  </>
);

const CasesManager = ({ items, form, setForm, editingId, cancel, save, edit, saving }) => (
  <div className="admin-manager-layout">
    <form className="admin-editor" onSubmit={save}>
      <EditorHeading icon={FiBookOpen} editing={editingId} noun="caso clínico" cancel={cancel} />
      <div className="admin-form-grid"><Field label="Título"><input required value={form.titulo} onChange={(e) => setForm({ ...form, titulo: e.target.value })} /></Field><Field label="Especialidade"><input required value={form.especialidade} onChange={(e) => setForm({ ...form, especialidade: e.target.value })} /></Field><Field label="Dificuldade"><select value={form.nivel_dificuldade} onChange={(e) => setForm({ ...form, nivel_dificuldade: e.target.value })}><option>Fácil</option><option>Médio</option><option>Intermediário</option><option>Difícil</option><option>Crítico</option></select></Field><Field label="Publicação"><select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}><option value="rascunho">Rascunho</option><option value="publicado">Publicado</option><option value="arquivado">Arquivado</option></select></Field></div>
      <label className="admin-switch"><input type="checkbox" checked={form.premium} onChange={(e) => setForm({ ...form, premium: e.target.checked })} /><span /><strong>Conteúdo Premium</strong></label>
      <Field label="História clínica"><textarea required rows="5" value={form.historia_clinica} onChange={(e) => setForm({ ...form, historia_clinica: e.target.value })} /></Field><Field label="Exame físico"><textarea required rows="4" value={form.exame_fisico} onChange={(e) => setForm({ ...form, exame_fisico: e.target.value })} /></Field>
      <div className="admin-subsection"><div><strong>Exames disponíveis</strong><button type="button" onClick={() => setForm({ ...form, exames: [...form.exames, { codigo: '', nome: '', resultado: '', referencia_adequada: true }] })}><FiPlus /> Adicionar exame</button></div>{form.exames.map((exam, index) => <article className="admin-exam-editor" key={`${exam.codigo}-${index}`}><input required placeholder="Código" value={exam.codigo} onChange={(e) => setForm({ ...form, exames: form.exames.map((item, i) => i === index ? { ...item, codigo: e.target.value } : item) })} /><input required placeholder="Nome do exame" value={exam.nome} onChange={(e) => setForm({ ...form, exames: form.exames.map((item, i) => i === index ? { ...item, nome: e.target.value } : item) })} /><textarea required placeholder="Resultado liberado ao usuário" value={exam.resultado} onChange={(e) => setForm({ ...form, exames: form.exames.map((item, i) => i === index ? { ...item, resultado: e.target.value } : item) })} /><label><input type="checkbox" checked={exam.referencia_adequada} onChange={(e) => setForm({ ...form, exames: form.exames.map((item, i) => i === index ? { ...item, referencia_adequada: e.target.checked } : item) })} /> Adequado</label><button type="button" aria-label="Remover exame" onClick={() => setForm({ ...form, exames: form.exames.filter((_, i) => i !== index) })}><FiTrash2 /></button></article>)}</div>
      <div className="admin-subsection rubric"><strong>Gabarito e avaliação automática</strong><p>Preencha os campos abaixo para ativar o feedback estruturado sem editar código.</p><Field label="Diagnóstico de referência"><textarea rows="2" value={form.diagnostico_referencia} onChange={(e) => setForm({ ...form, diagnostico_referencia: e.target.value })} /></Field><Field label="Termos aceitos no diagnóstico (separados por vírgula)"><input value={form.diagnostico_termos} onChange={(e) => setForm({ ...form, diagnostico_termos: e.target.value })} /></Field><Field label="Conduta de referência"><textarea rows="3" value={form.conduta_referencia} onChange={(e) => setForm({ ...form, conduta_referencia: e.target.value })} /></Field><Field label="Palavras-chave da conduta (separadas por vírgula)"><input value={form.conduta_termos} onChange={(e) => setForm({ ...form, conduta_termos: e.target.value })} /></Field><Field label="Temas recomendados para estudo"><input value={form.temas_estudo} onChange={(e) => setForm({ ...form, temas_estudo: e.target.value })} /></Field></div>
      <button className="admin-save-button" disabled={saving}><FiSave /> {saving ? 'Salvando...' : 'Salvar caso clínico'}</button>
    </form>
    <ContentList title={`${items.length} casos cadastrados`} items={items} edit={edit} type="case" />
  </div>
);

const ChallengesManager = ({ items, form, setForm, editingId, cancel, save, edit, saving }) => (
  <div className="admin-manager-layout">
    <form className="admin-editor" onSubmit={save}>
      <EditorHeading icon={FiImage} editing={editingId} noun="desafio visual" cancel={cancel} />
      <div className="admin-form-grid"><Field label="ID único"><input required disabled={Boolean(editingId)} pattern="[a-z0-9-]+" placeholder="ex: pneumonia-lobar" value={form.id} onChange={(e) => setForm({ ...form, id: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-') })} /></Field><Field label="Título interno"><input required value={form.titulo} onChange={(e) => setForm({ ...form, titulo: e.target.value })} /></Field><Field label="Especialidade"><input required value={form.especialidade} onChange={(e) => setForm({ ...form, especialidade: e.target.value })} /></Field><Field label="Modalidade"><input required value={form.modalidade} onChange={(e) => setForm({ ...form, modalidade: e.target.value })} /></Field><Field label="Dificuldade"><select value={form.dificuldade} onChange={(e) => setForm({ ...form, dificuldade: e.target.value })}><option>Fácil</option><option>Médio</option><option>Difícil</option></select></Field><Field label="Publicação"><select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}><option value="rascunho">Rascunho</option><option value="publicado">Publicado</option><option value="arquivado">Arquivado</option></select></Field></div>
      <Field label="URL da imagem"><input required type="url" value={form.imagem_url} onChange={(e) => setForm({ ...form, imagem_url: e.target.value })} /></Field><Field label="Descrição acessível da imagem"><input required value={form.imagem_alt} onChange={(e) => setForm({ ...form, imagem_alt: e.target.value })} /></Field><Field label="Pergunta"><textarea required rows="2" value={form.pergunta} onChange={(e) => setForm({ ...form, pergunta: e.target.value })} /></Field>
      <div className="admin-options-editor"><strong>Quatro alternativas</strong>{form.alternativas.map((option, index) => <label key={index}><input type="radio" name="correct" checked={form.alternativa_correta === index} onChange={() => setForm({ ...form, alternativa_correta: index })} /><span>{String.fromCharCode(65 + index)}</span><input required value={option} onChange={(e) => setForm({ ...form, alternativas: form.alternativas.map((item, i) => i === index ? e.target.value : item) })} /></label>)}</div>
      <Field label="Diagnóstico correto"><input required value={form.diagnostico_correto} onChange={(e) => setForm({ ...form, diagnostico_correto: e.target.value })} /></Field><Field label="Explicação"><textarea required rows="4" value={form.explicacao} onChange={(e) => setForm({ ...form, explicacao: e.target.value })} /></Field><Field label="Achados-chave (separados por vírgula)"><input value={form.achados_chave} onChange={(e) => setForm({ ...form, achados_chave: e.target.value })} /></Field>
      <button className="admin-save-button" disabled={saving}><FiSave /> {saving ? 'Salvando...' : 'Salvar desafio'}</button>
    </form>
    <ContentList title={`${items.length} desafios administráveis`} items={items} edit={edit} type="challenge" />
  </div>
);

const Audience = ({ academic, overview }) => { const max = Math.max(...academic.periodos.map((item) => item.total), 1); return <><section className="admin-kpi-grid compact"><Metric icon={FiUsers} label="Total cadastrado" value={academic.total_usuarios} helper={`${academic.cobertura_percentual}% com perfil completo`} tone="blue" /><Metric icon={FiEye} label="Ativos em 7 dias" value={overview.ativos_7_dias} helper={`${overview.ativos_30_dias} ativos no mês`} tone="green" /><Metric icon={FiTrendingUp} label="Retenção" value={`${overview.retencao_7_dias}%`} helper="retorno após 7 dias" tone="violet" /></section><div className="admin-overview-grid"><section className="admin-operations-panel"><PanelHeading eyebrow="PERÍODOS" title="Momento do curso" text="Distribuição agregada da comunidade." /><div className="admin-period-chart">{academic.periodos.map((item) => <div className="admin-period-row" key={item.periodo}><strong>{item.periodo}º</strong><div><span style={{ width: `${(item.total / max) * 100}%` }} /></div><p><b>{item.total}</b><small>{item.percentual}%</small></p></div>)}</div></section><section className="admin-operations-panel"><PanelHeading eyebrow="INSTITUIÇÕES" title="Faculdades representadas" text="Dados úteis para ações e parcerias." /><div className="admin-faculty-list">{academic.faculdades.map((item, index) => <article key={item.faculdade}><span>{String(index + 1).padStart(2, '0')}</span><div><strong>{item.faculdade}</strong><small>{item.percentual}% dos perfis</small></div><b>{item.total}</b></article>)}</div></section></div><p className="admin-privacy-footnote"><FiShield /> Nenhum e-mail, senha ou resposta individual é exibido ou exportado.</p></>; };

const AnnouncementsManager = ({ items, form, setForm, editingId, cancel, save, edit, saving }) => <div className="admin-manager-layout"><form className="admin-editor" onSubmit={save}><EditorHeading icon={FiBell} editing={editingId} noun="aviso" cancel={cancel} /><Field label="Título"><input required value={form.titulo} onChange={(e) => setForm({ ...form, titulo: e.target.value })} /></Field><Field label="Mensagem"><textarea required rows="4" value={form.mensagem} onChange={(e) => setForm({ ...form, mensagem: e.target.value })} /></Field><div className="admin-form-grid"><Field label="Tom"><select value={form.tom} onChange={(e) => setForm({ ...form, tom: e.target.value })}><option value="informativo">Informativo</option><option value="sucesso">Sucesso</option><option value="atencao">Atenção</option><option value="urgente">Urgente</option></select></Field><Field label="Texto do link"><input value={form.link_texto || ''} onChange={(e) => setForm({ ...form, link_texto: e.target.value })} /></Field></div><Field label="URL do link"><input value={form.link_url || ''} onChange={(e) => setForm({ ...form, link_url: e.target.value })} /></Field><label className="admin-switch"><input type="checkbox" checked={form.ativo} onChange={(e) => setForm({ ...form, ativo: e.target.checked })} /><span /><strong>Aviso ativo na plataforma</strong></label><button className="admin-save-button" disabled={saving}><FiBell /> {saving ? 'Salvando...' : 'Publicar aviso'}</button></form><div className="admin-content-list"><h2>{items.length} avisos</h2>{items.map((item) => <article key={item.id}><div><span className={`status-${item.ativo ? 'publicado' : 'arquivado'}`}>{item.ativo ? 'Ativo' : 'Inativo'}</span><h3>{item.titulo}</h3><p>{item.mensagem}</p></div><button type="button" onClick={() => edit(item)}><FiEdit3 /> Editar</button></article>)}</div></div>;

const ContentList = ({ title, items, edit, type }) => <div className="admin-content-list"><h2>{title}</h2>{items.map((item) => <article key={item.id}>{type === 'challenge' && item.imagem_url ? <img src={item.imagem_url} alt="" /> : <span className="admin-content-icon">{type === 'case' ? <FiBookOpen /> : <FiImage />}</span>}<div><span className={`status-${item.status}`}>{item.status}</span>{item.premium && <span className="status-premium">Premium</span>}<h3>{item.titulo}</h3><p>{item.especialidade} · {item.nivel_dificuldade || item.dificuldade}{item.avaliacao_2_disponivel ? ' · Feedback ativo' : ''}</p></div><button type="button" onClick={() => edit(item)}><FiEdit3 /> Editar</button></article>)}</div>;
const EditorHeading = ({ icon, editing, noun, cancel }) => { const Icon = icon; return <div className="admin-editor-heading"><span><Icon /></span><div><small>{editing ? 'EDITANDO' : 'NOVO CONTEÚDO'}</small><h2>{editing ? `Atualizar ${noun}` : `Criar ${noun}`}</h2></div>{editing && <button type="button" onClick={cancel}><FiX /> Cancelar</button>}</div>; };
const Field = ({ label, children }) => <label className="admin-field"><span>{label}</span>{children}</label>;
const Metric = ({ icon, label, value, helper, tone }) => { const Icon = icon; return <article className={`admin-kpi ${tone}`}><span><Icon /></span><div><small>{label}</small><strong>{value}</strong><p>{helper}</p></div></article>; };
const PanelHeading = ({ eyebrow, title, text }) => <div className="admin-panel-heading"><span>{eyebrow}</span><h2>{title}</h2><p>{text}</p></div>;
const Empty = ({ text }) => <div className="admin-empty-state"><FiActivity /><strong>Sem dados ainda</strong><p>{text}</p></div>;
const AdminError = ({ error, reload }) => <div className="page-container admin-academic-error"><FiAlertTriangle /><h1>Acesso ao painel indisponível</h1><p>{error}</p><div><Link to="/dashboard"><FiArrowLeft /> Voltar</Link><button type="button" onClick={reload}><FiRefreshCw /> Tentar novamente</button></div></div>;

export default AdminAcademicPage;
