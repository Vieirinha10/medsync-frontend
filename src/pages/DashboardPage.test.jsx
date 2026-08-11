import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { api } from '../services/api';
import DashboardPage from './DashboardPage';

vi.mock('../services/api', () => ({
  api: {
    getCurrentUser: vi.fn(),
    getProgress: vi.fn(),
    getCases: vi.fn(),
    resetProgress: vi.fn(),
  },
  ApiError: class ApiError extends Error {},
}));

const user = {
  id: 1,
  nome: 'Gustavo Vieira',
  email: 'gustavo@example.com',
  created_at: '2026-07-01T12:00:00Z',
};

const cases = [
  { id: 8, titulo: 'Tromboembolismo pulmonar', especialidade: 'Pneumologia' },
  { id: 12, titulo: 'Síndrome coronariana aguda', especialidade: 'Cardiologia' },
];

const progress = [
  {
    id: 22,
    id_caso: 8,
    pontuacao: 90,
    created_at: '2026-08-02T12:00:00Z',
    respostas_usuario: { _avaliacao: { pontuacao_total: 90 } },
  },
  {
    id: 21,
    id_caso: 12,
    pontuacao: 70,
    created_at: '2026-08-01T12:00:00Z',
    respostas_usuario: {},
  },
];

describe('DashboardPage', () => {
  afterEach(() => cleanup());

  beforeEach(() => {
    api.getCurrentUser.mockResolvedValue(user);
    api.getProgress.mockResolvedValue(progress);
    api.getCases.mockResolvedValue(cases);
    api.resetProgress.mockResolvedValue({ registros_removidos: 2 });
  });

  it('exibe dados reais do usuário, desempenho e histórico', async () => {
    render(<MemoryRouter><DashboardPage /></MemoryRouter>);

    expect(await screen.findByRole('heading', { name: 'Olá, Gustavo!' })).toBeInTheDocument();
    expect(screen.getByText('gustavo@example.com')).toBeInTheDocument();
    expect(screen.getByText('80%')).toBeInTheDocument();
    expect(screen.getAllByText('Pneumologia')).not.toHaveLength(0);
    expect(screen.getByText('Tromboembolismo pulmonar')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Rever resultado de Tromboembolismo pulmonar/ })).toHaveAttribute('href', '/resultados/22');
  });

  it('exige confirmação textual antes de redefinir as estatísticas', async () => {
    render(<MemoryRouter><DashboardPage /></MemoryRouter>);
    await screen.findByRole('heading', { name: 'Olá, Gustavo!' });

    fireEvent.click(screen.getByRole('button', { name: /Resetar minhas estatísticas/ }));
    const confirmButton = screen.getByRole('button', { name: /Apagar estatísticas/ });
    expect(confirmButton).toBeDisabled();

    fireEvent.change(screen.getByLabelText(/Digite RESETAR para confirmar/), {
      target: { value: 'RESETAR' },
    });
    expect(confirmButton).toBeEnabled();
    fireEvent.click(confirmButton);

    await waitFor(() => expect(api.resetProgress).toHaveBeenCalledTimes(1));
    expect(await screen.findByText(/Suas estatísticas foram redefinidas/)).toBeInTheDocument();
    expect(screen.getByText('Seu gráfico começa com o primeiro caso')).toBeInTheDocument();
  });

  it('mostra o plano Premium ativo e sua validade', async () => {
    api.getCurrentUser.mockResolvedValue({
      ...user,
      premium_ativo: true,
      premium_plano: 'avulso',
      premium_valido_ate: '2026-09-10T12:00:00Z',
    });

    render(<MemoryRouter><DashboardPage /></MemoryRouter>);

    expect(await screen.findByText('Seu acesso Premium está ativo')).toBeInTheDocument();
    expect(screen.getByText('Premium ativo')).toBeInTheDocument();
    expect(screen.getByText('Mensal avulso')).toBeInTheDocument();
    expect(screen.getByText(/Válido até 10 de set. de 2026/)).toBeInTheDocument();
  });
});
