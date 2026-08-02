import { describe, it, expect } from 'vitest';
import { ilYA } from './dates';

const MAINTENANT = new Date('2026-08-02T12:00:00Z').getTime();

function ilYAMinutes(n: number) {
  return new Date(MAINTENANT - n * 60000).toISOString();
}

describe('ilYA', () => {
  it('parle d’instant pour moins de deux minutes', () => {
    expect(ilYA(ilYAMinutes(1), MAINTENANT)).toBe('à l’instant');
  });

  it('compte en minutes sous une heure', () => {
    expect(ilYA(ilYAMinutes(45), MAINTENANT)).toBe('il y a 45 minutes');
  });

  it('compte en heures sous un jour', () => {
    expect(ilYA(ilYAMinutes(60 * 5), MAINTENANT)).toBe('il y a 5 heures');
  });

  it('dit « hier » pour la veille', () => {
    expect(ilYA(ilYAMinutes(60 * 25), MAINTENANT)).toBe('hier');
  });

  it('compte en jours puis en mois', () => {
    expect(ilYA(ilYAMinutes(60 * 24 * 5), MAINTENANT)).toBe('il y a 5 jours');
    expect(ilYA(ilYAMinutes(60 * 24 * 70), MAINTENANT)).toBe('il y a 2 mois');
  });

  it('renvoie une chaîne vide sur une date inexploitable', () => {
    expect(ilYA('pas une date', MAINTENANT)).toBe('');
  });
});
