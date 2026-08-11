import { cleanup, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';
import CheckoutPage from './CheckoutPage';

vi.mock('../services/api', () => ({
  api: {
    createTransparentPayment: vi.fn(),
    getCurrentUser: vi.fn().mockResolvedValue({ nome: 'Aluno MedSync', email: 'aluno@medsync.com' }),
    getPaymentStatus: vi.fn(),
  },
}));

const renderCheckout = (plan = 'avulso') => render(
  <MemoryRouter initialEntries={[`/checkout/${plan}`]}>
    <Routes><Route path="/checkout/:planId" element={<CheckoutPage />} /></Routes>
  </MemoryRouter>,
);

describe('CheckoutPage', () => {
  afterEach(() => cleanup());

  it('mostra o checkout Pix inteiramente dentro do MedSync', () => {
    renderCheckout('avulso');
    expect(screen.getByRole('heading', { name: /Resumo do pedido/ })).toBeInTheDocument();
    expect(screen.getByText('Pix à vista')).toBeInTheDocument();
    expect(screen.getAllByText('R$ 25,90')).toHaveLength(2);
    expect(screen.getByRole('button', { name: /Gerar QR Code Pix/ })).toBeInTheDocument();
    expect(screen.queryByText(/Continuar para pagamento/)).not.toBeInTheDocument();
  });

  it('coleta cartão e oferece parcelamento no plano trimestral', () => {
    renderCheckout('trimestral');
    expect(screen.getByLabelText('Número do cartão')).toBeInTheDocument();
    expect(screen.getByLabelText('Parcelas')).toBeInTheDocument();
    expect(screen.getByRole('option', { name: '3x de R$ 21,97' })).toBeInTheDocument();
    expect(screen.getByText(/não armazena número do cartão nem CVV/)).toBeInTheDocument();
  });
});
