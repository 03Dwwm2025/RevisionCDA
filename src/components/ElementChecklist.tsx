import { Children, isValidElement } from 'react';
import type { ReactNode } from 'react';
import { useParams } from 'react-router-dom';
import { useChecklist } from '../hooks/useChecklist';
import { cleElement, texteDe } from '../utils/noeuds';

/**
 * Élément de liste à cocher issu du markdown.
 *
 * Le moteur de rendu produit une case désactivée : on la remplace par une vraie
 * case interactive, dont l'état est mémorisé. La clé vient du texte de la ligne
 * et non de sa position — réordonner la checklist ne perd pas les coches.
 *
 * Le composant lit l'état lui-même : la table des composants markdown reste
 * ainsi constante, et cocher une case ne remonte pas tout le chapitre.
 */
export default function ElementChecklist({ children }: { children: ReactNode }) {
  const { slug } = useParams<{ slug: string }>();
  const { cochees, basculer } = useChecklist(slug);

  // On écarte la case produite par le markdown, on garde le libellé.
  const contenu = Children.toArray(children).filter(
    (enfant) => !(isValidElement(enfant) && enfant.type === 'input'),
  );

  const cle = cleElement(texteDe(contenu));
  const coche = cochees.includes(cle);

  return (
    <li className="!list-none">
      <label className="-mx-2 flex cursor-pointer items-start gap-3 rounded-lg px-2 py-1.5 transition-colors hover:bg-ardoise-100 dark:hover:bg-ardoise-800">
        <input
          type="checkbox"
          checked={coche}
          onChange={() => basculer(cle)}
          className="mt-1.5 h-4 w-4 shrink-0 cursor-pointer accent-encre-600"
        />
        <span
          className={
            coche
              ? 'text-ardoise-400 line-through decoration-ardoise-300 dark:text-ardoise-500 dark:decoration-ardoise-600'
              : ''
          }
        >
          {contenu}
        </span>
      </label>
    </li>
  );
}
