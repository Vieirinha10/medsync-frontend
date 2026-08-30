import { createElement, useMemo, useState } from 'react';
import {
  FiActivity,
  FiClock,
  FiCpu,
  FiDollarSign,
  FiRefreshCw,
  FiUsers,
  FiZap,
} from 'react-icons/fi';

import { api } from '../services/api';

const PERIODS = [7, 30, 90];
const OPERATION_LABELS = {
  avaliacao_simulacao: 'Feedback de simulação',
  pergunta_pos_simulacao: 'Pergunta pós-simulação',
};

const integer = new Intl.NumberFormat('pt-BR');
const usd = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 4,
  maximumFractionDigits: 6,
});

const formatDuration = (milliseconds) => (
  milliseconds >= 1000
    ? `${(milliseconds / 1000).toLocaleString('pt-BR', { maximumFractionDigits: 1 })} s`
    : `${integer.format(milliseconds)} ms`
);

const UsageMetric = ({ icon, label, value, helper, tone = '' }) => (
  <article className={`admin-synapse-kpi ${tone}`}>
    <span>{createElement(icon)}</span>
    <div>
      <small>{label}</small>
      <strong>{value}</strong>
      <p>{helper}</p>
    </div>
  </article>
);

const Breakdown = ({ title, items, type }) => (
  <section className="admin-synapse-panel">
    <header>
      <span>{type === 'model' ? 'MODELOS' : 'OPERAÇÕES'}</span>
      <h2>{title}</h2>
    </header>
    <div className="admin-synapse-breakdown">
      {items.length ? items.map((item) => (
        <article key={item.chave}>
          <div>
            <strong>{type === 'operation' ? (OPERATION_LABELS[item.chave] || item.chave) : item.chave}</strong>
            <small>{integer.format(item.chamadas)} chamadas · {formatDuration(item.duracao_media_ms)} em média</small>
          </div>
          <p>
            <b>{integer.format(item.total_tokens)}</b>
            <small>tokens</small>
          </p>
          <p>
            <b>{usd.format(item.custo_estimado_usd)}</b>
            <small>estimados</small>
          </p>
        </article>
      )) : <p className="admin-synapse-empty">As primeiras chamadas aparecerão aqui.</p>}
    </div>
  </section>
);

