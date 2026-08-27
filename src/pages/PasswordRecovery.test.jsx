import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import LoginPage from './LoginPage';
import RecuperarSenhaPage from './RecuperarSenhaPage';
import RedefinirSenhaPage from './RedefinirSenhaPage';
import { api } from '../services/api';

vi.mock('../services/api', () => ({
  api: {
    login: vi.fn(),
    requestPasswordRecovery: vi.fn(),
    resetPassword: vi.fn(),
  },
  clearAuthToken: vi.fn(),
  setAuthToken: vi.fn(),
}));

describe('recuperação de senha', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('exibe o acesso de recuperação no login', () => {
    render(<MemoryRouter><LoginPage /></MemoryRouter>);
    expect(screen.getByRole('link', { name: 'Esqueci minha senha' })).toHaveAttribute(
      'href',
      '/recuperar-senha',
    );
  });

  it('solicita o link sem revelar se a conta existe', async () => {
    api.requestPasswordRecovery.mockResolvedValue({
      message: 'Se houver uma conta para este e-mail, enviaremos as instruções de recuperação.',
    });
    render(<MemoryRouter><RecuperarSenhaPage /></MemoryRouter>);

    fireEvent.change(screen.getByLabelText('E-mail'), {
      target: { value: 'aluno@example.com' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Enviar link de recuperação' }));

    await waitFor(() => {
      expect(api.requestPasswordRecovery).toHaveBeenCalledWith('aluno@example.com');
    });
    expect(screen.getByRole('status')).toHaveTextContent('Se houver uma conta');
  });

  it('redefine a senha apenas quando a confirmação coincide', async () => {
    api.resetPassword.mockResolvedValue({ message: 'Senha redefinida com segurança.' });
    render(
      <MemoryRouter initialEntries={['/redefinir-senha?token=token-seguro']}>
        <RedefinirSenhaPage />
      </MemoryRouter>,
    );

    fireEvent.change(screen.getByLabelText('Nova senha'), {
      target: { value: 'nova-senha-segura' },
    });
    fireEvent.change(screen.getByLabelText('Confirme a nova senha'), {
      target: { value: 'nova-senha-segura' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Salvar nova senha' }));

    await waitFor(() => {
      expect(api.resetPassword).toHaveBeenCalledWith('token-seguro', 'nova-senha-segura');
    });
    expect(screen.getByRole('link', { name: 'Entrar na MedSync' })).toHaveAttribute(
      'href',
      '/login',
    );
  });

  it('recusa um link sem token', () => {
    render(<MemoryRouter><RedefinirSenhaPage /></MemoryRouter>);
    expect(screen.getByRole('alert')).toHaveTextContent('inválido ou está incompleto');
    expect(screen.getByRole('button', { name: 'Salvar nova senha' })).toBeDisabled();
  });
});
