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

const metadata = {
  total_questoes: 2811,
  especialidades: [{ valor: 'Cirurgia', total: 2811 }],
  assuntos: [{ valor: 'Trauma e emergência', total: 1494 }],
  anos: [{ valor: '2025', total: 320 }],
  instituicoes: [{ valor: 'USP', total: 45 }],
  premium_ativo: false,
  limite_diario: 10,
  respondidas_hoje: 0,
  restantes_hoje: 10,
};

const question = {
  id: 101,
  ano: 2025,
  instituicao: 'USP',
  cabecalho: '2025 USP',
  especialidade: 'Cirurgia',
  assunto: 'Trauma e emergência',
  enunciado: 'Paciente vítima de trauma apresenta instabilidade hemodinâmica. Qual é a melhor conduta inicial?',
  alternativas: [
    { id: 'A', texto: 'Alta com orientação' },
    { id: 'B', texto: 'Avaliação e estabilização imediatas' },
    { id: 'C', texto: 'Aguardar exames ambulatoriais' },
  ],
  explicacao_disponivel: false,
};

const correction = {
  correta: true,
  alternativa_correta_id: 'B',
  total_respondentes: 137,
  distribuicao_alternativas: [
    { id: 'A', escolhas: 31, percentual: 22.6 },
    { id: 'B', escolhas: 88, percentual: 64.2 },
    { id: 'C', escolhas: 18, percentual: 13.1 },
  ],
  respondidas_hoje: 1,
  restantes_hoje: 9,
  explicacao: {
    resumo: 'A prioridade é reconhecer a instabilidade e iniciar a estabilização.',
    porque_correta: 'A avaliação primária e a estabilização seguem a prioridade de ameaças imediatas à vida.',
    analise_alternativas: [
      { id: 'A', correta: false, explicacao: 'A alta não é segura diante de instabilidade.' },
      { id: 'B', correta: true, explicacao: 'Esta opção prioriza avaliação e estabilização imediatas.' },
      { id: 'C', correta: false, explicacao: 'A investigação ambulatorial atrasaria o atendimento.' },
    ],
    alerta_atualizacao: null,
    fonte: 'synapse',
  },
};

