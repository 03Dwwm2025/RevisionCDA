import { describe, it, expect } from 'vitest';
import { tirageStratifie } from './tirage';
import { getAllQuestions } from '../data/questions';
import type { Question, Theme } from '../types/quiz';

function fabriquer(theme: Theme, nombre: number): Question[] {
  return Array.from({ length: nombre }, (_, i) => ({
    id: `${theme}-${i}`,
    theme,
    type: 'vrai_faux' as const,
    difficulte: 1 as const,
    enonce: 'question de test',
    explication: 'explication de test',
    bonneReponse: true,
  }));
}

describe('tirageStratifie', () => {
  it('renvoie le nombre demandé', () => {
    expect(tirageStratifie(getAllQuestions(), 20)).toHaveLength(20);
  });

  it('ne renvoie pas deux fois la même question', () => {
    const tirage = tirageStratifie(getAllQuestions(), 30);
    expect(new Set(tirage.map((q) => q.id)).size).toBe(30);
  });

  it('rend tout le lot si on demande plus que disponible', () => {
    const lot = fabriquer('poo', 5);
    expect(tirageStratifie(lot, 50)).toHaveLength(5);
  });

  it('ne laisse pas un thème volumineux écraser les autres', () => {
    // 100 questions d'un thème contre 5 de chacun des deux autres.
    const lot = [...fabriquer('conception', 100), ...fabriquer('git', 5), ...fabriquer('docker', 5)];
    const tirage = tirageStratifie(lot, 9);

    const parTheme = new Map<string, number>();
    for (const q of tirage) parTheme.set(q.theme, (parTheme.get(q.theme) ?? 0) + 1);

    expect(parTheme.size).toBe(3);
    // Le tirage tourne thème par thème : la répartition reste équilibrée.
    expect(Math.max(...parTheme.values())).toBeLessThanOrEqual(3);
  });

  it('couvre un maximum de thèmes différents sur un tirage d’examen', () => {
    const tirage = tirageStratifie(getAllQuestions(), 20);
    expect(new Set(tirage.map((q) => q.theme)).size).toBeGreaterThanOrEqual(15);
  });
});
