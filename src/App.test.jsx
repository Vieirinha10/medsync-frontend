import { cleanup, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import App from './App';

describe('App', () => {
  beforeEach(() => {
    window.scrollTo = vi.fn();
  });

  afterEach(() => cleanup());

  it('carrega uma página interna sob demanda', async () => {
    render(<MemoryRouter initialEntries={['/assinatura']}><App /></MemoryRouter>);

    expect(await screen.findByRole('heading', { name: /Mais prática clínica/ })).toBeInTheDocument();
    expect(screen.getByText('R$ 25,90')).toBeInTheDocument();
  });

  it('carrega corretamente uma exportação nomeada sob demanda', async () => {
    render(<MemoryRouter initialEntries={['/termos']}><App /></MemoryRouter>);

    expect(await screen.findByRole('heading', { name: 'Termos de Uso', level: 1 })).toBeInTheDocument();
  });
});
