import { useDeferredValue, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useCoursIndex } from '../hooks/useCours';
import { useIndexCours } from '../hooks/useIndexCours';
import { chercher, segmenter, termesDe } from '../utils/recherche';
import type { Resultat } from '../utils/recherche';
import { accentPartie } from '../utils/parties';
import Icone from '../components/Icone';

const SUGGESTIONS = ['CORS', 'normalisation', 'idempotent', 'XSS', 'blue-green', 'RPO'];

function Surligne({ texte, termes }: { texte: string; termes: string[] }) {
  return (
    <>
      {segmenter(texte, termes).map((s, i) =>
        s.marque ? (
          <mark
            key={i}
            className="rounded bg-amber-200 px-0.5 text-ardoise-900 dark:bg-amber-500/30 dark:text-amber-100"
          >
            {s.texte}
          </mark>
        ) : (
          <span key={i}>{s.texte}</span>
        ),
      )}
    </>
  );
}

function LigneResultat({ resultat, termes }: { resultat: Resultat; termes: string[] }) {
  const accent = accentPartie(resultat.partie);
  const cible = resultat.ancre
    ? `/cours/${resultat.slug}#${resultat.ancre}`
    : `/cours/${resultat.slug}`;

  return (
    <li>
      <Link to={cible} className="carte carte-cliquable block p-4">
        <p className="mb-1 flex items-center gap-2 text-[11px] font-bold tracking-wider uppercase">
          <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${accent.point}`} />
          <span className={`truncate ${accent.texte}`}>{resultat.titreChapitre}</span>
        </p>

        <p className="mb-1.5 font-semibold text-ardoise-900 dark:text-ardoise-100">
          <Surligne texte={resultat.titre} termes={termes} />
        </p>

        <p className="text-sm leading-relaxed text-ardoise-600 dark:text-ardoise-400">
          <Surligne texte={resultat.extrait} termes={termes} />
        </p>
      </Link>
    </li>
  );
}

export default function Recherche() {
  const [parametres, setParametres] = useSearchParams();
  const [saisie, setSaisie] = useState(parametres.get('q') ?? '');
  const champ = useRef<HTMLInputElement>(null);

  const { chapitres } = useCoursIndex();
  const { sections, pret } = useIndexCours(chapitres);

  // La recherche s'exécute sur une valeur retardée : la frappe reste fluide
  // même quand l'index compte plusieurs centaines de sections.
  const requete = useDeferredValue(saisie);
  const termes = useMemo(() => termesDe(requete), [requete]);
  const resultats = useMemo(
    () => (pret ? chercher(sections, requete) : []),
    [sections, requete, pret],
  );

  useEffect(() => {
    champ.current?.focus();
  }, []);

  // L'adresse porte la requête : un résultat consulté se retrouve avec le retour arrière.
  useEffect(() => {
    const courante = parametres.get('q') ?? '';
    if (saisie === courante) return;
    const suivant = new URLSearchParams(parametres);
    if (saisie) suivant.set('q', saisie);
    else suivant.delete('q');
    setParametres(suivant, { replace: true });
  }, [saisie, parametres, setParametres]);

  return (
    <div className="anim-entree mx-auto max-w-3xl px-5 py-8 sm:px-8 sm:py-10">
      <h1 className="mb-4 text-2xl font-bold tracking-tight text-ardoise-900 dark:text-white">
        Rechercher dans le cours
      </h1>

      <div className="relative mb-6">
        <span className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-ardoise-400">
          <Icone nom="cible" className="h-5 w-5" />
        </span>
        <input
          ref={champ}
          type="search"
          value={saisie}
          onChange={(e) => setSaisie(e.target.value)}
          placeholder="Une notion, un mot-clé, un acronyme…"
          aria-label="Rechercher dans le cours"
          className="w-full rounded-2xl border border-ardoise-300 bg-white py-3.5 pr-4 pl-12 text-[15px] text-ardoise-900 transition-colors placeholder:text-ardoise-400 hover:border-encre-400 focus:border-encre-500 dark:border-ardoise-700 dark:bg-ardoise-900 dark:text-ardoise-100"
        />
      </div>

      {termes.length === 0 ? (
        <div className="carte p-5">
          <p className="mb-3 text-sm text-ardoise-600 dark:text-ardoise-400">
            La recherche parcourt les {chapitres.length} chapitres, section par section. Les blocs de
            code sont écartés : seul le texte explicatif est indexé.
          </p>
          <div className="flex flex-wrap gap-2">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSaisie(s)}
                className="puce bg-ardoise-100 text-ardoise-600 transition-colors hover:bg-encre-100 hover:text-encre-700 dark:bg-ardoise-800 dark:text-ardoise-300 dark:hover:bg-encre-500/20"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      ) : !pret ? (
        <p className="py-10 text-center text-ardoise-400">Indexation du cours…</p>
      ) : resultats.length === 0 ? (
        <p className="py-10 text-center text-ardoise-500 dark:text-ardoise-400">
          Aucune section ne contient tous ces mots.
        </p>
      ) : (
        <>
          <p className="mb-3 px-1 text-xs text-ardoise-500 dark:text-ardoise-400">
            {resultats.length} section{resultats.length > 1 ? 's' : ''} trouvée
            {resultats.length > 1 ? 's' : ''}
          </p>
          <ul className="space-y-2.5">
            {resultats.map((r) => (
              <LigneResultat key={`${r.slug}#${r.ancre}`} resultat={r} termes={termes} />
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
