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

  it('explica o processo educacional da Synapse sem apresentar individualmente as cinco redes', () => {
    api.getPublicStats.mockResolvedValue({ estudantes_medsync: 127 });

    render(<MemoryRouter><HomePage /></MemoryRouter>);

    expect(screen.getByRole('heading', { name: /Synapse IA, a inteligência educativa do MedSync/i })).toBeInTheDocument();
    expect(screen.getByText('ARQUITETURA MULTI-LLM · O CONCEITO DA BANCA MÉDICA')).toBeInTheDocument();
    expect(screen.queryByText(/DeepSeek-R1|Claude 3\.5|GPT-4o|Gemini 2\.0|Grok 2/)).not.toBeInTheDocument();

    const terminal = document.querySelector('.synapse-process-terminal');
    expect(terminal).not.toBeNull();
    expect(within(terminal).getByLabelText('Processamento atual: RESPOSTA CLÍNICA')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('tab', { name: /RUBRICA CLÍNICA 2\.0/i }));
    expect(within(terminal).getByLabelText('Processamento atual: RUBRICA CLÍNICA 2.0')).toBeInTheDocument();
    expect(within(terminal).getByText('Critérios e pesos aplicados')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('tab', { name: /SEGURANÇA DO PACIENTE/i }));
    expect(within(terminal).getByText('Riscos e prioridades verificados')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('tab', { name: /DEVOLUTIVA PERSONALIZADA/i }));
    expect(within(terminal).getByText('Feedback personalizado pronto')).toBeInTheDocument();

    // Testa etapas do feedback
    const feedbackSystem = document.querySelector('.home-feedback-system');
    expect(feedbackSystem).not.toBeNull();
    fireEvent.click(within(feedbackSystem).getByRole('tab', { name: /Rubrica clínica/i }));
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
