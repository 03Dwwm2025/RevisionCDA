import { describe, it, expect } from 'vitest';
import { appliquerResultats } from './useProgression';
import type { Progression } from './useProgression';
import type { ResultatQuestion } from '../types/quiz';

const vide: Progression = { scores: {}, erreurs: [], sessions: 0 };

function resultat(id: string, correct: boolean): ResultatQuestion {
  return { id, theme: 'poo', correct, reponse: null };
}

describe('appliquerResultats', () => {
  it('enregistre le score du thème quand la série porte sur un seul thème', () => {
    const suivante = appliquerResultats(
      vide,
      [resultat('poo-001', true), resultat('poo-002', false), resultat('poo-003', true)],
      'poo',
    );
    expect(suivante.scores.poo).toMatchObject({ theme: 'poo', score: 2, total: 3 });
  });

  it('n’enregistre aucun score de thème pour une série mélangée', () => {
    const suivante = appliquerResultats(vide, [resultat('poo-001', true)]);
    expect(suivante.scores).toEqual({});
  });

  it('ajoute les questions ratées à la liste à rejouer', () => {
    const suivante = appliquerResultats(vide, [resultat('poo-001', false), resultat('poo-002', false)]);
    expect(suivante.erreurs).toEqual(['poo-001', 'poo-002']);
  });

  it('retire une question de la liste quand elle est enfin réussie', () => {
    const avec: Progression = { ...vide, erreurs: ['poo-001', 'poo-002'] };
    const suivante = appliquerResultats(avec, [resultat('poo-001', true)]);
    expect(suivante.erreurs).toEqual(['poo-002']);
  });

  it('ne crée pas de doublon quand une question est ratée deux fois', () => {
    const avec: Progression = { ...vide, erreurs: ['poo-001'] };
    const suivante = appliquerResultats(avec, [resultat('poo-001', false)]);
    expect(suivante.erreurs).toEqual(['poo-001']);
  });

  it('incrémente le compteur de séries terminées', () => {
    expect(appliquerResultats(vide, [resultat('poo-001', true)]).sessions).toBe(1);
  });
});
