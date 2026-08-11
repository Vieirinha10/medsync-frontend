import { cleanup, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, describe, expect, it } from 'vitest';
import { InstitutionalPage, LegalPage } from './InstitutionalPage';

describe('InstitutionalPage', () => {
  afterEach(() => cleanup());
  it('apresenta propósito, diferenciais e chamada do MedSync', () => {
    render(<MemoryRouter><InstitutionalPage page="sobre" /></MemoryRouter>);

    expect(screen.getByRole('heading', { name: /Treinar decisões clínicas/ })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Nossa missão' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Conhecer os casos/ })).toHaveAttribute('href', '/casos');
  });

  it('publica os termos com identificação empresarial e finalidade educacional', () => {
    render(<MemoryRouter><LegalPage page="termos" /></MemoryRouter>);

    expect(screen.getByRole('heading', { name: 'Termos de Uso', level: 1 })).toBeInTheDocument();
    expect(screen.getAllByText(/63.108.735\/0001-53/).length).toBeGreaterThan(0);
    expect(screen.getByRole('heading', { name: '3. Finalidade exclusivamente educacional' })).toBeInTheDocument();
    expect(screen.getByText(/não constituem consulta, diagnóstico, prescrição/i)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: '9. Direito de arrependimento e reembolso legal' })).toBeInTheDocument();
    expect(screen.getByText(/7 dias corridos contados da contratação/)).toBeInTheDocument();
  });

  it('explica dados, pagamentos, retenção e direitos na política de privacidade', () => {
    render(<MemoryRouter><LegalPage page="privacidade" /></MemoryRouter>);

    expect(screen.getByRole('heading', { name: 'Política de Privacidade', level: 1 })).toBeInTheDocument();
    expect(screen.getAllByText(/não são armazenados pelo MedSync/).length).toBeGreaterThan(0);
    expect(screen.getByRole('heading', { name: '11. Retenção e eliminação' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: '13. Direitos do titular' })).toBeInTheDocument();
  });
});
