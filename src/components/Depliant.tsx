import { useId } from 'react';
import type { ReactNode } from 'react';
import Icone from './Icone';

interface Props {
  titre: ReactNode;
  /** Affiché à droite du titre : un compteur, un badge. */
  indication?: ReactNode;
  ouvert: boolean;
  onBasculer: () => void;
  classeEntete?: string;
  children: ReactNode;
}

/**
 * Section repliable accessible : un bouton porte l'état, la zone repliée est
 * retirée du document quand elle est fermée (et non simplement masquée).
 */
export default function Depliant({
  titre,
  indication,
  ouvert,
  onBasculer,
  classeEntete = '',
  children,
}: Props) {
  const idZone = useId();

  return (
    <div>
      <button
        type="button"
        onClick={onBasculer}
        aria-expanded={ouvert}
        aria-controls={idZone}
        className={`flex w-full items-center gap-2 rounded-lg px-3 py-1.5 text-left transition-colors ${classeEntete}`}
      >
        <Icone
          nom="bas"
          className={`h-3.5 w-3.5 shrink-0 transition-transform duration-200 ${
            ouvert ? '' : '-rotate-90'
          }`}
        />
        <span className="flex-1 min-w-0">{titre}</span>
        {indication}
      </button>

      {ouvert && <div id={idZone}>{children}</div>}
    </div>
  );
}
