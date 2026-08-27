import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { api } from '../services/api';
import SimulacaoCaso from './SimulacaoCaso';

vi.mock('../services/api', () => ({
  api: {
    getCase: vi.fn(),
    finalizeSimulation: vi.fn(),
  },
  ApiError: class ApiError extends Error {
    constructor(message, status) {
      super(message);
      this.status = status;
    }
  },
}));

const clinicalCase = {
  id: 8,
  titulo: 'Dor torácica de início súbito',
  especialidade: 'Cardiologia',
  historia_clinica: 'Paciente com dor torácica intensa iniciada há duas horas.',
  exame_fisico: 'Taquicárdico, pressão arterial de 150 por 90 mmHg.',
  sinais_vitais: [
    { id: 'pa', nome: 'Pressão arterial', valor: '150/90', unidade: 'mmHg', status: 'alterado', referencia: '< 130/85 mmHg' },
    { id: 'fc', nome: 'Frequência cardíaca', valor: null, unidade: 'bpm', status: 'nao_informado', referencia: '60–100 bpm' },
  ],
  avaliacao_2_disponivel: true,
  exames_disponiveis: [
    { id: 1, nome: 'Eletrocardiograma', resultado: 'Supradesnivelamento de ST em parede inferior.' },
    { id: 2, nome: 'Troponina', resultado: 'Elevada.' },
  ],
};

describe('SimulacaoCaso', () => {
  beforeEach(() => {
    window.scrollTo = vi.fn();
    api.getCase.mockResolvedValue(clinicalCase);
    api.finalizeSimulation.mockResolvedValue({ progresso_id: 42 });
  });

  it('conduz o usuário pelas quatro etapas e envia o raciocínio preenchido', async () => {
    render(
      <MemoryRouter initialEntries={['/casos/8']}>
        <Routes>
          <Route path="/casos/:casoId" element={<SimulacaoCaso />} />
          <Route path="/resultados/:progressoId" element={<div>Resultado carregado</div>} />
        </Routes>
      </MemoryRouter>,
    );

    expect(await screen.findByRole('heading', { name: 'Dor torácica de início súbito' })).toBeInTheDocument();
    expect(screen.getByText('150/90')).toBeInTheDocument();
    expect(screen.queryByRole('checkbox', { name: 'Troponina' })).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /Iniciar investigação/ }));

    fireEvent.click(screen.getByRole('checkbox', { name: 'Troponina' }));
    fireEvent.change(screen.getByRole('textbox', { name: 'Justificativa para Troponina' }), {
      target: { value: 'Confirmar lesão miocárdica e orientar a estratégia.' },
    });

    fireEvent.click(screen.getByRole('button', { name: /Solicitar exames selecionados/ }));
    expect(screen.getByText('Elevada.')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /Avançar para hipótese/ }));
    fireEvent.change(screen.getByRole('textbox', { name: 'Qual é a sua principal hipótese?' }), {
      target: { value: 'Síndrome coronariana aguda com supradesnivelamento de ST.' },
    });

    fireEvent.click(screen.getByRole('button', { name: /Avançar para conduta/ }));
    fireEvent.change(screen.getByRole('textbox', { name: 'Qual será sua conduta inicial?' }), {
      target: { value: 'Monitorização, antiagregação e estratégia imediata de reperfusão.' },
    });

    expect(screen.getByLabelText('Etapa 4 de 4')).toBeInTheDocument();
    expect(screen.getByText('O que você já sabe')).toBeInTheDocument();
    expect(screen.getByText('Sua hipótese')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Enviar para a Synapse/ }));

    await waitFor(() => {
      expect(api.finalizeSimulation).toHaveBeenCalledWith(
        8,
        {
          exames_solicitados: ['2'],
          justificativas_exames: { 2: 'Confirmar lesão miocárdica e orientar a estratégia.' },
          hipotese_diagnostica: 'Síndrome coronariana aguda com supradesnivelamento de ST.',
          conduta_proposta: 'Monitorização, antiagregação e estratégia imediata de reperfusão.',
        },
        expect.any(String),
      );
    });
    expect(await screen.findByText('Resultado carregado')).toBeInTheDocument();
  });

  it('apresenta um convite Premium em vez de erro técnico para conta gratuita', async () => {
    const { ApiError } = await import('../services/api');
    api.getCase.mockRejectedValueOnce(
      new ApiError('Este conteúdo requer uma assinatura Premium ativa.', 403),
    );

    render(
      <MemoryRouter initialEntries={['/casos/8']}>
        <Routes>
          <Route path="/casos/:casoId" element={<SimulacaoCaso />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(await screen.findByRole('heading', {
      name: 'Este caso faz parte da experiência completa',
    })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Ver planos Premium/ })).toHaveAttribute(
      'href',
      '/assinatura',
    );
    expect(screen.getByRole('link', { name: /Voltar aos casos/ })).toHaveAttribute(
      'href',
      '/casos',
    );
    expect(screen.queryByText(/Erro:/)).not.toBeInTheDocument();
  });
});
