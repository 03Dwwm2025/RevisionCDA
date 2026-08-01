import type { Theme } from '../../types/quiz';

/**
 * Chapitre du cours -> thème de quiz proposé en fin de lecture.
 *
 * Volontairement séparé de `index.ts` : la navigation a besoin de cette table
 * sur toutes les pages, sans charger les questions elles-mêmes.
 */
export const SLUG_TO_THEME: Record<string, Theme> = {
  '02-le-cycle-de-vie-d-un-logiciel': 'gestion-projet',
  '04-1-l-analyse-des-besoins': 'conception',
  '05-2-la-modelisation-des-donnees': 'conception',
  '06-3-la-modelisation-uml': 'conception',
  '07-4-le-maquettage-ui-ux': 'conception',
  '08-5-l-architecture-logicielle': 'architecture',
  '09b-l-environnement-de-developpement': 'environnement',
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
