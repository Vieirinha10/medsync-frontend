import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import VerificarEmailPage from './VerificarEmailPage';
import { api } from '../services/api';

vi.mock('../services/api', () => ({
  api: {
    verifyEmail: vi.fn(),
    resendEmailVerification: vi.fn(),
  },
}));

describe('VerificarEmailPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('confirma automaticamente o token recebido no link', async () => {
    api.verifyEmail.mockResolvedValue({ message: 'Conta confirmada.' });

    render(
      <MemoryRouter initialEntries={['/verificar-email?token=token-seguro']}>
        <VerificarEmailPage />
      </MemoryRouter>,
    );

    await waitFor(() => expect(api.verifyEmail).toHaveBeenCalledWith('token-seguro'));
    expect(await screen.findByText('Conta confirmada.')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Entrar na MedSync' })).toHaveAttribute('href', '/login');
  });

  it('permite reenviar a confirmação sem expor a existência da conta', async () => {
    api.resendEmailVerification.mockResolvedValue({
      message: 'Se houver uma conta pendente, enviaremos uma confirmação.',
    });

    render(
      <MemoryRouter initialEntries={[{
        pathname: '/verificar-email',
        state: { email: 'aluno@example.com' },
      }]}
      >
        <VerificarEmailPage />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Reenviar confirmação' }));

    await waitFor(() => expect(api.resendEmailVerification).toHaveBeenCalledWith('aluno@example.com'));
    expect(screen.getByText(/Se houver uma conta pendente/)).toBeInTheDocument();
  });
});
