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

    expect(screen.getByRole('status')).toHaveTextContent('A Synapse está avaliando seu raciocínio');
    expect(screen.getAllByText('Organizando o prontuário')).toHaveLength(2);
    expect(screen.getByText(/Caso clínico de teste/)).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(1350);
    });

    expect(screen.getAllByText('Revisando avaliações e exames')).toHaveLength(2);
  });
});
