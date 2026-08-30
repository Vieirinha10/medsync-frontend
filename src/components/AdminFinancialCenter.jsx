import { useMemo, useState } from 'react';
import {
  FiAlertTriangle,
  FiCheckCircle,
  FiClock,
  FiCreditCard,
  FiCpu,
  FiDollarSign,
  FiDownload,
  FiFileText,
  FiRefreshCw,
  FiRepeat,
  FiSearch,
  FiShield,
  FiTrendingUp,
  FiUsers,
} from 'react-icons/fi';

import AdminSynapseUsage from './AdminSynapseUsage';

const FINANCIAL_TABS = [
  { id: 'summary', label: 'Resumo', icon: FiTrendingUp },
  { id: 'orders', label: 'Pedidos', icon: FiFileText },
  { id: 'payments', label: 'Pagamentos', icon: FiDollarSign },
  { id: 'subscriptions', label: 'Assinaturas', icon: FiRepeat },
  { id: 'failures', label: 'Falhas', icon: FiAlertTriangle },
  { id: 'synapse', label: 'Synapse', icon: FiCpu },
];

const PLAN_LABELS = {
  avulso: 'Mensal avulso',
  recorrente: 'Mensal recorrente',
  trimestral: 'Trimestral',
};

const STATUS_LABELS = {
  aguardando_confirmacao: 'Aguardando confirmação',
  aguardando_pagamento: 'Aguardando pagamento',
  cancelado: 'Cancelado',
  criado: 'Criado',
  estornado: 'Estornado',
  expirado: 'Expirado',
  falhou: 'Falhou',
  pago: 'Pago',
  processando: 'Processando',
  recusado: 'Recusado',
  suspenso: 'Suspenso',
  ativa: 'Ativa',
  expirada: 'Expirada',
  suspensa: 'Suspensa',
};

const formatCurrency = (cents = 0) => new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
}).format(cents / 100);

const formatDate = (value) => value
  ? new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(value))
  : '—';

const formatMonth = (value) => {
  const [year, month] = value.split('-').map(Number);
  return new Intl.DateTimeFormat('pt-BR', { month: 'short' })
    .format(new Date(year, month - 1, 1))
    .replace('.', '');
};

const shortId = (value) => value ? value.slice(0, 10).toUpperCase() : '—';
const normalize = (value) => String(value || '').toLocaleLowerCase('pt-BR');
const matchesSearch = (item, search) => !search || normalize(Object.values(item).join(' ')).includes(normalize(search));
const statusClass = (status) => `is-${String(status || 'indefinido').replaceAll('_', '-')}`;

const escapeCsv = (value) => `"${String(value ?? '').replaceAll('"', '""')}"`;

const downloadCsv = (name, headers, rows) => {
  const content = [headers, ...rows]
    .map((row) => row.map(escapeCsv).join(';'))
    .join('\n');
  const blob = new Blob([`\ufeff${content}`], { type: 'text/csv;charset=utf-8' });
  const url = window.URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `${name}.csv`;
  anchor.click();
  window.URL.revokeObjectURL(url);
};

