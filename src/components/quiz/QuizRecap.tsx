import { Link } from 'react-router-dom';
import type { Question, ResultatQuestion } from '../../types/quiz';
import { THEME_LABELS } from '../../types/quiz';
import Icone from '../Icone';
import TexteRiche from './TexteRiche';
import type { Retour } from './QuizEngine';

interface Props {
  questions: Question[];
  resultats: ResultatQuestion[];
  retour: Retour;
  onRejouer: () => void;
  tempsEcoule?: boolean;
}

function bonneReponseLisible(q: Question): string {
  switch (q.type) {
    case 'qcm':
      return q.options[q.bonneReponse];
    case 'vrai_faux':
      return q.bonneReponse ? 'Vrai' : 'Faux';
    case 'association':
      return q.paires.map((p) => `${p.gauche} → ${p.droite}`).join(' · ');
    case 'completer_code':
      return q.bonnesReponses.join(' · ');
    case 'remettre_ordre':
      return q.elements.join(' → ');
  }
}

/** Anneau de progression : plus lisible qu'une barre pour un score final. */
function Anneau({ pourcent, couleur }: { pourcent: number; couleur: string }) {
  const rayon = 52;
  const circonference = 2 * Math.PI * rayon;

  return (
    <svg viewBox="0 0 120 120" className="h-32 w-32 -rotate-90">
      <circle
        cx="60"
        cy="60"
        r={rayon}
        fill="none"
        strokeWidth="10"
        className="stroke-ardoise-200 dark:stroke-ardoise-800"
      />
      <circle
        cx="60"
        cy="60"
        r={rayon}
        fill="none"
        strokeWidth="10"
        strokeLinecap="round"
        className={couleur}
        strokeDasharray={circonference}
        strokeDashoffset={circonference * (1 - pourcent / 100)}
      />
    </svg>
  );
}

export default function QuizRecap({ questions, resultats, retour, onRejouer, tempsEcoule }: Props) {
  const score = resultats.filter((r) => r.correct).length;
  const total = resultats.length;
  const pourcent = total > 0 ? Math.round((score / total) * 100) : 0;
  const nonRepondues = questions.length - total;

  const parId = new Map(questions.map((q) => [q.id, q]));
  const erreurs = resultats
    .filter((r) => !r.correct)
    .map((r) => parId.get(r.id))
    .filter((q): q is Question => q !== undefined);

  const [teinte, anneau, verdict] =
    pourcent >= 80
      ? ['text-emerald-600 dark:text-emerald-400', 'stroke-emerald-500', 'Solide']
      : pourcent >= 60
        ? ['text-amber-600 dark:text-amber-400', 'stroke-amber-500', 'À consolider']
        : ['text-rose-600 dark:text-rose-400', 'stroke-rose-500', 'À retravailler'];

  return (
    <div className="anim-entree mx-auto max-w-3xl px-5 py-8 sm:px-8 sm:py-12">
      {tempsEcoule && (
        <p className="mb-6 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-center text-sm font-medium text-amber-800 dark:border-amber-700 dark:bg-amber-500/10 dark:text-amber-300">
          Temps écoulé — {nonRepondues} question{nonRepondues > 1 ? 's' : ''} sans réponse
        </p>
      )}

      <div className="carte mb-6 flex flex-col items-center gap-6 p-8 sm:flex-row sm:justify-center sm:gap-10">
        <div className="relative flex items-center justify-center">
          <Anneau pourcent={pourcent} couleur={anneau} />
          <span className="absolute text-center">
            <span className={`block text-3xl font-bold tabular-nums ${teinte}`}>{pourcent} %</span>
          </span>
        </div>

        <div className="text-center sm:text-left">
          <p className="text-2xl font-bold text-ardoise-900 dark:text-white">{verdict}</p>
          <p className="mt-1 text-ardoise-600 tabular-nums dark:text-ardoise-400">
            {score} bonne{score > 1 ? 's' : ''} réponse{score > 1 ? 's' : ''} sur {total}
          </p>
          {erreurs.length > 0 && (
            <p className="mt-3 text-sm text-ardoise-500 dark:text-ardoise-400">
              Les questions ratées sont ajoutées à « Mes erreurs » pour être rejouées.
            </p>
          )}
        </div>
      </div>

      <div className="mb-10 flex flex-wrap gap-3">
        <button type="button" onClick={onRejouer} className="btn btn-principal">
          <Icone nom="rejouer" className="h-4 w-4" />
          Recommencer
        </button>
        <Link to={retour.to} className="btn btn-secondaire">
          <Icone nom="gauche" className="h-4 w-4" />
          {retour.libelle}
        </Link>
        {erreurs.length > 0 && (
          <Link to="/erreurs" className="btn btn-secondaire">
            <Icone nom="cible" className="h-4 w-4" />
            Rejouer mes erreurs
          </Link>
        )}
      </div>

      {erreurs.length > 0 ? (
        <section>
          <h2 className="mb-4 text-sm font-bold tracking-wider text-ardoise-500 uppercase dark:text-ardoise-400">
            À revoir ({erreurs.length})
          </h2>
          <ul className="space-y-3">
            {erreurs.map((q) => (
              <li key={q.id} className="carte p-5">
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <span className="puce bg-ardoise-100 text-ardoise-600 dark:bg-ardoise-800 dark:text-ardoise-400">
                    {THEME_LABELS[q.theme]}
                  </span>
                </div>
                <p className="mb-3 font-medium text-ardoise-900 dark:text-ardoise-100"><TexteRiche>{q.enonce}</TexteRiche></p>
                <p className="mb-2 flex items-start gap-2 text-sm text-emerald-700 dark:text-emerald-300">
                  <Icone nom="coche" className="mt-0.5 h-4 w-4 shrink-0" />
                  <span><TexteRiche>{bonneReponseLisible(q)}</TexteRiche></span>
                </p>
                <p className="text-sm leading-relaxed text-ardoise-600 dark:text-ardoise-400">
                  <TexteRiche>{q.explication}</TexteRiche>
                </p>
              </li>
            ))}
          </ul>
        </section>
      ) : (
        total > 0 && (
          <p className="text-center text-ardoise-500 dark:text-ardoise-400">
            Aucune erreur sur cette série.
          </p>
        )
      )}
    </div>
  );
}
