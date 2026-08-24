import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
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

    expect(screen.getByText('19')).toBeInTheDocument();
    expect(screen.getByText('áreas médicas contempladas')).toBeInTheDocument();
    await waitFor(() => expect(screen.getByText('127')).toBeInTheDocument());
    expect(screen.getByText('estudantes MedSync')).toBeInTheDocument();
  });

  it('explica a Synapse e permite explorar a análise estruturada', () => {
    api.getPublicStats.mockResolvedValue({ estudantes_medsync: 127 });

    render(<MemoryRouter><HomePage /></MemoryRouter>);

    expect(screen.getByRole('heading', { name: 'Uma inteligência clínica que acompanha o seu raciocínio.' })).toBeInTheDocument();
    expect(screen.getByAltText('Logo da Synapse')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Próximo passo' }));
    expect(screen.getByRole('heading', { name: 'Transforma feedback em direção' })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('tab', { name: /Rubrica clínica/ }));
    expect(screen.getByRole('heading', { name: 'A comparação segue uma estrutura clínica' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Robustez que o estudante consegue enxergar.' })).toBeInTheDocument();
  });
});
