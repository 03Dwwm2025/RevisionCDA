interface Props {
  nom: NomIcone;
  className?: string;
}

export type NomIcone =
  | 'menu'
  | 'fermer'
  | 'soleil'
  | 'lune'
  | 'ecran'
  | 'gauche'
  | 'droite'
  | 'livre'
  | 'cible'
  | 'chrono'
  | 'coche'
  | 'croix'
  | 'rejouer'
  | 'accueil'
  | 'eclair'
  | 'liste';

// Traits SVG 24x24, contour uniquement : un seul jeu d'icônes, aucune dépendance.
const TRACES: Record<NomIcone, string> = {
  menu: 'M4 7h16M4 12h16M4 17h16',
  fermer: 'M6 6l12 12M18 6L6 18',
  soleil: 'M12 4v2m0 12v2M4 12H2m20 0h-2M6.3 6.3L4.9 4.9m14.2 14.2l-1.4-1.4M6.3 17.7l-1.4 1.4M19.1 4.9l-1.4 1.4M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0z',
  lune: 'M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5z',
  ecran: 'M3 5h18v11H3zM8 20h8M12 16v4',
  gauche: 'M15 5l-7 7 7 7',
  droite: 'M9 5l7 7-7 7',
  livre: 'M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z',
  cible: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zm0 5a4 4 0 1 0 0 8 4 4 0 0 0 0-8zm0 3.5a.5.5 0 1 0 0 1 .5.5 0 0 0 0-1z',
  chrono: 'M12 8v5l3 2M12 4a8 8 0 1 0 0 16 8 8 0 0 0 0-16zM9 2h6',
  coche: 'M4 12.5l5 5L20 6.5',
  croix: 'M6 6l12 12M18 6L6 18',
  rejouer: 'M3 12a9 9 0 1 0 3-6.7M3 4v5h5',
  accueil: 'M4 11l8-7 8 7M6 10v10h12V10',
  eclair: 'M13 2L4 14h7l-1 8 9-12h-7z',
  liste: 'M8 6h13M8 12h13M8 18h13M3.5 6h.01M3.5 12h.01M3.5 18h.01',
};

export default function Icone({ nom, className = 'h-5 w-5' }: Props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d={TRACES[nom]} />
    </svg>
  );
}
