import type { Question, Theme } from '../types/quiz';
import { shuffle } from './shuffle';

/**
 * Tirage stratifié : chaque thème est représenté proportionnellement à son
 * poids dans le lot, avec au moins une question par thème tant qu'il reste des
 * places. Un tirage uniforme sur-représenterait les thèmes les plus fournis.
 */
export function tirageStratifie(questions: Question[], nombre: number): Question[] {
  if (nombre >= questions.length) return shuffle(questions);

  const parTheme = new Map<Theme, Question[]>();
  for (const q of questions) {
    const lot = parTheme.get(q.theme);
    if (lot) lot.push(q);
    else parTheme.set(q.theme, [q]);
  }

  const themes = shuffle([...parTheme.keys()]);
  const restants = new Map(themes.map((t) => [t, shuffle(parTheme.get(t) ?? [])]));
  const tirees: Question[] = [];

  // Premier tour : une question par thème, puis on complète en tournant.
  while (tirees.length < nombre) {
    let ajoutDansCeTour = false;

    for (const theme of themes) {
      if (tirees.length >= nombre) break;
      const lot = restants.get(theme);
      if (!lot || lot.length === 0) continue;
      tirees.push(lot.pop()!);
      ajoutDansCeTour = true;
    }

    if (!ajoutDansCeTour) break;
  }

  return shuffle(tirees);
}
