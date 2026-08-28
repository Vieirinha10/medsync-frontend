import { describe, expect, it } from 'vitest';
import { getResponsiveFrequencyScale } from './chromaticWavesUtils';

describe('getResponsiveFrequencyScale', () => {
  it('preserva exatamente a frequência original em telas móveis', () => {
    expect(getResponsiveFrequencyScale(390, 766)).toBe(1);
    expect(getResponsiveFrequencyScale(759, 900)).toBe(1);
  });

  it('aumenta progressivamente a frequência somente em telas largas', () => {
    expect(getResponsiveFrequencyScale(1024, 768)).toBeGreaterThan(1);
    expect(getResponsiveFrequencyScale(1440, 900)).toBeGreaterThan(
      getResponsiveFrequencyScale(1024, 768),
    );
  });

  it('limita o aumento para evitar uma malha excessivamente carregada', () => {
    expect(getResponsiveFrequencyScale(2560, 720)).toBe(1.42);
  });
});
