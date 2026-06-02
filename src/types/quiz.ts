export type Theme =
  | 'conception'
  | 'poo'
  | 'solid'
  | 'architecture'
  | 'bdd-sql'
  | 'api-rest'
  | 'back-end'
  | 'front-end'
  | 'git'
  | 'tests'
  | 'securite'
  | 'docker'
  | 'ci-cd'
  | 'mise-en-prod'
  | 'supervision';

export type Difficulte = 1 | 2 | 3;

export type TypeQuestion =
  | 'qcm'
  | 'vrai_faux'
  | 'association'
  | 'completer_code'
  | 'remettre_ordre';

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
