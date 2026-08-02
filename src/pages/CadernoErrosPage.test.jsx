import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import CadernoErrosPage from './CadernoErrosPage';
import { api } from '../services/api';

vi.mock('../services/api', () => ({
  ApiError: class ApiError extends Error {},
  api: {
    getStudyErrors: vi.fn(),
    updateStudyErrorStatus: vi.fn(),
    deleteStudyError: vi.fn(),
  },
}));

const entry = {
  id: 7,
  tipo_origem: 'desafio_visual',
  id_origem: 'pneumotorax-hipertensivo',
  titulo: 'Pneumotórax hipertensivo à esquerda',
  especialidade: 'Radiologia',
  dificuldade: 'Intermediário',
  pergunta: 'Qual é o diagnóstico mais provável?',
  resposta_usuario: 'Pneumonia lobar',
  resposta_correta: 'Pneumotórax hipertensivo à esquerda',
  explicacao: 'A ausência de trama vascular periférica sustenta o diagnóstico.',
  detalhes: { imagem: '/images/desafios/pneumotorax.webp' },
  status: 'pendente',
  quantidade_erros: 2,
  visto_primeiro_em: '2026-08-01T12:00:00Z',
  visto_ultimo_em: '2026-08-02T12:00:00Z',
  dominado_em: null,
};

describe('CadernoErrosPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    api.getStudyErrors.mockResolvedValue([entry]);
  });

  afterEach(() => cleanup());

  it('mostra recorrência, explicação e permite avançar o status', async () => {
    api.updateStudyErrorStatus.mockResolvedValue({ ...entry, status: 'revisando' });
    render(<MemoryRouter><CadernoErrosPage /></MemoryRouter>);

    expect(await screen.findByRole('heading', { name: 'Pneumotórax hipertensivo à esquerda' })).toBeInTheDocument();
    expect(screen.getByText('2 ocorrências')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Revisar este conteúdo' }));
    expect(screen.getByText('Pneumonia lobar')).toBeInTheDocument();
    expect(screen.getByText(/ausência de trama vascular periférica/)).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Revisando' }));
    await waitFor(() => expect(api.updateStudyErrorStatus).toHaveBeenCalledWith(7, 'revisando'));
    expect(screen.getByText('Revisando', { selector: '.study-error-status' })).toBeInTheDocument();
  });

  it('filtra por status e apresenta um estado vazio contextual', async () => {
    render(<MemoryRouter><CadernoErrosPage /></MemoryRouter>);
    await screen.findByRole('heading', { name: 'Pneumotórax hipertensivo à esquerda' });

    fireEvent.change(screen.getByLabelText('STATUS'), { target: { value: 'dominado' } });
    expect(screen.getByRole('heading', { name: 'Nenhum conteúdo com esses filtros' })).toBeInTheDocument();
  });
});
