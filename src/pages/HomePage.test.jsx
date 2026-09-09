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

  it('apresenta a seção das 5 redes neurais da Synapse com feixe verde e cards dedicados', () => {
    api.getPublicStats.mockResolvedValue({ estudantes_medsync: 127 });

    render(<MemoryRouter><HomePage /></MemoryRouter>);

    expect(screen.getByRole('heading', { name: /Imagine uma Inteligência Educativa na palma da sua mão/i })).toBeInTheDocument();
    expect(screen.getByText(/Mais perspectivas\. Respostas mais completas\. Um raciocínio ainda mais confiável\./i)).toBeInTheDocument();

    expect(screen.getByRole('heading', { name: 'ChatGPT' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Grok' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Gemini' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Claude' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'DeepSeek' })).toBeInTheDocument();

    expect(screen.getByText('OPENAI')).toBeInTheDocument();
    expect(screen.getByText('xAI')).toBeInTheDocument();
    expect(screen.getByText('GOOGLE')).toBeInTheDocument();
    expect(screen.getByText('ANTHROPIC')).toBeInTheDocument();
    expect(screen.getByText('DEEPSEEK')).toBeInTheDocument();

    expect(screen.getByText('Raciocínio clínico e explicações claras.')).toBeInTheDocument();
    expect(screen.getByText('Análises críticas e perspectivas únicas.')).toBeInTheDocument();
    expect(screen.getByText('Síntese de informações e visão multimodal.')).toBeInTheDocument();
    expect(screen.getByText('Respostas seguras e bem estruturadas.')).toBeInTheDocument();
    expect(screen.getByText('Alta performance e raciocínio avançado.')).toBeInTheDocument();

    // Explicações no verso dos cards (animação de virar 3D)
    expect(screen.getByText('Transforma raciocínios complexos em explicações claras, estruturadas e fáceis de aplicar.')).toBeInTheDocument();
    expect(screen.getByText('Desafia hipóteses, explora caminhos alternativos e reduz conclusões precipitadas.')).toBeInTheDocument();
    expect(screen.getByText('Conecta dados, sinais, exames e contexto para formar uma visão mais completa do paciente.')).toBeInTheDocument();
    expect(screen.getByText('Aprofunda o caso, identifica nuances e ajuda a construir uma avaliação clínica mais criteriosa.')).toBeInTheDocument();
    expect(screen.getByText('Organiza possibilidades, compara condutas e busca o caminho mais objetivo para a decisão.')).toBeInTheDocument();

    // Interação de flip (clique/touch)
    const chatgptCard = document.querySelector('.card-chatgpt');
    expect(chatgptCard).not.toHaveClass('is-flipped');
    fireEvent.click(chatgptCard);
    expect(chatgptCard).toHaveClass('is-flipped');
    fireEvent.click(chatgptCard);
    expect(chatgptCard).not.toHaveClass('is-flipped');

    const beam = document.querySelector('.synapse-laser-beam');
    expect(beam).not.toBeNull();
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

    const hypothesisTab = screen.getByRole('tab', { name: '03 · Hipótese' });
    fireEvent.keyDown(examsTab, { key: 'ArrowRight' });
    expect(hypothesisTab).toHaveAttribute('aria-selected', 'true');
    expect(hypothesisTab).toHaveFocus();

    const documentIds = [...document.querySelectorAll('[id]')].map(({ id }) => id);
    expect(new Set(documentIds).size).toBe(documentIds.length);
    screen.getAllByRole('tab').forEach((tab) => {
      expect(document.getElementById(tab.getAttribute('aria-controls'))).not.toBeNull();
    });
  });
});
