import { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate, Link } from 'react-router-dom';
import Sidebar from './Sidebar';
import Icone from './Icone';
import { useCoursIndex } from '../hooks/useCours';
import { useProgression } from '../hooks/useProgression';
import { useTheme } from '../hooks/useTheme';

function BasculeTheme() {
  const { mode, basculer } = useTheme();
  const libelle =
    mode === 'clair' ? 'Thème clair' : mode === 'sombre' ? 'Thème sombre' : 'Thème du système';

  return (
    <button
      type="button"
      onClick={basculer}
      title={libelle}
      aria-label={`${libelle} — cliquer pour changer`}
      className="rounded-lg p-2 text-ardoise-500 transition-colors hover:bg-ardoise-100 hover:text-ardoise-800 dark:text-ardoise-400 dark:hover:bg-ardoise-800 dark:hover:text-ardoise-100"
    >
      <Icone nom={mode === 'clair' ? 'soleil' : mode === 'sombre' ? 'lune' : 'ecran'} />
    </button>
  );
}

function Marque() {
  return (
    <Link to="/" className="flex items-center gap-2.5">
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-encre-600 text-sm font-black text-white">
        CDA
      </span>
      <span className="leading-tight">
        <span className="block text-[15px] font-bold text-ardoise-900 dark:text-white">
          Révision CDA
        </span>
        <span className="block text-[11px] text-ardoise-500 dark:text-ardoise-400">Promo 2026</span>
      </span>
    </Link>
  );
}

export default function Layout() {
  const { chapitres } = useCoursIndex();
  const { aRevoir } = useProgression();
  const [menuOuvert, setMenuOuvert] = useState(false);
  const { pathname } = useLocation();
  const naviguer = useNavigate();

  // Le contenu principal remonte en haut à chaque changement de page.
  useEffect(() => {
    document.getElementById('contenu')?.scrollTo({ top: 0 });
  }, [pathname]);

  // Raccourci de recherche : « / » ou Ctrl+K, sauf quand on est déjà en train
  // de saisir quelque part.
  useEffect(() => {
    const surTouche = (e: KeyboardEvent) => {
      const cible = e.target as HTMLElement | null;
      const dansUnChamp =
        cible?.tagName === 'INPUT' || cible?.tagName === 'TEXTAREA' || cible?.isContentEditable;

      const raccourci = e.key === '/' || ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k');
      if (!raccourci || dansUnChamp) return;

      e.preventDefault();
      naviguer('/recherche');
    };

    window.addEventListener('keydown', surTouche);
    return () => window.removeEventListener('keydown', surTouche);
  }, [naviguer]);

  useEffect(() => {
    if (!menuOuvert) return;
    const fermerSurEchap = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOuvert(false);
    };
    window.addEventListener('keydown', fermerSurEchap);
    return () => window.removeEventListener('keydown', fermerSurEchap);
  }, [menuOuvert]);

  const barreLaterale = (
    <>
      <div className="flex items-center justify-between border-b border-ardoise-200 px-4 py-3 dark:border-ardoise-800">
        <Marque />
        <div className="flex items-center gap-1">
          <BasculeTheme />
          <button
            type="button"
            onClick={() => setMenuOuvert(false)}
            aria-label="Fermer le menu"
            className="rounded-lg p-2 text-ardoise-500 hover:bg-ardoise-100 lg:hidden dark:hover:bg-ardoise-800"
          >
            <Icone nom="fermer" />
          </button>
        </div>
      </div>
      <div className="min-h-0 flex-1">
        <Sidebar
          chapitres={chapitres}
          nbARevoir={aRevoir.length}
          onNaviguer={() => setMenuOuvert(false)}
        />
      </div>
    </>
  );

  return (
    <div className="flex h-dvh overflow-hidden bg-ardoise-50 dark:bg-ardoise-950">
      <aside className="hidden w-72 shrink-0 flex-col border-r border-ardoise-200 bg-white lg:flex dark:border-ardoise-800 dark:bg-ardoise-900">
        {barreLaterale}
      </aside>

      {menuOuvert && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setMenuOuvert(false)}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-ardoise-200 bg-white transition-transform duration-200 lg:hidden dark:border-ardoise-800 dark:bg-ardoise-900 ${
          menuOuvert ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {barreLaterale}
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center gap-3 border-b border-ardoise-200 bg-white px-4 py-2.5 lg:hidden dark:border-ardoise-800 dark:bg-ardoise-900">
          <button
            type="button"
            onClick={() => setMenuOuvert(true)}
            aria-label="Ouvrir le menu"
            className="rounded-lg p-2 text-ardoise-600 hover:bg-ardoise-100 dark:text-ardoise-400 dark:hover:bg-ardoise-800"
          >
            <Icone nom="menu" />
          </button>
          <div className="flex-1">
            <Marque />
          </div>
          <BasculeTheme />
        </header>

        <main id="contenu" className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
