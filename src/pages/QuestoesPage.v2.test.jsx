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

const metadataV1 = {
  total_questoes: 2811,
  especialidades: [{ valor: 'Ginecologia', total: 600 }],
  assuntos: [{ valor: 'Obstetrícia', total: 400 }],
  anos: [{ valor: '2022', total: 500 }],
  instituicoes: [{ valor: 'SUS-SP', total: 700 }],
  premium_ativo: true,
  limite_diario: null,
  respondidas_hoje: 5,
  restantes_hoje: null,
};

const realQuestionV2 = {
  id: 439600,
  source_id: '4000000002',
  ano: 2017,
  instituicao: 'AC - Fundação Hospital Estadual do Acre - Fundhacre',
  cabecalho: 'AC - Fundação Hospital Estadual do Acre - Fundhacre · 2017',
  especialidade: 'Obstetrícia',
  assunto: 'Obstetrícia',
  tema: null,
  regiao: 'AC',
  enunciado: 'Paciente de 21 anos, procura a maternidade com história de atraso menstrual de 3 meses, associado a pequeno sangramento vaginal. O diagnóstico compatível com o quadro é:',
  statement_rich_html: 'Paciente de 21 anos, procura a maternidade com história de atraso menstrual de 3 meses, associado a pequeno sangramento vaginal. O diagnóstico compatível com o quadro é:',
  alternativas: [
    { id: 'A', texto: 'Abortamento habitual.' },
    { id: 'B', texto: 'Aborto retido.' },
    { id: 'C', texto: 'Ameaça de abortamento.' },
    { id: 'D', texto: 'Incompetência istmocervical.' },
  ],
  catalog_version: 'v2',
  explicacao_disponivel: false,
};

const realAnswerV2 = {
  correta: true,
  alternativa_correta_id: 'B',
  total_respondentes: 45,
  distribuicao_alternativas: [
    { id: 'A', escolhas: 2, percentual: 4.4 },
    { id: 'B', escolhas: 35, percentual: 77.8 },
    { id: 'C', escolhas: 5, percentual: 11.1 },
    { id: 'D', escolhas: 3, percentual: 6.7 },
  ],
  respondidas_hoje: 6,
  restantes_hoje: null,
  explicacao: null,
  explanation_status: 'PENDING',
};

describe('QuestoesPage - Catálogo v2 (Piloto 100 Corretivo)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    api.getQuestionMetadata.mockResolvedValue(metadataV2);
    api.getQuestionPerformance.mockResolvedValue({
      respondidas: 5,
      acertos: 4,
      percentual: 80,
      tempo_medio_segundos: 45,
      assuntos: [{ assunto: 'Obstetrícia', respondidas: 3, percentual: 100 }],
    });
    api.getQuestions.mockResolvedValue([realQuestionV2]);
    api.answerQuestion.mockResolvedValue(realAnswerV2);
    api.reportQuestion.mockResolvedValue({ id: 1, message: 'Relato recebido.' });
    window.scrollTo = vi.fn();
  });

  afterEach(cleanup);

  it('exibe questão v2 com rótulo ENUNCIADO e sem vazamento de gabarito antes da resposta', async () => {
    render(<MemoryRouter><QuestoesPage /></MemoryRouter>);

    expect(await screen.findByRole('heading', { name: 'Questões de provas' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Iniciar lista aleatória/ }));

    expect(await screen.findByText(realQuestionV2.enunciado)).toBeInTheDocument();
    expect(screen.getByText('ENUNCIADO')).toBeInTheDocument();
    expect(screen.queryByText(/IMUTÁVEL/i)).not.toBeInTheDocument();

    // Nenhum vazamento de gabarito
    expect(screen.queryByText(/RESPOSTA CORRETA/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/RESPOSTA INCORRETA/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Gabarito:/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Comentário detalhado em preparação/i)).not.toBeInTheDocument();
  });

  it('permite alternar entre o Catálogo Clássico (v1) e o Novo Catálogo (v2) sem mostrar tela vazia', async () => {
    render(<MemoryRouter><QuestoesPage /></MemoryRouter>);
    await screen.findByRole('heading', { name: 'Questões de provas' });

    // Clicar em Catálogo Clássico (v1)
    api.getQuestionMetadata.mockResolvedValueOnce(metadataV1);
    const btnV1 = screen.getByRole('button', { name: 'Catálogo Clássico (v1)' });
    fireEvent.click(btnV1);

    await waitFor(() => {
      expect(api.getQuestionMetadata).toHaveBeenCalledWith('v1');
    });

    // Clicar de volta em Novo Catálogo (Piloto v2)
    api.getQuestionMetadata.mockResolvedValueOnce(metadataV2);
    const btnV2 = screen.getByRole('button', { name: 'Novo Catálogo (Piloto v2)' });
    fireEvent.click(btnV2);

    await waitFor(() => {
      expect(api.getQuestionMetadata).toHaveBeenCalledWith('v2');
    });
  });

  it('corrige com acerto imediato, exibe banner editorial pendente e ZERO menção à Synapse', async () => {
    render(<MemoryRouter><QuestoesPage /></MemoryRouter>);
    await screen.findByRole('heading', { name: 'Questões de provas' });
    fireEvent.click(screen.getByRole('button', { name: /Iniciar lista aleatória/ }));
    await screen.findByText(realQuestionV2.enunciado);

    // Selecionar alternativa B (correta)
    const optB = screen.getByRole('button', { name: /^B\s*Aborto retido/ });
    fireEvent.click(optB);

    const confirmBtn = screen.getByRole('button', { name: 'Confirmar resposta' });
    fireEvent.click(confirmBtn);

    // Feedback imediato
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
  });

  it('bloqueia ataques XSS renderizando enunciados e alternativas potencialmente maliciosos como texto plano seguro', async () => {
    const maliciousQuestion = {
      ...realQuestionV2,
      id: 999999,
      enunciado: 'Enunciado com script malicioso <script>window.__xss_attack_triggered = true;</script> e imagem <img src="x" onerror="window.__xss_img = true;" /> e iframe <iframe src="javascript:alert(1)"></iframe>.',
      alternativas: [
        { id: 'A', texto: 'Alternativa segura.' },
        { id: 'B', texto: 'Alternativa com payload <svg onload="window.__xss_svg = true;"><a href="javascript:alert(2)">click</a>.' },
      ],
    };

    api.getQuestions.mockResolvedValueOnce([maliciousQuestion]);

    render(<MemoryRouter><QuestoesPage /></MemoryRouter>);
    await screen.findByRole('heading', { name: 'Questões de provas' });
    fireEvent.click(screen.getByRole('button', { name: /Iniciar lista aleatória/ }));

    // O texto deve estar no documento como string escapada pura, não como elemento DOM executável
    expect(await screen.findByText(/<script>window.__xss_attack_triggered = true;<\/script>/)).toBeInTheDocument();
    expect(document.querySelector('iframe')).toBeNull();
    expect(document.querySelector('img[src="x"]')).toBeNull();
    expect(window.__xss_attack_triggered).toBeUndefined();
    expect(window.__xss_img).toBeUndefined();
    expect(window.__xss_svg).toBeUndefined();
  });
});
