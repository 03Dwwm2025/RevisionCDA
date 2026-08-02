import { useEffect, useRef, useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useChapitre, useCoursIndex } from '../hooks/useCours';
import { useProgression } from '../hooks/useProgression';
import { QUESTIONS_BY_THEME, SLUG_TO_THEME } from '../data/questions';
import { accentPartie } from '../utils/parties';
import { ancre } from '../utils/recherche';
import { useChecklist } from '../hooks/useChecklist';
import ElementChecklist from '../components/ElementChecklist';
import { texteDe } from '../utils/noeuds';
import Icone from '../components/Icone';

function slugDe(file: string) {
  return file.replace(/\.md$/, '');
}

const COMPOSANTS_MARKDOWN = {
  // Les tableaux du cours sont larges : ils défilent dans leur propre conteneur.
  table: ({ children }: { children?: React.ReactNode }) => (
    <div className="table-wrap">
      <table>{children}</table>
    </div>
  ),
  // Chaque section porte une ancre : la recherche peut ouvrir le chapitre au bon endroit.
  h3: ({ children }: { children?: React.ReactNode }) => (
    <h3 id={ancre(texteDe(children))}>{children}</h3>
  ),
  // Les listes à cocher du markdown deviennent des cases réellement cliquables.
  li: ({ className, children }: { className?: string; children?: React.ReactNode }) =>
    className?.includes('task-list-item') ? (
      <ElementChecklist>{children}</ElementChecklist>
    ) : (
      <li className={className}>{children}</li>
    ),
};

/** Récapitulatif affiché en tête d'un chapitre qui contient une checklist. */
function AvancementChecklist({ slug, total }: { slug: string | undefined; total: number }) {
  const { nbCochees, reinitialiser } = useChecklist(slug);
  const pourcent = total > 0 ? Math.round((nbCochees / total) * 100) : 0;
  const fini = nbCochees >= total;

  return (
    <div className="carte mb-8 p-4">
      <div className="mb-2 flex items-baseline justify-between gap-4">
        <p className="text-sm font-semibold text-ardoise-800 dark:text-ardoise-200">
          {fini ? 'Checklist terminée' : `${nbCochees} sur ${total}`}
          <span className="ml-2 font-normal text-ardoise-500 dark:text-ardoise-400">
            {fini ? 'tout est coché' : `${pourcent} %`}
          </span>
        </p>
        {nbCochees > 0 && (
          <button
            type="button"
            onClick={reinitialiser}
            className="rounded-lg px-2 py-1 text-xs font-semibold text-ardoise-500 transition-colors hover:bg-ardoise-100 hover:text-ardoise-800 dark:text-ardoise-400 dark:hover:bg-ardoise-800 dark:hover:text-ardoise-100"
          >
            Tout décocher
          </button>
        )}
      </div>

      <div
        className="h-2 overflow-hidden rounded-full bg-ardoise-200 dark:bg-ardoise-800"
        role="progressbar"
        aria-label="Avancement de la checklist"
        aria-valuenow={nbCochees}
        aria-valuemin={0}
        aria-valuemax={total}
      >
        <div
          className={`h-full rounded-full transition-[width] duration-300 ${fini ? 'bg-emerald-500' : 'bg-encre-500'}`}
          style={{ width: `${pourcent}%` }}
        />
      </div>

      <p className="mt-2 text-xs text-ardoise-500 dark:text-ardoise-400">
        Les cases cochées sont mémorisées dans ce navigateur.
      </p>
    </div>
  );
}