describe('QuestoesPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    api.getQuestionMetadata.mockResolvedValue(metadata);
    api.getQuestionPerformance.mockResolvedValue({
      respondidas: 0,
      acertos: 0,
      percentual: 0,
      tempo_medio_segundos: null,
      assuntos: [],
    });
    api.getQuestions.mockResolvedValue([question]);
    api.answerQuestion.mockResolvedValue(correction);
    api.reportQuestion.mockResolvedValue({ id: 4, message: 'Relato enviado.' });
    window.scrollTo = vi.fn();
  });

  afterEach(cleanup);

  it('orienta o aluno, respeita o limite gratuito e corrige somente após confirmar', async () => {
    render(<MemoryRouter><QuestoesPage /></MemoryRouter>);

    expect(await screen.findByRole('heading', { name: 'Questões de provas' })).toBeInTheDocument();
    expect(screen.getByText(/não alimentam revisões nem o caderno de erros/i)).toBeInTheDocument();
    expect(screen.getByLabelText('0 questões realizadas hoje')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '20 questões' })).toBeDisabled();
    expect(screen.getByRole('button', { name: '30 questões' })).toBeDisabled();

    fireEvent.click(screen.getByRole('button', { name: /Iniciar lista aleatória/ }));
    expect(await screen.findByText(question.enunciado)).toBeInTheDocument();
    expect(screen.queryByText(correction.explicacao.resumo)).not.toBeInTheDocument();
    expect(screen.queryByText(/Como os estudantes responderam/i)).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /^B\s*Avaliação e estabilização imediatas$/ }));
    fireEvent.click(screen.getByRole('button', { name: 'Confirmar resposta' }));

    expect(await screen.findByText('RESPOSTA CORRETA')).toBeInTheDocument();
    expect(screen.getByText('137 respostas registradas · cada estudante conta uma vez')).toBeInTheDocument();
    expect(screen.getByText('64,2%')).toBeInTheDocument();
    expect(screen.getByText('Distrator mais escolhido')).toBeInTheDocument();
    expect(screen.getByText(correction.explicacao.resumo)).toBeInTheDocument();
    expect(screen.getByText(correction.explicacao.porque_correta)).toBeInTheDocument();
    correction.explicacao.analise_alternativas.forEach((item) => {
      expect(screen.getByText(item.explicacao)).toBeInTheDocument();
    });
    expect(screen.queryByText(/Ponto-chave para a prova/i)).not.toBeInTheDocument();
    expect(screen.getByText(/Preparada pela Synapse/)).toBeInTheDocument();
    expect(api.answerQuestion).toHaveBeenCalledWith(101, 'B', expect.any(Number));
    expect(api.getStudyErrors).not.toHaveBeenCalled();
    expect(api.submitSpacedReview).not.toHaveBeenCalled();
    expect(api.recordVisualChallengeAttempt).not.toHaveBeenCalled();
  });

  it('não exibe o botão antigo de relatar problema e permite sinalizar erro pelo cabeçalho após responder', async () => {
    render(<MemoryRouter><QuestoesPage /></MemoryRouter>);
    await screen.findByRole('heading', { name: 'Questões de provas' });
    fireEvent.click(screen.getByRole('button', { name: /Iniciar lista aleatória/ }));
    await screen.findByText(question.enunciado);
    fireEvent.click(screen.getByRole('button', { name: /^B\s*Avaliação e estabilização imediatas$/ }));
    fireEvent.click(screen.getByRole('button', { name: 'Confirmar resposta' }));
    await screen.findByText('RESPOSTA CORRETA');

    // Botão legado "Reportar problema" não deve existir
    expect(screen.queryByRole('button', { name: 'Reportar problema' })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /(Próxima questão|Ver resultado)/i })).toBeInTheDocument();

    // Sinalizar erro através do botão completo do cabeçalho
    const flagBtn = screen.getByRole('button', { name: /Sinalizar erro/i });
    expect(flagBtn).toBeInTheDocument();
    fireEvent.click(flagBtn);

    expect(screen.getByRole('heading', { name: /Revisar Questão #101/i })).toBeInTheDocument();
    fireEvent.change(screen.getByPlaceholderText(/Ex: A resposta correta/), {
      target: { value: 'Revisar a atualização desta recomendação.' },
    });
    fireEvent.click(screen.getByRole('button', { name: /Confirmar Sinalização/i }));

    await waitFor(() => expect(api.reportQuestion).toHaveBeenCalledWith(101, {
      motivo: 'gabarito',
      descricao: '[FLAG TEMPORÁRIO] Revisar a atualização desta recomendação.',
    }));
    expect(screen.getByText(/Questão sinalizada com sucesso/i)).toBeInTheDocument();
  });

  it('não apresenta resumo genérico como explicação e permite tentar novamente', async () => {
    api.answerQuestion.mockResolvedValueOnce({
      ...correction,
      explicacao: {
        resumo: 'O gabarito validado aponta a alternativa B.',
        porque_correta: 'A explicação clínica ampliada está sendo preparada.',
        analise_alternativas: question.alternativas.map((item) => ({
          id: item.id,
          correta: item.id === 'B',
          explicacao: item.id === 'B'
            ? 'Esta alternativa corresponde ao gabarito validado.'
            : 'Esta alternativa não corresponde ao gabarito validado.',
        })),
        alerta_atualizacao: 'Conteúdo explicativo temporário.',
        fonte: 'resumo_automatico',
      },
    });
    api.retryQuestionExplanation.mockResolvedValueOnce(correction.explicacao);

    render(<MemoryRouter><QuestoesPage /></MemoryRouter>);
    await screen.findByRole('heading', { name: 'Questões de provas' });
    fireEvent.click(screen.getByRole('button', { name: /Iniciar lista aleatória/ }));
    await screen.findByText(question.enunciado);
    fireEvent.click(screen.getByRole('button', { name: /^B\s*Avaliação e estabilização imediatas$/ }));
    fireEvent.click(screen.getByRole('button', { name: 'Confirmar resposta' }));

    expect(await screen.findByText(/Explicação detalhada temporariamente indisponível/)).toBeInTheDocument();
    expect(screen.queryByText('Esta alternativa não corresponde ao gabarito validado.')).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Tentar novamente' }));

    expect(await screen.findByText(correction.explicacao.porque_correta)).toBeInTheDocument();
    expect(api.retryQuestionExplanation).toHaveBeenCalledWith(101);
    expect(screen.queryByText(/Ponto-chave para a prova/i)).not.toBeInTheDocument();
  });

  it('permite sinalizar erro diretamente no cabeçalho antes de responder', async () => {
    render(<MemoryRouter><QuestoesPage /></MemoryRouter>);
    await screen.findByRole('heading', { name: 'Questões de provas' });
    fireEvent.click(screen.getByRole('button', { name: /Iniciar lista aleatória/ }));
    await screen.findByText(question.enunciado);

    const flagBtn = screen.getByRole('button', { name: /Sinalizar erro nesta questão/i });
    expect(flagBtn).toBeInTheDocument();
    fireEvent.click(flagBtn);

    expect(screen.getByRole('heading', { name: /Revisar Questão #101/i })).toBeInTheDocument();
    fireEvent.change(screen.getByPlaceholderText(/Ex: A resposta correta deveria ser C/), {
      target: { value: 'Alternativa A tem erro de digitação' },
    });
    fireEvent.click(screen.getByRole('button', { name: /Confirmar Sinalização/i }));

    await waitFor(() => expect(api.reportQuestion).toHaveBeenCalledWith(101, {
      motivo: 'gabarito',
      descricao: '[FLAG TEMPORÁRIO] Alternativa A tem erro de digitação',
    }));
    expect(screen.getByText(/Questão sinalizada com sucesso/i)).toBeInTheDocument();
  });
});
