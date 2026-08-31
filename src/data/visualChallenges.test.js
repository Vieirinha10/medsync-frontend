import { describe, expect, it } from 'vitest';
import { visualChallenges } from './visualChallenges';

describe('visualChallenges', () => {
  it('mantém 130 desafios nativos completos após o nono lote', () => {
    expect(visualChallenges).toHaveLength(130);
    expect(new Set(visualChallenges.map(({ id }) => id)).size).toBe(130);

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

  it('preserva a distribuição editorial do quarto lote', () => {
    const fourthBatch = visualChallenges.slice(55, 70);

    expect(fourthBatch.map(({ id }) => id)).toEqual(
      Array.from(
        { length: 15 },
        (_, index) => `desafio-visual-${String(index + 56).padStart(3, '0')}`,
      ),
    );
    expect(fourthBatch.filter(({ difficulty }) => difficulty === 'Básico')).toHaveLength(7);
    expect(fourthBatch.filter(({ difficulty }) => difficulty === 'Intermediário')).toHaveLength(6);
    expect(fourthBatch.filter(({ difficulty }) => difficulty === 'Avançado')).toHaveLength(2);
    expect(fourthBatch.filter(({ category }) => category === 'Dermatologia')).toHaveLength(5);
    expect(fourthBatch.filter(({ category }) => category === 'Oftalmologia')).toHaveLength(3);
    expect(fourthBatch.filter(({ category }) => category === 'Otorrinolaringologia')).toHaveLength(2);
    expect(fourthBatch.filter(({ category }) => category === 'Cavidade oral')).toHaveLength(2);
    expect(fourthBatch.filter(({ category }) => category === 'Microbiologia')).toHaveLength(2);
    expect(fourthBatch.filter(({ category }) => category === 'Parasitologia')).toHaveLength(1);
  });

  it('preserva a distribuição editorial do quinto lote', () => {
    const fifthBatch = visualChallenges.slice(70, 85);

    expect(fifthBatch.map(({ id }) => id)).toEqual(
      Array.from(
        { length: 15 },
        (_, index) => `desafio-visual-${String(index + 71).padStart(3, '0')}`,
      ),
    );
    expect(fifthBatch.filter(({ difficulty }) => difficulty === 'Básico')).toHaveLength(7);
    expect(fifthBatch.filter(({ difficulty }) => difficulty === 'Intermediário')).toHaveLength(6);
    expect(fifthBatch.filter(({ difficulty }) => difficulty === 'Avançado')).toHaveLength(2);
    expect(fifthBatch.filter(({ category }) => category === 'Radiologia abdominal')).toHaveLength(4);
    expect(fifthBatch.filter(({ category }) => category === 'Ultrassonografia')).toHaveLength(3);
    expect(fifthBatch.filter(({ category }) => category === 'Urologia')).toHaveLength(3);
    expect(fifthBatch.filter(({ category }) => category === 'Ginecologia e Obstetrícia')).toHaveLength(3);
    expect(fifthBatch.filter(({ category }) => category === 'Endoscopia digestiva')).toHaveLength(2);
  });

  it('preserva a distribuição editorial do sexto lote', () => {
    const sixthBatch = visualChallenges.slice(85, 100);

    expect(sixthBatch.map(({ id }) => id)).toEqual(
      Array.from(
        { length: 15 },
        (_, index) => `desafio-visual-${String(index + 86).padStart(3, '0')}`,
      ),
    );
    expect(sixthBatch.filter(({ difficulty }) => difficulty === 'Básico')).toHaveLength(7);
    expect(sixthBatch.filter(({ difficulty }) => difficulty === 'Intermediário')).toHaveLength(6);
    expect(sixthBatch.filter(({ difficulty }) => difficulty === 'Avançado')).toHaveLength(2);
    expect(sixthBatch.filter(({ category }) => category === 'Pediatria')).toHaveLength(4);
    expect(sixthBatch.filter(({ category }) => category === 'Hematologia')).toHaveLength(3);
    expect(sixthBatch.filter(({ category }) => category === 'Histopatologia')).toHaveLength(3);
    expect(sixthBatch.filter(({ category }) => category === 'Infectologia')).toHaveLength(2);
    expect(sixthBatch.filter(({ category }) => category === 'Endocrinologia')).toHaveLength(2);
    expect(sixthBatch.filter(({ category }) => category === 'Toxicologia')).toHaveLength(1);
  });

  it('preserva a distribuição editorial do sétimo lote', () => {
    const seventhBatch = visualChallenges.slice(100, 110);

    expect(seventhBatch.map(({ id }) => id)).toEqual(
      Array.from(
        { length: 10 },
        (_, index) => `desafio-visual-${String(index + 101).padStart(3, '0')}`,
      ),
    );
    expect(seventhBatch.filter(({ difficulty }) => difficulty === 'Básico')).toHaveLength(4);
    expect(seventhBatch.filter(({ difficulty }) => difficulty === 'Intermediário')).toHaveLength(4);
    expect(seventhBatch.filter(({ difficulty }) => difficulty === 'Avançado')).toHaveLength(2);
    expect(
      seventhBatch.filter(({ category }) => category === 'Reumatologia e Imunologia'),
    ).toHaveLength(10);
  });

  it('preserva a distribuição editorial do oitavo lote', () => {
    const eighthBatch = visualChallenges.slice(110, 120);

    expect(eighthBatch.map(({ id }) => id)).toEqual(
      Array.from(
        { length: 10 },
        (_, index) => `desafio-visual-${String(index + 111).padStart(3, '0')}`,
      ),
    );
    expect(eighthBatch.filter(({ difficulty }) => difficulty === 'Básico')).toHaveLength(3);
    expect(eighthBatch.filter(({ difficulty }) => difficulty === 'Intermediário')).toHaveLength(4);
    expect(eighthBatch.filter(({ difficulty }) => difficulty === 'Avançado')).toHaveLength(3);
    expect(eighthBatch.filter(({ category }) => category === 'Nefrologia')).toHaveLength(10);
  });

  it('preserva a distribuição editorial do nono lote', () => {
    const ninthBatch = visualChallenges.slice(120, 130);

    expect(ninthBatch.map(({ id }) => id)).toEqual(
      Array.from(
        { length: 10 },
        (_, index) => `desafio-visual-${String(index + 121).padStart(3, '0')}`,
      ),
    );
    expect(ninthBatch.filter(({ difficulty }) => difficulty === 'Básico')).toHaveLength(3);
    expect(ninthBatch.filter(({ difficulty }) => difficulty === 'Intermediário')).toHaveLength(4);
    expect(ninthBatch.filter(({ difficulty }) => difficulty === 'Avançado')).toHaveLength(3);
    expect(
      ninthBatch.filter(({ category }) => category === 'Medicina Intensiva e Anestesiologia'),
    ).toHaveLength(10);
  });
});
