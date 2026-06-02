import type { Question, Theme } from '../../types/quiz';
import { questionsConception } from './conception';
import { questionsPOO } from './poo';
import { questionsSOLID } from './solid';
import { questionsArchitecture } from './architecture';
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

export const QUESTIONS_BY_THEME: Partial<Record<Theme, Question[]>> = {
  conception: questionsConception,
  poo: questionsPOO,
  solid: questionsSOLID,
  architecture: questionsArchitecture,
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

export const SLUG_TO_THEME: Record<string, Theme> = {
  '04-1-l-analyse-des-besoins': 'conception',
  '05-2-la-modelisation-des-donnees': 'conception',
  '06-3-la-modelisation-uml': 'conception',
  '10-6-la-programmation-orientee-objet-poo': 'poo',
  '11-7-les-principes-de-conception-solid-co': 'solid',
  '12-8-l-architecture-en-couches-en-pratique': 'architecture',
  '13-9-bases-de-donnees-et-sql': 'bdd-sql',
  '14-10-developper-une-api-rest': 'api-rest',
  '14b-le-developpement-back-end': 'back-end',
  '15-11-le-developpement-front-end': 'front-end',
  '16-12-la-gestion-de-versions-avec-git': 'git',
  '17-13-les-tests': 'tests',
  '18-14-synthese-securite-l-owasp-top-10': 'securite',
  '20-15-la-conteneurisation-avec-docker': 'docker',
  '21-16-l-integration-et-le-deploiement-continus-ci-cd': 'ci-cd',
  '22-17-la-mise-en-production': 'mise-en-prod',
  '23-18-la-supervision-et-la-maintenance': 'supervision',
};

export function getAllQuestions(): Question[] {
  return (Object.values(QUESTIONS_BY_THEME) as Question[][]).flat();
}
