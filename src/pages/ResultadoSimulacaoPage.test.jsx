import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';
import ResultadoSimulacaoPage from './ResultadoSimulacaoPage';

vi.mock('../services/api', () => ({
  api: {
    getSimulationResult: vi.fn(),
    completeLearningPathActivity: vi.fn(),
    askSimulationQuestion: vi.fn().mockResolvedValue({
      resposta: 'Neste cenário, o exame não mudaria a conduta inicial.',
      fonte_feedback: 'agente_regras',
      aviso_educacional: 'Conteúdo educacional.',
    }),
  },
  ApiError: class ApiError extends Error {},
}));

afterEach(cleanup);

const result = {
  progresso_id: 42,
  caso_id: 8,
  caso_titulo: 'Caso #008 – Dispneia súbita em mulher adulta',
  diagnostico_referencia: 'Tromboembolismo pulmonar agudo',
  pontuacao_total: 86,
  pontuacao: { exames: 36, hipotese: 25, conduta: 25 },
  exames: {
    adequados: ['Angiotomografia'],
    essenciais_ausentes: [],
    desnecessarios: [],
    comentario: 'Seleção adequada ao contexto.',
  },
  feedback: {
    resumo: 'Bom raciocínio clínico global.',
    sintese_raciocinio: 'Você reconheceu o quadro tromboembólico e priorizou o tratamento.',
    acertos: ['A hipótese foi bem sustentada.'],
    omissoes: ['Explicite os critérios de reavaliação.'],
    pontos_melhoria: ['Explicite os critérios de reavaliação.'],
    feedback_hipotese: 'Hipótese compatível com o caso.',
    feedback_conduta: 'Conduta adequada, com oportunidade de detalhar monitorização.',
    feedback_seguranca: 'Mantenha vigilância hemodinâmica.',
    reacao_paciente: 'A tendência é melhora progressiva da hipoxemia.',
    desfecho_clinico: 'A paciente permanece internada e monitorizada.',
    justificativas_exames: [{ exame_id: 'angiotc', exame: 'Angiotomografia', justificativa_estudante: 'Confirmar TEP.', compreensao: 'adequada', feedback: 'Justificativa alinhada à rubrica.' }],
    plano_pessoal_melhoria: ['Treinar a estratificação hemodinâmica.'],
    recomendacoes_estudo: ['Estratificação de risco no TEP'],
  },
  fonte_feedback: 'openai',
  nivel_conduta: 'adequada',
  consequencias: {
    tempo_desperdicado_minutos: 0,
    atraso_diagnostico_minutos: 0,
    tempo_total_impactado_minutos: 0,
    estado_paciente: 'estabilizado',
    aviso_tempo: 'Tempo educacional fictício.',
    eventos: [{ tipo: 'resposta', titulo: 'A conduta estabilizou o paciente', descricao: 'Hipoxemia em melhora.', minutos: 0 }],
    reavaliacao: [{ indicador: 'Saturação periférica', antes: 'hipoxemia', depois: 'tendência de melhora', tendencia: 'melhora' }],
  },
  objetivos_aprendizagem: ['Estratificar o risco do TEP'],
  fontes_clinicas: [{
    titulo: 'ASH Guidelines for treatment of DVT and PE',
    organizacao: 'American Society of Hematology',
    ano: 2020,
    url: 'https://doi.org/10.1182/bloodadvances.2020001830',
  }],
  aviso_educacional: 'Conteúdo exclusivamente educacional.',
};

describe('ResultadoSimulacaoPage', () => {
  it('organiza o debriefing clínico em quatro abas sem repetir os blocos', async () => {
    render(
      <MemoryRouter initialEntries={[{ pathname: '/resultados/42', state: { result } }]}>
        <Routes>
          <Route path="/resultados/:progressoId" element={<ResultadoSimulacaoPage />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByRole('heading', { name: 'Caso #008 – Dispneia súbita em mulher adulta' })).toBeInTheDocument();
    expect(screen.getByText('Feedback personalizado pela Synapse')).toBeInTheDocument();
    expect(screen.getByLabelText('Pontuação total: 8,6 de 10')).toBeInTheDocument();
    expect(screen.getByText('Você reconheceu o quadro tromboembólico e priorizou o tratamento.')).toBeInTheDocument();
    expect(screen.getByLabelText('Desempenho por dimensão clínica')).toHaveTextContent('Exames90%');
    expect(screen.queryByText('A tendência é melhora progressiva da hipoxemia.')).not.toBeInTheDocument();
    expect(screen.queryByText('Saturação periférica')).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('tab', { name: 'Decisões' }));
    expect(screen.getByRole('tabpanel', { name: 'Decisões' })).toBeInTheDocument();
    expect(screen.getByText('Tromboembolismo pulmonar agudo')).toBeInTheDocument();
    expect(screen.getByText('Hipótese compatível com o caso.')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Ver detalhes das avaliações, exames e justificativas'));
    expect(screen.getByText('Justificativa alinhada à rubrica.')).toBeInTheDocument();

    fireEvent.keyDown(screen.getByRole('tab', { name: 'Decisões' }), { key: 'ArrowRight' });
    expect(screen.getByRole('tabpanel', { name: 'Impacto clínico' })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Paciente estabilizado' })).toHaveTextContent('🙂');
    expect(screen.getByText('A tendência é melhora progressiva da hipoxemia.')).toBeInTheDocument();
    expect(screen.getByText(/Reavaliação: Saturação periférica/)).toBeInTheDocument();
    expect(screen.getByText('A paciente permanece internada e monitorizada.')).toBeInTheDocument();
    expect(screen.getByText('Tempo educacional fictício.')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('tab', { name: 'Como evoluir' }));
    expect(screen.getByText('Treinar a estratificação hemodinâmica.')).toBeVisible();
    fireEvent.click(screen.getByText('Objetivos e referências deste caso'));
    expect(screen.getByText('Estratificar o risco do TEP')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /ASH Guidelines/ })).toHaveAttribute(
      'href',
      'https://doi.org/10.1182/bloodadvances.2020001830',
    );
    fireEvent.click(screen.getByRole('button', { name: 'Por que a conduta teve esse peso?' }));
    await waitFor(() => expect(screen.getByText('Neste cenário, o exame não mudaria a conduta inicial.')).toBeInTheDocument());
  });

  it('reserva o emoji de olhos em X para risco grave explícito', () => {
    const criticalResult = {
      ...result,
      pontuacao_total: 18,
      pontuacao: { exames: 4, hipotese: 0, conduta: 14 },
      nivel_conduta: 'insegura',
      feedback: {
        ...result.feedback,
        reacao_paciente: 'O quadro apresenta deterioração progressiva.',
        desfecho_clinico: 'A paciente permanece em risco de óbito sem intervenção imediata.',
      },
      consequencias: {
        ...result.consequencias,
        estado_paciente: 'deterioracao',
      },
    };

    render(
      <MemoryRouter initialEntries={[{ pathname: '/resultados/43', state: { result: criticalResult } }]}>
        <Routes>
          <Route path="/resultados/:progressoId" element={<ResultadoSimulacaoPage />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByLabelText('Pontuação total: 1,8 de 10')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toHaveTextContent('A conduta oferece risco ao paciente');
    fireEvent.click(screen.getByRole('button', { name: 'Ver impacto' }));
    expect(screen.getByRole('img', { name: 'Estado crítico' })).toHaveTextContent('😵');
    expect(within(screen.getByRole('tabpanel', { name: 'Impacto clínico' })).getByText('IMPACTO CLÍNICO SIMULADO')).toBeInTheDocument();
  });
});
