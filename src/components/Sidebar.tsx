import { useMemo } from 'react';
import { NavLink, useParams } from 'react-router-dom';
import type { ChapitreIndex } from '../types/cours';
import { SLUG_TO_THEME } from '../data/questions/chapitres';
import { NB_QUESTIONS_PAR_THEME } from '../data/questions/compte';
import { accentPartie } from '../utils/parties';
import { useSectionExclusive } from '../hooks/useDepliants';
import Depliant from './Depliant';
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
  const { slug } = useParams<{ slug: string }>();

  const parParties = useMemo(() => {
    const table = new Map<string, ChapitreIndex[]>();
    for (const c of chapitres) {
      const cle = c.part ?? 'AUTRES';
      const lot = table.get(cle);
      if (lot) lot.push(c);
      else table.set(cle, [c]);
    }
    return table;
  }, [chapitres]);

  // Naviguer vers un chapitre déplie sa partie et referme les autres.
  const partieCourante =
    (slug ? chapitres.find((c) => slugDe(c.file) === slug)?.part : null) ?? null;

  const { ouverte, basculer } = useSectionExclusive(
    'revision-cda-partie-ouverte',
    partieCourante,
    'PARTIE I — CONCEPTION',
  );

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

      <div className="space-y-0.5">
        {[...parParties.entries()].map(([partie, items]) => {
          const accent = accentPartie(partie);
          const ouvert = partie === ouverte;

          return (
            <Depliant
              key={partie}
              ouvert={ouvert}
              onBasculer={() => basculer(partie)}
              classeEntete={`${accent.texte} hover:bg-ardoise-100 dark:hover:bg-ardoise-800`}
              titre={
                <span className="flex items-center gap-2 text-[11px] font-bold tracking-wider uppercase">
                  <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${accent.point}`} />
                  <span className="truncate">{partie}</span>
                </span>
              }
              indication={
                <span className="shrink-0 text-[11px] tabular-nums text-ardoise-400 dark:text-ardoise-500">
                  {items.length}
                </span>
              }
            >
              <div className="mt-0.5 mb-2 ml-[13px] border-l border-ardoise-200 pl-2 dark:border-ardoise-800">
                {items.map((c) => {
                  const slugChapitre = slugDe(c.file);
                  const n = nbQuestions(slugChapitre);
                  return (
                    <NavLink
                      key={c.file}
                      to={`/cours/${slugChapitre}`}
                      onClick={onNaviguer}
                      className={({ isActive }) =>
                        `flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-[13px] leading-snug transition-colors ${
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
            </Depliant>
          );
        })}
      </div>
    </nav>
  );
}
