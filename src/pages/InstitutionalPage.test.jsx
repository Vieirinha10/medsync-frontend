import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { InstitutionalPage, LegalPage } from './InstitutionalPage';

describe('InstitutionalPage', () => {
  it('apresenta propósito, diferenciais e chamada do MedSync', () => {
    render(<MemoryRouter><InstitutionalPage page="sobre" /></MemoryRouter>);

    expect(screen.getByRole('heading', { name: /Treinar decisões clínicas/ })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Nossa missão' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Conhecer os casos/ })).toHaveAttribute('href', '/casos');
  });

  it('publica os termos com identificação empresarial e finalidade educacional', () => {
    render(<MemoryRouter><LegalPage page="termos" /></MemoryRouter>);

    expect(screen.getByRole('heading', { name: 'Termos de Uso', level: 1 })).toBeInTheDocument();
    expect(screen.getByText(/63.108.735\/0001-53/)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: '2. Finalidade educacional' })).toBeInTheDocument();
    expect(screen.getByText(/não constitui consulta, diagnóstico, prescrição/)).toBeInTheDocument();
  });
});
