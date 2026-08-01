import { useEffect } from 'react';
import type { QuestionQCM as TypeQCM } from '../../types/quiz';
import Icone from '../Icone';
import TexteRiche from './TexteRiche';

interface Props {
  question: TypeQCM;
  reponseValidee?: number;
  onRepondre: (reponse: number) => void;
}

const LETTRES = ['A', 'B', 'C', 'D', 'E', 'F'];

export default function QuestionQCM({ question, reponseValidee, onRepondre }: Props) {
  const enCorrection = reponseValidee !== undefined;

  // Raccourcis clavier 1 à 6 tant que la réponse n'est pas validée.
  useEffect(() => {
    if (enCorrection) return;
    const surTouche = (e: KeyboardEvent) => {
      const n = Number(e.key);
      if (Number.isInteger(n) && n >= 1 && n <= question.options.length) onRepondre(n - 1);
    };
    window.addEventListener('keydown', surTouche);
    return () => window.removeEventListener('keydown', surTouche);
  }, [enCorrection, question.options.length, onRepondre]);

  return (
    <ul className="space-y-2">
      {question.options.map((option, i) => {
        const estBonne = i === question.bonneReponse;
        const estChoisie = reponseValidee === i;

        let styles =
          'border-ardoise-200 hover:border-encre-400 hover:bg-encre-50 dark:border-ardoise-700 dark:hover:border-encre-500 dark:hover:bg-encre-500/10';
        if (enCorrection) {
          if (estBonne)
            styles = 'border-emerald-400 bg-emerald-50 dark:border-emerald-600 dark:bg-emerald-500/10';
          else if (estChoisie)
            styles = 'border-rose-400 bg-rose-50 dark:border-rose-600 dark:bg-rose-500/10';
          else styles = 'border-ardoise-200 opacity-50 dark:border-ardoise-800';
        }

        return (
          <li key={option}>
            <button
              type="button"
              disabled={enCorrection}
              onClick={() => onRepondre(i)}
              className={`flex w-full items-start gap-3 rounded-xl border p-3.5 text-left transition-all disabled:cursor-default ${styles}`}
            >
              <span
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${
                  enCorrection && estBonne
                    ? 'bg-emerald-500 text-white'
                    : enCorrection && estChoisie
                      ? 'bg-rose-500 text-white'
                      : 'bg-ardoise-100 text-ardoise-600 dark:bg-ardoise-800 dark:text-ardoise-300'
                }`}
              >
                {LETTRES[i]}
              </span>
              <span className="flex-1 text-[15px] leading-snug text-ardoise-800 dark:text-ardoise-200">
                <TexteRiche>{option}</TexteRiche>
              </span>
              {enCorrection && (estBonne || estChoisie) && (
                <Icone
                  nom={estBonne ? 'coche' : 'croix'}
                  className={`h-5 w-5 shrink-0 ${estBonne ? 'text-emerald-600' : 'text-rose-600'}`}
                />
              )}
            </button>
          </li>
        );
      })}
    </ul>
  );
}
