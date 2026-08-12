import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
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
  it('expõe o diagnóstico, as consequências e permite aprofundar com a Synapse', async () => {
    render(
      <MemoryRouter initialEntries={[{ pathname: '/resultados/42', state: { result } }]}>
        <Routes>
          <Route path="/resultados/:progressoId" element={<ResultadoSimulacaoPage />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText('Tromboembolismo pulmonar agudo')).toBeInTheDocument();
    expect(screen.getByText('Synapse · feedback personalizado por IA')).toBeInTheDocument();
    expect(screen.getByText('A tendência é melhora progressiva da hipoxemia.')).toBeInTheDocument();
    expect(screen.getByText('A paciente permanece internada e monitorizada.')).toBeInTheDocument();
    expect(screen.getByLabelText('Pontuação total: 86 de 100')).toBeInTheDocument();
    expect(screen.getByText('Conduta adequada')).toBeInTheDocument();
    expect(screen.getByText('Estratificar o risco do TEP')).toBeInTheDocument();
    expect(screen.getByText('A conduta estabilizou o paciente')).toBeInTheDocument();
    expect(screen.getByText('Justificativa alinhada à rubrica.')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /ASH Guidelines/ })).toHaveAttribute(
      'href',
      'https://doi.org/10.1182/bloodadvances.2020001830',
    );
    fireEvent.click(screen.getByRole('button', { name: 'Por que este exame era desnecessário?' }));
    await waitFor(() => expect(screen.getByText('Neste cenário, o exame não mudaria a conduta inicial.')).toBeInTheDocument());
  });
});
