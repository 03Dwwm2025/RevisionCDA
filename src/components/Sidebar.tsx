import { NavLink } from 'react-router-dom';
import type { ChapitreIndex } from '../types/cours';

interface Props {
  chapitres: ChapitreIndex[];
  onClose?: () => void;
}

function slugFromFile(file: string) {
  return file.replace(/\.md$/, '');
}

const PART_COLORS: Record<string, string> = {
  'PARTIE I — CONCEPTION': 'text-blue-600 dark:text-blue-400',
  'PARTIE II — DÉVELOPPEMENT': 'text-green-600 dark:text-green-400',
  'PARTIE III — DÉPLOIEMENT': 'text-orange-600 dark:text-orange-400',
  ANNEXES: 'text-gray-500 dark:text-gray-400',
};

export default function Sidebar({ chapitres, onClose }: Props) {
  const chapitresByPart: Record<string, ChapitreIndex[]> = {};
  const noPart: ChapitreIndex[] = [];

  for (const c of chapitres) {
    if (!c.part) {
      noPart.push(c);
    } else {
      if (!chapitresByPart[c.part]) chapitresByPart[c.part] = [];
      chapitresByPart[c.part].push(c);
    }
  }

  return (
    <nav className="flex flex-col h-full overflow-y-auto py-4 px-3 gap-1">
      <NavLink
        to="/"
        end
        onClick={onClose}
        className={({ isActive }) =>
          `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            isActive
              ? 'bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
          }`
        }
      >
        Accueil
      </NavLink>

      <NavLink
        to="/examen"
        onClick={onClose}
        className={({ isActive }) =>
          `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            isActive
              ? 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
          }`
        }
      >
        Mode examen
      </NavLink>

      <hr className="my-2 border-gray-200 dark:border-gray-700" />

      {noPart.map((c) => (
        <NavLink
          key={c.file}
          to={`/cours/${slugFromFile(c.file)}`}
          onClick={onClose}
          className={({ isActive }) =>
            `px-3 py-1.5 rounded-lg text-sm transition-colors ${
              isActive
                ? 'bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 font-medium'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`
          }
        >
          {c.title}
        </NavLink>
      ))}

      {Object.entries(chapitresByPart).map(([part, items]) => (
        <div key={part} className="mt-3">
          <p
            className={`px-3 mb-1 text-xs font-bold uppercase tracking-wider ${
              PART_COLORS[part] ?? 'text-gray-400'
            }`}
          >
            {part}
          </p>
          {items.map((c) => (
            <NavLink
              key={c.file}
              to={`/cours/${slugFromFile(c.file)}`}
              onClick={onClose}
              className={({ isActive }) =>
                `block px-3 py-1.5 rounded-lg text-sm transition-colors ${
                  isActive
                    ? 'bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 font-medium'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`
              }
            >
              {c.title}
            </NavLink>
          ))}
        </div>
      ))}
    </nav>
  );
}
