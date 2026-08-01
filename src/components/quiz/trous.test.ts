import { describe, it, expect } from 'vitest';
import { analyserTrous } from './trous';

describe('analyserTrous', () => {
  it('compte un trou par numéro distinct', () => {
    const { nbTrous } = analyserTrous('SELECT ___1___ FROM t WHERE ___2___ = 1');
    expect(nbTrous).toBe(2);
  });

  it('traite un marqueur répété comme un seul trou', () => {
    // Cas réel : la balise ouvrante et la balise fermante d'un <label>.
    const { nbTrous, positionParNumero } = analyserTrous(
      '<___1___ ___2___="id">Texte</___1___> <img ___3___="alt">',
    );
    expect(nbTrous).toBe(3);
    expect(positionParNumero.get(1)).toBe(0);
    expect(positionParNumero.get(3)).toBe(2);
  });

  it('découpe le texte autour des marqueurs', () => {
    const { parts } = analyserTrous('a ___1___ b');
    expect(parts).toEqual(['a ', '___1___', ' b']);
  });

  it('ne trouve aucun trou dans un texte sans marqueur', () => {
    expect(analyserTrous('du code sans trou').nbTrous).toBe(0);
  });
});