const AdminFinancialCenter = ({ data, synapseData, onRefresh }) => {
  const [activeTab, setActiveTab] = useState('summary');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  const summary = data.resumo;

  const source = useMemo(() => {
    if (activeTab === 'orders') return data.pedidos;
    if (activeTab === 'payments') return data.pagamentos;
    if (activeTab === 'subscriptions') return data.assinaturas;
    if (activeTab === 'failures') return data.falhas;
    return [];
  }, [activeTab, data]);

  const filtered = useMemo(() => source.filter((item) => {
    const itemStatus = item.status || item.situacao;
    return matchesSearch(item, search)
      && (statusFilter === 'todos' || itemStatus === statusFilter);
  }), [search, source, statusFilter]);

  const statuses = useMemo(
    () => [...new Set(source.map((item) => item.status || item.situacao).filter(Boolean))],
    [source],
  );

  const exportCurrent = () => {
    if (activeTab === 'orders') {
      downloadCsv('medsync-pedidos', ['Pedido', 'Estudante', 'E-mail', 'Plano', 'Valor', 'Forma', 'Status', 'Criado em'], filtered.map((item) => [item.id, item.usuario_nome, item.usuario_email, PLAN_LABELS[item.plano_id], formatCurrency(item.valor_centavos), item.forma_pagamento, STATUS_LABELS[item.status] || item.status, formatDate(item.criado_em)]));
    } else if (activeTab === 'payments') {
      downloadCsv('medsync-pagamentos', ['Pagamento', 'Pedido', 'Estudante', 'E-mail', 'Plano', 'Valor', 'Confirmado em'], filtered.map((item) => [item.pagamento_id, item.pedido_id, item.usuario_nome, item.usuario_email, PLAN_LABELS[item.plano_id], formatCurrency(item.valor_centavos), formatDate(item.confirmado_em)]));
    } else if (activeTab === 'subscriptions') {
      downloadCsv('medsync-assinaturas', ['Estudante', 'E-mail', 'Plano', 'Situação', 'Renovação automática', 'Válida até'], filtered.map((item) => [item.usuario_nome, item.usuario_email, PLAN_LABELS[item.plano_id], STATUS_LABELS[item.situacao], item.renovacao_automatica ? 'Sim' : 'Não', formatDate(item.valido_ate)]));
    } else if (activeTab === 'failures') {
      downloadCsv('medsync-falhas-cobranca', ['Pedido', 'Estudante', 'E-mail', 'Plano', 'Valor', 'Status', 'Ocorrido em'], filtered.map((item) => [item.pedido_id, item.usuario_nome, item.usuario_email, PLAN_LABELS[item.plano_id], formatCurrency(item.valor_centavos), STATUS_LABELS[item.status] || item.status, formatDate(item.ocorrido_em)]));
    }
  };

  return (
    <section className="admin-financial-center">
      <header className="admin-financial-heading">
        <div><span><FiDollarSign /> CONTROLE FINANCEIRO</span><h2>Receita, cobranças e acessos Premium</h2><p>Conciliação baseada nos pedidos e confirmações recebidas do Asaas.</p></div>
        <button type="button" onClick={onRefresh}><FiRefreshCw /> Atualizar dados</button>
      </header>

      <div className="admin-financial-security"><FiShield /><span><strong>Ambiente restrito a administradores.</strong> O MedSync não armazena nem exibe número completo de cartão ou código de segurança.</span></div>

      <section className="admin-kpi-grid admin-financial-kpis">
        <FinancialMetric icon={FiDollarSign} label="Receita líquida" value={formatCurrency(summary.receita_liquida_centavos)} helper={`${formatCurrency(summary.receita_mes_centavos)} neste mês`} tone="green" />
        <FinancialMetric icon={FiRepeat} label="MRR estimado" value={formatCurrency(summary.mrr_centavos)} helper={`${summary.assinaturas_recorrentes} renovações automáticas`} tone="violet" />
        <FinancialMetric icon={FiUsers} label="Assinaturas ativas" value={summary.assinaturas_ativas} helper={`${Object.values(data.planos_ativos).reduce((total, value) => total + value, 0)} acessos vigentes`} tone="blue" />
        <FinancialMetric icon={FiCheckCircle} label="Conversão de pedidos" value={`${summary.conversao_percentual}%`} helper={`${summary.pedidos_pagos} de ${summary.total_pedidos} pedidos pagos`} tone="cyan" />
      </section>

      <nav className="admin-financial-tabs" aria-label="Dados financeiros">
        {FINANCIAL_TABS.map((tab) => {
          const Icon = tab.icon;
          return (
            <button type="button" className={activeTab === tab.id ? 'is-active' : ''} onClick={() => { setActiveTab(tab.id); setSearch(''); setStatusFilter('todos'); }} key={tab.id}>
              <Icon /> {tab.label}
              {tab.id === 'orders' && <b>{summary.total_pedidos}</b>}
              {tab.id === 'subscriptions' && <b>{summary.assinaturas_ativas}</b>}
              {tab.id === 'failures' && <b className={summary.falhas_30_dias ? 'has-alert' : ''}>{summary.falhas_30_dias}</b>}
              {tab.id === 'synapse' && <b>{synapseData.resumo.chamadas}</b>}
            </button>
          );
        })}
      </nav>

      {activeTab === 'summary' ? <FinancialSummary data={data} /> : activeTab === 'synapse' ? (
        <AdminSynapseUsage initialData={synapseData} />
      ) : (
        <>
          <div className="admin-financial-toolbar">
            <label><FiSearch /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar por estudante, e-mail ou identificador" /></label>
            <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} aria-label="Filtrar situação financeira">
              <option value="todos">Todas as situações</option>
              {statuses.map((status) => <option value={status} key={status}>{STATUS_LABELS[status] || status}</option>)}
            </select>
            <button type="button" onClick={exportCurrent}><FiDownload /> Exportar CSV</button>
          </div>
          <FinancialTable type={activeTab} rows={filtered} />
        </>
      )}
    </section>
  );
};

