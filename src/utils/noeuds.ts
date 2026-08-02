import { isValidElement } from 'react';
import type { ReactNode } from 'react';
import { ancre } from './recherche';

/** Aplatit un nœud React en texte brut, quelle que soit sa profondeur. */
export function texteDe(noeud: ReactNode): string {
  if (typeof noeud === 'string' || typeof noeud === 'number') return String(noeud);
  if (Array.isArray(noeud)) return noeud.map(texteDe).join('');
  if (isValidElement(noeud)) {
    return texteDe((noeud.props as { children?: ReactNode }).children);
  }
  return '';
}

/**
 * Clé d'un élément de checklist : dérivée de son texte, pas de sa position.
 * Réordonner la liste ne fait donc pas perdre les cases cochées.
 */
export function cleElement(texte: string): string {
  return ancre(texte).slice(0, 60);
}
