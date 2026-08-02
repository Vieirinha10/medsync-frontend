import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import AdminAcademicPage from './AdminAcademicPage';
import { api } from '../services/api';

vi.mock('../services/api', () => ({
  ApiError: class ApiError extends Error {},
  api: { getAcademicAnalytics: vi.fn() },
}));

describe('AdminAcademicPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    api.getAcademicAnalytics.mockResolvedValue({
      total_usuarios: 20,
      perfis_academicos_preenchidos: 16,
      cobertura_percentual: 80,
      novos_ultimos_30_dias: 6,
      periodos: [{ periodo: 6, total: 8, percentual: 50 }],
      faculdades: [{ faculdade: 'UFMA', total: 10, percentual: 62.5 }],
    });
  });

  it('apresenta indicadores acadêmicos agregados sem dados pessoais', async () => {
    render(<MemoryRouter><AdminAcademicPage /></MemoryRouter>);

    await waitFor(() => expect(screen.getByRole('heading', { name: 'Panorama acadêmico' })).toBeInTheDocument());
    expect(screen.getByText('Usuários cadastrados')).toBeInTheDocument();
    expect(screen.getByText('6º')).toBeInTheDocument();
    expect(screen.getByText('UFMA')).toBeInTheDocument();
    expect(screen.queryByText(/@/)).not.toBeInTheDocument();
  });
});
