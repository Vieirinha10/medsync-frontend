import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import DesafiosPage from './DesafiosPage';
import { api } from '../services/api';

describe('DesafiosPage', () => {
  beforeEach(() => window.localStorage.clear());
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
    window.history.pushState({}, '', '/desafios');
  });

  it('corrige a alternativa, explica o diagnóstico e preserva a resposta ao voltar', () => {
    render(<DesafiosPage />);

    expect(screen.getByText('Qual é o diagnóstico mais provável nesta radiografia?')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /^A\s*Pneumonia lobar$/ }));

    expect(screen.getByText('Ainda não. Observe os achados-chave')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Pneumotórax hipertensivo à esquerda' })).toBeInTheDocument();
    expect(screen.getByText(/ausência de trama vascular periférica/)).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Próximo desafio' }));
    expect(screen.getByText('Qual ritmo está representado neste eletrocardiograma?')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Desafio anterior' }));
    expect(screen.getByText('Ainda não. Observe os achados-chave')).toBeInTheDocument();
  });

  it('favorita um desafio e mantém a lista salva entre renderizações', () => {
    render(<DesafiosPage />);

    fireEvent.click(screen.getByRole('button', { name: 'Favoritar Pneumotórax hipertensivo à esquerda' }));
    expect(screen.getByRole('button', { name: 'Remover Pneumotórax hipertensivo à esquerda dos favoritos' })).toBeInTheDocument();
    expect(screen.getByText('Radiologia · Intermediário')).toBeInTheDocument();

    cleanup();
    render(<DesafiosPage />);

    expect(screen.getByRole('button', { name: 'Remover Pneumotórax hipertensivo à esquerda dos favoritos' })).toBeInTheDocument();
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
    const recordAttempt = vi.spyOn(api, 'recordVisualChallengeAttempt').mockResolvedValue({
      id: 1,
      status: 'pendente',
    });
    render(<DesafiosPage />);

    fireEvent.click(screen.getByRole('button', { name: /^A\s*Pneumonia lobar$/ }));

    await waitFor(() => expect(recordAttempt).toHaveBeenCalledWith(expect.objectContaining({
      desafio_id: 'pneumotorax-hipertensivo',
      resposta_usuario: 'Pneumonia lobar',
      resposta_correta: 'Pneumotórax hipertensivo à esquerda',
    })));
    expect(screen.getByText(/Erro salvo automaticamente/)).toBeInTheDocument();
  });

  it('abre o desafio indicado e registra a conclusão da atividade da trilha', async () => {
    window.history.pushState(
      {},
      '',
      '/desafios?desafio=fibrilacao-atrial&trilha=cardiopulmonar-na-pratica&atividade=cardiopulmonar-fa',
    );
    vi.spyOn(api, 'recordVisualChallengeAttempt').mockResolvedValue(null);
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
