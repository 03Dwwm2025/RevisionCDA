import { useState } from 'react';
import type { QuestionRemettreDansOrdre as RDOType } from '../../types/quiz';

interface Props {
  question: RDOType;
  shuffledElements: string[];
  submittedAnswer?: string[];
  onAnswer: (answer: string[]) => void;
}

export default function QuestionRemettreDansOrdre({
  question,
  shuffledElements,
  submittedAnswer,
  onAnswer,
}: Props) {
  // selectedOrder: indices into shuffledElements, in the order the user clicked them
  const [selectedOrder, setSelectedOrder] = useState<number[]>([]);
  const inCorrection = submittedAnswer !== undefined;

  const userAnswer = inCorrection
    ? submittedAnswer
    : selectedOrder.map((i) => shuffledElements[i]);

  const allSelected = !inCorrection && selectedOrder.length === shuffledElements.length;

  const handleClick = (idx: number) => {
    if (inCorrection) return;
    if (selectedOrder.includes(idx)) {
      // Remove this item and everything after it
      const pos = selectedOrder.indexOf(idx);
      setSelectedOrder((prev) => prev.slice(0, pos));
    } else {
      setSelectedOrder((prev) => [...prev, idx]);
    }
  };

  return (
    <div>
      {/* Sequence being built (interactive mode only) */}
      {!inCorrection && (
        <div className="mb-4">
          <p className="text-xs text-gray-400 dark:text-gray-500 mb-1.5">
            Votre ordre — cliquez un élément pour l'annuler
          </p>
          <div className="flex flex-col gap-1 min-h-8">
            {selectedOrder.length === 0 ? (
              <p className="text-sm text-gray-400 italic">
                Cliquez les éléments ci-dessous dans le bon ordre
              </p>
            ) : (
              selectedOrder.map((idx, pos) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 px-3 py-1.5 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-700 rounded-lg text-sm cursor-pointer hover:bg-purple-100 dark:hover:bg-purple-900/40"
                  onClick={() => handleClick(idx)}
                >
                  <span className="w-5 h-5 rounded-full bg-purple-500 text-white text-xs flex items-center justify-center font-bold shrink-0">
                    {pos + 1}
                  </span>
                  <span className="text-gray-800 dark:text-gray-200 flex-1">
                    {shuffledElements[idx]}
                  </span>
                  <span className="text-purple-400 text-xs">✕</span>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Pool of items (interactive) or correct-order correction */}
      <div className="space-y-1.5">
        {inCorrection
          ? question.elements.map((element, i) => {
              const userEl = userAnswer[i];
              const ok = userEl === element;
              return (
                <div
                  key={i}
                  className={`flex items-start gap-2 px-3 py-2 rounded-lg border text-sm ${
                    ok
                      ? 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700 text-green-800 dark:text-green-200'
                      : 'bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-700 text-red-800 dark:text-red-200'
                  }`}
                >
                  <span className="w-5 h-5 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs flex items-center justify-center font-bold shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <span className="flex-1">{element}</span>
                  <span className="shrink-0">{ok ? '✓' : '✗'}</span>
                </div>
              );
            })
          : shuffledElements.map((element, i) => {
              const pos = selectedOrder.indexOf(i);
              const isSelected = pos !== -1;
              return (
                <button
                  key={i}
                  onClick={() => handleClick(i)}
                  className={`w-full text-left flex items-center gap-2 px-3 py-2 rounded-lg border text-sm transition-colors ${
                    isSelected
                      ? 'border-purple-200 dark:border-purple-700 bg-purple-50/50 dark:bg-purple-900/10 text-gray-400 dark:text-gray-500'
                      : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:border-purple-400 cursor-pointer'
                  }`}
                >
                  {isSelected ? (
                    <span className="w-5 h-5 rounded-full bg-purple-400 text-white text-xs flex items-center justify-center font-bold shrink-0">
                      {pos + 1}
                    </span>
                  ) : (
                    <span className="w-5 h-5 rounded-full border border-gray-300 dark:border-gray-600 shrink-0" />
                  )}
                  <span>{element}</span>
                </button>
              );
            })}
      </div>

      {!inCorrection && (
        <button
          onClick={() => onAnswer([...userAnswer])}
          disabled={!allSelected}
          className="mt-3 w-full py-2.5 bg-purple-600 hover:bg-purple-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors text-sm"
        >
          Valider
        </button>
      )}
    </div>
  );
}
