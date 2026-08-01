import type { Question, Theme } from '../../types/quiz';
export { SLUG_TO_THEME } from './chapitres';
import { questionsGestionProjet } from './gestion-projet';
import { questionsConception } from './conception';
import { questionsArchitecture } from './architecture';
import { questionsEnvironnement } from './environnement';
import { questionsPOO } from './poo';
import { questionsSOLID } from './solid';
import { questionsBddSql } from './bdd-sql';
import { questionsApiRest } from './api-rest';
import { questionsBackEnd } from './back-end';
import { questionsFrontEnd } from './front-end';
import { questionsGit } from './git';
import { questionsTests } from './tests';
import { questionsSecurite } from './securite';
import { questionsDocker } from './docker';
import { questionsCiCd } from './ci-cd';
import { questionsMiseEnProd } from './mise-en-prod';
import { questionsSupervision } from './supervision';

export const QUESTIONS_BY_THEME: Record<Theme, Question[]> = {
  'gestion-projet': questionsGestionProjet,
  conception: questionsConception,
  architecture: questionsArchitecture,
  environnement: questionsEnvironnement,
  poo: questionsPOO,
  solid: questionsSOLID,
  'bdd-sql': questionsBddSql,
  'api-rest': questionsApiRest,
  'back-end': questionsBackEnd,
  'front-end': questionsFrontEnd,
  git: questionsGit,
  tests: questionsTests,
  securite: questionsSecurite,
  docker: questionsDocker,
  'ci-cd': questionsCiCd,
  'mise-en-prod': questionsMiseEnProd,
  supervision: questionsSupervision,
};

export function getAllQuestions(): Question[] {
  return Object.values(QUESTIONS_BY_THEME).flat();
}

export function getQuestionsByIds(ids: string[]): Question[] {
  const index = new Map(getAllQuestions().map((q) => [q.id, q]));
  return ids.map((id) => index.get(id)).filter((q): q is Question => q !== undefined);
}
