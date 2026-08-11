import { cleanup, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';
import CheckoutPage from './CheckoutPage';

vi.mock('../services/api', () => ({
  api: { createPaymentCheckout: vi.fn() },
}));

const renderCheckout = (plan = 'avulso') => render(
  <MemoryRouter initialEntries={[`/checkout/${plan}`]}>
    <Routes><Route path="/checkout/:planId" element={<CheckoutPage />} /></Routes>
  </MemoryRouter>,
);

describe('CheckoutPage', () => {
  afterEach(() => cleanup());

  it('resume o plano Pix sem coletar dados financeiros', () => {
    renderCheckout('avulso');
    expect(screen.getByRole('heading', { name: /um passo de liberar o Premium/ })).toBeInTheDocument();
    expect(screen.getAllByText('Mensal avulso')).toHaveLength(2);
    expect(screen.getByText('Pix à vista')).toBeInTheDocument();
    expect(screen.getByText('R$ 25,90')).toBeInTheDocument();
    expect(screen.getByText(/não recebe nem armazena o número do seu cartão/)).toBeInTheDocument();
  });

  it('mostra o parcelamento do plano trimestral', () => {
    renderCheckout('trimestral');
    expect(screen.getByText('3x de R$ 21,97')).toBeInTheDocument();
    expect(screen.getByText('ou R$ 65,90 à vista no cartão')).toBeInTheDocument();
  });
});
