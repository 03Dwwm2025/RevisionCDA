import { useState } from 'react';
import type { QuestionRemettreDansOrdre as TypeOrdre } from '../../types/quiz';
import Icone from '../Icone';
import TexteRiche from './TexteRiche';

interface Props {
  question: TypeOrdre;
  elementsMelanges: string[];
  reponseValidee?: string[];
  onRepondre: (reponse: string[]) => void;
}

export default function QuestionRemettreDansOrdre({
  question,
  elementsMelanges,
  reponseValidee,
  onRepondre,
}: Props) {
  // Indices dans `elementsMelanges`, dans l'ordre où l'utilisateur a cliqué.
  const [ordre, setOrdre] = useState<number[]>([]);
  const enCorrection = reponseValidee !== undefined;
  const reponse = enCorrection ? reponseValidee : ordre.map((i) => elementsMelanges[i]);
  const complet = ordre.length === elementsMelanges.length;

  const cliquer = (indice: number) => {
    if (enCorrection) return;
    const position = ordre.indexOf(indice);
    // Recliquer un élément déjà placé annule ce choix et tous les suivants.
    setOrdre((prec) => (position === -1 ? [...prec, indice] : prec.slice(0, position)));
  };

  if (enCorrection) {
    return (
      <ol className="space-y-2">
        {question.elements.map((element, i) => {
          const donnee = reponse[i];
          const juste = donnee === element;
          return (
            <li
              key={element}
              className={`flex items-start gap-3 rounded-xl border p-3 text-sm ${
                juste
                  ? 'border-emerald-400 bg-emerald-50 dark:border-emerald-700 dark:bg-emerald-500/10'
                  : 'border-rose-400 bg-rose-50 dark:border-rose-700 dark:bg-rose-500/10'
              }`}
            >
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-ardoise-200 text-xs font-bold text-ardoise-700 dark:bg-ardoise-700 dark:text-ardoise-200">
                {i + 1}
              </span>
              <span className="flex-1 text-ardoise-800 dark:text-ardoise-200">
                <TexteRiche>{element}</TexteRiche>
                {!juste && (
                  <span className="mt-1 block text-xs text-rose-700 dark:text-rose-300">
                    Tu avais placé : {donnee ?? '(rien)'}
                  </span>
                )}
              </span>
              <Icone
                nom={juste ? 'coche' : 'croix'}
                className={`h-5 w-5 shrink-0 ${juste ? 'text-emerald-600' : 'text-rose-600'}`}
              />
            </li>
          );
        })}
      </ol>
    );
  }

  return (
    <div>
      <div className="mb-4 rounded-xl border border-dashed border-ardoise-300 p-3 dark:border-ardoise-700">
        <p className="mb-2 text-xs text-ardoise-500 dark:text-ardoise-400">
          Ton ordre — clique un élément placé pour revenir en arrière
        </p>
        {ordre.length === 0 ? (
          <p className="py-1 text-sm text-ardoise-400 italic">
            Clique les éléments ci-dessous dans le bon ordre
          </p>
        ) : (
          <ol className="space-y-1.5">
            {ordre.map((indice, position) => (
              <li key={indice}>
                <button
                  type="button"
                  onClick={() => cliquer(indice)}
                  className="flex w-full items-center gap-2.5 rounded-lg border border-encre-300 bg-encre-50 px-3 py-2 text-left text-sm transition-colors hover:bg-encre-100 dark:border-encre-700 dark:bg-encre-500/10 dark:hover:bg-encre-500/20"
                >
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-encre-600 text-[11px] font-bold text-white">
                    {position + 1}
                  </span>
                  <span className="flex-1 text-ardoise-800 dark:text-ardoise-200">
                    <TexteRiche>{elementsMelanges[indice]}</TexteRiche>
                  </span>
                  <Icone nom="croix" className="h-3.5 w-3.5 text-encre-500" />
                </button>
              </li>
            ))}
          </ol>
        )}
      </div>

      <ul className="space-y-1.5">
        {elementsMelanges.map((element, i) => {
          const position = ordre.indexOf(i);
          const place = position !== -1;
          return (
            <li key={element}>
              <button
                type="button"
                onClick={() => cliquer(i)}
                className={`flex w-full items-center gap-2.5 rounded-lg border px-3 py-2.5 text-left text-sm transition-all ${
                  place
                    ? 'border-ardoise-200 text-ardoise-400 dark:border-ardoise-800 dark:text-ardoise-600'
                    : 'border-ardoise-200 text-ardoise-800 hover:border-encre-400 hover:bg-encre-50 dark:border-ardoise-700 dark:text-ardoise-200 dark:hover:border-encre-500 dark:hover:bg-encre-500/10'
                }`}
              >
                <span
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md text-[11px] font-bold ${
                    place
                      ? 'bg-encre-500/40 text-white'
                      : 'border border-ardoise-300 dark:border-ardoise-600'
                  }`}
                >
                  {place ? position + 1 : ''}
                </span>
                <span className="flex-1"><TexteRiche>{element}</TexteRiche></span>
              </button>
            </li>
          );
        })}
      </ul>

      <button
        type="button"
        onClick={() => onRepondre([...reponse])}
        disabled={!complet}
        className="btn btn-principal mt-4 w-full"
      >
        Valider
      </button>
    </div>
  );
}
