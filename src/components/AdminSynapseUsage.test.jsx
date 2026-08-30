import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import AdminSynapseUsage from './AdminSynapseUsage';
import { api } from '../services/api';

vi.mock('../services/api', () => ({
  api: { getAdminSynapseUsage: vi.fn() },
}));

const usage = {
  periodo_dias: 30,
  gerado_em: '2026-08-30T12:00:00Z',
  resumo: {
    chamadas: 18,
    usuarios_ativos: 7,
    input_tokens: 12000,
    cached_input_tokens: 3000,
    output_tokens: 2400,
    total_tokens: 14400,
    custo_estimado_usd: 0.0184,
    custo_completo: true,
    duracao_media_ms: 820,
    duracao_p95_ms: 1400,
    taxa_cache_percentual: 25,
  },
  por_operacao: [{
    chave: 'avaliacao_simulacao', chamadas: 12, input_tokens: 9000,
    output_tokens: 1800, total_tokens: 10800, custo_estimado_usd: 0.014,
    duracao_media_ms: 900,
  }],
  por_modelo: [{
    chave: 'gpt-5.6-luna', chamadas: 15, input_tokens: 10000,
    output_tokens: 2000, total_tokens: 12000, custo_estimado_usd: 0.01,
    duracao_media_ms: 700,
  }],
  uso_diario: [{
    data: '2026-08-30', chamadas: 5, usuarios: 3, total_tokens: 4200,
    custo_estimado_usd: 0.005, duracao_media_ms: 700,
  }],
  usuarios_mais_ativos: [{
    usuario_id: 4, nome: 'Aluno Teste', email: 'aluno@example.com',
    chamadas: 6, total_tokens: 5200, custo_estimado_usd: 0.006,
  }],
  configuracao: {
    modelo_rotina: 'gpt-5.6-luna',
    modelo_avancado: 'gpt-5.6-terra',
    modelo_perguntas: 'gpt-5.6-luna',
    perguntas_com_roteamento_automatico: true,
    esforco_raciocinio: 'low',
    limite_saida_feedback: 900,
    limite_saida_pergunta: 450,
  },
};

describe('AdminSynapseUsage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(cleanup);

  it('mostra consumo, modelos, limites e ausência de bloqueio por franquia', () => {
    render(<AdminSynapseUsage initialData={usage} />);

    expect(screen.getByRole('heading', { name: 'Consumo, custo e desempenho' })).toBeInTheDocument();
    expect(screen.getByText('18')).toBeInTheDocument();
    expect(screen.getAllByText('gpt-5.6-luna')).toHaveLength(2);
    expect(screen.getByText('gpt-5.6-terra')).toBeInTheDocument();
    expect(screen.getByText('low')).toBeInTheDocument();
    expect(screen.getByText('900 tokens')).toBeInTheDocument();
    expect(screen.getByText('Aluno Teste')).toBeInTheDocument();
    expect(screen.getByText(/não há franquia aplicada/i)).toBeInTheDocument();
  });

  it('recarrega a telemetria ao mudar o período', async () => {
    api.getAdminSynapseUsage.mockResolvedValue({
      ...usage,
      periodo_dias: 7,
      resumo: { ...usage.resumo, chamadas: 4 },
    });
    render(<AdminSynapseUsage initialData={usage} />);

    fireEvent.click(screen.getByRole('button', { name: '7 dias' }));

    await waitFor(() => expect(api.getAdminSynapseUsage).toHaveBeenCalledWith(7));
    expect(screen.getByText('4')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '7 dias' })).toHaveAttribute('aria-pressed', 'true');
  });
});
