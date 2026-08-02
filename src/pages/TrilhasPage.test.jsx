import { cleanup, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import TrilhasPage from './TrilhasPage';
import { api } from '../services/api';

vi.mock('../services/api', () => ({
  ApiError: class ApiError extends Error {},
  api: { getLearningPaths: vi.fn() },
}));

const path = {
  id: 'cardiopulmonar-na-pratica',
  titulo: 'Cardiopulmonar na prática',
  subtitulo: 'Integre ritmo, radiografia e raciocínio clínico.',
  descricao: 'Fortaleça a leitura dos principais problemas cardiovasculares e respiratórios.',
  especialidade: 'Cardiologia e Pneumologia',
  nivel: 'Intermediário',
  cor: 'azul',
  duracao_minutos: 48,
  objetivos: ['Interpretar padrões básicos de ECG', 'Reconhecer alterações radiográficas'],
  progresso: {
    concluidas: 1,
    total: 2,
    percentual: 50,
    media_melhores_notas: 100,
  },
  modulos: [
    {
      id: 'ritmo-e-torax',
      titulo: 'Ritmo e tórax',
      descricao: 'Comece pelos padrões visuais mais frequentes.',
      progresso: { concluidas: 1, total: 2 },
      atividades: [
        {
          id: 'cardiopulmonar-fa',
          tipo: 'desafio_visual',
          referencia_id: 'fibrilacao-atrial',
          titulo: 'Fibrilação atrial',
          especialidade: 'Cardiologia',
          minutos: 6,
          progresso: { concluida: true, tentativas: 1, melhor_pontuacao: 100 },
        },
        {
          id: 'cardiopulmonar-tep',
          tipo: 'caso_clinico',
          referencia_id: '8',
          titulo: 'Tromboembolismo pulmonar',
          especialidade: 'Clínica Médica',
          minutos: 30,
          progresso: { concluida: false, tentativas: 0, melhor_pontuacao: 0 },
        },
      ],
    },
  ],
};

const renderPathRoute = (initialEntry) => render(
  <MemoryRouter initialEntries={[initialEntry]}>
    <Routes>
      <Route path="/trilhas" element={<TrilhasPage />} />
      <Route path="/trilhas/:trilhaId" element={<TrilhasPage />} />
    </Routes>
  </MemoryRouter>,
);

describe('TrilhasPage', () => {
  beforeEach(() => api.getLearningPaths.mockResolvedValue([path]));
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it('apresenta o catálogo com progresso e próxima atividade', async () => {
    renderPathRoute('/trilhas');

    expect(await screen.findByRole('heading', { name: 'Cardiopulmonar na prática' })).toBeInTheDocument();
    expect(screen.getByText('1 de 2 atividades')).toBeInTheDocument();
    expect(screen.getByText('Próxima: Tromboembolismo pulmonar')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Continuar trilha/ })).toHaveAttribute(
      'href',
      '/trilhas/cardiopulmonar-na-pratica',
    );
  });

  it('mostra módulos, melhores notas e links com contexto da trilha', async () => {
    renderPathRoute('/trilhas/cardiopulmonar-na-pratica');

    expect(await screen.findByRole('heading', { name: 'Ritmo e tórax' })).toBeInTheDocument();
    expect(screen.getByText('100', { selector: '.learning-activity-score strong' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Continuar agora/ })).toHaveAttribute(
      'href',
      '/casos/8?trilha=cardiopulmonar-na-pratica&atividade=cardiopulmonar-tep',
    );
    expect(screen.getByRole('link', { name: /Refazer/ })).toHaveAttribute(
      'href',
      '/desafios?trilha=cardiopulmonar-na-pratica&atividade=cardiopulmonar-fa&desafio=fibrilacao-atrial',
    );
  });
});
