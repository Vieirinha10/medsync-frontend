import { act, cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
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
    vi.useRealTimers();
  });

  it('apresenta prova social e abrangência médica com dados reais', async () => {
    api.getPublicStats.mockResolvedValue({ estudantes_medsync: 127 });

    render(<MemoryRouter><HomePage /></MemoryRouter>);

    const stats = screen.getByRole('region', { name: 'Números do MedSync' });
    expect(within(stats).getByText('41 áreas e especialidades contempladas')).toBeInTheDocument();
    expect(within(stats).getAllByRole('listitem')).toHaveLength(4);

    const specialties = screen.getByRole('region', { name: 'Especialidades médicas disponíveis' });
    expect(within(specialties).getByText(/Especialidades disponíveis: CARDIOLOGIA/)).toBeInTheDocument();
    expect(specialties.querySelector('.specialty-marquee-track')).toHaveAttribute('aria-hidden', 'true');

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

    expect(document.querySelector('.home-feedback-system')).toBeNull();
    const integratedResult = document.querySelector('.synapse-integrated-result');
    expect(integratedResult).not.toBeNull();
    expect(within(integratedResult).getByRole('heading', { name: 'É assim que suas decisões voltam para você.' })).toBeInTheDocument();
    expect(within(integratedResult).getByLabelText('Nota geral 8,4 de 10')).toBeInTheDocument();
    expect(within(integratedResult).getByText('O QUE VOCÊ FEZ BEM')).toBeInTheDocument();
    expect(within(integratedResult).getByText('ONDE PODE EVOLUIR')).toBeInTheDocument();
    expect(within(integratedResult).getByText('ANÁLISE DOS EXAMES')).toBeInTheDocument();
    expect(within(integratedResult).getByText('SEGURANÇA DO PACIENTE')).toBeInTheDocument();
    expect(within(integratedResult).getByText('PLANO RÁPIDO DE MELHORIA')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Critérios visíveis em cada resultado.' })).toBeInTheDocument();
  });

  it('apresenta duas esteiras acadêmicas sem depoimentos ou sugestão de parceria institucional', () => {
    api.getPublicStats.mockResolvedValue({ estudantes_medsync: 127 });

    render(<MemoryRouter><HomePage /></MemoryRouter>);

    expect(screen.getByRole('heading', { name: 'Uma comunidade médica em formação.' })).toBeInTheDocument();
    expect(screen.getByText(/Instituições representadas: UFMA, CEUMA, UFPI/)).toBeInTheDocument();
    expect(screen.getByText(/não representa vínculo ou parceria institucional/i)).toBeInTheDocument();
    expect(document.querySelectorAll('.academic-marquee-row')).toHaveLength(2);
    expect(document.querySelector('.academic-marquee-row.is-reverse')).not.toBeNull();
    expect(screen.queryByText('Aluno verificado')).not.toBeInTheDocument();
    expect(screen.queryByText('Lucas Martins')).not.toBeInTheDocument();
  });

  it('resume o ecossistema e apresenta os planos sem repetir etapas ou expor as cinco redes', () => {
    api.getPublicStats.mockResolvedValue({ estudantes_medsync: 127 });

    render(<MemoryRouter><HomePage /></MemoryRouter>);

    expect(screen.getByRole('heading', { name: 'Tudo o que você precisa para praticar, revisar e evoluir.' })).toBeInTheDocument();
    expect(document.querySelectorAll('.solid-feature-card')).toHaveLength(6);
    expect(document.querySelector('.solid-card-number')).toBeNull();
    expect(screen.queryByText(/ETAPA 01 · IDENTIFICAÇÃO/i)).not.toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Robustez que o estudante consegue enxergar.' })).not.toBeInTheDocument();

    expect(screen.getByRole('heading', { name: 'Comece gratuito. Avance quando fizer sentido.' })).toBeInTheDocument();
    expect(screen.getByText('R$ 25,90')).toBeInTheDocument();
    expect(screen.getByText('R$ 23,90')).toBeInTheDocument();
    expect(screen.getByText('R$ 65,90')).toBeInTheDocument();
    expect(screen.getAllByText('Feedback clínico personalizado da Synapse')).toHaveLength(3);
    expect(screen.queryByText(/Synapse 5-Core com Junta Médica/i)).not.toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Estude com método.Decida com confiança.' })).toBeInTheDocument();
  });

  it('pausa a demonstração automática quando a página não está visível', () => {
    api.getPublicStats.mockResolvedValue({ estudantes_medsync: 127 });
    vi.useFakeTimers();
    const visibilityDescriptor = Object.getOwnPropertyDescriptor(document, 'visibilityState');
    Object.defineProperty(document, 'visibilityState', { configurable: true, value: 'hidden' });

    render(<MemoryRouter><HomePage /></MemoryRouter>);
    const patientTab = screen.getByRole('tab', { name: '01 · Paciente' });
    const examsTab = screen.getByRole('tab', { name: '02 · Exames' });

    act(() => vi.advanceTimersByTime(6000));
    expect(patientTab).toHaveAttribute('aria-selected', 'true');

    Object.defineProperty(document, 'visibilityState', { configurable: true, value: 'visible' });
    act(() => document.dispatchEvent(new Event('visibilitychange')));
    act(() => vi.advanceTimersByTime(5000));
    expect(examsTab).toHaveAttribute('aria-selected', 'true');

    if (visibilityDescriptor) {
      Object.defineProperty(document, 'visibilityState', visibilityDescriptor);
    } else {
      delete document.visibilityState;
    }
  });

  it('permite pausar a demonstração e navegar pelas etapas com o teclado', () => {
    api.getPublicStats.mockResolvedValue({ estudantes_medsync: 127 });
    vi.useFakeTimers();

    render(<MemoryRouter><HomePage /></MemoryRouter>);

    const patientTab = screen.getByRole('tab', { name: '01 · Paciente' });
    const examsTab = screen.getByRole('tab', { name: '02 · Exames' });
    const pauseButton = screen.getByRole('button', { name: 'Pausar demonstração automática' });

    fireEvent.click(pauseButton);
    act(() => vi.advanceTimersByTime(6000));
    expect(patientTab).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('button', { name: 'Retomar demonstração automática' })).toBeInTheDocument();

    patientTab.focus();
    fireEvent.keyDown(patientTab, { key: 'ArrowRight' });
    expect(examsTab).toHaveAttribute('aria-selected', 'true');
    expect(examsTab).toHaveFocus();

    const responseTab = screen.getByRole('tab', { name: /RESPOSTA CLÍNICA/i });
    const contextTab = screen.getByRole('tab', { name: /CONTEXTO DO CASO/i });
    responseTab.focus();
    fireEvent.keyDown(responseTab, { key: 'ArrowRight' });
    expect(contextTab).toHaveAttribute('aria-selected', 'true');
    expect(contextTab).toHaveFocus();

    const documentIds = [...document.querySelectorAll('[id]')].map(({ id }) => id);
    expect(new Set(documentIds).size).toBe(documentIds.length);
    screen.getAllByRole('tab').forEach((tab) => {
      expect(document.getElementById(tab.getAttribute('aria-controls'))).not.toBeNull();
    });
  });
});
