import { useEffect, useState } from 'react';
import type { ChapitreIndex } from '../types/cours';
import { decouperEnSections } from '../utils/recherche';
import type { Section } from '../utils/recherche';

/**
 * Index de recherche : tous les chapitres découpés en sections.
 *
 * Construit une seule fois, à la demande — 340 Ko de markdown n'ont pas à
 * partir avec le premier chargement de la page.
 */
let construction: Promise<Section[]> | null = null;

function construire(chapitres: ChapitreIndex[]): Promise<Section[]> {
  construction ??= Promise.all(
    chapitres.map(async (c) => {
      const reponse = await fetch(`/cours/${c.file}`);
      if (!reponse.ok) return [];
      const markdown = await reponse.text();
      return decouperEnSections(markdown, {
        slug: c.file.replace(/\.md$/, ''),
        titre: c.title,
        partie: c.part,
      });
    }),
  )
    .then((lots) => lots.flat())
    .catch(() => {
      construction = null;
      return [];
    });

  return construction;
}

export function useIndexCours(chapitres: ChapitreIndex[]) {
  const [sections, setSections] = useState<Section[]>([]);
  const [pret, setPret] = useState(false);

  useEffect(() => {
    if (chapitres.length === 0) return;
    let annule = false;

    construire(chapitres).then((index) => {
      if (annule) return;
      setSections(index);
      setPret(true);
    });

    return () => {
      annule = true;
    };
  }, [chapitres]);

  return { sections, pret };
}
