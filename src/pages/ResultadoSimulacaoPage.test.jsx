import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import ResultadoSimulacaoPage from './ResultadoSimulacaoPage';

vi.mock('../services/api', () => ({
  api: {
    getSimulationResult: vi.fn(),
    completeLearningPathActivity: vi.fn(),
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
    acertos: ['A hipótese foi bem sustentada.'],
    pontos_melhoria: ['Explicite os critérios de reavaliação.'],
    feedback_hipotese: 'Hipótese compatível com o caso.',
    feedback_conduta: 'Conduta adequada, com oportunidade de detalhar monitorização.',
    feedback_seguranca: 'Mantenha vigilância hemodinâmica.',
    reacao_paciente: 'A tendência é melhora progressiva da hipoxemia.',
    desfecho_clinico: 'A paciente permanece internada e monitorizada.',
    recomendacoes_estudo: ['Estratificação de risco no TEP'],
  },
  fonte_feedback: 'openai',
  nivel_conduta: 'adequada',
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
  it('expõe o diagnóstico, o feedback Synapse e a evolução simulada do paciente', () => {
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
    expect(screen.getByRole('link', { name: /ASH Guidelines/ })).toHaveAttribute(
      'href',
      'https://doi.org/10.1182/bloodadvances.2020001830',
    );
  });
});
