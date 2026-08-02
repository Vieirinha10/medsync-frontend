import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import CasosListPage from './CasosListPage';
import { api } from '../services/api';

vi.mock('../services/api', () => ({
  api: { getCases: vi.fn() },
  ApiError: class ApiError extends Error {},
}));

const cases = [
  {
    id: 8,
    titulo: 'Tromboembolismo pulmonar',
    especialidade: 'Pneumologia',
    nivel_dificuldade: 'Difícil',
    avaliacao_2_disponivel: true,
  },
  {
    id: 9,
    titulo: 'Síndrome de Ramsay Hunt',
    especialidade: 'Neurologia',
    nivel_dificuldade: 'Médio',
    avaliacao_2_disponivel: false,
  },
];

describe('CasosListPage', () => {
  beforeEach(() => {
    api.getCases.mockResolvedValue(cases);
  });

  it('filtra casos por busca e informa quando a rubrica está em revisão', async () => {
    render(<MemoryRouter><CasosListPage /></MemoryRouter>);

    expect(await screen.findByText('Tromboembolismo pulmonar')).toBeInTheDocument();
    expect(screen.getByText('Rubrica em revisão')).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText('Buscar casos'), {
      target: { value: 'Ramsay' },
    });

    expect(screen.queryByText('Tromboembolismo pulmonar')).not.toBeInTheDocument();
    expect(screen.getByText('Síndrome de Ramsay Hunt')).toBeInTheDocument();
    expect(screen.getByText('1 de 2 casos encontrados')).toBeInTheDocument();
  });
});
