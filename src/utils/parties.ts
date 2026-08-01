export interface Partie {
  nom: string;
  titre: string;
  resume: string;
}

/** Une couleur d'accent par partie du cours, pour créer un repère visuel. */
export interface AccentPartie {
  texte: string;
  fond: string;
  bordure: string;
  point: string;
}

const NEUTRE: AccentPartie = {
  texte: 'text-ardoise-600 dark:text-ardoise-400',
  fond: 'bg-ardoise-100 dark:bg-ardoise-800',
  bordure: 'border-ardoise-300 dark:border-ardoise-700',
  point: 'bg-ardoise-400',
};

const ACCENTS: Record<string, AccentPartie> = {
  INTRODUCTION: {
    texte: 'text-slate-600 dark:text-slate-300',
    fond: 'bg-slate-100 dark:bg-slate-500/15',
    bordure: 'border-slate-300 dark:border-slate-600',
    point: 'bg-slate-400',
  },
  'PARTIE I — CONCEPTION': {
    texte: 'text-sky-700 dark:text-sky-300',
    fond: 'bg-sky-100 dark:bg-sky-500/15',
    bordure: 'border-sky-300 dark:border-sky-700',
    point: 'bg-sky-500',
  },
  'PARTIE II — DÉVELOPPEMENT': {
    texte: 'text-emerald-700 dark:text-emerald-300',
    fond: 'bg-emerald-100 dark:bg-emerald-500/15',
    bordure: 'border-emerald-300 dark:border-emerald-700',
    point: 'bg-emerald-500',
  },
  'PARTIE III — DÉPLOIEMENT': {
    texte: 'text-amber-700 dark:text-amber-300',
    fond: 'bg-amber-100 dark:bg-amber-500/15',
    bordure: 'border-amber-300 dark:border-amber-700',
    point: 'bg-amber-500',
  },
  ANNEXES: {
    texte: 'text-violet-700 dark:text-violet-300',
    fond: 'bg-violet-100 dark:bg-violet-500/15',
    bordure: 'border-violet-300 dark:border-violet-700',
    point: 'bg-violet-500',
  },
};

export function accentPartie(nom: string | null | undefined): AccentPartie {
  return (nom && ACCENTS[nom]) || NEUTRE;
}

/** Libellé court, pour les emplacements étroits. */
export function abregerPartie(nom: string): string {
  return nom
    .replace('PARTIE I — ', '')
    .replace('PARTIE II — ', '')
    .replace('PARTIE III — ', '')
    .toLowerCase()
    .replace(/^./, (c) => c.toUpperCase());
}
