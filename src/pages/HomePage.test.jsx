import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { api } from '../services/api';
import HomePage from './HomePage';

vi.mock('../services/api', () => ({
  api: {
    getPublicStats: vi.fn(),
  },
}));

describe('HomePage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it('apresenta prova social e abrangência médica com dados reais', async () => {
    api.getPublicStats.mockResolvedValue({ estudantes_medsync: 127 });

    render(<MemoryRouter><HomePage /></MemoryRouter>);

    const stats = screen.getByRole('region', { name: 'Números do MedSync' });
    expect(within(stats).getByText('19 áreas médicas contempladas')).toBeInTheDocument();
    expect(within(stats).getAllByRole('listitem')).toHaveLength(4);
    await waitFor(() => expect(within(stats).getByText('127 estudantes MedSync')).toBeInTheDocument());
  });

  it('explica a Synapse 5-Core e permite explorar todos os 5 examinadores e o consenso orbital', () => {
    api.getPublicStats.mockResolvedValue({ estudantes_medsync: 127 });

    render(<MemoryRouter><HomePage /></MemoryRouter>);

    expect(screen.getByRole('heading', { name: /Synapse IA, a inteligência educativa do MedSync/i })).toBeInTheDocument();
    
    // Testa alternância de cada examinador da banca
    fireEvent.click(screen.getByRole('tab', { name: /O Professor/i }));
    expect(screen.getByRole('heading', { name: /Didática, empatia, fisiopatologia/i })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('tab', { name: /O Avaliador Técnico/i }));
    expect(screen.getByRole('heading', { name: /Rubricas e critérios de pontuação/i })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('tab', { name: /O Analista/i }));
    expect(screen.getByRole('heading', { name: /Velocidade, cruzamento de dados/i })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('tab', { name: /O Auditor/i }));
    expect(screen.getByRole('heading', { name: /Segurança, diagnósticos raros/i })).toBeInTheDocument();

    // Testa a 6ª etapa (Consenso Integral)
    fireEvent.click(screen.getByRole('tab', { name: /CONSENSO INTEGRAL/i }));
    expect(screen.getByText('CONSENSO UNÂNIME CONSOLIDADO')).toBeInTheDocument();

    // Testa etapas do feedback
    fireEvent.click(screen.getByRole('tab', { name: /Rubrica clínica/i }));
    expect(screen.getByRole('heading', { name: 'A comparação segue uma estrutura clínica' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Robustez que o estudante consegue enxergar.' })).toBeInTheDocument();
  });

  it('apresenta a comunidade acadêmica sem sugerir parceria institucional', () => {
    api.getPublicStats.mockResolvedValue({ estudantes_medsync: 127 });

    render(<MemoryRouter><HomePage /></MemoryRouter>);

    expect(screen.getByRole('heading', { name: 'Uma comunidade médica em formação.' })).toBeInTheDocument();
    expect(screen.getByText(/Instituições representadas: UFMA, CEUMA, UFPI/)).toBeInTheDocument();
    expect(screen.getByText(/não representa vínculo ou parceria institucional/i)).toBeInTheDocument();
  });
});
