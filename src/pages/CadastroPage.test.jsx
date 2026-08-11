import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import CadastroPage from './CadastroPage';
import { api } from '../services/api';

const navigate = vi.fn();

vi.mock('../services/api', () => ({
  api: { registerUser: vi.fn() },
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => navigate };
});

describe('CadastroPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    api.registerUser.mockResolvedValue({ id: 1 });
  });

  it('envia o período e a faculdade junto aos dados da nova conta', async () => {
    render(<MemoryRouter><CadastroPage /></MemoryRouter>);

    fireEvent.change(screen.getByLabelText('Nome Completo'), { target: { value: 'Gustavo Vieira' } });
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'gustavo@example.com' } });
    fireEvent.change(screen.getByLabelText('Período do curso'), { target: { value: '6' } });
    fireEvent.change(screen.getByLabelText('Faculdade'), { target: { value: 'UFMA' } });
    fireEvent.change(screen.getByLabelText('Senha'), { target: { value: 'senha-segura' } });
    fireEvent.click(screen.getByRole('checkbox', { name: /Li e aceito/ }));
    fireEvent.click(screen.getByRole('button', { name: 'Criar minha conta' }));

    await waitFor(() => expect(api.registerUser).toHaveBeenCalledWith({
      nome: 'Gustavo Vieira',
      email: 'gustavo@example.com',
      periodo_curso: 6,
      faculdade: 'UFMA',
      password: 'senha-segura',
      aceite_termos: true,
    }));
    expect(navigate).toHaveBeenCalledWith('/login', expect.objectContaining({ replace: true }));
  });
});
