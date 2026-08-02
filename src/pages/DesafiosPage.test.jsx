import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import DesafiosPage from './DesafiosPage';

describe('DesafiosPage', () => {
  it('corrige a alternativa, explica o diagnóstico e preserva a resposta ao voltar', () => {
    render(<DesafiosPage />);

    expect(screen.getByText('Qual é o diagnóstico mais provável nesta radiografia?')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /Pneumonia lobar/ }));

    expect(screen.getByText('Ainda não. Observe os achados-chave')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Pneumotórax hipertensivo à esquerda' })).toBeInTheDocument();
    expect(screen.getByText(/ausência de trama vascular periférica/)).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Próximo desafio' }));
    expect(screen.getByText('Qual ritmo está representado neste eletrocardiograma?')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Desafio anterior' }));
    expect(screen.getByText('Ainda não. Observe os achados-chave')).toBeInTheDocument();
  });
});
