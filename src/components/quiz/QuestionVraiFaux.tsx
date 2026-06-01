import type { QuestionVraiFaux as VFType } from '../../types/quiz';

interface Props {
  question: VFType;
  submittedAnswer?: boolean;
  onAnswer: (answer: boolean) => void;
}

export default function QuestionVraiFaux({ question, submittedAnswer, onAnswer }: Props) {
  const inCorrection = submittedAnswer !== undefined;

  const btnCls = (value: boolean) => {
    const isSelected = submittedAnswer === value;
    const isCorrect = value === question.bonneReponse;
    let cls =
      'flex-1 py-4 rounded-xl border-2 font-bold text-lg transition-colors ';

    if (!inCorrection) {
      cls +=
        'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 cursor-pointer';
    } else if (isCorrect) {
      cls +=
        'border-green-400 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300';
    } else if (isSelected) {
      cls +=
        'border-red-400 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400';
    } else {
      cls +=
        'border-gray-100 dark:border-gray-800 text-gray-300 dark:text-gray-600';
    }
    return cls;
  };

  return (
    <div className="flex gap-4">
      {[true, false].map((value) => (
        <button
          key={String(value)}
          onClick={() => !inCorrection && onAnswer(value)}
          disabled={inCorrection}
          className={btnCls(value)}
        >
          {value ? '✓ Vrai' : '✗ Faux'}
        </button>
      ))}
    </div>
  );
}
