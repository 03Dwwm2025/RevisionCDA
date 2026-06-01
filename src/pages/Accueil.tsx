import { useNavigate } from 'react-router-dom';
import { useCoursIndex } from '../hooks/useCours';
import type { ChapitreIndex } from '../types/cours';

function slugFromFile(file: string) {
  return file.replace(/\.md$/, '');
}

const PART_BADGE: Record<string, string> = {
  'PARTIE I — CONCEPTION': 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  'PARTIE II — DÉVELOPPEMENT':
    'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300',
  'PARTIE III — DÉPLOIEMENT':
    'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300',
  ANNEXES: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
};

function ChapitreCard({ c }: { c: ChapitreIndex }) {
  const navigate = useNavigate();
  const slug = slugFromFile(c.file);

  return (
    <button
      onClick={() => navigate(`/cours/${slug}`)}
      className="text-left p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:border-purple-300 dark:hover:border-purple-600 hover:shadow-md transition-all group"
    >
      {c.part && (
        <span
          className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
            PART_BADGE[c.part] ?? 'bg-gray-100 text-gray-600'
          }`}
        >
          {c.part
            .replace('PARTIE I — ', 'P.I ')
            .replace('PARTIE II — ', 'P.II ')
            .replace('PARTIE III — ', 'P.III ')}
        </span>
      )}
      <p className="mt-2 font-medium text-gray-900 dark:text-gray-100 group-hover:text-purple-700 dark:group-hover:text-purple-300 transition-colors">
        {c.title}
      </p>
    </button>
  );
}

export default function Accueil() {
  const { chapitres, loading } = useCoursIndex();
  const navigate = useNavigate();

  const chapitresAvecContenu = chapitres.filter((c) => c.part !== null);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400">
        Chargement…
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <div className="flex items-start justify-between mb-8 gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Révision CDA 2026
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            {chapitresAvecContenu.length} chapitres disponibles
          </p>
        </div>
        <button
          onClick={() => navigate('/examen')}
          className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow transition-colors"
        >
          Mode examen
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {chapitresAvecContenu.map((c) => (
          <ChapitreCard key={c.file} c={c} />
        ))}
      </div>
    </div>
  );
}
