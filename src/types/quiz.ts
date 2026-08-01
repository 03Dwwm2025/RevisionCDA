export const THEMES = [
  'gestion-projet',
  'conception',
  'architecture',
  'environnement',
  'poo',
  'solid',
  'bdd-sql',
  'api-rest',
  'back-end',
  'front-end',
  'git',
  'tests',
  'securite',
  'docker',
  'ci-cd',
  'mise-en-prod',
  'supervision',
] as const;

export type Theme = (typeof THEMES)[number];

export const THEME_LABELS: Record<Theme, string> = {
  'gestion-projet': 'Gestion de projet',
  conception: 'Conception',
  architecture: 'Architecture',
  environnement: 'Environnement de dev',
  poo: 'POO',
  solid: 'SOLID',
  'bdd-sql': 'Bases de données',
  'api-rest': 'API REST',
  'back-end': 'Back-end',
  'front-end': 'Front-end',
  git: 'Git',
  tests: 'Tests',
  securite: 'Sécurité',
  docker: 'Docker',
  'ci-cd': 'CI/CD',
  'mise-en-prod': 'Mise en production',
  supervision: 'Supervision',
};

export type Difficulte = 1 | 2 | 3;

export type TypeQuestion =
  | 'qcm'
  | 'vrai_faux'
  | 'association'
  | 'completer_code'
  | 'remettre_ordre';

export const TYPE_LABELS: Record<TypeQuestion, string> = {
  qcm: 'Choix multiple',
  vrai_faux: 'Vrai ou faux',
  association: 'Association',
  completer_code: 'Compléter le code',
  remettre_ordre: 'Remettre en ordre',
};

interface QuestionBase {
  id: string;
  theme: Theme;
  difficulte: Difficulte;
  enonce: string;
  explication: string;
}

export interface QuestionQCM extends QuestionBase {
  type: 'qcm';
  options: string[];
  bonneReponse: number;
}

export interface QuestionVraiFaux extends QuestionBase {
  type: 'vrai_faux';
  bonneReponse: boolean;
}

export interface QuestionAssociation extends QuestionBase {
  type: 'association';
  paires: Array<{ gauche: string; droite: string }>;
}

export interface QuestionCompleterCode extends QuestionBase {
  type: 'completer_code';
  codeAvecTrous: string;
  choix: string[];
  bonnesReponses: string[];
}

export interface QuestionRemettreDansOrdre extends QuestionBase {
  type: 'remettre_ordre';
  elements: string[];
}

export type Question =
  | QuestionQCM
  | QuestionVraiFaux
  | QuestionAssociation
  | QuestionCompleterCode
  | QuestionRemettreDansOrdre;

export interface ScoreTheme {
  theme: Theme;
  score: number;
  total: number;
  date: string;
}

/** Résultat d'une question au sein d'une série. */
export interface ResultatQuestion {
  id: string;
  theme: Theme;
  correct: boolean;
  reponse: unknown;
}
