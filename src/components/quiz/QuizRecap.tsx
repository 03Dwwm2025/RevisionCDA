import { useNavigate } from 'react-router-dom';
import type { Question } from '../../types/quiz';

interface ResultRecord {
  correct: boolean;
  answer: unknown;
}

interface Props {
  questions: Question[];
  results: ResultRecord[];
  onRestart: () => void;
  examMode?: boolean;
  timeExpired?: boolean;
}

function formatCorrectAnswer(q: Question): string {
  switch (q.type) {
    case 'qcm':
      return q.options[q.bonneReponse];
    case 'vrai_faux':
      return q.bonneReponse ? 'Vrai' : 'Faux';
    case 'association':
      return q.paires.map((p) => `${p.gauche} → ${p.droite}`).join(' | ');
    case 'completer_code':
      return q.bonnesReponses.join(', ');
    case 'remettre_ordre':
      return q.elements.join(' → ');
  }
}

export default function QuizRecap({
  questions,
  results,
  onRestart,
  examMode,
  timeExpired,
}: Props) {
  const navigate = useNavigate();
  const score = results.filter((r) => r.correct).length;
  const total = results.length;
  const pct = total > 0 ? Math.round((score / total) * 100) : 0;

  const errors = questions
    .slice(0, total)
    .map((q, i) => ({ q, r: results[i] }))
    .filter((x) => !x.r.correct);

  const unanswered = questions.length - total;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {timeExpired && (
        <div className="mb-4 px-4 py-2 bg-orange-50 dark:bg-orange-900/20 border border-orange-300 dark:border-orange-700 rounded-lg text-sm text-orange-700 dark:text-orange-400 text-center font-medium">
          Temps écoulé — {unanswered} question{unanswered > 1 ? 's' : ''} non répondue
          {unanswered > 1 ? 's' : ''}
        </div>
      )}

      {/* Score */}
      <div
        className={`rounded-2xl p-6 text-center mb-8 border ${
          pct >= 80
            ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
            : pct >= 60
              ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800'
              : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
        }`}
      >
        <p className="text-5xl font-bold mb-1 text-gray-900 dark:text-gray-100">
          {score}{' '}
          <span className="text-2xl text-gray-500 dark:text-gray-400">/ {total}</span>
        </p>
        <p
          className={`text-lg font-semibold ${
            pct >= 80
              ? 'text-green-700 dark:text-green-400'
              : pct >= 60
                ? 'text-yellow-700 dark:text-yellow-400'
                : 'text-red-700 dark:text-red-400'
          }`}
        >
          {pct}% —{' '}
          {pct >= 80 ? 'Excellent !' : pct >= 60 ? 'Bien' : 'À retravailler'}
        </p>
      </div>

      {/* Actions */}
      <div className="flex gap-3 mb-8">
        <button
          onClick={onRestart}
          className="flex-1 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          Recommencer
        </button>
        <button
          onClick={() => (examMode ? navigate('/') : navigate(-1))}
          className="flex-1 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors"
        >
          {examMode ? 'Retour à l\'accueil' : 'Retour au cours'}
        </button>
      </div>

      {/* Error recap */}
      {errors.length > 0 ? (
        <div>
          <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
            Erreurs à revoir ({errors.length})
          </h3>
          <div className="space-y-4">
            {errors.map(({ q }) => (
              <div
                key={q.id}
                className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-4"
              >
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                  {q.enonce}
                </p>
                <p className="text-sm text-green-700 dark:text-green-400 mb-1.5">
                  <span className="font-medium">Bonne réponse :</span>{' '}
                  {formatCorrectAnswer(q)}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                  {q.explication}
                </p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-400 dark:text-gray-500 text-sm">
          Toutes les réponses étaient correctes !
        </p>
      )}
    </div>
  );
}
