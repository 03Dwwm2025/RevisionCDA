import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import QuizEngine from '../components/quiz/QuizEngine';
import { QUESTIONS_BY_THEME, SLUG_TO_THEME } from '../data/questions';
import { useCoursIndex } from '../hooks/useCours';

export default function QuizTheme() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { chapitres } = useCoursIndex();
  const [quizKey, setQuizKey] = useState(0);

  const theme = slug ? SLUG_TO_THEME[slug] : undefined;
  const questions = theme ? (QUESTIONS_BY_THEME[theme] ?? []) : [];
  const chapTitle = chapitres.find((c) => c.file === `${slug}.md`)?.title ?? slug;

  if (!theme || questions.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-12 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full mb-6 text-2xl">
          ✍️
        </div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Questions à venir
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm">
          Les questions pour « {chapTitle} » seront ajoutées prochainement.
        </p>
        <button
          onClick={() => navigate(`/cours/${slug}`)}
          className="px-5 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          Retour au cours
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="max-w-2xl mx-auto px-4 pt-6 pb-0">
        <button
          onClick={() => navigate(`/cours/${slug}`)}
          className="text-sm text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors mb-2"
        >
          ← {chapTitle}
        </button>
        <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-1">
          Quiz — {chapTitle}
        </h2>
        <p className="text-sm text-gray-400 dark:text-gray-500 mb-4">
          {questions.length} question{questions.length > 1 ? 's' : ''}
        </p>
      </div>
      <QuizEngine
        key={quizKey}
        questions={questions}
        onRestart={() => setQuizKey((k) => k + 1)}
      />
    </div>
  );
}
