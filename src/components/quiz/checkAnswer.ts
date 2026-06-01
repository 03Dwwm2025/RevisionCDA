import type { Question } from '../../types/quiz';

export function checkAnswer(q: Question, answer: unknown): boolean {
  switch (q.type) {
    case 'qcm':
      return answer === q.bonneReponse;
    case 'vrai_faux':
      return answer === q.bonneReponse;
    case 'association': {
      const ans = answer as Record<string, string>;
      return q.paires.every((p) => ans[p.gauche] === p.droite);
    }
    case 'completer_code': {
      const ans = answer as string[];
      return (
        ans.length === q.bonnesReponses.length &&
        q.bonnesReponses.every((r, i) => ans[i] === r)
      );
    }
    case 'remettre_ordre': {
      const ans = answer as string[];
      return (
        ans.length === q.elements.length &&
        q.elements.every((e, i) => ans[i] === e)
      );
    }
  }
}
