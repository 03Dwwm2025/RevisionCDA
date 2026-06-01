import { useParams, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useChapitre } from '../hooks/useCours';
import { useCoursIndex } from '../hooks/useCours';

export default function LectureChapitre() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { chapitres } = useCoursIndex();

  const file = slug ? `${slug}.md` : undefined;
  const { contenu, loading, error } = useChapitre(file);

  const meta = chapitres.find((c) => c.file === file);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400">
        Chargement…
      </div>
    );
  }

  if (error || !contenu) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-12 text-center">
        <p className="text-gray-500">Chapitre introuvable.</p>
        <button
          onClick={() => navigate('/')}
          className="mt-4 text-purple-600 hover:underline"
        >
          Retour à l'accueil
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      {meta?.part && (
        <p className="text-sm text-gray-400 dark:text-gray-500 mb-1">{meta.part}</p>
      )}

      <div className="prose-content">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{contenu}</ReactMarkdown>
      </div>

      <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700 flex flex-col items-center gap-3">
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          Prêt à tester tes connaissances sur ce chapitre ?
        </p>
        <button
          onClick={() => navigate(`/quiz/${slug}`)}
          className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg shadow-sm transition-colors"
        >
          M'entraîner sur ce thème
        </button>
      </div>
    </div>
  );
}
