import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import QuizEngine from '../components/quiz/QuizEngine';
import { getAllQuestions } from '../data/questions';
import { shuffle } from '../utils/shuffle';

const EXAM_QUESTION_COUNT = 20;
const EXAM_DURATION_SECONDS = 30 * 60;

export default function ModeExamen() {
  const navigate = useNavigate();
  const [started, setStarted] = useState(false);
  const [examKey, setExamKey] = useState(0);

  const questions = useMemo(() => {
    const all = getAllQuestions();
    return shuffle(all).slice(0, EXAM_QUESTION_COUNT);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [examKey]);

  if (!started) {
    return (
      <div className="max-w-lg mx-auto px-6 py-12 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full mb-6 text-3xl">
          ⏱
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Mode examen
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm leading-relaxed">
          {questions.length} question{questions.length > 1 ? 's' : ''} tirées
          aléatoirement dans tous les thèmes.
          <br />
          Durée : <strong className="text-gray-700 dark:text-gray-300">30 minutes</strong>.
          <br />
          Correction et récapitulatif des erreurs à la fin.
        </p>

        <div className="flex flex-col gap-3">
          <button
            onClick={() => setStarted(true)}
            className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow transition-colors"
          >
            Commencer l'examen
          </button>
          <button
            onClick={() => navigate('/')}
            className="w-full py-2.5 border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-sm"
          >
            Retour à l'accueil
          </button>
        </div>
      </div>
    );
  }

  return (
    <QuizEngine
      key={examKey}
      questions={questions}
      onRestart={() => {
        setExamKey((k) => k + 1);
        setStarted(false);
      }}
      durationSeconds={EXAM_DURATION_SECONDS}
      examMode
    />
  );
}
