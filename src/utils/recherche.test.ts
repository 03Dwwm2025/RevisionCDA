import { describe, it, expect } from 'vitest';
import {
  ancre,
  chercher,
  decouperEnSections,
  extraire,
  normaliser,
  segmenter,
  termesDe,
} from './recherche';

const chapitre = { slug: '13-bdd', titre: '9. Bases de données et SQL', partie: 'PARTIE II' };

const markdown = `## 9. Bases de données et SQL

Le langage des bases relationnelles se divise en sous-langages.

### 9.1 Les jointures

Une jointure rapproche deux tables. Le INNER JOIN ne garde que les correspondances.

\`\`\`sql
SELECT * FROM Demande d JOIN Salarie s ON s.id = d.idSalarie;
### ceci est du code, pas un titre
\`\`\`

### 9.2 Les index

Un **index** accélère les recherches sur les colonnes filtrées.
`;

describe('normaliser et ancre', () => {
  it('supprime la casse et les accents', () => {
    expect(normaliser('Modélisation ÉLÉMENTAIRE')).toBe('modelisation elementaire');
  });

  it('fabrique une ancre lisible et stable', () => {
    expect(ancre('9.1 Les jointures')).toBe('9-1-les-jointures');
    expect(ancre('A03 — Injection')).toBe('a03-injection');
  });
});

describe('decouperEnSections', () => {
  const sections = decouperEnSections(markdown, chapitre);

  it('crée une section par titre de niveau 3, plus le préambule', () => {
    expect(sections.map((s) => s.titre)).toEqual([
      '9. Bases de données et SQL',
      '9.1 Les jointures',
      '9.2 Les index',
    ]);
  });

  it('ne prend pas un dièse à l’intérieur d’un bloc de code pour un titre', () => {
    expect(sections).toHaveLength(3);
  });

  it('retire le contenu des blocs de code du texte indexé', () => {
    const jointures = sections.find((s) => s.titre === '9.1 Les jointures')!;
    expect(jointures.texte).not.toContain('SELECT');
    expect(jointures.texte).toContain('INNER JOIN');
  });

  it('écarte les lignes de séparation des tableaux', () => {
    const avecTableau = decouperEnSections(
      '## Titre\n\n| Verbe | Idempotent |\n| --- | --- |\n| GET | oui |\n',
      chapitre,
    );
    expect(avecTableau[0].texte).not.toContain('---');
    expect(avecTableau[0].texte).toContain('Idempotent');
  });

  it('retire le balisage gras du texte indexé', () => {
    const index = sections.find((s) => s.titre === '9.2 Les index')!;
    expect(index.texte).toContain('index accélère');
    expect(index.texte).not.toContain('**');
  });

  it('donne une ancre aux sections, mais pas au préambule', () => {
    expect(sections[0].ancre).toBe('');
    expect(sections[1].ancre).toBe('9-1-les-jointures');
  });
});

describe('termesDe', () => {
  it('ignore les mots d’une seule lettre et la ponctuation', () => {
    expect(termesDe('à quoi sert un index ?')).toEqual(['quoi', 'sert', 'un', 'index']);
  });

  it('renvoie une liste vide sur une requête vide', () => {
    expect(termesDe('  ')).toEqual([]);
  });
});

describe('chercher', () => {
  const sections = decouperEnSections(markdown, chapitre);

  it('trouve une section par un mot de son corps', () => {
    expect(chercher(sections, 'jointure').map((r) => r.titre)).toContain('9.1 Les jointures');
  });

  it('ignore les accents et la casse', () => {
    expect(chercher(sections, 'DONNÉES').length).toBeGreaterThan(0);
    expect(chercher(sections, 'donnees').length).toBeGreaterThan(0);
  });

  it('exige que tous les termes soient présents', () => {
    expect(chercher(sections, 'jointure index')).toEqual([]);
  });

  it('classe devant la section dont le titre porte le terme', () => {
    expect(chercher(sections, 'index')[0].titre).toBe('9.2 Les index');
  });

  it('ne renvoie rien sur une requête vide', () => {
    expect(chercher(sections, '')).toEqual([]);
  });

  it('joint un extrait à chaque résultat', () => {
    expect(chercher(sections, 'jointure')[0].extrait).toContain('jointure');
  });
});

describe('extraire', () => {
  const texte = 'a'.repeat(200) + ' cible ' + 'b'.repeat(200);

  it('centre l’extrait sur le terme trouvé', () => {
    expect(extraire(texte, 'cible')).toContain('cible');
  });

  it('marque la troncature des deux côtés', () => {
    const e = extraire(texte, 'cible');
    expect(e.startsWith('…')).toBe(true);
    expect(e.endsWith('…')).toBe(true);
  });

  it('retombe sur le début du texte si le terme est absent', () => {
    expect(extraire('texte court', 'absent')).toBe('texte court');
  });
});

describe('segmenter', () => {
  it('isole les termes trouvés pour pouvoir les mettre en évidence', () => {
    const segments = segmenter('Une jointure interne', ['jointure']);
    expect(segments.filter((s) => s.marque).map((s) => s.texte)).toEqual(['jointure']);
  });

  it('respecte les accents du texte d’origine', () => {
    const segments = segmenter('La modélisation', ['modelisation']);
    expect(segments.find((s) => s.marque)?.texte).toBe('modélisation');
  });

  it('renvoie le texte intact sans terme', () => {
    expect(segmenter('rien à marquer', [])).toEqual([{ texte: 'rien à marquer', marque: false }]);
  });
});
