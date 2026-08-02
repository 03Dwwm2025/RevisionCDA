import { useCallback, useEffect, useRef, useSyncExternalStore } from 'react';

/**
 * État des sections repliables, partagé par clé.
 *
 * La barre latérale de bureau et le tiroir mobile sont montés en même temps :
 * sans état commun, replier une section d'un côté laisserait l'autre en
 * décalage jusqu'au rechargement de la page.
 */
const valeurs = new Map<string, unknown>();
const abonnes = new Map<string, Set<() => void>>();

function lire<T>(cle: string, defaut: T): T {
  if (valeurs.has(cle)) return valeurs.get(cle) as T;

  let valeur = defaut;
  try {
    const brut = localStorage.getItem(cle);
    if (brut !== null) valeur = JSON.parse(brut) as T;
  } catch {
    // Stockage indisponible : on retombe sur la valeur par défaut.
  }
  valeurs.set(cle, valeur);
  return valeur;
}

function definir(cle: string, valeur: unknown) {
  if (valeurs.get(cle) === valeur) return;
  valeurs.set(cle, valeur);
  try {
    localStorage.setItem(cle, JSON.stringify(valeur));
  } catch {
    // Sans stockage, l'état reste valable pour la session en cours.
  }
  abonnes.get(cle)?.forEach((notifier) => notifier());
}

function sabonner(cle: string, notifier: () => void) {
  const lot = abonnes.get(cle) ?? new Set();
  lot.add(notifier);
  abonnes.set(cle, lot);
  return () => lot.delete(notifier);
}

function useValeur<T>(cle: string, defaut: T): T {
  const instantane = useCallback(() => lire(cle, defaut), [cle, defaut]);
  return useSyncExternalStore((n) => sabonner(cle, n), instantane, instantane);
}

/** Bascule d'une section repliable isolée, mémorisée d'une visite à l'autre. */
export function useDepliant(cle: string, ouvertParDefaut = false) {
  const ouvert = useValeur(cle, ouvertParDefaut);
  const basculer = useCallback(() => definir(cle, !lire(cle, ouvertParDefaut)), [cle, ouvertParDefaut]);
  return [ouvert, basculer] as const;
}

/**
 * Une seule section ouverte à la fois : rouvrir celle qui l'est déjà la ferme.
 * Fonction pure, pour pouvoir la tester sans monter de composant.
 */
export function basculerExclusif(ouverte: string | null, demandee: string): string | null {
  return ouverte === demandee ? null : demandee;
}

/**
 * Groupe de sections dont une seule reste ouverte. `sectionCourante` est celle
 * du contenu affiché : y naviguer ouvre sa section et referme les autres.
 */
export function useSectionExclusive(
  cle: string,
  sectionCourante: string | null,
  defaut: string | null = null,
) {
  const ouverte = useValeur<string | null>(cle, defaut);

  // Une référence, et non un état : suivre la navigation ne doit pas provoquer
  // de rendu supplémentaire, seul le changement de section en déclenche un.
  const derniereVue = useRef(sectionCourante);
  useEffect(() => {
    if (sectionCourante && sectionCourante !== derniereVue.current) {
      derniereVue.current = sectionCourante;
      definir(cle, sectionCourante);
    }
  }, [cle, sectionCourante]);

  const basculer = useCallback(
    (nom: string) => definir(cle, basculerExclusif(lire<string | null>(cle, defaut), nom)),
    [cle, defaut],
  );

  return { ouverte, basculer };
}
