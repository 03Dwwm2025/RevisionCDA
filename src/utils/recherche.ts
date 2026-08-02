export interface Section {
  /** Chapitre auquel appartient la section. */
  slug: string;
  titreChapitre: string;
  partie: string | null;
  /** Titre de la sous-section, ou celui du chapitre pour le préambule. */
  titre: string;
  /** Identifiant d'ancre, pour ouvrir le chapitre au bon endroit. */
  ancre: string;
  texte: string;
}

export interface Resultat extends Section {
  /** Extrait centré sur la première occurrence, avec le terme encadré. */
  extrait: string;
  score: number;
}

/** Minuscules sans accents : la recherche ignore la casse et les diacritiques. */
export function normaliser(texte: string): string {
  return texte
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '');
}

/** Identifiant d'ancre stable, dérivé d'un titre. */
export function ancre(titre: string): string {
  return normaliser(titre)
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** Retire ce qui ne se lit pas : blocs de code, balisage, ponctuation de tableau. */
function nettoyer(markdown: string): string {
  return markdown
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    // Lignes de séparation d'un tableau : elles ne portent aucun texte.
    .replace(/^[\s|:-]*$/gm, ' ')
    .replace(/^\s*[|>]+\s*/gm, ' ')
    .replace(/\|/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Découpe un chapitre en sections indexables, une par titre de niveau 3.
 * Le texte qui précède le premier titre forme le préambule du chapitre.
 */
export function decouperEnSections(
  markdown: string,
  chapitre: { slug: string; titre: string; partie: string | null },
): Section[] {
  const lignes = markdown.split('\n');
  const sections: Section[] = [];

  let titreCourant = chapitre.titre;
  let tampon: string[] = [];

  const vider = () => {
    const texte = nettoyer(tampon.join('\n'));
    if (texte.length > 0) {
      sections.push({
        slug: chapitre.slug,
        titreChapitre: chapitre.titre,
        partie: chapitre.partie,
        titre: titreCourant,
        ancre: titreCourant === chapitre.titre ? '' : ancre(titreCourant),
        texte,
      });
    }
    tampon = [];
  };

  let dansCode = false;
  for (const ligne of lignes) {
    if (ligne.startsWith('```')) dansCode = !dansCode;

    if (!dansCode && ligne.startsWith('### ')) {
      vider();
      titreCourant = ligne.slice(4).trim();
      continue;
    }
    tampon.push(ligne);
  }
  vider();

  return sections;
}

/** Découpe une requête en termes, en ignorant les mots trop courts. */
export function termesDe(requete: string): string[] {
  return normaliser(requete)
    .split(/[^a-z0-9]+/)
    .filter((t) => t.length >= 2);
}

/** Extrait d'environ `longueur` caractères, centré sur la première occurrence. */
export function extraire(texte: string, terme: string, longueur = 180): string {
  const position = normaliser(texte).indexOf(terme);
  if (position === -1) return texte.slice(0, longueur) + (texte.length > longueur ? '…' : '');

  const debut = Math.max(0, position - Math.floor(longueur / 3));
  const fin = Math.min(texte.length, debut + longueur);

  return (debut > 0 ? '…' : '') + texte.slice(debut, fin).trim() + (fin < texte.length ? '…' : '');
}

/**
 * Recherche les sections contenant TOUS les termes. Un terme trouvé dans un
 * titre pèse plus lourd qu'une occurrence dans le corps.
 */
export function chercher(sections: Section[], requete: string, maximum = 40): Resultat[] {
  const termes = termesDe(requete);
  if (termes.length === 0) return [];

  const resultats: Resultat[] = [];

  for (const section of sections) {
    const texte = normaliser(section.texte);
    const titre = normaliser(`${section.titre} ${section.titreChapitre}`);

    let score = 0;
    let complet = true;

    for (const terme of termes) {
      const dansTitre = titre.includes(terme);
      const occurrences = texte.split(terme).length - 1;

      if (!dansTitre && occurrences === 0) {
        complet = false;
        break;
      }
      score += (dansTitre ? 12 : 0) + Math.min(occurrences, 5);
    }

    if (complet) {
      resultats.push({ ...section, score, extrait: extraire(section.texte, termes[0]) });
    }
  }

  return resultats.sort((a, b) => b.score - a.score).slice(0, maximum);
}

/** Découpe un texte autour des termes, pour pouvoir les mettre en évidence. */
export function segmenter(texte: string, termes: string[]): { texte: string; marque: boolean }[] {
  if (termes.length === 0) return [{ texte, marque: false }];

  const motif = new RegExp(`(${termes.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'gi');
  const normalise = normaliser(texte);

  // On travaille sur la version normalisée pour trouver les positions, et on
  // découpe le texte d'origine aux mêmes index : les accents ne décalent pas
  // la longueur, la correspondance reste exacte.
  const segments: { texte: string; marque: boolean }[] = [];
  let curseur = 0;

  for (const found of normalise.matchAll(motif)) {
    const debut = found.index ?? 0;
    if (debut > curseur) segments.push({ texte: texte.slice(curseur, debut), marque: false });
    segments.push({ texte: texte.slice(debut, debut + found[0].length), marque: true });
    curseur = debut + found[0].length;
  }

  if (curseur < texte.length) segments.push({ texte: texte.slice(curseur), marque: false });
  return segments;
}
