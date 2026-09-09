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

  it('apresenta a seção das 5 IAs da Synapse com feixe verde e cards dedicados', () => {
    api.getPublicStats.mockResolvedValue({ estudantes_medsync: 127 });

    render(<MemoryRouter><HomePage /></MemoryRouter>);

    expect(screen.getByRole('heading', { name: /Cinco das principais inteligências artificiais do mundo/i })).toBeInTheDocument();
    expect(screen.getByText('CINCO IAs ATIVAS · UMA ÚNICA SYNAPSE')).toBeInTheDocument();
    expect(screen.getByText(/A Synapse organiza essas perspectivas em um feedback clínico claro/i)).toBeInTheDocument();

    const synapseLink = screen.getByRole('link', { name: 'Conhecer a Synapse IA' });
    expect(synapseLink).toHaveAttribute('href', '#synapse-networks');
    expect(document.querySelector('#synapse-networks')).not.toBeNull();

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

    expect(screen.getByText('Estruturação do raciocínio e explicações claras.')).toBeInTheDocument();
    expect(screen.getByText('Auditoria crítica e hipóteses alternativas.')).toBeInTheDocument();
    expect(screen.getByText('Integração de dados e contexto multimodal.')).toBeInTheDocument();
    expect(screen.getByText('Análise cuidadosa e síntese pedagógica.')).toBeInTheDocument();
    expect(screen.getByText('Comparação lógica de hipóteses e condutas.')).toBeInTheDocument();

    // Explicações no verso dos cards (animação de virar 3D)
    expect(screen.getByText('Organiza o raciocínio clínico e transforma pontos complexos em uma explicação direta.')).toBeInTheDocument();
    expect(screen.getByText('Questiona hipóteses, procura contraindicações e amplia a análise dos diagnósticos diferenciais.')).toBeInTheDocument();
    expect(screen.getByText('Conecta sinais, exames, contexto e informações multimodais em uma visão integrada do caso.')).toBeInTheDocument();
    expect(screen.getByText('Aprofunda as nuances do caso e transforma a análise em uma síntese pedagógica e cuidadosa.')).toBeInTheDocument();
    expect(screen.getByText('Compara hipóteses, relações de causa e efeito e possíveis condutas com raciocínio estruturado.')).toBeInTheDocument();

    // Interação de flip (clique/touch)
    const chatgptCard = screen.getByRole('button', { name: /ChatGPT\. Estruturação do raciocínio e explicações claras/i });
    expect(chatgptCard).not.toHaveClass('is-flipped');
    expect(chatgptCard).toHaveAttribute('aria-expanded', 'false');
    fireEvent.click(chatgptCard);
    expect(chatgptCard).toHaveClass('is-flipped');
    expect(chatgptCard).toHaveAttribute('aria-expanded', 'true');
    expect(document.querySelector('#synapse-card-details-chatgpt')).toHaveAttribute('aria-hidden', 'false');
    fireEvent.click(chatgptCard);
    expect(chatgptCard).not.toHaveClass('is-flipped');
    expect(chatgptCard).toHaveAttribute('aria-expanded', 'false');

    expect(screen.getByText('1 consenso coordenado pela Synapse')).toBeInTheDocument();

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
