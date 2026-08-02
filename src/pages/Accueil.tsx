import { Link } from 'react-router-dom';
import { useCoursIndex } from '../hooks/useCours';
import { useProgression } from '../hooks/useProgression';
import { useDepliant } from '../hooks/useDepliants';
import { SLUG_TO_THEME, THEME_TO_SLUG } from '../data/questions/chapitres';
import { NB_QUESTIONS_PAR_THEME, NB_QUESTIONS_TOTAL } from '../data/questions/compte';
import { THEMES, THEME_LABELS } from '../types/quiz';
import type { ScoreTheme } from '../types/quiz';
import type { ChapitreIndex } from '../types/cours';
import { accentPartie } from '../utils/parties';
import { ilYA } from '../utils/dates';
import Depliant from '../components/Depliant';
import Icone from '../components/Icone';

const SEUIL_A_RETRAVAILLER = 0.8;
const NB_SUGGESTIONS = 3;

function slugDe(file: string) {
  return file.replace(/\.md$/, '');
}

function pourcent(s: ScoreTheme) {
  return Math.round((s.score / s.total) * 100);
}

function teinte(p: number) {
  if (p >= 80) return { texte: 'text-emerald-600 dark:text-emerald-400', barre: 'bg-emerald-500' };
  if (p >= 60) return { texte: 'text-amber-600 dark:text-amber-400', barre: 'bg-amber-500' };
  return { texte: 'text-rose-600 dark:text-rose-400', barre: 'bg-rose-500' };
}

function Bloc({
  titre,
  indication,
  children,
}: {
  titre: string;
  indication?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-4">
      <h2 className="mb-2 flex items-baseline justify-between gap-3 px-1">
        <span className="text-xs font-bold tracking-wider text-ardoise-500 uppercase dark:text-ardoise-400">
          {titre}
        </span>
        {indication && (
          <span className="text-xs text-ardoise-400 dark:text-ardoise-500">{indication}</span>
        )}
      </h2>
      {children}
    </section>
  );
}

function LigneTheme({ score }: { score: ScoreTheme }) {
  const p = pourcent(score);
  const couleurs = teinte(p);
  const slug = THEME_TO_SLUG[score.theme];

  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <span className="w-36 shrink-0 truncate text-sm font-medium text-ardoise-800 dark:text-ardoise-200">
        {THEME_LABELS[score.theme]}
      </span>

      <span className={`w-10 shrink-0 text-sm font-bold tabular-nums ${couleurs.texte}`}>
        {p} %
      </span>

      <div className="hidden h-1.5 flex-1 overflow-hidden rounded-full bg-ardoise-200 sm:block dark:bg-ardoise-800">
        <div className={`h-full rounded-full ${couleurs.barre}`} style={{ width: `${p}%` }} />
      </div>

      {slug && (
        <Link
          to={`/quiz/${slug}`}
          className="shrink-0 rounded-lg px-2.5 py-1 text-xs font-semibold text-encre-700 transition-colors hover:bg-encre-50 dark:text-encre-300 dark:hover:bg-encre-500/15"
        >
          S’entraîner
        </Link>
      )}
    </div>
  );
}

