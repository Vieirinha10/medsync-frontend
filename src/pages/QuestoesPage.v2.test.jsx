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

const canonicalQuestionV2_4000000002 = {
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

describe('QuestoesPage - Catálogo Ativo (Piloto 100 v1.2)', () => {
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
    api.getQuestions.mockResolvedValue([canonicalQuestionV2_4000000002]);
    api.answerQuestion.mockResolvedValue(realAnswerV2);
    api.reportQuestion.mockResolvedValue({ id: 1, message: 'Relato recebido.' });
    window.scrollTo = vi.fn();
  });

  afterEach(cleanup);

  it('exibe questão com rótulo ENUNCIADO e sem vazamento de gabarito antes da resposta', async () => {
    render(<MemoryRouter><QuestoesPage /></MemoryRouter>);

    expect(await screen.findByRole('heading', { name: 'Questões de provas' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Iniciar lista aleatória/ }));

    expect(await screen.findByText(canonicalQuestionV2_4000000002.enunciado)).toBeInTheDocument();
    expect(screen.getByText('ENUNCIADO')).toBeInTheDocument();
    expect(screen.queryByText(/IMUTÁVEL/i)).not.toBeInTheDocument();

    // Nenhum vazamento de gabarito
    expect(screen.queryByText(/RESPOSTA CORRETA/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/RESPOSTA INCORRETA/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Gabarito:/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Comentário detalhado em preparação/i)).not.toBeInTheDocument();
  });

  it('não expõe seletores de versão técnica de catálogo ao estudante na interface', async () => {
    render(<MemoryRouter><QuestoesPage /></MemoryRouter>);
    await screen.findByRole('heading', { name: 'Questões de provas' });

    // Garante que botões de versão técnica não estão presentes para o aluno
    expect(screen.queryByRole('button', { name: /Novo Catálogo \(Piloto v2\)/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Catálogo Clássico \(v1\)/i })).not.toBeInTheDocument();
    expect(screen.queryByText(/VERSÃO DO CATÁLOGO/i)).not.toBeInTheDocument();

    // Metadados são carregados da versão ativa sem parâmetros técnicos do cliente
    expect(api.getQuestionMetadata).toHaveBeenCalledWith();
  });

  it('corrige com acerto imediato, exibe banner editorial pendente e ZERO menção à Synapse', async () => {
    render(<MemoryRouter><QuestoesPage /></MemoryRouter>);
    await screen.findByRole('heading', { name: 'Questões de provas' });
    fireEvent.click(screen.getByRole('button', { name: /Iniciar lista aleatória/ }));
    await screen.findByText(canonicalQuestionV2_4000000002.enunciado);

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
      ...canonicalQuestionV2_4000000002,
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
    expect(window.__xss_img).toBeUndefined();
    expect(window.__xss_svg).toBeUndefined();
  });

  it('permite riscar e descartar alternativas com toggle visual e restauração ao selecionar', async () => {
    render(<MemoryRouter><QuestoesPage /></MemoryRouter>);
    await screen.findByRole('heading', { name: 'Questões de provas' });
    fireEvent.click(screen.getByRole('button', { name: /Iniciar lista aleatória/ }));
    await screen.findByText(canonicalQuestionV2_4000000002.enunciado);

    // Botão de descarte da alternativa D
    const discardD = screen.getByRole('button', { name: 'Riscar alternativa D' });
    expect(discardD).toBeInTheDocument();
    expect(discardD).not.toHaveClass('is-active');

    // Clicar para riscar alternativa D
    fireEvent.click(discardD);
    expect(discardD).toHaveClass('is-active');

    const optDText = screen.getByText('Pode tratar-se de uma gestação incipiente.');
    expect(optDText).toHaveClass('is-struck');

    // Clicar novamente restaura
    fireEvent.click(discardD);
    expect(discardD).not.toHaveClass('is-active');
    expect(optDText).not.toHaveClass('is-struck');

    // Riscar novamente D e depois clicar na alternativa D para selecioná-la
    fireEvent.click(discardD);
    expect(discardD).toHaveClass('is-active');
    expect(optDText).toHaveClass('is-struck');

    const optDBtn = screen.getByRole('button', { name: /^D\s*Pode tratar-se de uma gestação incipiente/ });
    fireEvent.click(optDBtn);

    // Ao selecionar diretamente, ela é automaticamente desmarcada do descarte
    expect(discardD).not.toHaveClass('is-active');
    expect(optDText).not.toHaveClass('is-struck');
    expect(optDBtn).toHaveClass('is-selected');
  });
});
