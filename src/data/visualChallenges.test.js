import { describe, expect, it } from 'vitest';
import { visualChallenges } from './visualChallenges';

describe('visualChallenges', () => {
  it('mantém quatro alternativas e uma única resposta correta em cada desafio', () => {
    visualChallenges.forEach((challenge) => {
      expect(challenge.options).toHaveLength(4);
      expect(
        challenge.options.filter((option) => option.id === challenge.correctOptionId),
      ).toHaveLength(1);
      expect(challenge.explanation.length).toBeGreaterThan(40);
      expect(challenge.keyFindings.length).toBeGreaterThanOrEqual(3);
    });
  });
});
