import { useState, useMemo, useEffect } from 'react';
import type { Question } from '../../types/quiz';
import { shuffle } from '../../utils/shuffle';
import { checkAnswer } from './checkAnswer';
import QuestionQCM from './QuestionQCM';
import QuestionVraiFaux from './QuestionVraiFaux';
import QuestionAssociation from './QuestionAssociation';
import QuestionCompleterCode from './QuestionCompleterCode';
import QuestionRemettreDansOrdre from './QuestionRemettreDansOrdre';
import QuizRecap from './QuizRecap';

interface PreparedQuestion {
  question: Question;
  shuffledRight: string[];
  shuffledElements: string[];
}

interface ResultRecord {
  correct: boolean;
  answer: unknown;
}

interface Props {
  questions: Question[];
  onRestart: () => void;
  durationSeconds?: number;
  examMode?: boolean;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
    .toString()
    .padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

export default function QuizEngine({
  questions,
  onRestart,
  durationSeconds,
  examMode,
}: Props) {
  const prepared = useMemo<PreparedQuestion[]>(
    () =>
      questions.map((q) => ({
        question: q,
        shuffledRight:
          q.type === 'association' ? shuffle(q.paires.map((p) => p.droite)) : [],
        shuffledElements:
          q.type === 'remettre_ordre' ? shuffle([...q.elements]) : [],
      })),
    [questions],
  );

  const [currentIndex, setCurrentIndex] = useState(0);
  const [submittedAnswer, setSubmittedAnswer] = useState<unknown>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [allResults, setAllResults] = useState<ResultRecord[]>([]);
  const [showRecap, setShowRecap] = useState(false);
  const [timeLeft, setTimeLeft] = useState(durationSeconds ?? null);
  const [timeExpired, setTimeExpired] = useState(false);

  // Countdown timer for exam mode
  useEffect(() => {
    if (timeLeft === null || showRecap) return;
    if (timeLeft <= 0) {
      setTimeExpired(true);
      setShowRecap(true);
      return;
    }
    const id = setTimeout(() => setTimeLeft((t) => (t ?? 1) - 1), 1000);
    return () => clearTimeout(id);
  }, [timeLeft, showRecap]);

  const current = prepared[currentIndex];
  const q = current.question;
  const inCorrection = submittedAnswer !== null;

  const handleSubmit = (answer: unknown) => {
    const correct = checkAnswer(q, answer);
    setSubmittedAnswer(answer);
    setIsCorrect(correct);
  };

  const handleNext = () => {
    const newResults = [
      ...allResults,
      { correct: isCorrect!, answer: submittedAnswer },
    ];
    setAllResults(newResults);
    if (currentIndex + 1 >= questions.length) {
      setShowRecap(true);
    } else {
      setCurrentIndex((i) => i + 1);
      setSubmittedAnswer(null);
      setIsCorrect(null);
    }
  };

  if (showRecap) {
    return (
      <QuizRecap
        questions={questions}
        results={allResults}
        onRestart={onRestart}
        examMode={examMode}
        timeExpired={timeExpired}
      />
    );
  }

  const progress = (currentIndex / questions.length) * 100;
  const timerColor =
    timeLeft === null
      ? ''
      : timeLeft > 300
        ? 'text-green-600 dark:text-green-400'
        : timeLeft > 60
          ? 'text-yellow-600 dark:text-yellow-400'
          : 'text-red-600 dark:text-red-400 animate-pulse';

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {/* Progress bar */}
      <div className="mb-5">
        <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400 mb-1">
          <span>
            Question {currentIndex + 1} / {questions.length}
          </span>
          <div className="flex items-center gap-4">
            <span>{allResults.filter((r) => r.correct).length} correcte{allResults.filter((r) => r.correct).length > 1 ? 's' : ''}</span>
            {timeLeft !== null && (
              <span className={`font-mono font-bold ${timerColor}`}>
                {formatTime(timeLeft)}
              </span>
            )}
          </div>
        </div>
        <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full">
          <div
            className="h-full bg-purple-500 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Difficulty */}
      <div className="mb-3">
        <span
          className={`text-xs font-medium px-2 py-0.5 rounded-full ${
            q.difficulte === 1
              ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
              : q.difficulte === 2
                ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
          }`}
        >
          {'★'.repeat(q.difficulte)}
          {'☆'.repeat(3 - q.difficulte)}
        </span>
      </div>

      {/* Question card */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-5 mb-4">
        <p className="text-gray-900 dark:text-gray-100 font-medium leading-relaxed mb-4">
          {q.enonce}
        </p>

        {q.type === 'qcm' && (
          <QuestionQCM
            question={q}
            submittedAnswer={inCorrection ? (submittedAnswer as number) : undefined}
            onAnswer={handleSubmit}
          />
        )}
        {q.type === 'vrai_faux' && (
          <QuestionVraiFaux
            question={q}
            submittedAnswer={
              inCorrection ? (submittedAnswer as boolean) : undefined
            }
            onAnswer={handleSubmit}
          />
        )}
        {q.type === 'association' && (
          <QuestionAssociation
            question={q}
            shuffledRight={current.shuffledRight}
            submittedAnswer={
              inCorrection
                ? (submittedAnswer as Record<string, string>)
                : undefined
            }
            onAnswer={handleSubmit}
          />
        )}
        {q.type === 'completer_code' && (
          <QuestionCompleterCode
            question={q}
            submittedAnswer={
              inCorrection ? (submittedAnswer as string[]) : undefined
            }
            onAnswer={handleSubmit}
          />
        )}
        {q.type === 'remettre_ordre' && (
          <QuestionRemettreDansOrdre
            question={q}
            shuffledElements={current.shuffledElements}
            submittedAnswer={
              inCorrection ? (submittedAnswer as string[]) : undefined
            }
            onAnswer={handleSubmit}
          />
        )}
      </div>

      {/* Correction feedback */}
      {inCorrection && (
        <div
          className={`rounded-xl border p-4 mb-4 ${
            isCorrect
              ? 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700'
              : 'bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-700'
          }`}
        >
          <p
            className={`font-semibold mb-1 ${
              isCorrect
                ? 'text-green-700 dark:text-green-400'
                : 'text-red-700 dark:text-red-400'
            }`}
          >
            {isCorrect ? '✓ Correct !' : '✗ Incorrect'}
          </p>
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
            {q.explication}
          </p>
        </div>
      )}

      {/* Next button */}
      {inCorrection && (
        <div className="flex justify-end">
          <button
            onClick={handleNext}
            className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors"
          >
            {currentIndex + 1 >= questions.length
              ? 'Voir le récapitulatif'
              : 'Question suivante →'}
          </button>
        </div>
      )}
    </div>
  );
}
