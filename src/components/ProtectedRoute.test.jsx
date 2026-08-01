import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it } from 'vitest';
import ProtectedRoute from './ProtectedRoute';

describe('ProtectedRoute', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('redireciona visitantes sem token para o login', () => {
    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <Routes>
          <Route path="/login" element={<p>Página de login</p>} />
          <Route
            path="/dashboard"
            element={<ProtectedRoute><p>Painel privado</p></ProtectedRoute>}
          />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText('Página de login')).toBeInTheDocument();
    expect(screen.queryByText('Painel privado')).not.toBeInTheDocument();
  });

  it('renderiza o conteúdo protegido quando existe token', () => {
    localStorage.setItem('authToken', 'token-valido');
    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <Routes>
          <Route
            path="/dashboard"
            element={<ProtectedRoute><p>Painel privado</p></ProtectedRoute>}
          />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText('Painel privado')).toBeInTheDocument();
  });
});
