import type { QuestionQCM as QCMType } from '../../types/quiz';

interface Props {
  question: QCMType;
  submittedAnswer?: number;
  onAnswer: (answer: number) => void;
}

export default function QuestionQCM({ question, submittedAnswer, onAnswer }: Props) {
  const inCorrection = submittedAnswer !== undefined;

  return (
    <div className="space-y-2">
      {question.options.map((option, i) => {
        const isSelected = submittedAnswer === i;
        const isCorrect = i === question.bonneReponse;

        let cls =
          'w-full text-left flex items-start gap-3 px-4 py-3 rounded-lg border text-sm transition-colors ';

        if (!inCorrection) {
          cls +=
            'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:border-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 cursor-pointer';
        } else if (isCorrect) {
          cls +=
            'border-green-400 bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200 font-medium';
        } else if (isSelected) {
          cls +=
            'border-red-400 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300';
        } else {
          cls +=
            'border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 text-gray-400 dark:text-gray-500';
        }

        return (
          <button
            key={i}
            onClick={() => !inCorrection && onAnswer(i)}
            disabled={inCorrection}
            className={cls}
          >
            <span className="shrink-0 font-mono text-xs mt-0.5 w-5 text-gray-400">
              {String.fromCharCode(65 + i)}.
            </span>
            <span className="flex-1">{option}</span>
            {inCorrection && isCorrect && (
              <span className="shrink-0 text-green-600 dark:text-green-400 font-bold">✓</span>
            )}
            {inCorrection && isSelected && !isCorrect && (
              <span className="shrink-0 text-red-500 font-bold">✗</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
