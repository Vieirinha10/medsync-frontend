import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import DesafiosPage from './DesafiosPage';
import { api } from '../services/api';

describe('DesafiosPage', () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.spyOn(api, 'getDynamicChallenges').mockResolvedValue([]);
    vi.spyOn(api, 'answerVisualChallenge').mockImplementation(async (challengeId, optionId) => {
      const corrections = {
        'desafio-visual-001': {
          alternativa_correta_id: 'pneumotorax',
          diagnostico_correto: 'Pneumotórax hipertensivo à esquerda',
          explicacao: 'A ausência de trama vascular periférica e o desvio do mediastino sustentam o diagnóstico.',
          achados_chave: ['Ausência de trama vascular periférica'],
        },
        'desafio-visual-002': {
          alternativa_correta_id: 'fibrilacao',
          diagnostico_correto: 'Fibrilação atrial',
          explicacao: 'O ritmo é irregularmente irregular e não apresenta ondas P organizadas.',
          achados_chave: ['Intervalos RR irregulares'],
        },
      };
      const correction = corrections[challengeId];
      return {
        ...correction,
        correta: optionId === correction.alternativa_correta_id,
        fonte_credito: 'MedSync',
        fonte_licenca: 'Uso educacional',
        fonte_url: 'https://example.com/source',
      };
    });
    vi.spyOn(api, 'recordVisualChallengeAttempt').mockResolvedValue(null);
  });
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
    window.history.pushState({}, '', '/desafios');
  });

  it('corrige a alternativa, explica o diagnóstico e preserva a resposta ao voltar', async () => {
    render(<DesafiosPage />);

    expect(screen.getByText('Qual é o diagnóstico mais provável nesta radiografia?')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /^A\s*Pneumonia lobar$/ }));

    expect(await screen.findByText('Ainda não. Observe os achados-chave')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Pneumotórax hipertensivo à esquerda' })).toBeInTheDocument();
    expect(screen.getByText(/ausência de trama vascular periférica/)).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Próximo desafio' }));
    expect(screen.getByText('Qual ritmo está representado neste eletrocardiograma?')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Desafio anterior' }));
    expect(screen.getByText('Ainda não. Observe os achados-chave')).toBeInTheDocument();
  });

  it('favorita um desafio e mantém a lista salva entre renderizações', () => {
    render(<DesafiosPage />);

    fireEvent.click(screen.getByRole('button', { name: 'Salvar desafio 1 para estudar depois' }));
    expect(screen.getByRole('button', { name: 'Remover desafio 1 dos favoritos' })).toBeInTheDocument();
    expect(screen.getByText('Radiografia de tórax · Radiologia · Intermediário')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Desafio visual #01/ })).not.toHaveTextContent('Pneumotórax hipertensivo');

    cleanup();
    render(<DesafiosPage />);

    expect(screen.getByRole('button', { name: 'Remover desafio 1 dos favoritos' })).toBeInTheDocument();
  });

  it('filtra desafios por dificuldade, especialidade e favoritos', () => {
    render(<DesafiosPage />);

    fireEvent.click(screen.getByRole('button', { name: 'Avançado' }));
    expect(screen.getByText('Qual diagnóstico deve ser priorizado diante desta lesão pigmentada?')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Todas' }));
    fireEvent.change(screen.getByLabelText('CONTEÚDO OU ESPECIALIDADE'), { target: { value: 'Urologia' } });
    expect(screen.getByText('Qual achado explica melhor a obstrução observada nesta tomografia?')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /Somente favoritos/ }));
    expect(screen.getByRole('heading', { name: 'Nenhum desafio encontrado' })).toBeInTheDocument();
  });

  it('salva automaticamente uma resposta incorreta no Caderno de Erros', async () => {
    api.recordVisualChallengeAttempt.mockResolvedValue({
      id: 1,
      status: 'pendente',
    });
    render(<DesafiosPage />);

    fireEvent.click(screen.getByRole('button', { name: /^A\s*Pneumonia lobar$/ }));

    await waitFor(() => expect(api.recordVisualChallengeAttempt).toHaveBeenCalledWith(expect.objectContaining({
      desafio_id: 'desafio-visual-001',
      resposta_usuario: 'Pneumonia lobar',
      resposta_correta: 'Pneumotórax hipertensivo à esquerda',
    })));
    expect(screen.getByText(/Erro salvo automaticamente/)).toBeInTheDocument();
  });

  it('abre o desafio indicado e registra a conclusão da atividade da trilha', async () => {
    window.history.pushState(
      {},
      '',
      '/desafios?desafio=desafio-visual-002&trilha=cardiopulmonar-na-pratica&atividade=cardiopulmonar-fa',
    );
    const completeActivity = vi.spyOn(api, 'completeLearningPathActivity').mockResolvedValue({});

    render(<DesafiosPage />);
    expect(screen.getByText('Qual ritmo está representado neste eletrocardiograma?')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /^C\s*Fibrilação atrial$/ }));
    await waitFor(() => expect(completeActivity).toHaveBeenCalledWith(
      'cardiopulmonar-na-pratica',
      'cardiopulmonar-fa',
      100,
    ));
    expect(screen.getByText(/progresso da trilha atualizado/i)).toBeInTheDocument();
  });
});