function BarreLecture({ cible }: { cible: React.RefObject<HTMLElement | null> }) {
  const [avancement, setAvancement] = useState(0);

  useEffect(() => {
    const zone = document.getElementById('contenu');
    if (!zone) return;

    const calculer = () => {
      const article = cible.current;
      if (!article) return;
      const parcouru = zone.scrollTop;
      const total = article.offsetHeight - zone.clientHeight;
      setAvancement(total <= 0 ? 100 : Math.min(100, Math.max(0, (parcouru / total) * 100)));
    };

    calculer();
    zone.addEventListener('scroll', calculer, { passive: true });
    return () => zone.removeEventListener('scroll', calculer);
  }, [cible]);

  return (
    <div
      className="fixed inset-x-0 top-0 z-20 h-0.5 bg-transparent"
      role="progressbar"
      aria-label="Progression de lecture"
      aria-valuenow={Math.round(avancement)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className="h-full bg-encre-500 transition-[width] duration-150"
        style={{ width: `${avancement}%` }}
      />
    </div>
  );
}

export default function LectureChapitre() {
  const { slug } = useParams<{ slug: string }>();
  const { chapitres } = useCoursIndex();
  const article = useRef<HTMLElement>(null);

  const file = slug ? `${slug}.md` : undefined;
  const { contenu, loading, error } = useChapitre(file);

  const position = chapitres.findIndex((c) => c.file === file);
  const meta = position >= 0 ? chapitres[position] : undefined;
  const precedent = position > 0 ? chapitres[position - 1] : undefined;
  const suivant = position >= 0 && position < chapitres.length - 1 ? chapitres[position + 1] : undefined;

  const theme = slug ? SLUG_TO_THEME[slug] : undefined;
  const nbQuestions = theme ? (QUESTIONS_BY_THEME[theme]?.length ?? 0) : 0;
  const accent = accentPartie(meta?.part);
  const nbTaches = contenu ? (contenu.match(/^- \[[ xX]\]/gm) ?? []).length : 0;

  // Le contenu arrive après le premier rendu : le navigateur ne peut pas sauter
  // tout seul vers l'ancre demandée, on le fait une fois le markdown affiché.
  const { hash } = useLocation();
  useEffect(() => {
    if (!contenu || !hash) return;
    document.getElementById(decodeURIComponent(hash.slice(1)))?.scrollIntoView({ block: 'start' });
  }, [contenu, hash]);

  // Mémorise le chapitre pour proposer de reprendre la lecture depuis l'accueil.
  const { enregistrerLecture } = useProgression();
  useEffect(() => {
    if (slug && meta?.title) enregistrerLecture(slug, meta.title);
  }, [slug, meta?.title, enregistrerLecture]);

  if (loading) {
    return <div className="flex h-64 items-center justify-center text-ardoise-400">Chargement…</div>;
  }

  if (error || !contenu) {
    return (
      <div className="mx-auto max-w-lg px-6 py-20 text-center">
        <p className="mb-4 text-ardoise-600 dark:text-ardoise-400">Ce chapitre est introuvable.</p>
        <Link to="/" className="btn btn-secondaire">
          Retour à l’accueil
        </Link>
      </div>
    );
  }

  return (
    <>
      <BarreLecture cible={article} />

      <article ref={article} className="anim-entree mx-auto max-w-3xl px-5 py-8 sm:px-8 sm:py-12">
        {meta?.part && (
          <p className={`mb-6 flex items-center gap-2 text-xs font-bold tracking-widest uppercase ${accent.texte}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${accent.point}`} />
            {meta.part}
          </p>
        )}

        {nbTaches > 0 && <AvancementChecklist slug={slug} total={nbTaches} />}

        <div className="prose-cours">
          <ReactMarkdown remarkPlugins={[remarkGfm]} components={COMPOSANTS_MARKDOWN}>
            {contenu}
          </ReactMarkdown>
        </div>

        {nbQuestions > 0 && (
          <div className="mt-14 rounded-2xl border border-encre-200 bg-encre-50 p-6 text-center dark:border-encre-800 dark:bg-encre-500/10">
            <h2 className="mb-1 text-lg font-bold text-ardoise-900 dark:text-white">
              Prêt à te tester ?
            </h2>
            <p className="mb-5 text-sm text-ardoise-600 dark:text-ardoise-400">
              {nbQuestions} question{nbQuestions > 1 ? 's' : ''} sur ce thème, corrigées une par une.
            </p>
            <Link to={`/quiz/${slug}`} className="btn btn-principal">
              <Icone nom="cible" className="h-4 w-4" />
              M’entraîner sur ce thème
            </Link>
          </div>
        )}

        <nav className="mt-12 grid grid-cols-1 gap-3 border-t border-ardoise-200 pt-6 sm:grid-cols-2 dark:border-ardoise-800">
          {precedent ? (
            <Link
              to={`/cours/${slugDe(precedent.file)}`}
              className="carte carte-cliquable flex items-center gap-3 p-4"
            >
              <Icone nom="gauche" className="h-5 w-5 shrink-0 text-ardoise-400" />
              <span className="min-w-0">
                <span className="block text-xs text-ardoise-500 dark:text-ardoise-400">Précédent</span>
                <span className="block truncate text-sm font-semibold text-ardoise-800 dark:text-ardoise-200">
                  {precedent.title}
                </span>
              </span>
            </Link>
          ) : (
            <span />
          )}

          {suivant && (
            <Link
              to={`/cours/${slugDe(suivant.file)}`}
              className="carte carte-cliquable flex items-center justify-end gap-3 p-4 text-right"
            >
              <span className="min-w-0">
                <span className="block text-xs text-ardoise-500 dark:text-ardoise-400">Suivant</span>
                <span className="block truncate text-sm font-semibold text-ardoise-800 dark:text-ardoise-200">
                  {suivant.title}
                </span>
              </span>
              <Icone nom="droite" className="h-5 w-5 shrink-0 text-ardoise-400" />
            </Link>
          )}
        </nav>
      </article>
    </>
  );
}