const FinancialSummary = ({ data }) => {
  const maxRevenue = Math.max(...data.receita_mensal.map((item) => item.receita_centavos), 1);
  const summary = data.resumo;
  return (
    <div className="admin-financial-summary-grid">
      <article className="admin-operations-panel admin-revenue-panel">
        <div className="admin-panel-heading"><span>RECEITA CONFIRMADA</span><h2>Últimos seis meses</h2><p>Valores reconhecidos após confirmação financeira.</p></div>
        <div className="admin-revenue-chart">
          {data.receita_mensal.map((item) => <div key={item.mes}><span title={`${formatCurrency(item.receita_centavos)} · ${item.pagamentos} pagamento(s)`} style={{ height: `${Math.max(5, (item.receita_centavos / maxRevenue) * 100)}%` }} /><strong>{formatCurrency(item.receita_centavos)}</strong><small>{formatMonth(item.mes)}</small></div>)}
        </div>
        <footer><span>Receita bruta <b>{formatCurrency(summary.receita_bruta_centavos)}</b></span><span>Estornos <b>{formatCurrency(summary.estornos_centavos)}</b></span><span>Ticket médio <b>{formatCurrency(summary.ticket_medio_centavos)}</b></span></footer>
      </article>
      <article className="admin-operations-panel">
        <div className="admin-panel-heading"><span>OPERAÇÃO</span><h2>Saúde das cobranças</h2><p>Pontos que merecem acompanhamento.</p></div>
        <div className="admin-financial-health-list">
          <HealthItem icon={FiClock} label="Pedidos pendentes" value={summary.pedidos_pendentes} tone="pending" />
          <HealthItem icon={FiAlertTriangle} label="Falhas nos últimos 30 dias" value={summary.falhas_30_dias} tone={summary.falhas_30_dias ? 'alert' : 'success'} />
          <HealthItem icon={FiCreditCard} label="Pagamentos confirmados" value={data.pagamentos.length} tone="success" />
          <HealthItem icon={FiRepeat} label="Renovações automáticas" value={summary.assinaturas_recorrentes} tone="info" />
        </div>
      </article>
      <article className="admin-operations-panel admin-plan-mix">
        <div className="admin-panel-heading"><span>BASE PREMIUM</span><h2>Planos ativos</h2><p>Distribuição dos acessos vigentes.</p></div>
        {Object.keys(data.planos_ativos).length ? Object.entries(data.planos_ativos).map(([plan, count]) => <div key={plan}><span><b>{PLAN_LABELS[plan] || plan}</b><small>{count} assinatura(s)</small></span><strong>{count}</strong></div>) : <FinancialEmpty text="As assinaturas ativas aparecerão aqui." />}
      </article>
      <article className="admin-operations-panel admin-recent-failures">
        <div className="admin-panel-heading"><span>ATENÇÃO</span><h2>Falhas recentes</h2><p>Últimas cobranças que não foram concluídas.</p></div>
        {data.falhas.slice(0, 4).map((item) => <div key={item.pedido_id}><span className={`admin-financial-status ${statusClass(item.status)}`}>{STATUS_LABELS[item.status] || item.status}</span><p><strong>{item.usuario_nome}</strong><small>{PLAN_LABELS[item.plano_id]} · {formatDate(item.ocorrido_em)}</small></p><b>{formatCurrency(item.valor_centavos)}</b></div>)}
        {!data.falhas.length && <FinancialEmpty text="Nenhuma falha de cobrança registrada." />}
      </article>
    </div>
  );
};

