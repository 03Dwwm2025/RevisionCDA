import { useState, useEffect } from 'react';
import type { ChapitreIndex } from '../types/cours';
import type { Partie } from '../utils/parties';

const INDEX_URL = '/cours/index.json';
const PARTIES_URL = '/cours/parties.json';

let partiesEnCours: Promise<Partie[]> | null = null;

export function useParties() {
  const [parties, setParties] = useState<Partie[]>([]);

  useEffect(() => {
    let annule = false;
    partiesEnCours ??= fetch(PARTIES_URL)
      .then((r) => r.json() as Promise<Partie[]>)
      .catch(() => {
        partiesEnCours = null;
        return [];
      });
    partiesEnCours.then((p) => {
      if (!annule) setParties(p);
    });
    return () => {
      annule = true;
    };
  }, []);

  return parties;
}

// L'index est demandé par la barre latérale, l'accueil et chaque page :
// une seule requête réseau partagée par tous les appelants.
let indexEnCours: Promise<ChapitreIndex[]> | null = null;

function chargerIndex(): Promise<ChapitreIndex[]> {
  indexEnCours ??= fetch(INDEX_URL)
    .then((r) => r.json() as Promise<ChapitreIndex[]>)
    .catch(() => {
      indexEnCours = null;
      return [];
    });
  return indexEnCours;
}

export function useCoursIndex() {
  const [etat, setEtat] = useState<{ chapitres: ChapitreIndex[]; loading: boolean }>({
    chapitres: [],
    loading: true,
  });

  useEffect(() => {
    let annule = false;
    chargerIndex().then((chapitres) => {
      if (!annule) setEtat({ chapitres, loading: false });
    });
    return () => {
      annule = true;
    };
  }, []);

  return etat;
}

interface EtatChapitre {
  file: string | undefined;
  contenu: string | null;
  error: boolean;
}

export function useChapitre(file: string | undefined) {
  // On mémorise le fichier chargé : tant qu'il diffère de celui demandé,
  // on est en chargement — pas besoin d'un setState dans le corps de l'effet.
  const [etat, setEtat] = useState<EtatChapitre>({
    file: undefined,
    contenu: null,
    error: false,
  });

  useEffect(() => {
    if (!file) return;
    let annule = false;

    fetch(`/cours/${file}`)
      .then((r) => {
        if (!r.ok) throw new Error('chapitre introuvable');
        return r.text();
      })
      .then((contenu) => {
        if (!annule) setEtat({ file, contenu, error: false });
      })
      .catch(() => {
        if (!annule) setEtat({ file, contenu: null, error: true });
      });

    return () => {
      annule = true;
    };
  }, [file]);

  const loading = etat.file !== file;

  return {
    contenu: loading ? null : etat.contenu,
    loading,
    error: !loading && etat.error,
  };
}