export default function Accueil() {
  const { chapitres, loading } = useCoursIndex();
  const { scores, erreurs, derniereLecture } = useProgression();
  const [programmeOuvert, basculerProgramme] = useDepliant('revision-cda-accueil-programme');

  if (loading) {
    return <div className="flex h-64 items-center justify-center text-ardoise-400">Chargement…</div>;
  }

  const testes = Object.values(scores) as ScoreTheme[];
  const moyenne =
    testes.length > 0
      ? Math.round((testes.reduce((s, x) => s + x.score / x.total, 0) / testes.length) * 100)
      : null;

  const aRetravailler = [...testes]
    .sort((a, b) => a.score / a.total - b.score / b.total)
    .filter((s) => s.score / s.total < SEUIL_A_RETRAVAILLER)
    .slice(0, NB_SUGGESTIONS);

  const jamaisTestes = THEMES.filter((t) => !scores[t]);
  const debut = testes.length === 0 && !derniereLecture;

  const groupes = new Map<string, ChapitreIndex[]>();
  for (const c of chapitres) {
    const cle = c.part ?? 'AUTRES';
    const lot = groupes.get(cle);
    if (lot) lot.push(c);
    else groupes.set(cle, [c]);
  }

  return (
    <div className="anim-entree mx-auto max-w-3xl px-5 py-8 sm:px-8 sm:py-10">
      <header className="mb-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mb-1 text-xs font-semibold tracking-wide text-encre-600 uppercase dark:text-encre-400">
              Titre professionnel niveau 6
            </p>
            <h1 className="text-3xl font-bold tracking-tight text-ardoise-900 sm:text-4xl dark:text-white">
              Révision CDA
            </h1>
            <p className="mt-1.5 text-sm text-ardoise-500 dark:text-ardoise-400">
              {chapitres.length} chapitres · {NB_QUESTIONS_TOTAL} questions ·{' '}
              {moyenne === null ? 'aucun score' : `moyenne ${moyenne} %`}
            </p>
          </div>

          <Link to="/examen" className="btn btn-principal">
            <Icone nom="chrono" className="h-4 w-4" />
            Examen blanc
          </Link>
        </div>
      </header>

      {debut && (
        <Bloc titre="Par où commencer">
          <div className="carte p-5">
            <p className="mb-4 text-sm leading-relaxed text-ardoise-600 dark:text-ardoise-400">
              Rien n’est encore enregistré. Ouvre un chapitre pour le lire, ou lance directement une
              série de questions — le site retiendra tes scores et les questions ratées.
            </p>
            <div className="flex flex-wrap gap-2">
              {chapitres
                .filter((c) => SLUG_TO_THEME[slugDe(c.file)])
                .slice(0, NB_SUGGESTIONS)
                .map((c) => (
                  <Link
                    key={c.file}
                    to={`/cours/${slugDe(c.file)}`}
                    className="btn btn-secondaire text-xs"
                  >
                    {c.title}
                  </Link>
                ))}
            </div>
          </div>
        </Bloc>
      )}

      {derniereLecture && (
        <Bloc titre="Reprendre">
          <Link
            to={`/cours/${derniereLecture.slug}`}
            className="carte carte-cliquable flex items-center gap-4 p-4"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-encre-100 text-encre-600 dark:bg-encre-500/15 dark:text-encre-400">
              <Icone nom="reprendre" className="h-4 w-4" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate font-semibold text-ardoise-900 dark:text-ardoise-100">
                {derniereLecture.titre}
              </span>
              <span className="block text-xs text-ardoise-500 dark:text-ardoise-400">
                Ouvert {ilYA(derniereLecture.date)}
              </span>
            </span>
            <Icone nom="droite" className="h-5 w-5 shrink-0 text-ardoise-400" />
          </Link>
        </Bloc>
      )}

      {aRetravailler.length > 0 && (
        <Bloc
          titre="À retravailler"
          indication={`${aRetravailler.length} thème${aRetravailler.length > 1 ? 's' : ''} sous ${SEUIL_A_RETRAVAILLER * 100} %`}
        >
          <div className="carte divide-y divide-ardoise-200 dark:divide-ardoise-800">
            {aRetravailler.map((s) => (
              <LigneTheme key={s.theme} score={s} />
            ))}
          </div>
        </Bloc>
      )}

      {erreurs.length > 0 && (
        <Bloc titre="Mes erreurs">
          <Link
            to="/erreurs"
            className="carte carte-cliquable flex items-center gap-4 p-4"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-100 text-rose-600 dark:bg-rose-500/15 dark:text-rose-400">
              <Icone nom="rejouer" className="h-4 w-4" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block font-semibold text-ardoise-900 dark:text-ardoise-100">
                {erreurs.length} question{erreurs.length > 1 ? 's' : ''} à rejouer
              </span>
              <span className="block text-xs text-ardoise-500 dark:text-ardoise-400">
                Une question réussie sort de la liste
              </span>
            </span>
            <Icone nom="droite" className="h-5 w-5 shrink-0 text-ardoise-400" />
          </Link>
        </Bloc>
      )}

      {!debut && (
        <Bloc titre="Couverture" indication={`${testes.length} / ${THEMES.length} thèmes testés`}>
          <div className="carte p-4">
            <div className="mb-2 h-2 overflow-hidden rounded-full bg-ardoise-200 dark:bg-ardoise-800">
              <div
                className="h-full rounded-full bg-encre-500 transition-[width] duration-500"
                style={{ width: `${(testes.length / THEMES.length) * 100}%` }}
              />
            </div>
            <p className="text-xs text-ardoise-500 dark:text-ardoise-400">
              {jamaisTestes.length === 0
                ? 'Tous les thèmes ont été testés au moins une fois.'
                : `Jamais testé : ${jamaisTestes.slice(0, 4).map((t) => THEME_LABELS[t]).join(', ')}${
                    jamaisTestes.length > 4 ? `, et ${jamaisTestes.length - 4} autres` : ''
                  }.`}
            </p>
          </div>
        </Bloc>
      )}

      <section className="mt-8 border-t border-ardoise-200 pt-4 dark:border-ardoise-800">
        <Depliant
          ouvert={programmeOuvert}
          onBasculer={basculerProgramme}
          classeEntete="text-ardoise-600 hover:bg-ardoise-100 dark:text-ardoise-400 dark:hover:bg-ardoise-800"
          titre={
            <span className="text-xs font-bold tracking-wider uppercase">Programme complet</span>
          }
          indication={
            <span className="text-xs text-ardoise-400 dark:text-ardoise-500">
              {groupes.size} parties · {chapitres.length} chapitres
            </span>
          }
        >
          <div className="mt-3 space-y-5">
            {[...groupes.entries()].map(([partie, items]) => {
              const accent = accentPartie(partie);
              return (
                <div key={partie}>
                  <p
                    className={`mb-1 flex items-center gap-2 px-3 text-[11px] font-bold tracking-wider uppercase ${accent.texte}`}
                  >
                    <span className={`h-1.5 w-1.5 rounded-full ${accent.point}`} />
                    {partie}
                  </p>

                  {items.map((c) => {
                    const slug = slugDe(c.file);
                    const theme = SLUG_TO_THEME[slug];
                    const score = theme ? scores[theme] : undefined;

                    return (
                      <Link
                        key={c.file}
                        to={`/cours/${slug}`}
                        className="flex items-center gap-3 rounded-lg px-3 py-1.5 text-sm transition-colors hover:bg-ardoise-100 dark:hover:bg-ardoise-800"
                      >
                        <span className="min-w-0 flex-1 truncate text-ardoise-700 dark:text-ardoise-300">
                          {c.title}
                        </span>
                        {theme && (
                          <span className="shrink-0 text-[11px] tabular-nums text-ardoise-400 dark:text-ardoise-500">
                            {NB_QUESTIONS_PAR_THEME[theme]} q.
                          </span>
                        )}
                        {/* Colonne de score : vide pour les chapitres sans quiz. */}
                        <span
                          className={`w-10 shrink-0 text-right text-xs font-semibold tabular-nums ${
                            score
                              ? teinte(pourcent(score)).texte
                              : 'text-ardoise-300 dark:text-ardoise-600'
                          }`}
                        >
                          {score ? `${pourcent(score)} %` : theme ? '—' : ''}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </Depliant>
      </section>
    </div>
  );
}
