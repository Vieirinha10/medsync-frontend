/**
 * QuestoesPage - Contrato Visual e Teste de Componente com Payload Canônico Reconciliado (v1.4)
 * 
 * Classificação formal do teste:
 * - Teste de componente React com mock de camada de serviços (vi.mock('../services/api'));
 * - Validação de contrato visual do frontend e conformidade do payload canônico;
 * - NÃO constitui teste de integração E2E de navegador (automação completa ponta a ponta
 *   será validada em ambiente de Staging com API, frontend e PostgreSQL ativos).
 */

import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { api } from '../services/api';
import QuestoesPage from './QuestoesPage';

vi.mock('../services/api', () => ({
  api: {
    getQuestionMetadata: vi.fn(),
    getQuestionSubjects: vi.fn(),
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

// Dados reais extraídos diretamente da fixture oficial pilot-100-import-ready.jsonl via API
const canonicalApiPayload_4000000002 = {
  id: 1,
  source_id: '4000000002',
  ano: 2017,
  instituicao: 'AC - Fundação Hospital Estadual do Acre - Fundhacre',
  cabecalho: 'AC - Fundação Hospital Estadual do Acre - Fundhacre · 2017',
  especialidade: 'Obstetrícia',
  assunto: 'Obstetrícia',
  tema: null,
  regiao: 'AC',
  enunciado: 'Paciente de 21 anos, procura a maternidade com história de atraso menstrual de 3 meses, associado a pequeno sangramento vaginal. Refere ainda que os enjoos cessaram. Ao exame físico: paciente encontra-se em bom estado geral, PA = 100 x 70 mmHg. Ao toque vaginal: colo fechado, útero amolecido e 3 cm acima da sínfise púbica. A ultrassonografia revelou presença de embrião com comprimento cabeça nádegas (CCN) de 31 mm, ausência de batimentos cardíacos fetais em gestação de 10 semanas. O diagnóstico compatível com o quadro é:',
  statement_rich_html: 'Paciente de 21 anos, procura a maternidade com história de atraso menstrual de 3 meses, associado a pequeno sangramento vaginal. Refere ainda que os enjoos cessaram. Ao exame físico: paciente encontra-se em bom estado geral, PA = 100 x 70 mmHg. Ao toque vaginal: colo fechado, útero amolecido e 3 cm acima da sínfise púbica. A ultrassonografia revelou presença de embrião com comprimento cabeça nádegas (CCN) de 31 mm, ausência de batimentos cardíacos fetais em gestação de 10 semanas. O diagnóstico compatível com o quadro é:',
  alternativas: [
    { id: 'A', texto: 'Abortamento habitual.' },
    { id: 'B', texto: 'Aborto retido.' },
    { id: 'C', texto: 'Abortamento incompleto.' },
    { id: 'D', texto: 'Pode tratar-se de uma gestação incipiente.' },
  ],
  catalog_version: 'v2',
  explicacao_disponivel: false,
};

const canonicalApiResponseCorrect = {
  correta: true,
  alternativa_correta_id: 'B',
  total_respondentes: 100,
  distribuicao_alternativas: [
    { id: 'A', escolhas: 4, percentual: 4.0 },
    { id: 'B', escolhas: 85, percentual: 85.0 },
    { id: 'C', escolhas: 5, percentual: 5.0 },
    { id: 'D', escolhas: 6, percentual: 6.0 },
  ],
  respondidas_hoje: 1,
  restantes_hoje: null,
  explicacao: null,
  explanation_status: 'PENDING',
};

const canonicalApiResponseIncorrect = {
  correta: false,
  alternativa_correta_id: 'B',
  total_respondentes: 100,
  distribuicao_alternativas: [
    { id: 'A', escolhas: 4, percentual: 4.0 },
    { id: 'B', escolhas: 85, percentual: 85.0 },
    { id: 'C', escolhas: 5, percentual: 5.0 },
    { id: 'D', escolhas: 6, percentual: 6.0 },
  ],
  respondidas_hoje: 2,
  restantes_hoje: null,
  explicacao: null,
  explanation_status: 'PENDING',
};

describe('QuestoesPage - Contrato Visual e Teste de Componente com Payload Canônico Reconciliado (v1.4)', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    api.getQuestionMetadata.mockResolvedValue({
      total_questoes: 100,
      especialidades: [{ valor: 'Obstetrícia', total: 100 }],
      assuntos: [{ valor: 'Obstetrícia', total: 100 }],
      anos: [{ valor: '2017', total: 100 }],
      instituicoes: [{ valor: 'AC - Fundação Hospital Estadual do Acre - Fundhacre', total: 100 }],
      premium_ativo: true,
      limite_diario: null,
      respondidas_hoje: 0,
      restantes_hoje: null,
    });
    api.getQuestionSubjects.mockResolvedValue([
      { valor: 'Obstetrícia', total: 100 },
    ]);
    api.getQuestionPerformance.mockResolvedValue({
      total_respondidas: 10,
      taxa_acerto: 80,
      tempo_medio_segundos: 40,
      assuntos: [{ assunto: 'Obstetrícia', respondidas: 10, percentual: 80 }],
    });
    api.getQuestions.mockResolvedValue([canonicalApiPayload_4000000002]);
    window.scrollTo = vi.fn();
  });

  afterEach(cleanup);

  it('contrato visual e renderização de componente: consome payload canônico sem gabarito, submete resposta correta e renderiza feedback com zero IA', async () => {
    api.answerQuestion.mockResolvedValueOnce(canonicalApiResponseCorrect);

    render(<MemoryRouter><QuestoesPage /></MemoryRouter>);

    // 1. Carregamento inicial da página
    expect(await screen.findByRole('heading', { name: 'Questões de provas' })).toBeInTheDocument();
    
    // Iniciar lista (chamada a api.getQuestions sem query string de versão técnica)
    fireEvent.click(screen.getByRole('button', { name: /Iniciar lista aleatória/ }));
    expect(api.getQuestions).toHaveBeenCalledWith(expect.objectContaining({ quantidade: 10 }));

    // 2. Validação da questão canônica na tela
    expect(await screen.findByText(canonicalApiPayload_4000000002.enunciado)).toBeInTheDocument();
    expect(screen.getByText('ENUNCIADO')).toBeInTheDocument();

    // Validar presença de todas as alternativas canônicas reais da fixture
    expect(screen.getByRole('button', { name: /^A\s*Abortamento habitual/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^B\s*Aborto retido/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^C\s*Abortamento incompleto/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^D\s*Pode tratar-se de uma gestação incipiente/ })).toBeInTheDocument();

    // 3. Confirmar que o gabarito NÃO é exibido antes da resposta
    expect(screen.queryByText(/RESPOSTA CORRETA/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/RESPOSTA INCORRETA/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Gabarito:/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Comentário detalhado em preparação/i)).not.toBeInTheDocument();

    // Botão Confirmar inicialmente desabilitado
    const confirmBtn = screen.getByRole('button', { name: 'Confirmar resposta' });
    expect(confirmBtn).toBeDisabled();

    // 4. Selecionar alternativa B (correta)
    fireEvent.click(screen.getByRole('button', { name: /^B\s*Aborto retido/ }));
    expect(confirmBtn).not.toBeDisabled();

    // 5. Confirmar resposta
    fireEvent.click(confirmBtn);
    expect(api.answerQuestion).toHaveBeenCalledWith(1, 'B', expect.any(Number));

    // 6. Validar feedback pós-resposta
    expect(await screen.findByText('RESPOSTA CORRETA')).toBeInTheDocument();
    expect(screen.getByText('Gabarito: alternativa B.')).toBeInTheDocument();

    // Distribuição de respostas real
    expect(screen.getByText('85%')).toBeInTheDocument();
    expect(screen.getAllByText(/escolheram esta alternativa/i)).toHaveLength(4);

    // Banner de comentário editorial pendente (sem IA)
    const pendingBanner = screen.getByRole('status');
    expect(pendingBanner).toBeInTheDocument();
    expect(screen.getByText('Comentário detalhado em preparação')).toBeInTheDocument();
    expect(screen.getByText('Comentário detalhado em preparação pela equipe editorial do MedSync.')).toBeInTheDocument();

    // ZERO chamadas à Synapse ou retry
    expect(screen.queryByText(/Synapse/i)).not.toBeInTheDocument();
    expect(api.retryQuestionExplanation).not.toHaveBeenCalled();
  });

  it('contrato visual em resposta incorreta: submete alternativa incorreta e revela gabarito com explicação nula e comentário pendente', async () => {
    api.answerQuestion.mockResolvedValueOnce(canonicalApiResponseIncorrect);

    render(<MemoryRouter><QuestoesPage /></MemoryRouter>);
    await screen.findByRole('heading', { name: 'Questões de provas' });
    fireEvent.click(screen.getByRole('button', { name: /Iniciar lista aleatória/ }));
    await screen.findByText(canonicalApiPayload_4000000002.enunciado);

    // Selecionar alternativa A (incorreta)
    fireEvent.click(screen.getByRole('button', { name: /^A\s*Abortamento habitual/ }));
    fireEvent.click(screen.getByRole('button', { name: 'Confirmar resposta' }));

    // Feedback de erro com revelação do gabarito B
    expect(await screen.findByText('RESPOSTA INCORRETA')).toBeInTheDocument();
    expect(screen.getByText('Gabarito: alternativa B.')).toBeInTheDocument();

    // Banner editorial pendente
    expect(screen.getByText('Comentário detalhado em preparação pela equipe editorial do MedSync.')).toBeInTheDocument();
    expect(screen.queryByText(/Synapse/i)).not.toBeInTheDocument();
  });
});
