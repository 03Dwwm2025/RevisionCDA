import { describe, it, expect } from 'vitest';
import { checkAnswer } from './checkAnswer';
import type {
  QuestionQCM,
  QuestionVraiFaux,
  QuestionAssociation,
  QuestionCompleterCode,
  QuestionRemettreDansOrdre,
} from '../../types/quiz';

const base = { theme: 'poo', difficulte: 1, explication: 'explication de test' } as const;

const qcm: QuestionQCM = {
  ...base,
  id: 'test-qcm',
  type: 'qcm',
  enonce: 'Combien de piliers en POO ?',
  options: ['2', '3', '4'],
  bonneReponse: 2,
};

const vraiFaux: QuestionVraiFaux = {
  ...base,
  id: 'test-vf',
  type: 'vrai_faux',
  enonce: 'Une interface peut contenir des champs.',
  bonneReponse: false,
};

const association: QuestionAssociation = {
  ...base,
  id: 'test-assoc',
  type: 'association',
  enonce: 'Associez.',
  paires: [
    { gauche: 'A', droite: 'Atomicité' },
    { gauche: 'I', droite: 'Isolation' },
  ],
};

const completer: QuestionCompleterCode = {
  ...base,
  id: 'test-cc',
  type: 'completer_code',
  enonce: 'Complétez.',
  codeAvecTrous: 'public ___1___ class Chose : ___2___ { }',
  choix: ['sealed', 'abstract', 'IChose', 'Base'],
  bonnesReponses: ['abstract', 'IChose'],
};

const ordre: QuestionRemettreDansOrdre = {
  ...base,
  id: 'test-ordre',
  type: 'remettre_ordre',
  enonce: 'Remettez dans l’ordre.',
  elements: ['Rouge', 'Vert', 'Refactor'],
};

describe('checkAnswer', () => {
  it('valide un choix multiple sur l’index exact', () => {
    expect(checkAnswer(qcm, 2)).toBe(true);
    expect(checkAnswer(qcm, 1)).toBe(false);
    expect(checkAnswer(qcm, undefined)).toBe(false);
  });

  it('valide un vrai/faux sur le booléen exact', () => {
    expect(checkAnswer(vraiFaux, false)).toBe(true);
    expect(checkAnswer(vraiFaux, true)).toBe(false);
  });

  it('exige toutes les paires justes en association', () => {
    expect(checkAnswer(association, { A: 'Atomicité', I: 'Isolation' })).toBe(true);
    expect(checkAnswer(association, { A: 'Atomicité', I: 'Intégrité' })).toBe(false);
    expect(checkAnswer(association, { A: 'Atomicité' })).toBe(false);
  });

  it('exige le bon mot dans le bon trou', () => {
    expect(checkAnswer(completer, ['abstract', 'IChose'])).toBe(true);
    expect(checkAnswer(completer, ['IChose', 'abstract'])).toBe(false);
    expect(checkAnswer(completer, ['abstract'])).toBe(false);
  });

  it('exige la séquence exacte en remise en ordre', () => {
    expect(checkAnswer(ordre, ['Rouge', 'Vert', 'Refactor'])).toBe(true);
    expect(checkAnswer(ordre, ['Vert', 'Rouge', 'Refactor'])).toBe(false);
    expect(checkAnswer(ordre, ['Rouge', 'Vert'])).toBe(false);
  });
});
