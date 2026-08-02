import { useCallback, useState } from 'react';

/**
 * Mémorise quelles sections repliables sont ouvertes, d'une visite à l'autre.
 * `ouvertesParDefaut` ne s'applique qu'à la toute première visite.
 */
export function useSectionsOuvertes(cle: string, ouvertesParDefaut: () => string[]) {
  const [ouvertes, setOuvertes] = useState<Set<string>>(() => {
    try {
      const brut = localStorage.getItem(cle);
      if (brut) return new Set(JSON.parse(brut) as string[]);
    } catch {
      // Stockage indisponible : on retombe sur les valeurs par défaut.
    }
    return new Set(ouvertesParDefaut());
  });

  const basculer = useCallback(
    (nom: string) => {
      setOuvertes((precedentes) => {
        const suivantes = new Set(precedentes);
        if (suivantes.has(nom)) suivantes.delete(nom);
        else suivantes.add(nom);

        try {
          localStorage.setItem(cle, JSON.stringify([...suivantes]));
        } catch {
          // Sans stockage, l'état reste valable pour la session en cours.
        }
        return suivantes;
      });
    },
    [cle],
  );

  return { ouvertes, basculer };
}
