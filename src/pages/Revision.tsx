import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import QuizEngine from '../components/quiz/QuizEngine';
import { getQuestionsByIds } from '../data/questions';
import { useProgression } from '../hooks/useProgression';
import { shuffle } from '../utils/shuffle';
import { INTERVALLES, prochaineEcheance, repartition } from '../utils/leitner';
import type { Boite } from '../utils/leitner';
import { THEME_LABELS } from '../types/quiz';
import Icone from '../components/Icone';

const MAX_PAR_SERIE = 25;

const LIBELLES_BOITE: Record<Boite, string> = {
  1: 'revue demain',
  2: 'dans 3 jours',
  3: 'dans 1 semaine',
  4: 'dans 3 semaines',
};

function formaterDate(iso: string): string {
  return new Date(`${iso}T12:00:00`).toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
}

export default function Revision() {
  const { paquet, aRevoir } = useProgression();
  const [demarre, setDemarre] = useState(false);
  const [tirage, setTirage] = useState(0);
  const [enAvance, setEnAvance] = useState(false);

  // Figé au montage : la liste se vide au fil des bonnes réponses, la série en
  // cours ne doit pas changer sous les pieds de l'utilisateur.
  const [idsDus] = useState(aRevoir);
  const idsPaquet = useMemo(() => Object.keys(paquet), [paquet]);

  const questions = useMemo(
    () => shuffle(getQuestionsByIds(enAvance ? idsPaquet : idsDus)).slice(0, MAX_PAR_SERIE),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [idsDus, idsPaquet, enAvance, tirage],
  );

  const total = idsPaquet.length;
  const parBoite = repartition(paquet);
  const echeance = prochaineEcheance(paquet);
  const dus = idsDus.length;

  if (demarre && questions.length > 0) {
    return (
      <QuizEngine
        key={`${tirage}-${enAvance}`}
        questions={questions}
        titre="Révision"
        retour={{ to: '/', libelle: 'Retour à l’accueil' }}
        onRejouer={() => {
          setTirage((n) => n + 1);
          setDemarre(false);
        }}
      />
    );
  }

  if (total === 0) {
    return (
      <div className="anim-entree mx-auto max-w-lg px-6 py-20 text-center">
        <span className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400">
          <Icone nom="coche" className="h-8 w-8" />
        </span>
        <h1 className="mb-3 text-2xl font-bold text-ardoise-900 dark:text-white">Rien à revoir</h1>
        <p className="mb-8 leading-relaxed text-ardoise-600 dark:text-ardoise-400">
          Les questions que tu rates entrent ici et reviennent à intervalles croissants : demain, 3
          jours, 1 semaine, 3 semaines. Réussies à chaque passage, elles finissent par être acquises
          et quittent le paquet.
        </p>
        <Link to="/" className="btn btn-secondaire">
          Retour à l’accueil
        </Link>
      </div>
    );
  }

  const parTheme = new Map<string, number>();
  for (const q of getQuestionsByIds(idsDus)) {
    parTheme.set(q.theme, (parTheme.get(q.theme) ?? 0) + 1);
  }

  return (
    <div className="anim-entree mx-auto max-w-lg px-6 py-14 text-center">
      <span
        className={`mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl ${
          dus > 0
            ? 'bg-encre-100 text-encre-600 dark:bg-encre-500/15 dark:text-encre-400'
            : 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400'
        }`}
      >
        <Icone nom={dus > 0 ? 'rejouer' : 'coche'} className="h-8 w-8" />
      </span>

      <h1 className="mb-3 text-3xl font-bold tracking-tight text-ardoise-900 dark:text-white">
        {dus > 0 ? 'Révision du jour' : 'À jour'}
      </h1>

      <p className="mb-8 leading-relaxed text-ardoise-600 dark:text-ardoise-400">
        {dus > 0 ? (
          <>
            {dus} question{dus > 1 ? 's' : ''} à revoir aujourd’hui, sans chrono. Une réponse juste
            repousse la question plus loin ; une erreur la ramène à demain.
          </>
        ) : (
          <>
            Rien n’est dû aujourd’hui. Prochaine échéance{' '}
            {echeance ? <strong>{formaterDate(echeance)}</strong> : 'inconnue'}.
          </>
        )}
      </p>

      {dus > 0 && parTheme.size > 0 && (
        <ul className="mb-8 flex flex-wrap justify-center gap-2">
          {[...parTheme.entries()]
            .sort((a, b) => b[1] - a[1])
            .map(([theme, n]) => (
              <li
                key={theme}
                className="puce bg-ardoise-100 text-ardoise-600 dark:bg-ardoise-800 dark:text-ardoise-300"
              >
                {THEME_LABELS[theme as keyof typeof THEME_LABELS]} · {n}
              </li>
            ))}
        </ul>
      )}

      <div className="carte mb-8 p-4 text-left">
        <p className="mb-3 text-xs font-bold tracking-wider text-ardoise-500 uppercase dark:text-ardoise-400">
          Le paquet · {total} question{total > 1 ? 's' : ''}
        </p>

        <ul className="space-y-2">
          {([1, 2, 3, 4] as Boite[]).map((b) => (
            <li key={b} className="flex items-center gap-2 text-sm">
              <span className="w-14 shrink-0 text-xs text-ardoise-500 dark:text-ardoise-400">
                Boîte {b}
              </span>
              <span className="w-7 shrink-0 text-right font-semibold text-ardoise-800 tabular-nums dark:text-ardoise-200">
                {parBoite[b]}
              </span>
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-ardoise-200 dark:bg-ardoise-800">
                <div
                  className="h-full rounded-full bg-encre-500"
                  style={{ width: `${(parBoite[b] / total) * 100}%` }}
                />
              </div>
              <span className="w-24 shrink-0 text-right text-xs text-ardoise-400 dark:text-ardoise-500">
                {LIBELLES_BOITE[b]}
              </span>
            </li>
          ))}
        </ul>

        <p className="mt-3 text-xs leading-relaxed text-ardoise-400 dark:text-ardoise-500">
          Une réussite fait monter d’une boîte — {INTERVALLES[1]}, {INTERVALLES[2]}, {INTERVALLES[3]}{' '}
          puis {INTERVALLES[4]} jours. Une erreur renvoie en boîte 1.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {dus > 0 ? (
          <button
            type="button"
            onClick={() => setDemarre(true)}
            className="btn btn-principal py-3"
          >
            Réviser {Math.min(dus, MAX_PAR_SERIE)} question{Math.min(dus, MAX_PAR_SERIE) > 1 ? 's' : ''}
          </button>
        ) : (
          <button
            type="button"
            onClick={() => {
              setEnAvance(true);
              setDemarre(true);
            }}
            className="btn btn-secondaire py-3"
          >
            Réviser en avance
          </button>
        )}
        <Link to="/" className="btn btn-secondaire">
          Retour à l’accueil
        </Link>
      </div>
    </div>
  );
}
