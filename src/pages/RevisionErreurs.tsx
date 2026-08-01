import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import QuizEngine from '../components/quiz/QuizEngine';
import { getQuestionsByIds } from '../data/questions';
import { useProgression } from '../hooks/useProgression';
import { shuffle } from '../utils/shuffle';
import { THEME_LABELS } from '../types/quiz';
import Icone from '../components/Icone';

const MAX_PAR_SERIE = 25;

export default function RevisionErreurs() {
  const { erreurs } = useProgression();
  const [demarre, setDemarre] = useState(false);
  const [tirage, setTirage] = useState(0);

  // Figé au montage : la liste se vide au fur et à mesure des bonnes réponses,
  // on ne veut pas que la série en cours change sous les pieds de l'utilisateur.
  const [idsInitiaux] = useState(erreurs);

  const questions = useMemo(
    () => shuffle(getQuestionsByIds(idsInitiaux)).slice(0, MAX_PAR_SERIE),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [idsInitiaux, tirage],
  );

  if (questions.length === 0) {
    return (
      <div className="anim-entree mx-auto max-w-lg px-6 py-20 text-center">
        <span className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400">
          <Icone nom="coche" className="h-8 w-8" />
        </span>
        <h1 className="mb-3 text-2xl font-bold text-ardoise-900 dark:text-white">
          Rien à rattraper
        </h1>
        <p className="mb-8 text-ardoise-600 dark:text-ardoise-400">
          Les questions que tu rates sont collectées ici pour être rejouées jusqu’à ce qu’elles
          passent. Ta liste est vide.
        </p>
        <Link to="/" className="btn btn-secondaire">
          Retour à l’accueil
        </Link>
      </div>
    );
  }

  if (!demarre) {
    const parTheme = new Map<string, number>();
    for (const q of questions) {
      parTheme.set(q.theme, (parTheme.get(q.theme) ?? 0) + 1);
    }

    return (
      <div className="anim-entree mx-auto max-w-lg px-6 py-16 text-center">
        <span className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-encre-100 text-encre-600 dark:bg-encre-500/15 dark:text-encre-400">
          <Icone nom="rejouer" className="h-8 w-8" />
        </span>

        <h1 className="mb-3 text-3xl font-bold tracking-tight text-ardoise-900 dark:text-white">
          Mes erreurs
        </h1>
        <p className="mb-8 leading-relaxed text-ardoise-600 dark:text-ardoise-400">
          {questions.length} question{questions.length > 1 ? 's' : ''} déjà ratée
          {questions.length > 1 ? 's' : ''}, sans chrono. Une question réussie sort de la liste ;
          une question ratée y reste.
        </p>

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

        <div className="flex flex-col gap-3">
          <button type="button" onClick={() => setDemarre(true)} className="btn btn-principal py-3">
            Rejouer la série
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
      titre="Mes erreurs"
      retour={{ to: '/', libelle: 'Retour à l’accueil' }}
      onRejouer={() => {
        setTirage((n) => n + 1);
        setDemarre(false);
      }}
    />
  );
}
