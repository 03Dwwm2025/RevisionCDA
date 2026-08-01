import { describe, it, expect } from 'vitest';
import { QUESTIONS_BY_THEME, SLUG_TO_THEME, getAllQuestions } from './index';
import { THEMES } from '../../types/quiz';
import type { Question } from '../../types/quiz';
import { analyserTrous } from '../../components/quiz/trous';
import { checkAnswer } from '../../components/quiz/checkAnswer';
import { NB_QUESTIONS_PAR_THEME, NB_QUESTIONS_TOTAL } from './compte';

const toutes = getAllQuestions();

function pour(type: Question['type']) {
  return toutes.filter((q) => q.type === type);
}

describe('intégrité du lot de questions', () => {
  it('contient des questions', () => {
    expect(toutes.length).toBeGreaterThan(0);
  });

  it('a des identifiants uniques', () => {
    const ids = toutes.map((q) => q.id);
    const doublons = ids.filter((id, i) => ids.indexOf(id) !== i);
    expect(doublons).toEqual([]);
  });

  it('range chaque question sous son propre thème', () => {
    const mauvaises = Object.entries(QUESTIONS_BY_THEME).flatMap(([theme, qs]) =>
      (qs ?? []).filter((q) => q.theme !== theme).map((q) => `${q.id} (${q.theme} ≠ ${theme})`),
    );
    expect(mauvaises).toEqual([]);
  });

  it('donne un énoncé et une explication utilisables', () => {
    const pauvres = toutes
      .filter((q) => q.enonce.trim().length < 10 || q.explication.trim().length < 20)
      .map((q) => q.id);
    expect(pauvres).toEqual([]);
  });

  it('reste dans l’échelle de difficulté 1 à 3', () => {
    const hors = toutes.filter((q) => ![1, 2, 3].includes(q.difficulte)).map((q) => q.id);
    expect(hors).toEqual([]);
  });
});

describe('questions à choix multiple', () => {
  it('propose au moins trois options distinctes', () => {
    const fautives = pour('qcm')
      .filter((q) => q.type === 'qcm')
      .filter((q) => q.options.length < 3 || new Set(q.options).size !== q.options.length)
      .map((q) => q.id);
    expect(fautives).toEqual([]);
  });

  it('désigne une bonne réponse qui existe', () => {
    const fautives = pour('qcm')
      .filter((q) => q.type === 'qcm')
      .filter((q) => q.bonneReponse < 0 || q.bonneReponse >= q.options.length)
      .map((q) => q.id);
    expect(fautives).toEqual([]);
  });
});

describe('questions d’association', () => {
  it('a au moins deux paires', () => {
    const fautives = pour('association')
      .filter((q) => q.type === 'association')
      .filter((q) => q.paires.length < 2)
      .map((q) => q.id);
    expect(fautives).toEqual([]);
  });

  it('n’a ni terme ni définition en double (sinon le choix est ambigu)', () => {
    const fautives = pour('association')
      .filter((q) => q.type === 'association')
      .filter((q) => {
        const g = q.paires.map((p) => p.gauche);
        const d = q.paires.map((p) => p.droite);
        return new Set(g).size !== g.length || new Set(d).size !== d.length;
      })
      .map((q) => q.id);
    expect(fautives).toEqual([]);
  });
});

describe('questions à trous', () => {
  it('numérote les trous de 1 à N sans saut', () => {
    const fautives = pour('completer_code')
      .filter((q) => q.type === 'completer_code')
      .filter((q) => {
        const { positionParNumero, nbTrous } = analyserTrous(q.codeAvecTrous);
        const numeros = [...positionParNumero.keys()];
        return nbTrous === 0 || numeros.some((n, i) => n !== i + 1);
      })
      .map((q) => q.id);
    expect(fautives).toEqual([]);
  });

  it('donne exactement une réponse par trou', () => {
    const fautives = pour('completer_code')
      .filter((q) => q.type === 'completer_code')
      .filter((q) => analyserTrous(q.codeAvecTrous).nbTrous !== q.bonnesReponses.length)
      .map((q) => q.id);
    expect(fautives).toEqual([]);
  });

  it('propose chaque bonne réponse dans la liste de choix', () => {
    const fautives = pour('completer_code')
      .filter((q) => q.type === 'completer_code')
      .filter((q) => q.bonnesReponses.some((r) => !q.choix.includes(r)))
      .map((q) => q.id);
    expect(fautives).toEqual([]);
  });

  it('n’a pas de choix en double et garde au moins un distracteur', () => {
    const fautives = pour('completer_code')
      .filter((q) => q.type === 'completer_code')
      .filter(
        (q) =>
          new Set(q.choix).size !== q.choix.length ||
          q.choix.length <= new Set(q.bonnesReponses).size,
      )
      .map((q) => q.id);
    expect(fautives).toEqual([]);
  });

  it('reste résoluble : remplir les bonnes réponses valide la question', () => {
    const bloquees = pour('completer_code')
      .filter((q) => q.type === 'completer_code')
      .filter((q) => !checkAnswer(q, q.bonnesReponses))
      .map((q) => q.id);
    expect(bloquees).toEqual([]);
  });
});

describe('questions de remise en ordre', () => {
  it('a au moins trois éléments, tous distincts', () => {
    const fautives = pour('remettre_ordre')
      .filter((q) => q.type === 'remettre_ordre')
      .filter((q) => q.elements.length < 3 || new Set(q.elements).size !== q.elements.length)
      .map((q) => q.id);
    expect(fautives).toEqual([]);
  });
});

describe('couverture des thèmes', () => {
  it('donne au moins six questions à chaque thème déclaré', () => {
    const maigres = THEMES.filter((t) => (QUESTIONS_BY_THEME[t] ?? []).length < 6);
    expect(maigres).toEqual([]);
  });

  it('rattache chaque thème à au moins un chapitre du cours', () => {
    const cibles = new Set(Object.values(SLUG_TO_THEME));
    const orphelins = THEMES.filter((t) => !cibles.has(t));
    expect(orphelins).toEqual([]);
  });

  it('ne renvoie vers aucun thème inconnu depuis les chapitres', () => {
    const inconnus = Object.entries(SLUG_TO_THEME)
      .filter(([, theme]) => !THEMES.includes(theme))
      .map(([slug]) => slug);
    expect(inconnus).toEqual([]);
  });

  it('couvre les cinq formats de question', () => {
    const formats = new Set(toutes.map((q) => q.type));
    expect([...formats].sort()).toEqual([
      'association',
      'completer_code',
      'qcm',
      'remettre_ordre',
      'vrai_faux',
    ]);
  });
});

describe('compteurs affichés dans la navigation', () => {
  it('correspondent au lot réel de questions', () => {
    const reels = Object.fromEntries(
      THEMES.map((t) => [t, (QUESTIONS_BY_THEME[t] ?? []).length]),
    );
    expect(NB_QUESTIONS_PAR_THEME).toEqual(reels);
  });

  it('donnent le même total', () => {
    expect(NB_QUESTIONS_TOTAL).toBe(toutes.length);
  });
});
