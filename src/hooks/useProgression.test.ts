import { describe, it, expect } from 'vitest';
import { appliquerResultats, migrerDepuisV1 } from './useProgression';
import type { Progression } from './useProgression';
import type { ResultatQuestion } from '../types/quiz';

const T0 = new Date('2026-08-02T10:00:00').getTime();

const vide: Progression = {
  scores: {},
  historique: {},
  paquet: {},
  sessions: 0,
  derniereLecture: null,
};

function resultat(id: string, correct: boolean): ResultatQuestion {
  return { id, theme: 'poo', correct, reponse: null };
}

describe('appliquerResultats', () => {
  it('enregistre le score du thème quand la série porte sur un seul thème', () => {
    const suivante = appliquerResultats(
      vide,
      [resultat('poo-001', true), resultat('poo-002', false), resultat('poo-003', true)],
      'poo',
      T0,
    );
    expect(suivante.scores.poo).toMatchObject({ theme: 'poo', score: 2, total: 3 });
  });

  it('n’enregistre aucun score de thème pour une série mélangée', () => {
    expect(appliquerResultats(vide, [resultat('poo-001', true)], undefined, T0).scores).toEqual({});
  });

  it('fait entrer les questions ratées dans le paquet de révision', () => {
    const suivante = appliquerResultats(
      vide,
      [resultat('poo-001', false), resultat('poo-002', true)],
      'poo',
      T0,
    );
    expect(Object.keys(suivante.paquet)).toEqual(['poo-001']);
    expect(suivante.paquet['poo-001'].boite).toBe(1);
  });

  it('fait monter d’une boîte une question déjà suivie et réussie', () => {
    const avec = appliquerResultats(vide, [resultat('poo-001', false)], 'poo', T0);
    const apres = appliquerResultats(avec, [resultat('poo-001', true)], 'poo', T0);
    expect(apres.paquet['poo-001'].boite).toBe(2);
  });

  it('empile l’historique du thème, en gardant les cinq derniers essais', () => {
    let p = vide;
    for (let i = 0; i < 7; i++) {
      p = appliquerResultats(p, [resultat(`poo-00${i}`, i % 2 === 0)], 'poo', T0);
    }
    expect(p.historique.poo).toHaveLength(5);
  });

  it('incrémente le compteur de séries terminées', () => {
    expect(appliquerResultats(vide, [resultat('poo-001', true)], 'poo', T0).sessions).toBe(1);
  });

  it('conserve le dernier chapitre lu', () => {
    const avec: Progression = {
      ...vide,
      derniereLecture: { slug: 'x', titre: 'X', date: '2026-08-01T00:00:00Z' },
    };
    expect(appliquerResultats(avec, [resultat('poo-001', true)], 'poo', T0).derniereLecture).toEqual(
      avec.derniereLecture,
    );
  });
});

describe('migrerDepuisV1', () => {
  const v1 = {
    scores: {
      poo: { theme: 'poo' as const, score: 8, total: 10, date: '2026-07-01T00:00:00Z' },
    },
    erreurs: ['poo-001', 'poo-002'],
    sessions: 3,
    derniereLecture: { slug: 'x', titre: 'X', date: '2026-07-01T00:00:00Z' },
  };

  it('transforme chaque erreur en carte à revoir tout de suite', () => {
    const p = migrerDepuisV1(v1, '2026-08-02');
    expect(p.paquet).toEqual({
      'poo-001': { boite: 1, prochaine: '2026-08-02' },
      'poo-002': { boite: 1, prochaine: '2026-08-02' },
    });
  });

  it('amorce l’historique avec le dernier score connu', () => {
    expect(migrerDepuisV1(v1, '2026-08-02').historique.poo).toEqual([
      { score: 8, total: 10, date: '2026-07-01T00:00:00Z' },
    ]);
  });

  it('conserve les scores, le compteur et la dernière lecture', () => {
    const p = migrerDepuisV1(v1, '2026-08-02');
    expect(p.scores.poo?.score).toBe(8);
    expect(p.sessions).toBe(3);
    expect(p.derniereLecture?.slug).toBe('x');
  });

  it('accepte une progression vide', () => {
    expect(migrerDepuisV1({}, '2026-08-02')).toMatchObject({ paquet: {}, sessions: 0 });
  });
});
