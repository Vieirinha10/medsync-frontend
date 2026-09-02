import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { api } from '../services/api';
import QuestoesPage from './QuestoesPage';

vi.mock('../services/api', () => ({
  api: {
    getQuestionMetadata: vi.fn(),
    getQuestionPerformance: vi.fn(),
    getQuestions: vi.fn(),
    answerQuestion: vi.fn(),
    retryQuestionExplanation: vi.fn(),
    reportQuestion: vi.fn(),
    getStudyErrors: vi.fn(),
    submitSpacedReview: vi.fn(),
    recordVisualChallengeAttempt: vi.fn(),
  },
}));

const metadataV2 = {
  total_questoes: 100,
  especialidades: [{ valor: 'Clínica Médica', total: 40 }, { valor: 'Cirurgia', total: 30 }],
  assuntos: [{ valor: 'Cardiologia', total: 25 }, { valor: 'Trauma', total: 20 }],
  anos: [{ valor: '2024', total: 50 }, { valor: '2023', total: 50 }],
  instituicoes: [{ valor: 'USP', total: 30 }, { valor: 'UNICAMP', total: 20 }],
  premium_ativo: true,
  limite_diario: null,
  respondidas_hoje: 5,
  restantes_hoje: null,
};

const questionV2 = {
  id: 2001,
  ano: 2024,
  instituicao: 'USP',
  cabecalho: 'USP · 2024',
  especialidade: 'Clínica Médica',
  assunto: 'Cardiologia',
  enunciado: 'Homem de 62 anos com dor precordial típica aos esforços há 3 meses. Qual exame inicial mais indicado?',
  alternativas: [
    { id: 'A', texto: 'Cintilografia miocárdica de repouso isolada' },
    { id: 'B', texto: 'Teste ergométrico em esteira' },
    { id: 'C', texto: 'Ressonância magnética cardíaca de estresse' },
    { id: 'D', texto: 'Cateterismo cardíaco imediato' },
  ],
  catalog_version: 'v2',
  explicacao_disponivel: false,
};

const answerV2Correct = {
  correta: true,
  alternativa_correta_id: 'B',
  total_respondentes: 45,
  distribuicao_alternativas: [
    { id: 'A', escolhas: 5, percentual: 11.1 },
    { id: 'B', escolhas: 35, percentual: 77.8 },
    { id: 'C', escolhas: 3, percentual: 6.7 },
    { id: 'D', escolhas: 2, percentual: 4.4 },
  ],
  respondidas_hoje: 6,
  restantes_hoje: null,
  explicacao: null,
  explanation_status: 'PENDING',
};

const answerV2Wrong = {
  correta: false,
  alternativa_correta_id: 'B',
  total_respondentes: 45,
  distribuicao_alternativas: [
    { id: 'A', escolhas: 5, percentual: 11.1 },
    { id: 'B', escolhas: 35, percentual: 77.8 },
    { id: 'C', escolhas: 3, percentual: 6.7 },
    { id: 'D', escolhas: 2, percentual: 4.4 },
  ],
  respondidas_hoje: 6,
  restantes_hoje: null,
  explicacao: null,
  explanation_status: 'PENDING',
};

