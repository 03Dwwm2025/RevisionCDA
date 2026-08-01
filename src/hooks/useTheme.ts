import { useCallback, useEffect, useSyncExternalStore } from 'react';

export type ModeTheme = 'clair' | 'sombre' | 'systeme';

const CLE = 'revision-cda-theme';

function lireMode(): ModeTheme {
  try {
    const brut = localStorage.getItem(CLE);
    return brut === 'clair' || brut === 'sombre' ? brut : 'systeme';
  } catch {
    return 'systeme';
  }
}

// Le thème est un état global : plusieurs boutons de bascule coexistent
// (barre latérale de bureau, tiroir mobile) et doivent rester synchronisés.
let mode: ModeTheme = lireMode();
const abonnes = new Set<() => void>();

function sombrePour(m: ModeTheme): boolean {
  if (m === 'sombre') return true;
  if (m === 'clair') return false;
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

export function appliquerTheme(m: ModeTheme = mode) {
  document.documentElement.classList.toggle('dark', sombrePour(m));
}

function definirMode(nouveau: ModeTheme) {
  mode = nouveau;
  appliquerTheme(nouveau);
  try {
    localStorage.setItem(CLE, nouveau);
  } catch {
    // Stockage indisponible : le thème reste appliqué pour la session en cours.
  }
  abonnes.forEach((notifier) => notifier());
}

function sabonner(notifier: () => void) {
  abonnes.add(notifier);
  return () => abonnes.delete(notifier);
}

export function useTheme() {
  const modeCourant = useSyncExternalStore(sabonner, () => mode, () => mode);

  // En mode système, on suit les changements de préférence de l'OS en direct.
  useEffect(() => {
    if (modeCourant !== 'systeme') return;
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const suivre = () => appliquerTheme('systeme');
    media.addEventListener('change', suivre);
    return () => media.removeEventListener('change', suivre);
  }, [modeCourant]);

  const basculer = useCallback(() => {
    definirMode(mode === 'clair' ? 'sombre' : mode === 'sombre' ? 'systeme' : 'clair');
  }, []);

  return { mode: modeCourant, setMode: definirMode, basculer, sombre: sombrePour(modeCourant) };
}
