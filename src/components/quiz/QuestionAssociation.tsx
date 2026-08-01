import { useState } from 'react';
import type { QuestionAssociation as TypeAssoc } from '../../types/quiz';
import Icone from '../Icone';
import TexteRiche from './TexteRiche';

interface Props {
  question: TypeAssoc;
  droitesMelangees: string[];
  reponseValidee?: Record<string, string>;
  onRepondre: (reponse: Record<string, string>) => void;
}

export default function QuestionAssociation({
  question,
  droitesMelangees,
  reponseValidee,
  onRepondre,
}: Props) {
  const [choix, setChoix] = useState<Record<string, string>>({});
  const enCorrection = reponseValidee !== undefined;
  const courant = enCorrection ? reponseValidee : choix;
  const toutRempli = question.paires.every((p) => courant[p.gauche]);

  return (
    <div className="space-y-3">
      {question.paires.map((paire) => {
        const valeur = courant[paire.gauche] ?? '';
        const juste = enCorrection && valeur === paire.droite;

        return (
          <div key={paire.gauche} className="grid grid-cols-1 gap-2 sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1.4fr)] sm:items-center">
            <div className="rounded-xl bg-ardoise-100 px-3.5 py-2.5 text-sm font-semibold text-ardoise-800 dark:bg-ardoise-800 dark:text-ardoise-200">
              <TexteRiche>{paire.gauche}</TexteRiche>
            </div>

            <Icone
              nom="droite"
              className="hidden h-4 w-4 shrink-0 text-ardoise-400 sm:block"
            />

            {!enCorrection ? (
              <label className="block">
                <span className="sr-only">Correspondance pour {paire.gauche}</span>
                <select
                  value={valeur}
                  onChange={(e) =>
                    setChoix((prec) => ({ ...prec, [paire.gauche]: e.target.value }))
                  }
                  className="w-full rounded-xl border border-ardoise-300 bg-white px-3 py-2.5 text-sm text-ardoise-800 transition-colors hover:border-encre-400 dark:border-ardoise-700 dark:bg-ardoise-950 dark:text-ardoise-200"
                >
                  <option value="">— choisir —</option>
                  {droitesMelangees.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </label>
            ) : (
              <div
                className={`rounded-xl border px-3.5 py-2.5 text-sm ${
                  juste
                    ? 'border-emerald-400 bg-emerald-50 text-emerald-800 dark:border-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-200'
                    : 'border-rose-400 bg-rose-50 text-rose-800 dark:border-rose-700 dark:bg-rose-500/10 dark:text-rose-200'
                }`}
              >
                <span className="flex items-start gap-2">
                  <Icone
                    nom={juste ? 'coche' : 'croix'}
                    className="mt-0.5 h-4 w-4 shrink-0"
                  />
                  <span>{valeur ? <TexteRiche>{valeur}</TexteRiche> : '(sans réponse)'}</span>
                </span>
                {!juste && (
                  <span className="mt-1.5 block text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                    Attendu : <TexteRiche>{paire.droite}</TexteRiche>
                  </span>
                )}
              </div>
            )}
          </div>
        );
      })}

      {!enCorrection && (
        <button
          type="button"
          onClick={() => onRepondre({ ...choix })}
          disabled={!toutRempli}
          className="btn btn-principal mt-2 w-full"
        >
          Valider
        </button>
      )}
    </div>
  );
}