describe('QuestoesPage - Catálogo v2 (Piloto 100)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    api.getQuestionMetadata.mockResolvedValue(metadataV2);
    api.getQuestionPerformance.mockResolvedValue({
      respondidas: 5,
      acertos: 4,
      percentual: 80,
      tempo_medio_segundos: 45,
      assuntos: [{ assunto: 'Cardiologia', respondidas: 3, percentual: 100 }],
    });
    api.getQuestions.mockResolvedValue([questionV2]);
    api.answerQuestion.mockResolvedValue(answerV2Correct);
    api.reportQuestion.mockResolvedValue({ id: 1, message: 'Relato recebido.' });
    window.scrollTo = vi.fn();
  });

  afterEach(cleanup);

  it('exibe questão v2 sem vazamento de gabarito antes da resposta', async () => {
    render(<MemoryRouter><QuestoesPage /></MemoryRouter>);

    expect(await screen.findByRole('heading', { name: 'Questões de provas' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Iniciar lista aleatória/ }));

    expect(await screen.findByText(questionV2.enunciado)).toBeInTheDocument();
    expect(screen.queryByText(/RESPOSTA CORRETA/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/RESPOSTA INCORRETA/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Gabarito:/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Comentário detalhado em preparação/i)).not.toBeInTheDocument();

    // Alternativas sem indicação de resposta
    questionV2.alternativas.forEach((alt) => {
      const btn = screen.getByRole('button', { name: new RegExp(`^${alt.id}\\s*${alt.texto}`) });
      expect(btn).toBeInTheDocument();
      expect(btn).not.toHaveClass('is-correct');
      expect(btn).not.toHaveClass('is-wrong');
    });
  });

  it('corrige com acerto imediato, exibe banner editorial pendente e ZERO menção à Synapse', async () => {
    render(<MemoryRouter><QuestoesPage /></MemoryRouter>);
    await screen.findByRole('heading', { name: 'Questões de provas' });
    fireEvent.click(screen.getByRole('button', { name: /Iniciar lista aleatória/ }));
    await screen.findByText(questionV2.enunciado);

    // Selecionar alternativa B (correta)
    const optB = screen.getByRole('button', { name: /^B\s*Teste ergométrico em esteira/ });
    fireEvent.click(optB);

    const confirmBtn = screen.getByRole('button', { name: 'Confirmar resposta' });
    fireEvent.click(confirmBtn);

    // Verificar acerto imediato e gabarito
    expect(await screen.findByText('RESPOSTA CORRETA')).toBeInTheDocument();
    expect(screen.getByText('Gabarito: alternativa B.')).toBeInTheDocument();

    // Banner editorial pendente
    const pendingBanner = screen.getByRole('status');
    expect(pendingBanner).toBeInTheDocument();
    expect(pendingBanner).toHaveAttribute('aria-live', 'polite');
    expect(screen.getByText('Comentário detalhado em preparação')).toBeInTheDocument();
    expect(
      screen.getByText('Comentário detalhado em preparação pela equipe editorial do MedSync.')
    ).toBeInTheDocument();

    // ZERO chamadas à Synapse ou retry
    expect(screen.queryByText(/Preparada pela Synapse/i)).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Tentar novamente/i })).not.toBeInTheDocument();
    expect(api.retryQuestionExplanation).not.toHaveBeenCalled();

    // Estatísticas da comunidade
    expect(screen.getByText('45 respostas registradas · cada estudante conta uma vez')).toBeInTheDocument();
    expect(screen.getByText('77,8%')).toBeInTheDocument();
  });

  it('corrige com erro imediato, destaca resposta errada e correta, e banner pendente', async () => {
    api.answerQuestion.mockResolvedValueOnce(answerV2Wrong);

    render(<MemoryRouter><QuestoesPage /></MemoryRouter>);
    await screen.findByRole('heading', { name: 'Questões de provas' });
    fireEvent.click(screen.getByRole('button', { name: /Iniciar lista aleatória/ }));
    await screen.findByText(questionV2.enunciado);

    // Selecionar alternativa incorreta A
    const optA = screen.getByRole('button', { name: /^A\s*Cintilografia miocárdica/ });
    fireEvent.click(optA);
    fireEvent.click(screen.getByRole('button', { name: 'Confirmar resposta' }));

    expect(await screen.findByText('RESPOSTA INCORRETA')).toBeInTheDocument();
    expect(screen.getByText('Gabarito: alternativa B.')).toBeInTheDocument();
    expect(screen.getByText('Comentário detalhado em preparação')).toBeInTheDocument();

    // Alternativa A marcada como errada e B marcada como correta
    expect(optA).toHaveClass('is-wrong');
    const optB = screen.getByRole('button', { name: /^B\s*Teste ergométrico em esteira/ });
    expect(optB).toHaveClass('is-correct');

    // Botão de avançar disponível
    expect(screen.getByRole('button', { name: /Ver resultado|Próxima questão/i })).toBeInTheDocument();
  });
});
