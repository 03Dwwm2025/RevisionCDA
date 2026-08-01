import { Link } from 'react-router-dom';
import { useCoursIndex, useParties } from '../hooks/useCours';
import { useProgression } from '../hooks/useProgression';
import { SLUG_TO_THEME } from '../data/questions/chapitres';
import { NB_QUESTIONS_PAR_THEME, NB_QUESTIONS_TOTAL } from '../data/questions/compte';
import { accentPartie } from '../utils/parties';
import type { ChapitreIndex } from '../types/cours';
import { THEMES, THEME_LABELS } from '../types/quiz';
import type { ScoreTheme } from '../types/quiz';
import Icone from '../components/Icone';

function slugDe(file: string) {
  return file.replace(/\.md$/, '');
}

function couleurScore(pourcent: number) {
  if (pourcent >= 80) return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300';
  if (pourcent >= 60) return 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300';
  return 'bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300';
}

function Tuile({ valeur, libelle }: { valeur: string | number; libelle: string }) {
  return (
    <div className="carte px-4 py-3">
      <p className="text-2xl font-bold tabular-nums text-ardoise-900 dark:text-white">{valeur}</p>
      <p className="text-xs text-ardoise-500 dark:text-ardoise-400">{libelle}</p>
    </div>
  );
}

function CarteChapitre({ chapitre, score }: { chapitre: ChapitreIndex; score?: ScoreTheme }) {
  const slug = slugDe(chapitre.file);
  const theme = SLUG_TO_THEME[slug];
  const nbQuestions = theme ? NB_QUESTIONS_PAR_THEME[theme] : 0;
  const accent = accentPartie(chapitre.part);
  const pourcent = score ? Math.round((score.score / score.total) * 100) : null;

  return (
    <Link
      to={`/cours/${slug}`}
      className="carte carte-cliquable group flex flex-col gap-3 p-4 focus-visible:outline-2"
    >
      <div className="flex items-start gap-3">
        <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${accent.point}`} />
        <p className="flex-1 font-semibold leading-snug text-ardoise-900 group-hover:text-encre-700 dark:text-ardoise-100 dark:group-hover:text-encre-300">
          {chapitre.title}
        </p>
        {pourcent !== null && (
          <span className={`puce shrink-0 tabular-nums ${couleurScore(pourcent)}`}>{pourcent} %</span>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-ardoise-500 dark:text-ardoise-400">
        {theme ? (
          <span className="flex items-center gap-1">
            <Icone nom="cible" className="h-3.5 w-3.5" />
            Quiz {THEME_LABELS[theme].toLowerCase()} · {nbQuestions} questions
          </span>
        ) : (
          <span className="flex items-center gap-1">
            <Icone nom="livre" className="h-3.5 w-3.5" />
            Lecture seule
          </span>
        )}
        {score && (
          <span className="tabular-nums">
            {score.score}/{score.total} au dernier essai
          </span>
        )}
      </div>
    </Link>
  );
}

export default function Accueil() {
  const { chapitres, loading } = useCoursIndex();
  const parties = useParties();
  const { scores, erreurs } = useProgression();

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center text-ardoise-400">Chargement…</div>
    );
  }

  const themesRevises = Object.keys(scores).length;
  const moyenne = (() => {
    const valeurs = Object.values(scores) as ScoreTheme[];
    if (valeurs.length === 0) return null;
    const total = valeurs.reduce((somme, s) => somme + s.score / s.total, 0);
    return Math.round((total / valeurs.length) * 100);
  })();

  const ordreParties = parties.length > 0 ? parties.map((p) => p.nom) : [];
  const groupes = new Map<string, ChapitreIndex[]>();
  for (const c of chapitres) {
    const cle = c.part ?? 'AUTRES';
    const lot = groupes.get(cle);
    if (lot) lot.push(c);
    else groupes.set(cle, [c]);
  }
  const clesTriees = [...groupes.keys()].sort(
    (a, b) => (ordreParties.indexOf(a) + 1 || 99) - (ordreParties.indexOf(b) + 1 || 99),
  );

  return (
    <div className="anim-entree mx-auto max-w-5xl px-5 py-8 sm:px-8 sm:py-12">
      <header className="mb-8">
        <p className="mb-2 text-sm font-semibold text-encre-600 dark:text-encre-400">
          Titre professionnel niveau 6
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-ardoise-900 sm:text-5xl dark:text-white">
          Concepteur développeur d’applications
        </h1>
        <p className="mt-3 max-w-2xl text-ardoise-600 dark:text-ardoise-400">
          Le cours complet, découpé par thème, et {NB_QUESTIONS_TOTAL} questions pour s’entraîner sur
          les trois blocs de compétences.
        </p>
      </header>

      <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Tuile valeur={chapitres.length} libelle="chapitres" />
        <Tuile valeur={NB_QUESTIONS_TOTAL} libelle="questions" />
        <Tuile valeur={`${themesRevises}/${THEMES.length}`} libelle="thèmes révisés" />
        <Tuile valeur={moyenne === null ? '—' : `${moyenne} %`} libelle="moyenne" />
      </div>

      <div className="mb-12 flex flex-wrap gap-3">
        <Link to="/examen" className="btn btn-principal">
          <Icone nom="chrono" className="h-4 w-4" />
          Lancer un examen blanc
        </Link>
        <Link
          to="/erreurs"
          className={`btn ${erreurs.length > 0 ? 'btn-danger' : 'btn-secondaire'}`}
          aria-disabled={erreurs.length === 0}
        >
          <Icone nom="rejouer" className="h-4 w-4" />
          {erreurs.length > 0
            ? `Rejouer mes ${erreurs.length} erreur${erreurs.length > 1 ? 's' : ''}`
            : 'Aucune erreur à rejouer'}
        </Link>
      </div>

      {clesTriees.map((cle) => {
        const accent = accentPartie(cle);
        const partie = parties.find((p) => p.nom === cle);
        return (
          <section key={cle} className="mb-12">
            <div className="mb-4">
              <h2
                className={`flex items-center gap-2 text-xs font-bold tracking-widest uppercase ${accent.texte}`}
              >
                <span className={`h-2 w-2 rounded-full ${accent.point}`} />
                {cle}
              </h2>
              {partie && (
                <p className="mt-2 max-w-3xl text-sm leading-relaxed text-ardoise-600 dark:text-ardoise-400">
                  {partie.resume}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {(groupes.get(cle) ?? []).map((c) => {
                const theme = SLUG_TO_THEME[slugDe(c.file)];
                return (
                  <CarteChapitre
                    key={c.file}
                    chapitre={c}
                    score={theme ? scores[theme] : undefined}
                  />
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}
