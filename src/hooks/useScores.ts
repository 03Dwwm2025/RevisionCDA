import { useState, useCallback } from 'react';
import type { ScoreTheme, Theme } from '../types/quiz';

const STORAGE_KEY = 'revision-cda-scores';

function loadScores(): Partial<Record<Theme, ScoreTheme>> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveScores(scores: Record<string, ScoreTheme>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(scores));
}

export function useScores() {
  const [scores, setScores] = useState<Partial<Record<Theme, ScoreTheme>>>(loadScores);

  const enregistrerScore = useCallback(
    (theme: Theme, score: number, total: number) => {
      const updated = {
        ...scores,
        [theme]: { theme, score, total, date: new Date().toISOString() },
      };
      saveScores(updated);
      setScores(updated);
    },
    [scores],
  );

  return { scores, enregistrerScore };
}
