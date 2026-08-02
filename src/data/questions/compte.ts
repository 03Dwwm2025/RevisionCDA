import type { Theme } from '../../types/quiz';

/**
 * Nombre de questions par thème, en dur.
 *
 * La barre latérale et l'accueil affichent ces compteurs sur toutes les pages :
 * importer le lot complet ici ferait entrer les 340 questions dans le premier
 * paquet chargé. Un test vérifie que ces valeurs correspondent aux données.
 */
export const NB_QUESTIONS_PAR_THEME: Record<Theme, number> = {
  'gestion-projet': 14,
  conception: 47,
  architecture: 22,
  environnement: 20,
  poo: 26,
  solid: 20,
  'bdd-sql': 38,
  'api-rest': 21,
  'back-end': 20,
  'front-end': 20,
  git: 20,
  tests: 18,
  securite: 26,
  docker: 24,
  'ci-cd': 20,
  'mise-en-prod': 23,
  supervision: 14,
};

export const NB_QUESTIONS_TOTAL = Object.values(NB_QUESTIONS_PAR_THEME).reduce(
  (somme, n) => somme + n,
  0,
);
