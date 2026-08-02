import { useCallback, useSyncExternalStore } from 'react';
import type { ResultatQuestion, ScoreTheme, Theme } from '../types/quiz';
import { appliquerReponse, cartesDues, jour } from '../utils/leitner';
import type { Paquet } from '../utils/leitner';

const CLE = 'revision-cda-progression-v2';
const CLE_V1 = 'revision-cda-progression-v1';
const MAX_HISTORIQUE = 5;

/** Dernier chapitre ouvert, pour proposer de reprendre la lecture. */
export interface DerniereLecture {
  slug: string;
  titre: string;
  date: string;
}

/** Un passage sur un thème, conservé pour suivre la progression dans le temps. */
export interface Essai {
  score: number;
  total: number;
  date: string;
}

export interface Progression {
  /** Dernier score obtenu sur chaque thème. */
  scores: Partial<Record<Theme, ScoreTheme>>;
  /** Les cinq derniers essais par thème, du plus ancien au plus récent. */
  historique: Partial<Record<Theme, Essai[]>>;
  /** Questions suivies en révision espacée, par identifiant. */
  paquet: Paquet;
  /** Nombre de séries terminées, tous modes confondus. */
  sessions: number;
  /** Chapitre ouvert le plus récemment. */
  derniereLecture: DerniereLecture | null;
}

const VIDE: Progression = {
  scores: {},
  historique: {},
  paquet: {},
  sessions: 0,
  derniereLecture: null,
};

interface ProgressionV1 {
  scores?: Partial<Record<Theme, ScoreTheme>>;
  erreurs?: string[];
  sessions?: number;
  derniereLecture?: DerniereLecture | null;
}

/**
 * Reprend une progression au format précédent : la liste plate d'erreurs
 * devient un paquet dont toutes les cartes sont en boîte 1, à revoir tout de
 * suite. L'historique démarre avec le dernier score connu de chaque thème.
 */
export function migrerDepuisV1(v1: ProgressionV1, aujourdHui: string): Progression {
  const paquet: Paquet = {};
  for (const id of v1.erreurs ?? []) paquet[id] = { boite: 1, prochaine: aujourdHui };

  const historique: Partial<Record<Theme, Essai[]>> = {};
  for (const [theme, s] of Object.entries(v1.scores ?? {}) as [Theme, ScoreTheme][]) {
    historique[theme] = [{ score: s.score, total: s.total, date: s.date }];
  }

  return {
    scores: v1.scores ?? {},
    historique,
    paquet,
    sessions: v1.sessions ?? 0,
    derniereLecture: v1.derniereLecture ?? null,
  };
}

function lire(): Progression {
  try {
    const brut = localStorage.getItem(CLE);
    if (brut) {
      const d = JSON.parse(brut) as Partial<Progression>;
      return {
        scores: d.scores ?? {},
        historique: d.historique ?? {},
        paquet: d.paquet ?? {},
        sessions: d.sessions ?? 0,
        derniereLecture: d.derniereLecture ?? null,
      };
    }

    const ancien = localStorage.getItem(CLE_V1);
    if (ancien) return migrerDepuisV1(JSON.parse(ancien) as ProgressionV1, jour());
  } catch {
    // Donnée illisible : on repart d'une progression vide plutôt que de planter.
  }
  return VIDE;
}

/**
 * Applique les résultats d'une série : score et historique du thème quand la
 * série n'en couvre qu'un, et mise à jour du paquet de révision espacée.
 */
export function appliquerResultats(
  actuelle: Progression,
  resultats: ResultatQuestion[],
  themeSerie?: Theme,
  instant: number = Date.now(),
): Progression {
  let paquet = actuelle.paquet;
  for (const r of resultats) paquet = appliquerReponse(paquet, r.id, r.correct, instant);

  const scores = { ...actuelle.scores };
  const historique = { ...actuelle.historique };

  if (themeSerie && resultats.length > 0) {
    const essai: Essai = {
      score: resultats.filter((r) => r.correct).length,
      total: resultats.length,
      date: new Date(instant).toISOString(),
    };
    scores[themeSerie] = { theme: themeSerie, ...essai };
    historique[themeSerie] = [...(historique[themeSerie] ?? []), essai].slice(-MAX_HISTORIQUE);
  }

  return { ...actuelle, scores, historique, paquet, sessions: actuelle.sessions + 1 };
}

// État partagé : le compteur de la barre latérale et l'accueil doivent refléter
// la fin d'une série sans attendre un rechargement de page.
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

  const enregistrerLecture = useCallback((slug: string, titre: string) => {
    // Rouvrir le même chapitre ne déclenche pas d'écriture inutile.
    if (progression.derniereLecture?.slug === slug) return;
    ecrire({
      ...progression,
      derniereLecture: { slug, titre, date: new Date().toISOString() },
    });
  }, []);

  const reinitialiser = useCallback(() => ecrire(VIDE), []);

  return {
    ...courante,
    /** Questions à revoir aujourd'hui. */
    aRevoir: cartesDues(courante.paquet),
    enregistrerSession,
    enregistrerLecture,
    reinitialiser,
  };
}
