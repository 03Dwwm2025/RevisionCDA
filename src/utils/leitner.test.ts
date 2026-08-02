import { describe, it, expect } from 'vitest';
import {
  appliquerReponse,
  cartesDues,
  jour,
  prochaineEcheance,
  repartition,
  INTERVALLES,
} from './leitner';
import type { Paquet } from './leitner';

const T0 = new Date('2026-08-02T10:00:00').getTime();
const dans = (n: number) => jour(T0 + n * 86_400_000);

describe('appliquerReponse', () => {
  it('fait entrer une question ratée en boîte 1', () => {
    const p = appliquerReponse({}, 'poo-001', false, T0);
    expect(p['poo-001']).toEqual({ boite: 1, prochaine: dans(INTERVALLES[1]) });
  });

  it('n’ajoute pas une question réussie qui n’a jamais été ratée', () => {
    expect(appliquerReponse({}, 'poo-001', true, T0)).toEqual({});
  });

  it('fait monter d’une boîte à chaque réussite, avec un intervalle plus long', () => {
    let p: Paquet = appliquerReponse({}, 'poo-001', false, T0);
    p = appliquerReponse(p, 'poo-001', true, T0);
    expect(p['poo-001']).toEqual({ boite: 2, prochaine: dans(3) });

    p = appliquerReponse(p, 'poo-001', true, T0);
    expect(p['poo-001']).toEqual({ boite: 3, prochaine: dans(7) });

    p = appliquerReponse(p, 'poo-001', true, T0);
    expect(p['poo-001']).toEqual({ boite: 4, prochaine: dans(21) });
  });

  it('retire la carte du paquet après une réussite depuis la dernière boîte', () => {
    const p: Paquet = { 'poo-001': { boite: 4, prochaine: dans(0) } };
    expect(appliquerReponse(p, 'poo-001', true, T0)).toEqual({});
  });

  it('renvoie en boîte 1 une carte ratée, quel que soit son niveau', () => {
    const p: Paquet = { 'poo-001': { boite: 4, prochaine: dans(0) } };
    expect(appliquerReponse(p, 'poo-001', false, T0)['poo-001'].boite).toBe(1);
  });

  it('ne modifie pas le paquet reçu', () => {
    const p: Paquet = {};
    appliquerReponse(p, 'poo-001', false, T0);
    expect(p).toEqual({});
  });
});

describe('cartesDues', () => {
  const paquet: Paquet = {
    hier: { boite: 1, prochaine: dans(-1) },
    aujourdhui: { boite: 2, prochaine: dans(0) },
    demain: { boite: 3, prochaine: dans(1) },
  };

  it('retient ce qui est dû aujourd’hui ou en retard', () => {
    expect(cartesDues(paquet, T0)).toEqual(['hier', 'aujourdhui']);
  });

  it('laisse de côté ce qui n’est pas encore dû', () => {
    expect(cartesDues(paquet, T0)).not.toContain('demain');
  });

  it('trie du plus ancien au plus récent', () => {
    expect(cartesDues(paquet, T0)[0]).toBe('hier');
  });
});

describe('repartition et prochaine échéance', () => {
  const paquet: Paquet = {
    a: { boite: 1, prochaine: dans(1) },
    b: { boite: 1, prochaine: dans(5) },
    c: { boite: 3, prochaine: dans(2) },
  };

  it('compte les cartes par boîte', () => {
    expect(repartition(paquet)).toEqual({ 1: 2, 2: 0, 3: 1, 4: 0 });
  });

  it('donne la date de révision la plus proche', () => {
    expect(prochaineEcheance(paquet)).toBe(dans(1));
  });

  it('ne donne aucune échéance sur un paquet vide', () => {
    expect(prochaineEcheance({})).toBeNull();
  });
});
