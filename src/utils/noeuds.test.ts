import { describe, it, expect } from 'vitest';
import { createElement } from 'react';
import { cleElement, texteDe } from './noeuds';

describe('texteDe', () => {
  it('rend une chaîne telle quelle', () => {
    expect(texteDe('Les cardinalités')).toBe('Les cardinalités');
  });

  it('concatène un tableau de nœuds', () => {
    expect(texteDe(['Les ', 'cardinalités'])).toBe('Les cardinalités');
  });

  it('descend dans les éléments imbriqués', () => {
    const noeud = createElement('span', null, 'Les ', createElement('code', null, 'cardinalités'));
    expect(texteDe(noeud)).toBe('Les cardinalités');
  });

  it('ignore les nœuds sans texte', () => {
    expect(texteDe(null)).toBe('');
    expect(texteDe(undefined)).toBe('');
    expect(texteDe(false)).toBe('');
  });
});

describe('cleElement', () => {
  it('produit une clé lisible et stable', () => {
    expect(cleElement('Les cardinalités Merise')).toBe('les-cardinalites-merise');
  });

  it('donne la même clé quelle que soit la casse ou la ponctuation', () => {
    expect(cleElement('ACID : les 4 propriétés !')).toBe(cleElement('acid les 4 proprietes'));
  });

  it('borne la longueur pour rester utilisable comme clé', () => {
    expect(cleElement('a'.repeat(200)).length).toBeLessThanOrEqual(60);
  });
});
