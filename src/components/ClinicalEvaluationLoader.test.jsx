import { act, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import ClinicalEvaluationLoader from './ClinicalEvaluationLoader';

describe('ClinicalEvaluationLoader', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('apresenta e avança as etapas da avaliação clínica', () => {
    vi.useFakeTimers();
    render(<ClinicalEvaluationLoader caseTitle="Caso clínico de teste" />);

    expect(screen.getByRole('status')).toHaveTextContent('Construindo seu feedback');
    expect(screen.getAllByText('Organizando os dados clínicos')).toHaveLength(2);
    expect(screen.getByText(/Caso clínico de teste/)).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(1350);
    });

    expect(screen.getAllByText('Revisando os exames solicitados')).toHaveLength(2);
  });
});
