import { useEffect, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useChapitre, useCoursIndex } from '../hooks/useCours';
import { QUESTIONS_BY_THEME, SLUG_TO_THEME } from '../data/questions';
import { accentPartie } from '../utils/parties';
import Icone from '../components/Icone';

function slugDe(file: string) {
  return file.replace(/\.md$/, '');
}

/** Les tableaux du cours sont larges : ils défilent dans leur propre conteneur. */
const COMPOSANTS_MARKDOWN = {
  table: ({ children }: { children?: React.ReactNode }) => (
    <div className="table-wrap">
      <table>{children}</table>
    </div>
  ),
};

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
