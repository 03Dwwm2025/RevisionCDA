import { useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import QuizEngine from '../components/quiz/QuizEngine';
import { QUESTIONS_BY_THEME, SLUG_TO_THEME } from '../data/questions';
import { useCoursIndex } from '../hooks/useCours';
import { shuffle } from '../utils/shuffle';
import Icone from '../components/Icone';

export default function QuizTheme() {
  const { slug } = useParams<{ slug: string }>();
  const { chapitres } = useCoursIndex();
  const [tirage, setTirage] = useState(0);

  const theme = slug ? SLUG_TO_THEME[slug] : undefined;
  const titreChapitre = chapitres.find((c) => c.file === `${slug}.md`)?.title ?? 'ce chapitre';

  // L'ordre change à chaque série : on mémorise le contenu, pas la séquence.
  const questions = useMemo(
    () => (theme ? shuffle(QUESTIONS_BY_THEME[theme] ?? []) : []),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [theme, tirage],
  );

  if (!theme || questions.length === 0) {
    return (
      <div className="mx-auto max-w-lg px-6 py-20 text-center">
        <h1 className="mb-2 text-xl font-bold text-ardoise-900 dark:text-white">
          Pas encore de questions
        </h1>
        <p className="mb-6 text-sm text-ardoise-600 dark:text-ardoise-400">
          Le chapitre « {titreChapitre} » se lit, mais n’a pas encore de série d’entraînement.
        </p>
        <Link to={`/cours/${slug}`} className="btn btn-secondaire">
          <Icone nom="gauche" className="h-4 w-4" />
          Retour au chapitre
        </Link>
      </div>
    );
  }

  return (
    <QuizEngine
      key={tirage}
      questions={questions}
      titre={titreChapitre}
      themeSerie={theme}
      retour={{ to: `/cours/${slug}`, libelle: 'Retour au chapitre' }}
      onRejouer={() => setTirage((n) => n + 1)}
    />
  );
}
