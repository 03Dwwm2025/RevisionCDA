import { useState } from 'react';
import type { QuestionCompleterCode as CCType } from '../../types/quiz';

interface Props {
  question: CCType;
  submittedAnswer?: string[];
  onAnswer: (answer: string[]) => void;
}

export default function QuestionCompleterCode({
  question,
  submittedAnswer,
  onAnswer,
}: Props) {
  const parts = question.codeAvecTrous.split(/(___\d+___)/g);
  const blankCount = parts.filter((p) => /^___\d+___$/.test(p)).length;

  const [userAnswers, setUserAnswers] = useState<string[]>(Array(blankCount).fill(''));
  const inCorrection = submittedAnswer !== undefined;
  const current = inCorrection ? submittedAnswer : userAnswers;
  const allFilled = current.every((a) => a !== '');

  const update = (idx: number, value: string) =>
    setUserAnswers((prev) => {
      const next = [...prev];
      next[idx] = value;
      return next;
    });

  return (
    <div>
      <pre className="bg-gray-900 dark:bg-gray-950 text-gray-100 rounded-lg p-4 text-sm font-mono leading-relaxed overflow-x-auto mb-3 whitespace-pre-wrap">
        {parts.map((part, i) => {
          const match = part.match(/^___(\d+)___$/);
          if (!match) return <span key={i}>{part}</span>;

          const blankIdx = parseInt(match[1]) - 1;
          const value = current[blankIdx] ?? '';
          const correct = inCorrection && value === question.bonnesReponses[blankIdx];
          const wrong = inCorrection && value !== question.bonnesReponses[blankIdx];

          if (inCorrection) {
            return (
              <span
                key={i}
                className={`inline-block px-2 py-0.5 rounded font-bold ${
                  correct
                    ? 'bg-green-600 text-white'
                    : 'bg-red-600 text-white'
                }`}
              >
                {value || '???'}
                {wrong && (
                  <span className="ml-1.5 text-green-300 font-normal text-xs">
                    ✓ {question.bonnesReponses[blankIdx]}
                  </span>
                )}
              </span>
            );
          }

          return (
            <select
              key={i}
              value={value}
              onChange={(e) => update(blankIdx, e.target.value)}
              className="inline-block bg-gray-700 hover:bg-gray-600 text-white rounded px-1 font-mono text-sm border border-gray-500 cursor-pointer"
            >
              <option value="">???</option>
              {question.choix.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          );
        })}
      </pre>

      {!inCorrection && (
        <button
          onClick={() => onAnswer([...userAnswers])}
          disabled={!allFilled}
          className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors text-sm"
        >
          Valider
        </button>
      )}
    </div>
  );
}
