import { useCallback, useSyncExternalStore } from 'react';
import type { ResultatQuestion, ScoreTheme, Theme } from '../types/quiz';

const CLE = 'revision-cda-progression-v1';
const MAX_ERREURS = 200;

export interface Progression {
  /** Dernier score obtenu sur chaque thème. */
  scores: Partial<Record<Theme, ScoreTheme>>;
  /** Identifiants des questions ratées et pas encore rejouées avec succès. */
  erreurs: string[];
  /** Nombre de séries terminées, tous modes confondus. */
  sessions: number;
}

const VIDE: Progression = { scores: {}, erreurs: [], sessions: 0 };

function lire(): Progression {
  try {
    const brut = localStorage.getItem(CLE);
    if (!brut) return VIDE;
    const donnees = JSON.parse(brut) as Partial<Progression>;
    return {
      scores: donnees.scores ?? {},
      erreurs: Array.isArray(donnees.erreurs) ? donnees.erreurs : [],
      sessions: typeof donnees.sessions === 'number' ? donnees.sessions : 0,
    };
  } catch {
    return VIDE;
  }
}

/**
 * Applique les résultats d'une série : met à jour le score du thème si la série
 * portait sur un seul thème, et tient à jour la liste des questions à rejouer.
 */
export function appliquerResultats(
  actuelle: Progression,
  resultats: ResultatQuestion[],
  themeSerie?: Theme,
): Progression {
  const rates = resultats.filter((r) => !r.correct).map((r) => r.id);
  const reussis = new Set(resultats.filter((r) => r.correct).map((r) => r.id));

  // Une question réussie sort de la liste ; une question ratée y entre (sans doublon).
  const erreurs = [...new Set([...actuelle.erreurs.filter((id) => !reussis.has(id)), ...rates])];

  const scores = { ...actuelle.scores };
  if (themeSerie && resultats.length > 0) {
    scores[themeSerie] = {
      theme: themeSerie,
      score: resultats.filter((r) => r.correct).length,
      total: resultats.length,
      date: new Date().toISOString(),
    };
  }

  return {
    scores,
    erreurs: erreurs.slice(-MAX_ERREURS),
    sessions: actuelle.sessions + 1,
  };
}

// État partagé : le compteur d'erreurs de la barre latérale et l'accueil doivent
// refléter la fin d'une série sans attendre un rechargement de page.
let progression: Progression = lire();
const abonnes = new Set<() => void>();

function ecrire(suivante: Progression) {
  progression = suivante;
  try {
    localStorage.setItem(CLE, JSON.stringify(suivante));
  } catch {
    // Stockage indisponible (navigation privée) : la session reste utilisable,
    // seule la mémorisation entre deux visites est perdue.
  }
  abonnes.forEach((notifier) => notifier());
}

function sabonner(notifier: () => void) {
  abonnes.add(notifier);
  return () => abonnes.delete(notifier);
}

export function useProgression() {
  const courante = useSyncExternalStore(
    sabonner,
    () => progression,
    () => progression,
  );

  const enregistrerSession = useCallback(
    (resultats: ResultatQuestion[], themeSerie?: Theme) => {
      ecrire(appliquerResultats(progression, resultats, themeSerie));
    },
    [],
  );

  const reinitialiser = useCallback(() => ecrire(VIDE), []);

  return { ...courante, enregistrerSession, reinitialiser };
}
