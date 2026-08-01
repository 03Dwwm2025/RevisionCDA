import { NavLink } from 'react-router-dom';
import type { ChapitreIndex } from '../types/cours';
import { SLUG_TO_THEME } from '../data/questions/chapitres';
import { NB_QUESTIONS_PAR_THEME } from '../data/questions/compte';
import { accentPartie } from '../utils/parties';
import Icone from './Icone';
import type { NomIcone } from './Icone';

interface Props {
  chapitres: ChapitreIndex[];
  nbErreurs: number;
  onNaviguer?: () => void;
}

function slugDe(file: string) {
  return file.replace(/\.md$/, '');
}

function nbQuestions(slug: string): number {
  const theme = SLUG_TO_THEME[slug];
  return theme ? NB_QUESTIONS_PAR_THEME[theme] : 0;
}

function LienPrincipal({
  to,
  icone,
  libelle,
  badge,
  onNaviguer,
}: {
  to: string;
  icone: NomIcone;
  libelle: string;
  badge?: number;
  onNaviguer?: () => void;
}) {
  return (
    <NavLink
      to={to}
      end={to === '/'}
      onClick={onNaviguer}
      className={({ isActive }) =>
        `flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
          isActive
            ? 'bg-encre-600 text-white'
            : 'text-ardoise-600 hover:bg-ardoise-100 dark:text-ardoise-400 dark:hover:bg-ardoise-800'
        }`
      }
    >
      <Icone nom={icone} className="h-[18px] w-[18px] shrink-0" />
      <span className="flex-1">{libelle}</span>
      {badge !== undefined && badge > 0 && (
        <span className="rounded-full bg-rose-500 px-1.5 py-px text-[11px] font-bold text-white">
          {badge}
        </span>
      )}
    </NavLink>
  );
}

export default function Sidebar({ chapitres, nbErreurs, onNaviguer }: Props) {
  const parParties = new Map<string, ChapitreIndex[]>();
  for (const c of chapitres) {
    const cle = c.part ?? 'AUTRES';
    const lot = parParties.get(cle);
    if (lot) lot.push(c);
    else parParties.set(cle, [c]);
  }

  return (
    <nav
      className="flex h-full flex-col gap-1 overflow-y-auto px-3 py-4"
      aria-label="Navigation du cours"
    >
      <LienPrincipal to="/" icone="accueil" libelle="Accueil" onNaviguer={onNaviguer} />
      <LienPrincipal to="/examen" icone="chrono" libelle="Mode examen" onNaviguer={onNaviguer} />
      <LienPrincipal
        to="/erreurs"
        icone="rejouer"
        libelle="Mes erreurs"
        badge={nbErreurs}
        onNaviguer={onNaviguer}
      />

      <hr className="my-3 border-ardoise-200 dark:border-ardoise-800" />

      {[...parParties.entries()].map(([partie, items]) => {
        const accent = accentPartie(partie);
        return (
          <div key={partie} className="mb-4">
            <p
              className={`mb-1.5 flex items-center gap-2 px-3 text-[11px] font-bold tracking-wider uppercase ${accent.texte}`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${accent.point}`} />
              {partie}
            </p>

            {items.map((c) => {
              const slug = slugDe(c.file);
              const n = nbQuestions(slug);
              return (
                <NavLink
                  key={c.file}
                  to={`/cours/${slug}`}
                  onClick={onNaviguer}
                  className={({ isActive }) =>
                    `flex items-center gap-2 rounded-lg px-3 py-1.5 text-[13px] leading-snug transition-colors ${
                      isActive
                        ? 'bg-encre-50 font-semibold text-encre-700 dark:bg-encre-500/15 dark:text-encre-300'
                        : 'text-ardoise-600 hover:bg-ardoise-100 dark:text-ardoise-400 dark:hover:bg-ardoise-800'
                    }`
                  }
                >
                  <span className="flex-1">{c.title}</span>
                  {n > 0 && (
                    <span className="shrink-0 text-[11px] tabular-nums text-ardoise-400 dark:text-ardoise-500">
                      {n}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </div>
        );
      })}
    </nav>
  );
}
