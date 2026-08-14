import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import RevisoesPage from './RevisoesPage';
import { api } from '../services/api';

vi.mock('../services/api', () => ({
  ApiError: class ApiError extends Error {},
  api: {
    getSpacedReviewPlan: vi.fn(),
    submitSpacedReview: vi.fn(),
  },
}));

const DAY_IN_MS = 24 * 60 * 60 * 1000;
const dateFromNow = (days, extraMilliseconds = 0) => new Date(
  Date.now() + (days * DAY_IN_MS) + extraMilliseconds,
).toISOString();

const createEntry = (overrides = {}) => ({
  id: 12,
  tipo_origem: 'desafio_visual',
  id_origem: 'fibrilacao-atrial',
  titulo: 'Fibrilação atrial no ECG',
  especialidade: 'Cardiologia',
  dificuldade: 'Intermediário',
  pergunta: 'Qual é o ritmo apresentado?',
  resposta_usuario: 'Flutter atrial',
  resposta_correta: 'Fibrilação atrial',
  explicacao: 'A ausência de ondas P e os intervalos RR irregulares sustentam o diagnóstico.',
  detalhes: { imagem: '/images/desafios/ecg.webp' },
  status: 'pendente',
  quantidade_erros: 1,
  revisoes_realizadas: 0,
  sequencia_acertos: 0,
  intervalo_dias: 0,
  proxima_revisao_em: dateFromNow(0, -60 * 60 * 1000),
  previsoes: {
    errei: { intervalo_dias: 1, proxima_revisao_em: dateFromNow(1) },
    dificil: { intervalo_dias: 1, proxima_revisao_em: dateFromNow(1) },
    bom: { intervalo_dias: 1, proxima_revisao_em: dateFromNow(1) },
    facil: { intervalo_dias: 3, proxima_revisao_em: dateFromNow(3) },
  },
  ...overrides,
});

describe('RevisoesPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    const entry = createEntry();
    api.getSpacedReviewPlan.mockResolvedValue([entry]);
    api.submitSpacedReview.mockResolvedValue({
      ...entry,
      status: 'revisando',
      intervalo_dias: 7,
      revisoes_realizadas: 1,
      sequencia_acertos: 1,
      proxima_revisao_em: dateFromNow(7),
    });
  });

  afterEach(() => cleanup());

  it('mostra a previsão, registra a lembrança e resume a próxima data', async () => {
    render(<MemoryRouter><RevisoesPage /></MemoryRouter>);

    expect(await screen.findByRole('heading', { name: 'Fibrilação atrial no ECG' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Como funciona a revisão espaçada?' })).toBeInTheDocument();
    expect(screen.queryByText('Flutter atrial')).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /Mostrar resposta/ }));
    expect(screen.getByText('Flutter atrial')).toBeInTheDocument();
    expect(screen.getByText(/intervalos RR irregulares/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Lembrei bem: Amanhã/ })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /Lembrei bem: Amanhã/ }));
    await waitFor(() => expect(api.submitSpacedReview).toHaveBeenCalledWith(12, 'bom'));
    expect(await screen.findByRole('heading', { name: 'Revisão finalizada!' })).toBeInTheDocument();
    const recap = screen.getByRole('region', { name: 'Quando estes conteúdos voltarão' });
    expect(within(recap).getByText(/intervalo de 1 semana/)).toBeInTheDocument();
    expect(within(recap).getByText('Em 7 dias')).toBeInTheDocument();
  });

  it('mantém a agenda visível mesmo quando não há revisão para hoje', async () => {
    api.getSpacedReviewPlan.mockResolvedValue([
      createEntry({ proxima_revisao_em: dateFromNow(1) }),
    ]);
    render(<MemoryRouter><RevisoesPage /></MemoryRouter>);

    expect(await screen.findByRole('heading', { name: 'Nenhuma revisão para hoje' })).toBeInTheDocument();
    expect(screen.getByText(/próximo conteúdo aparece amanhã/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /Agenda completa/ }));
    expect(screen.getByRole('heading', { name: 'Todos os conteúdos agendados' })).toBeInTheDocument();
    expect(screen.getByText('Próximo ciclo')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Fibrilação atrial no ECG' })).toBeInTheDocument();
  });

  it('organiza e filtra os conteúdos futuros por especialidade', async () => {
    api.getSpacedReviewPlan.mockResolvedValue([
      createEntry({ proxima_revisao_em: dateFromNow(1) }),
      createEntry({
        id: 21,
        tipo_origem: 'caso_clinico',
        titulo: 'Apendicite aguda',
        especialidade: 'Cirurgia Geral',
        proxima_revisao_em: dateFromNow(5),
      }),
    ]);
    render(<MemoryRouter><RevisoesPage /></MemoryRouter>);

    await screen.findByRole('heading', { name: 'Nenhuma revisão para hoje' });
    fireEvent.click(screen.getByRole('button', { name: /Agenda completa/ }));
    expect(screen.getByRole('heading', { name: 'Fibrilação atrial no ECG' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Apendicite aguda' })).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText('Filtrar agenda por especialidade'), {
      target: { value: 'Cirurgia Geral' },
    });
    expect(screen.queryByRole('heading', { name: 'Fibrilação atrial no ECG' })).not.toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Apendicite aguda' })).toBeInTheDocument();
  });
});
