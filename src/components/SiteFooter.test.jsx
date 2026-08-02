import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import SiteFooter from './SiteFooter';

describe('SiteFooter', () => {
  it('exibe redes oficiais, navegação institucional e identificação da empresa', () => {
    render(<MemoryRouter><SiteFooter /></MemoryRouter>);

    expect(screen.getByRole('link', { name: 'Instagram do MedSync' })).toHaveAttribute(
      'href',
      'https://www.instagram.com/medsync.educacional/',
    );
    expect(screen.getByRole('link', { name: 'TikTok do MedSync' })).toHaveAttribute(
      'href',
      'https://www.tiktok.com/@medsync.edu?is_from_webapp=1&sender_device=pc',
    );
    expect(screen.getByLabelText('WhatsApp do MedSync em breve')).toHaveAttribute('aria-disabled', 'true');
    expect(screen.getByRole('link', { name: 'Sobre o MedSync' })).toHaveAttribute('href', '/sobre');
    expect(screen.getByRole('link', { name: 'Termos de Uso' })).toHaveAttribute('href', '/termos');
    expect(screen.getByRole('link', { name: 'Política de Privacidade' })).toHaveAttribute('href', '/privacidade');
    expect(screen.getByText(/CNPJ 63.108.735\/0001-53/)).toBeInTheDocument();
  });
});
