import { describe, expect, it } from 'vitest';
import { visualChallenges } from './visualChallenges';

describe('visualChallenges', () => {
  it('mantém quatro alternativas sem transportar o gabarito no catálogo público', () => {
    expect(visualChallenges).toHaveLength(10);

    visualChallenges.forEach((challenge) => {
      expect(challenge.options).toHaveLength(4);
      expect(challenge).not.toHaveProperty('correctOptionId');
      expect(challenge).not.toHaveProperty('correctDiagnosis');
      expect(challenge).not.toHaveProperty('explanation');
      expect(challenge).not.toHaveProperty('keyFindings');
      expect(challenge.imageSrc).toMatch(/^\/images\/desafios\/desafio-visual-\d{3}\.webp$/);
      expect(challenge.category).toBeTruthy();
      expect(['Básico', 'Intermediário', 'Avançado']).toContain(challenge.difficulty);
    });
  });
});
