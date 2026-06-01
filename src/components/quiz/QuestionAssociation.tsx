import { useState } from 'react';
import type { QuestionAssociation as AssocType } from '../../types/quiz';

interface Props {
  question: AssocType;
  shuffledRight: string[];
  submittedAnswer?: Record<string, string>;
  onAnswer: (answer: Record<string, string>) => void;
}

export default function QuestionAssociation({
  question,
  shuffledRight,
  submittedAnswer,
  onAnswer,
}: Props) {
  const [selections, setSelections] = useState<Record<string, string>>({});
  const inCorrection = submittedAnswer !== undefined;
  const current = inCorrection ? submittedAnswer : selections;
  const allSelected = question.paires.every((p) => current[p.gauche]);

  return (
    <div className="space-y-3">
      {question.paires.map((p) => {
        const userChoice = current[p.gauche] ?? '';
        const isCorrect = inCorrection && userChoice === p.droite;
        const isWrong = inCorrection && userChoice !== p.droite;

        return (
          <div key={p.gauche} className="flex items-start gap-2">
            <div className="flex-1 px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-sm font-medium text-gray-800 dark:text-gray-200 self-center">
              {p.gauche}
            </div>
            <span className="text-gray-400 self-center shrink-0">→</span>
            {!inCorrection ? (
              <select
                value={userChoice}
                onChange={(e) =>
                  setSelections((prev) => ({ ...prev, [p.gauche]: e.target.value }))
                }
                className="flex-1 px-3 py-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 rounded-lg text-sm"
              >
                <option value="">— choisir —</option>
                {shuffledRight.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            ) : (
              <div
                className={`flex-1 px-3 py-2 rounded-lg text-sm border ${
                  isCorrect
                    ? 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700 text-green-800 dark:text-green-200'
                    : 'bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-700 text-red-800 dark:text-red-200'
                }`}
              >
                {userChoice || '—'}
                {isWrong && (
                  <span className="block text-xs text-green-600 dark:text-green-400 mt-0.5">
                    ✓ {p.droite}
                  </span>
                )}
              </div>
            )}
          </div>
        );
      })}

      {!inCorrection && (
        <button
          onClick={() => onAnswer({ ...selections })}
          disabled={!allSelected}
          className="mt-1 w-full py-2.5 bg-purple-600 hover:bg-purple-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors text-sm"
        >
          Valider
        </button>
      )}
    </div>
  );
}