const AdminSynapseUsage = ({ initialData }) => {
  const [data, setData] = useState(initialData);
  const [period, setPeriod] = useState(initialData.periodo_dias || 30);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const maxDailyCalls = useMemo(
    () => Math.max(...data.uso_diario.map((item) => item.chamadas), 1),
    [data.uso_diario],
  );

  const loadPeriod = async (nextPeriod = period) => {
    setIsLoading(true);
    setError('');
    try {
      const nextData = await api.getAdminSynapseUsage(nextPeriod);
      setData(nextData);
      setPeriod(nextPeriod);
    } catch (requestError) {
      setError(requestError.message || 'Não foi possível atualizar o consumo da Synapse.');
    } finally {
      setIsLoading(false);
    }
  };

  const { resumo, configuracao } = data;

  return (
    <div className="admin-synapse-usage">
      <section className="admin-synapse-heading">
        <div>
          <span><FiCpu /> EFICIÊNCIA DA SYNAPSE</span>
          <h2>Consumo, custo e desempenho</h2>
          <p>Telemetria agregada das avaliações e perguntas, sem limitar o uso dos estudantes.</p>
        </div>
        <div className="admin-synapse-periods" aria-label="Período do relatório">
          {PERIODS.map((days) => (
            <button
              type="button"
              key={days}
              className={period === days ? 'is-active' : ''}
              aria-pressed={period === days}
              disabled={isLoading}
              onClick={() => loadPeriod(days)}
            >
              {days} dias
            </button>
          ))}
          <button type="button" aria-label="Atualizar consumo" disabled={isLoading} onClick={() => loadPeriod()}>
            <FiRefreshCw className={isLoading ? 'is-spinning' : ''} />
          </button>
        </div>
      </section>

      {error && <p className="admin-operation-error">{error}</p>}

      <section className="admin-synapse-kpis">
        <UsageMetric icon={FiActivity} label="Chamadas" value={integer.format(resumo.chamadas)} helper={`${integer.format(resumo.usuarios_ativos)} usuários no período`} />
        <UsageMetric icon={FiZap} label="Tokens totais" value={integer.format(resumo.total_tokens)} helper={`${integer.format(resumo.input_tokens)} entrada · ${integer.format(resumo.output_tokens)} saída`} tone="cyan" />
        <UsageMetric icon={FiDollarSign} label="Custo estimado" value={usd.format(resumo.custo_estimado_usd)} helper={resumo.custo_completo ? 'todas as chamadas precificadas' : 'há chamadas sem tarifa configurada'} tone="green" />
        <UsageMetric icon={FiClock} label="Latência média" value={formatDuration(resumo.duracao_media_ms)} helper={`p95 em ${formatDuration(resumo.duracao_p95_ms)}`} tone="violet" />
      </section>

      <section className="admin-synapse-telemetry">
        <span><b>{resumo.taxa_cache_percentual}%</b> de cache na entrada</span>
        <span><b>{integer.format(resumo.cached_input_tokens)}</b> tokens reaproveitados</span>
        <span><b>{integer.format(resumo.output_tokens)}</b> tokens de saída</span>
      </section>

      <section className="admin-synapse-panel admin-synapse-trend">
        <header>
          <span>TENDÊNCIA</span>
          <h2>Chamadas por dia</h2>
          <p>O gráfico usa o mesmo período selecionado acima.</p>
        </header>
        <div className="admin-synapse-chart" role="img" aria-label={`Chamadas diárias da Synapse nos últimos ${period} dias`}>
          {data.uso_diario.map((day) => (
            <div key={day.data} title={`${day.data}: ${day.chamadas} chamadas, ${integer.format(day.total_tokens)} tokens`}>
              <span style={{ height: `${Math.max(day.chamadas ? 8 : 2, (day.chamadas / maxDailyCalls) * 100)}%` }} />
              <small>{day.data.slice(8)}</small>
            </div>
          ))}
        </div>
      </section>

      <div className="admin-synapse-grid">
        <Breakdown title="Distribuição por modelo" items={data.por_modelo} type="model" />
        <Breakdown title="Distribuição por tarefa" items={data.por_operacao} type="operation" />
      </div>

      <div className="admin-synapse-grid admin-synapse-grid-bottom">
        <section className="admin-synapse-panel">
          <header>
            <span>MONITORAMENTO</span>
            <h2>Usuários com maior consumo</h2>
            <p>Informação administrativa para identificar padrões e anomalias; não há franquia aplicada.</p>
          </header>
          <div className="admin-synapse-users">
            {data.usuarios_mais_ativos.length ? data.usuarios_mais_ativos.map((user) => (
              <article key={user.usuario_id}>
                <span><FiUsers /></span>
                <div><strong>{user.nome}</strong><small>{user.email}</small></div>
                <p><b>{integer.format(user.chamadas)}</b><small>chamadas</small></p>
                <p><b>{integer.format(user.total_tokens)}</b><small>tokens</small></p>
              </article>
            )) : <p className="admin-synapse-empty">Ainda não há consumo individual no período.</p>}
          </div>
        </section>

        <section className="admin-synapse-panel admin-synapse-config">
          <header>
            <span>CONFIGURAÇÃO ATIVA</span>
            <h2>Política de eficiência</h2>
          </header>
          <dl>
            <div><dt>Modelo de rotina</dt><dd>{configuracao.modelo_rotina}</dd></div>
            <div><dt>Modelo avançado</dt><dd>{configuracao.modelo_avancado}</dd></div>
            <div><dt>Perguntas</dt><dd>{configuracao.perguntas_com_roteamento_automatico ? 'Roteamento automático' : configuracao.modelo_perguntas}</dd></div>
            <div><dt>Raciocínio</dt><dd>{configuracao.esforco_raciocinio}</dd></div>
            <div><dt>Teto do feedback</dt><dd>{integer.format(configuracao.limite_saida_feedback)} tokens</dd></div>
            <div><dt>Teto por pergunta</dt><dd>{integer.format(configuracao.limite_saida_pergunta)} tokens</dd></div>
          </dl>
        </section>
      </div>
    </div>
  );
};

export default AdminSynapseUsage;
