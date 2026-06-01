import { useState, useEffect } from 'react';
import type { ChapitreIndex } from '../types/cours';

const INDEX_URL = '/cours/index.json';

export function useCoursIndex() {
  const [chapitres, setChapitres] = useState<ChapitreIndex[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(INDEX_URL)
      .then((r) => r.json())
      .then((data: ChapitreIndex[]) => setChapitres(data))
      .finally(() => setLoading(false));
  }, []);

  return { chapitres, loading };
}

export function useChapitre(file: string | undefined) {
  const [contenu, setContenu] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!file) return;
    setLoading(true);
    setError(false);
    fetch(`/cours/${file}`)
      .then((r) => {
        if (!r.ok) throw new Error('not found');
        return r.text();
      })
      .then(setContenu)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [file]);

  return { contenu, loading, error };
}
