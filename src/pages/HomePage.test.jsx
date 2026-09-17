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

const renderHome = () => render(<MemoryRouter><HomePage /></MemoryRouter>);

describe('HomePage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.setItem('medsync-home-intro-viewed', 'true');
    api.getPublicStats.mockResolvedValue({ estudantes_medsync: 127 });
  });

  afterEach(() => {
    cleanup();
    vi.useRealTimers();
    sessionStorage.clear();
  });

  it('apresenta a nova proposta de valor e os números atuais do produto', async () => {
    renderHome();

    expect(screen.getByRole('heading', { name: /Treine decisões\. Não apenas respostas\./i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Criar conta grátis/i })).toHaveAttribute('href', '/cadastro');
    expect(screen.queryByRole('navigation', { name: 'Navegação da página inicial' })).not.toBeInTheDocument();

    const stats = screen.getByLabelText('Números atuais do MedSync');
    expect(within(stats).getByText('80')).toBeInTheDocument();
    expect(within(stats).getByText('150')).toBeInTheDocument();
    expect(within(stats).getByText('226 mil+')).toBeInTheDocument();
    await waitFor(() => expect(within(stats).getByText('127')).toBeInTheDocument());
  });

  it('apresenta as cinco perspectivas da Synapse sem o feixe verde antigo', () => {
    renderHome();

    expect(screen.getByRole('heading', { name: /Cinco perspectivas clínicas/i })).toBeInTheDocument();
    const aiList = screen.getByRole('list', { name: 'Perspectivas da Synapse' });
    expect(within(aiList).getAllByRole('listitem')).toHaveLength(5);
    ['ChatGPT', 'Grok', 'Gemini', 'Claude', 'DeepSeek'].forEach((name) => {
      expect(within(aiList).getByRole('heading', { name })).toBeInTheDocument();
    });
    expect(document.querySelector('.synapse-laser-beam')).toBeNull();
  });

  it('mostra instituições e reserva os depoimentos para relatos reais', () => {
    renderHome();

    expect(screen.getByRole('heading', { name: /Estudantes de diferentes instituições/i })).toBeInTheDocument();
    expect(screen.getByLabelText('Instituições presentes na comunidade MedSync')).toBeInTheDocument();
    expect(screen.getByText(/não representa vínculo ou parceria institucional/i)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Experimente o MedSync e conte como foi.' })).toBeInTheDocument();
    expect(screen.getByText(/depoimentos serão publicados apenas com autorização/i)).toBeInTheDocument();
    expect(screen.queryByText('Lucas Martins')).not.toBeInTheDocument();
  });

  it('resume cinco funcionalidades e apresenta os quatro planos configurados', () => {
    renderHome();

    expect(screen.getByRole('heading', { name: /Tudo o que você precisa para evoluir em um só lugar/i })).toBeInTheDocument();
    expect(document.querySelectorAll('.preview-feature-card')).toHaveLength(5);
    expect(screen.getByRole('heading', { name: 'Casos clínicos' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Desafios visuais' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Mais de 200 mil questões' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Caderno de revisão' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Trilhas de estudo' })).toBeInTheDocument();

    expect(document.querySelectorAll('.preview-plan-card')).toHaveLength(4);
    expect(screen.getByText('R$ 0')).toBeInTheDocument();
    expect(screen.getByText('R$ 25,90')).toBeInTheDocument();
    expect(screen.getByText('R$ 23,90')).toBeInTheDocument();
    expect(screen.getByText('R$ 65,90')).toBeInTheDocument();
    expect(screen.getByText('Mais preparo. Mais clareza. Melhores decisões.')).toBeInTheDocument();
  });

  it('pausa a demonstração automática quando a página não está visível', () => {
    vi.useFakeTimers();
    const visibilityDescriptor = Object.getOwnPropertyDescriptor(document, 'visibilityState');
    Object.defineProperty(document, 'visibilityState', { configurable: true, value: 'hidden' });

    renderHome();
    const examsTab = screen.getByRole('tab', { name: 'Exames' });
    const hypothesisTab = screen.getByRole('tab', { name: 'Hipótese diagnóstica' });

    act(() => vi.advanceTimersByTime(6000));
    expect(examsTab).toHaveAttribute('aria-selected', 'true');

    Object.defineProperty(document, 'visibilityState', { configurable: true, value: 'visible' });
    act(() => document.dispatchEvent(new Event('visibilitychange')));
    act(() => vi.advanceTimersByTime(5600));
    expect(hypothesisTab).toHaveAttribute('aria-selected', 'true');

    if (visibilityDescriptor) Object.defineProperty(document, 'visibilityState', visibilityDescriptor);
    else delete document.visibilityState;
  });

  it('permite pausar a demonstração e navegar pelas etapas com o teclado', () => {
    vi.useFakeTimers();
    renderHome();

    const examsTab = screen.getByRole('tab', { name: 'Exames' });
    const hypothesisTab = screen.getByRole('tab', { name: 'Hipótese diagnóstica' });
    const conductTab = screen.getByRole('tab', { name: 'Conduta' });
    const pauseButton = screen.getByRole('button', { name: 'Pausar demonstração automática' });

    fireEvent.click(pauseButton);
    act(() => vi.advanceTimersByTime(6000));
    expect(examsTab).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('button', { name: 'Retomar demonstração automática' })).toBeInTheDocument();

    examsTab.focus();
    fireEvent.keyDown(examsTab, { key: 'ArrowRight' });
    expect(hypothesisTab).toHaveAttribute('aria-selected', 'true');
    expect(hypothesisTab).toHaveFocus();

    fireEvent.keyDown(hypothesisTab, { key: 'End' });
    expect(conductTab).toHaveAttribute('aria-selected', 'true');
    expect(conductTab).toHaveFocus();

    const documentIds = [...document.querySelectorAll('[id]')].map(({ id }) => id);
    expect(new Set(documentIds).size).toBe(documentIds.length);
    screen.getAllByRole('tab').forEach((tab) => {
      expect(document.getElementById(tab.getAttribute('aria-controls'))).not.toBeNull();
    });
  });
});
