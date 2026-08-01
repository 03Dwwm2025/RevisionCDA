import { describe, it, expect } from 'vitest';
import { shuffle } from './shuffle';

describe('shuffle', () => {
  it('ne modifie pas le tableau d’origine', () => {
    const source = [1, 2, 3, 4, 5];
    shuffle(source);
    expect(source).toEqual([1, 2, 3, 4, 5]);
  });

  it('conserve tous les éléments', () => {
    const melange = shuffle(['a', 'b', 'c', 'd']);
    expect([...melange].sort()).toEqual(['a', 'b', 'c', 'd']);
  });

  it('finit par produire un ordre différent', () => {
    const source = [1, 2, 3, 4, 5, 6, 7, 8];
    const differents = Array.from({ length: 40 }, () => shuffle(source)).some(
      (m) => m.join() !== source.join(),
    );
    expect(differents).toBe(true);
  });
});
