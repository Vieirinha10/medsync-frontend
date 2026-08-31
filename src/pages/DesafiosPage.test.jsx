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
    expect(screen.getByRole('button', { name: /^A\s*Pneumonia lobar$/ })).toHaveClass('is-incorrect');
    expect(screen.getByRole('button', {
      name: /^C\s*Pneumotórax hipertensivo à esquerda$/,
    })).toHaveClass('is-correct');

    fireEvent.click(screen.getByRole('button', { name: 'Próximo desafio' }));
    expect(screen.getByText('Qual ritmo está representado neste eletrocardiograma?')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Desafio anterior' }));
    expect(screen.getByText('Ainda não. Observe os achados-chave')).toBeInTheDocument();
  });

  it('identifica o exame e explica sua finalidade sem exibir favoritos', () => {
    render(<DesafiosPage />);

    expect(screen.getByRole('button', {
      name: 'Radiografia de tórax: saiba para que serve este exame',
    })).toBeInTheDocument();
    expect(screen.getByRole('tooltip')).toHaveTextContent('Para que serve este exame?');
    expect(screen.getByRole('tooltip')).toHaveTextContent('Avalia pulmões, pleuras, mediastino e silhueta cardíaca');
    expect(screen.queryByText(/favorit/i)).not.toBeInTheDocument();
  });

  it('filtra desafios por dificuldade, especialidade e tipo de exame', () => {
    render(<DesafiosPage />);

    fireEvent.click(screen.getByRole('button', { name: 'Avançado' }));
    expect(screen.getByText('Qual diagnóstico deve ser priorizado diante desta lesão pigmentada?')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Todas' }));
    fireEvent.change(screen.getByLabelText('ESPECIALIDADE'), { target: { value: 'Urologia' } });
    expect(screen.getByText('Qual achado explica melhor a obstrução observada nesta tomografia?')).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText('ESPECIALIDADE'), { target: { value: 'Todas' } });
    fireEvent.change(screen.getByLabelText('TIPO DE EXAME'), { target: { value: 'Esfregaço periférico' } });
    expect(screen.getByText('Qual diagnóstico é sugerido pela morfologia das hemácias?')).toBeInTheDocument();
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
      titulo: 'Radiografia de tórax',
      resposta_usuario: 'Pneumonia lobar',
      resposta_correta: 'Pneumotórax hipertensivo à esquerda',
    })));
    expect(screen.getByText(/Erro salvo automaticamente/)).toBeInTheDocument();
  });

  it('mantém o aviso do Caderno de Erros apenas no desafio respondido', async () => {
    let finishRecording;
    api.recordVisualChallengeAttempt.mockReturnValue(new Promise((resolve) => {
      finishRecording = resolve;
    }));
    render(<DesafiosPage />);

    fireEvent.click(screen.getByRole('button', { name: /^A\s*Pneumonia lobar$/ }));
    await screen.findByText('Ainda não. Observe os achados-chave');
    fireEvent.click(screen.getByRole('button', { name: 'Próximo desafio' }));

    finishRecording({ id: 1, status: 'pendente' });
    fireEvent.click(screen.getByRole('button', { name: 'Desafio anterior' }));
    expect(await screen.findByText(/Erro salvo automaticamente/)).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Próximo desafio' }));
    expect(screen.queryByText(/Erro salvo automaticamente/)).not.toBeInTheDocument();
  });

  it('resume a navegação numérica em uma janela organizada', () => {
    render(<DesafiosPage />);

    const numberedButtons = screen.getAllByRole('button', { name: /Ir para o desafio/i });
    expect(numberedButtons).toHaveLength(9);
    expect(screen.getByRole('button', { name: /Ir para o desafio 150:/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Ir para o desafio 50:/i })).not.toBeInTheDocument();
    expect(screen.getByText('1 de 150')).toBeInTheDocument();
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
