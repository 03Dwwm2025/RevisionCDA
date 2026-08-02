/**
 * Révision espacée, méthode des boîtes de Leitner.
 *
 * Une question ratée entre en boîte 1. Chaque réussite la fait monter d'une
 * boîte, et l'intervalle avant la prochaine révision s'allonge. Une erreur la
 * renvoie en boîte 1, quel que soit son niveau. Réussie depuis la dernière
 * boîte, elle est considérée comme acquise et quitte le paquet.
 */

export const BOITES = [1, 2, 3, 4] as const;
export type Boite = (typeof BOITES)[number];

/** Nombre de jours avant la prochaine révision, par boîte. */
export const INTERVALLES: Record<Boite, number> = { 1: 1, 2: 3, 3: 7, 4: 21 };

export interface Carte {
  boite: Boite;
  /** Date de la prochaine révision, au format AAAA-MM-JJ. */
  prochaine: string;
}

export type Paquet = Record<string, Carte>;

/** Date du jour au format AAAA-MM-JJ, dans le fuseau local. */
export function jour(instant: number = Date.now()): string {
  const d = new Date(instant);
  const mois = String(d.getMonth() + 1).padStart(2, '0');
  const jourDuMois = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${mois}-${jourDuMois}`;
}

function dans(nbJours: number, instant: number): string {
  return jour(instant + nbJours * 86_400_000);
}

/**
 * Applique le résultat d'une question au paquet.
 * Une question réussie qui n'y figure pas n'y entre pas : seules les erreurs
 * alimentent la révision espacée.
 */
export function appliquerReponse(
  paquet: Paquet,
  id: string,
  correct: boolean,
  instant: number = Date.now(),
): Paquet {
  const carte = paquet[id];
  const suivant = { ...paquet };

  if (!correct) {
    suivant[id] = { boite: 1, prochaine: dans(INTERVALLES[1], instant) };
    return suivant;
  }

  if (!carte) return paquet; // jamais ratée : rien à suivre

  if (carte.boite >= 4) {
    delete suivant[id]; // acquise : quatre réussites espacées
    return suivant;
  }

  const boite = (carte.boite + 1) as Boite;
  suivant[id] = { boite, prochaine: dans(INTERVALLES[boite], instant) };
  return suivant;
}

/** Identifiants dont la date de révision est atteinte, les plus anciens d'abord. */
export function cartesDues(paquet: Paquet, instant: number = Date.now()): string[] {
  const aujourdHui = jour(instant);
  return Object.entries(paquet)
    .filter(([, c]) => c.prochaine <= aujourdHui)
    .sort((a, b) => a[1].prochaine.localeCompare(b[1].prochaine) || a[1].boite - b[1].boite)
    .map(([id]) => id);
}

/** Répartition du paquet par boîte, pour l'affichage. */
export function repartition(paquet: Paquet): Record<Boite, number> {
  const table: Record<Boite, number> = { 1: 0, 2: 0, 3: 0, 4: 0 };
  for (const carte of Object.values(paquet)) table[carte.boite]++;
  return table;
}

/** Prochaine date de révision du paquet, quand rien n'est dû aujourd'hui. */
export function prochaineEcheance(paquet: Paquet): string | null {
  const dates = Object.values(paquet)
    .map((c) => c.prochaine)
    .sort();
  return dates[0] ?? null;
}
