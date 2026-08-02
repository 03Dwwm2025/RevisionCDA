import { describe, it, expect } from 'vitest';
import { basculerCase } from './useChecklist';

describe('basculerCase', () => {
  it('coche un élément absent de la liste', () => {
    expect(basculerCase([], 'les-cardinalites')).toEqual(['les-cardinalites']);
  });

  it('décoche un élément déjà présent', () => {
    expect(basculerCase(['a', 'b'], 'a')).toEqual(['b']);
  });

  it('ne touche pas aux autres éléments', () => {
    expect(basculerCase(['a', 'b'], 'c')).toEqual(['a', 'b', 'c']);
  });

  it('ne modifie pas la liste reçue', () => {
    const depart = ['a'];
    basculerCase(depart, 'b');
    expect(depart).toEqual(['a']);
  });
});
