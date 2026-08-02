import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import RevisoesPage from './RevisoesPage';
import { api } from '../services/api';

vi.mock('../services/api', () => ({
  ApiError: class ApiError extends Error {},
  api: {
    getDueReviews: vi.fn(),
    submitSpacedReview: vi.fn(),
  },
}));

const entry = {
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
  intervalo_dias: 0,
};

describe('RevisoesPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    api.getDueReviews.mockResolvedValue([entry]);
    api.submitSpacedReview.mockResolvedValue({ ...entry, intervalo_dias: 7 });
  });

  afterEach(() => cleanup());

  it('revela a explicação, registra a lembrança e conclui a sessão', async () => {
    render(<MemoryRouter><RevisoesPage /></MemoryRouter>);

    expect(await screen.findByRole('heading', { name: 'Fibrilação atrial no ECG' })).toBeInTheDocument();
    expect(screen.queryByText('Flutter atrial')).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /Mostrar resposta/ }));
    expect(screen.getByText('Flutter atrial')).toBeInTheDocument();
    expect(screen.getByText(/intervalos RR irregulares/)).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /Lembrei bem/ }));
    await waitFor(() => expect(api.submitSpacedReview).toHaveBeenCalledWith(12, 'bom'));
    expect(await screen.findByRole('heading', { name: 'Revisão finalizada!' })).toBeInTheDocument();
    expect(screen.getByText(/reagendado em 1 semana/)).toBeInTheDocument();
  });

  it('mostra estado em dia quando não há conteúdo vencido', async () => {
    api.getDueReviews.mockResolvedValue([]);
    render(<MemoryRouter><RevisoesPage /></MemoryRouter>);

    expect(await screen.findByRole('heading', { name: 'Nenhuma revisão pendente' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Abrir Caderno de Erros/ })).toHaveAttribute('href', '/caderno-erros');
  });
});
