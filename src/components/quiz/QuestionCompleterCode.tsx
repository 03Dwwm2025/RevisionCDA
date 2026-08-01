import { useState } from 'react';
import type { QuestionCompleterCode as TypeCC } from '../../types/quiz';
import { MARQUEUR, analyserTrous } from './trous';

interface Props {
  question: TypeCC;
  reponseValidee?: string[];
  onRepondre: (reponse: string[]) => void;
}

export default function QuestionCompleterCode({ question, reponseValidee, onRepondre }: Props) {
  const { parts, positionParNumero, nbTrous } = analyserTrous(question.codeAvecTrous);

  const [saisies, setSaisies] = useState<string[]>(() => Array(nbTrous).fill(''));
  const enCorrection = reponseValidee !== undefined;
  const courant = enCorrection ? reponseValidee : saisies;
  const toutRempli = courant.length === nbTrous && courant.every((v) => v !== '');

  const modifier = (position: number, valeur: string) =>
    setSaisies((prec) => {
      const suivant = [...prec];
      suivant[position] = valeur;
      return suivant;
    });

  return (
    <div>
      <pre className="mb-4 overflow-x-auto rounded-xl border border-ardoise-800 bg-ardoise-900 p-4 font-mono text-[13px] leading-[2] whitespace-pre-wrap text-ardoise-100 dark:bg-black/40">
        {parts.map((part, i) => {
          const marqueur = MARQUEUR.exec(part);
          if (!marqueur) return <span key={i}>{part}</span>;

          const position = positionParNumero.get(Number(marqueur[1]))!;
          const valeur = courant[position] ?? '';
          const juste = enCorrection && valeur === question.bonnesReponses[position];

          if (enCorrection) {
            return (
              <span
                key={i}
                className={`inline-flex items-baseline gap-1.5 rounded-md px-2 py-0.5 font-bold ${
                  juste ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
                }`}
              >
                {valeur || '???'}
                {!juste && (
                  <span className="text-xs font-normal text-emerald-200">
                    → {question.bonnesReponses[position]}
                  </span>
                )}
              </span>
            );
          }

          return (
            <select
              key={i}
              value={valeur}
              aria-label={`Trou numéro ${position + 1}`}
              onChange={(e) => modifier(position, e.target.value)}
              className="mx-0.5 inline-block cursor-pointer rounded-md border border-ardoise-600 bg-ardoise-800 px-1.5 py-0.5 font-mono text-[13px] text-white transition-colors hover:border-encre-400 hover:bg-ardoise-700"
            >
              <option value="">???</option>
              {question.choix.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          );
        })}
      </pre>

      {!enCorrection && (
        <button
          type="button"
          onClick={() => onRepondre([...saisies])}
          disabled={!toutRempli}
          className="btn btn-principal w-full"
        >
          Valider
        </button>
      )}
    </div>
  );
}
