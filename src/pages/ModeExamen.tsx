import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import QuizEngine from '../components/quiz/QuizEngine';
import { getAllQuestions } from '../data/questions';
import { tirageStratifie } from '../utils/tirage';
import Icone from '../components/Icone';

const NB_QUESTIONS = 25;
const DUREE_SECONDES = 30 * 60;

export default function ModeExamen() {
  const [demarre, setDemarre] = useState(false);
  const [tirage, setTirage] = useState(0);

  const questions = useMemo(
    () => tirageStratifie(getAllQuestions(), NB_QUESTIONS),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [tirage],
  );

  if (!demarre) {
    const themes = new Set(questions.map((q) => q.theme)).size;

    return (
      <div className="anim-entree mx-auto max-w-lg px-6 py-16 text-center">
        <span className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-100 text-rose-600 dark:bg-rose-500/15 dark:text-rose-400">
          <Icone nom="chrono" className="h-8 w-8" />
        </span>

        <h1 className="mb-3 text-3xl font-bold tracking-tight text-ardoise-900 dark:text-white">
          Examen blanc
        </h1>
        <p className="mb-8 leading-relaxed text-ardoise-600 dark:text-ardoise-400">
          {NB_QUESTIONS} questions tirées sur {themes} thèmes, en 30 minutes chrono. Le tirage
          équilibre les thèmes : aucun ne domine la série. Correction et bilan des erreurs à la fin.
        </p>

        <dl className="carte mb-8 grid grid-cols-3 divide-x divide-ardoise-200 p-4 text-center dark:divide-ardoise-800">
          <div>
            <dt className="text-xs text-ardoise-500 dark:text-ardoise-400">Questions</dt>
            <dd className="text-xl font-bold tabular-nums text-ardoise-900 dark:text-white">
              {NB_QUESTIONS}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-ardoise-500 dark:text-ardoise-400">Durée</dt>
            <dd className="text-xl font-bold tabular-nums text-ardoise-900 dark:text-white">30 min</dd>
          </div>
          <div>
            <dt className="text-xs text-ardoise-500 dark:text-ardoise-400">Thèmes</dt>
            <dd className="text-xl font-bold tabular-nums text-ardoise-900 dark:text-white">
              {themes}
            </dd>
          </div>
        </dl>

        <div className="flex flex-col gap-3">
          <button type="button" onClick={() => setDemarre(true)} className="btn btn-danger py-3">
            Démarrer le chrono
          </button>
          <Link to="/" className="btn btn-secondaire">
            Retour à l’accueil
          </Link>
        </div>
      </div>
    );
  }

  return (
    <QuizEngine
      key={tirage}
      questions={questions}
      titre="Examen blanc"
      dureeSecondes={DUREE_SECONDES}
      retour={{ to: '/', libelle: 'Retour à l’accueil' }}
      onRejouer={() => {
        setTirage((n) => n + 1);
        setDemarre(false);
      }}
    />
  );
}
