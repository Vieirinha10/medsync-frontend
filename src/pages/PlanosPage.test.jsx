import { cleanup, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, describe, expect, it } from 'vitest';
import PlanosPage from './PlanosPage';

describe('PlanosPage', () => {
  afterEach(() => cleanup());

  it('apresenta o valor e os benefícios previstos do Premium', () => {
    render(<MemoryRouter><PlanosPage /></MemoryRouter>);

    expect(screen.getByRole('heading', { name: /Mais prática clínica/ })).toBeInTheDocument();
    expect(screen.getByText('R$ 19,90')).toBeInTheDocument();
    expect(screen.getByText('Biblioteca completa de casos clínicos')).toBeInTheDocument();
    expect(screen.getByText('Feedback completo sobre exames, hipótese e conduta')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Veja o que muda com o Premium' })).toBeInTheDocument();
  });

  it('informa com transparência que a assinatura ainda não está ativa', () => {
    render(<MemoryRouter><PlanosPage /></MemoryRouter>);

    expect(screen.getAllByText(/Premium em preparação/).length).toBeGreaterThan(0);
    expect(screen.getByText('Nenhuma cobrança é realizada agora.')).toBeInTheDocument();
    expect(screen.getByText(/A Synapse continua em desenvolvimento/)).toBeInTheDocument();
  });

  it('direciona as chamadas de cadastro para a conta gratuita', () => {
    render(<MemoryRouter><PlanosPage /></MemoryRouter>);

    const registrationLinks = screen.getAllByRole('link').filter((link) => link.getAttribute('href') === '/cadastro');
    expect(registrationLinks).toHaveLength(4);
  });
});
