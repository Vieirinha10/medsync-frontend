import { describe, expect, it } from 'vitest';
import { visualChallenges } from './visualChallenges';

describe('visualChallenges', () => {
  it('mantém 25 desafios nativos completos após o primeiro lote', () => {
    expect(visualChallenges).toHaveLength(25);
    expect(new Set(visualChallenges.map(({ id }) => id)).size).toBe(25);

    visualChallenges.forEach((challenge) => {
      expect(challenge.id).toMatch(/^desafio-visual-\d{3}$/);
      expect(challenge.options).toHaveLength(4);
      expect(new Set(challenge.options.map(({ id }) => id)).size).toBe(4);
      expect(challenge.imageSrc).toBe(`/images/desafios/${challenge.id}.webp`);
      expect(challenge.imageAlt).not.toBe('');
      expect(challenge.question).not.toBe('');
      expect(challenge).not.toHaveProperty('correctOptionId');
      expect(challenge).not.toHaveProperty('correctDiagnosis');
      expect(challenge).not.toHaveProperty('explanation');
      expect(challenge).not.toHaveProperty('keyFindings');
      expect(challenge.category).toBeTruthy();
      expect(['Básico', 'Intermediário', 'Avançado']).toContain(challenge.difficulty);
    });
  });
});
