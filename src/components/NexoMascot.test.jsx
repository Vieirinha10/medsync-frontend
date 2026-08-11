import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import NexoMascot from './NexoMascot';

describe('NexoMascot', () => {
  it('usa a animação correspondente ao estado da plataforma', () => {
    render(<NexoMascot state="celebrating" message="Mandou bem!" />);

    expect(screen.getByRole('img', { name: /Nexo comemorando/ })).toHaveAttribute(
      'src',
      '/nexo/jumping.gif',
    );
    expect(screen.getByText('Mandou bem!')).toBeInTheDocument();
  });

  it('volta ao estado neutro quando recebe um estado desconhecido', () => {
    render(<NexoMascot state="desconhecido" />);

    expect(screen.getByRole('img', { name: /Nexo aguardando/ })).toHaveAttribute(
      'src',
      '/nexo/idle.gif',
    );
  });
});