const FinancialTable = ({ type, rows }) => {
  if (!rows.length) return <FinancialEmpty text="Nenhum registro encontrado com estes filtros." />;
  return <div className="admin-financial-table-wrap"><table><thead><tr>{type === 'orders' && <><th>Pedido</th><th>Estudante</th><th>Plano</th><th>Valor</th><th>Pagamento</th><th>Status</th><th>Criado em</th></>}{type === 'payments' && <><th>Pagamento</th><th>Pedido</th><th>Estudante</th><th>Plano</th><th>Valor</th><th>Confirmado em</th></>}{type === 'subscriptions' && <><th>Estudante</th><th>Plano</th><th>Situação</th><th>Renovação</th><th>Validade</th><th>Prazo</th></>}{type === 'failures' && <><th>Pedido</th><th>Estudante</th><th>Plano</th><th>Valor</th><th>Status</th><th>Ocorrido em</th></>}</tr></thead><tbody>{rows.map((item) => <FinancialRow type={type} item={item} key={item.id || item.pagamento_id || item.pedido_id || `${item.usuario_id}-${item.plano_id}`} />)}</tbody></table></div>;
};

const FinancialRow = ({ type, item }) => {
  const student = <span className="admin-financial-student"><strong>{item.usuario_nome}</strong><small>{item.usuario_email}</small></span>;
  if (type === 'orders') return <tr><td><code title={item.id}>{shortId(item.id)}</code></td><td>{student}</td><td>{PLAN_LABELS[item.plano_id] || item.plano_id}</td><td><strong>{formatCurrency(item.valor_centavos)}</strong></td><td>{item.forma_pagamento === 'PIX' ? 'Pix' : 'Cartão'}</td><td><span className={`admin-financial-status ${statusClass(item.status)}`}>{STATUS_LABELS[item.status] || item.status}</span></td><td>{formatDate(item.criado_em)}</td></tr>;
  if (type === 'payments') return <tr><td><code title={item.pagamento_id}>{shortId(item.pagamento_id)}</code></td><td><code title={item.pedido_id}>{shortId(item.pedido_id)}</code></td><td>{student}</td><td>{PLAN_LABELS[item.plano_id] || item.plano_id}</td><td><strong>{formatCurrency(item.valor_centavos)}</strong></td><td>{formatDate(item.confirmado_em)}</td></tr>;
  if (type === 'subscriptions') return <tr><td>{student}</td><td>{PLAN_LABELS[item.plano_id] || item.plano_id}</td><td><span className={`admin-financial-status ${statusClass(item.situacao)}`}>{STATUS_LABELS[item.situacao]}</span></td><td>{item.renovacao_automatica ? 'Automática' : 'Manual'}</td><td>{formatDate(item.valido_ate)}</td><td>{item.situacao === 'ativa' ? `${item.dias_restantes} dia(s)` : '—'}</td></tr>;
  return <tr><td><code title={item.pedido_id}>{shortId(item.pedido_id)}</code></td><td>{student}</td><td>{PLAN_LABELS[item.plano_id] || item.plano_id}</td><td><strong>{formatCurrency(item.valor_centavos)}</strong></td><td><span className={`admin-financial-status ${statusClass(item.status)}`}>{STATUS_LABELS[item.status] || item.status}</span></td><td>{formatDate(item.ocorrido_em)}</td></tr>;
};

const FinancialMetric = ({ icon, label, value, helper, tone }) => {
  const Icon = icon;
  return <article className={`admin-kpi ${tone}`}><span><Icon /></span><div><small>{label}</small><strong>{value}</strong><p>{helper}</p></div></article>;
};
const HealthItem = ({ icon, label, value, tone }) => {
  const Icon = icon;
  return <div className={`admin-financial-health is-${tone}`}><span><Icon /></span><p><strong>{label}</strong><small>Atualizado com os registros internos</small></p><b>{value}</b></div>;
};
const FinancialEmpty = ({ text }) => <div className="admin-financial-empty"><FiCreditCard /><strong>Sem registros</strong><p>{text}</p></div>;

export default AdminFinancialCenter;
