import { useCallback, useSyncExternalStore } from 'react';

const CLE = 'revision-cda-checklist-v1';

/** Cases cochées, par chapitre puis par identifiant d'élément. */
type Etat = Record<string, string[]>;

function lire(): Etat {
  try {
    const brut = localStorage.getItem(CLE);
    return brut ? (JSON.parse(brut) as Etat) : {};
  } catch {
    return {};
  }
}

// État partagé : chaque case est un composant distinct, et le récapitulatif en
// tête de chapitre doit se mettre à jour dès qu'on en coche une.
let etat: Etat = lire();
const abonnes = new Set<() => void>();

function ecrire(suivant: Etat) {
  etat = suivant;
  try {
    localStorage.setItem(CLE, JSON.stringify(suivant));
  } catch {
    // Stockage indisponible : les cases restent utilisables pour la session.
  }
  abonnes.forEach((notifier) => notifier());
}

function sabonner(notifier: () => void) {
  abonnes.add(notifier);
  return () => abonnes.delete(notifier);
}

const VIDE: string[] = [];

/** Bascule une case dans la liste d'un chapitre. Fonction pure, testable. */
export function basculerCase(cochees: string[], cle: string): string[] {
  return cochees.includes(cle) ? cochees.filter((c) => c !== cle) : [...cochees, cle];
}

export function useChecklist(slug: string | undefined) {
  const cochees = useSyncExternalStore(
    sabonner,
    () => (slug ? (etat[slug] ?? VIDE) : VIDE),
    () => VIDE,
  );

  const basculer = useCallback(
    (cleElement: string) => {
      if (!slug) return;
      ecrire({ ...etat, [slug]: basculerCase(etat[slug] ?? [], cleElement) });
    },
    [slug],
  );

  const reinitialiser = useCallback(() => {
    if (!slug) return;
    const suivant = { ...etat };
    delete suivant[slug];
    ecrire(suivant);
  }, [slug]);

  return { cochees, basculer, reinitialiser, nbCochees: cochees.length };
}
