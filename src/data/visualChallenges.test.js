import { describe, expect, it } from 'vitest';
import { visualChallenges } from './visualChallenges';

describe('visualChallenges', () => {
  it('mantém 55 desafios nativos completos após o terceiro lote', () => {
    expect(visualChallenges).toHaveLength(55);
    expect(new Set(visualChallenges.map(({ id }) => id)).size).toBe(55);

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

  it('preserva a progressão editorial do terceiro lote', () => {
    const thirdBatch = visualChallenges.slice(40, 55);

    expect(thirdBatch.map(({ id }) => id)).toEqual(
      Array.from(
        { length: 15 },
        (_, index) => `desafio-visual-${String(index + 41).padStart(3, '0')}`,
      ),
    );
    expect(thirdBatch.filter(({ difficulty }) => difficulty === 'Básico')).toHaveLength(7);
    expect(thirdBatch.filter(({ difficulty }) => difficulty === 'Intermediário')).toHaveLength(6);
    expect(thirdBatch.filter(({ difficulty }) => difficulty === 'Avançado')).toHaveLength(2);
  });
});
