import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import AdminAcademicPage from './AdminAcademicPage';
import { api } from '../services/api';

vi.mock('../services/api', () => ({
  ApiError: class ApiError extends Error {},
  api: {
    getAcademicAnalytics: vi.fn(),
    getAdminOverview: vi.fn(),
    getAdminCases: vi.fn(),
    getAdminChallenges: vi.fn(),
    getAdminAnnouncements: vi.fn(),
    downloadAnonymizedReport: vi.fn(),
  },
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
    api.getAdminOverview.mockResolvedValue({
      total_usuarios: 20,
      ativos_7_dias: 8,
      ativos_30_dias: 14,
      novos_30_dias: 6,
      taxa_conclusao: 55,
      retencao_7_dias: 42,
      casos_publicados: 40,
      desafios_publicados: 3,
      avisos_ativos: 1,
      conteudos_populares: [{ tipo: 'caso_clinico', id: '8', titulo: 'Tromboembolismo pulmonar', acessos: 12, conclusoes: 8 }],
      atividade_diaria: [{ data: '2026-08-02', usuarios: 4, eventos: 9 }],
    });
    api.getAdminCases.mockResolvedValue([{ id: 8, titulo: 'Tromboembolismo pulmonar', especialidade: 'Pneumologia', nivel_dificuldade: 'Difícil', status: 'publicado', premium: true, avaliacao_2_disponivel: true, exames: [], rubrica: null }]);
    api.getAdminChallenges.mockResolvedValue([]);
    api.getAdminAnnouncements.mockResolvedValue([]);
  });

  it('apresenta indicadores acadêmicos agregados sem dados pessoais', async () => {
    render(<MemoryRouter><AdminAcademicPage /></MemoryRouter>);

    await waitFor(() => expect(screen.getByRole('heading', { name: 'Administração MedSync' })).toBeInTheDocument());
    expect(screen.getByText('Usuários ativos')).toBeInTheDocument();
    expect(screen.getByText('Tromboembolismo pulmonar')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /Usuários/ }));
    expect(screen.getByText('6º')).toBeInTheDocument();
    expect(screen.getByText('UFMA')).toBeInTheDocument();
    expect(screen.queryByText(/@/)).not.toBeInTheDocument();
  });
});
