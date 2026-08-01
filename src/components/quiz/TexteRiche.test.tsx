import { describe, it, expect } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import TexteRiche from './TexteRiche';

function rendre(texte: string) {
  return renderToStaticMarkup(<TexteRiche>{texte}</TexteRiche>);
}

describe('TexteRiche', () => {
  it('rend les accents graves comme du code', () => {
    expect(rendre('la commande `git commit` valide')).toContain('<code');
    expect(rendre('la commande `git commit` valide')).toContain('git commit');
  });

  it('rend les doubles astérisques en gras', () => {
    const html = rendre('une branche **et** bascule dessus');
    expect(html).toContain('<strong');
    expect(html).toContain('et');
  });

  it('laisse le texte simple intact', () => {
    expect(rendre('sans notation')).toBe('<span>sans notation</span>');
  });

  it('ne transforme pas un accent grave isolé', () => {
    expect(rendre('un ` seul')).not.toContain('<code');
  });

  it('gère plusieurs notations dans la même phrase', () => {
    const html = rendre('`a` puis **b** puis `c`');
    expect(html.match(/<code/g)).toHaveLength(2);
    expect(html.match(/<strong/g)).toHaveLength(1);
  });
});
