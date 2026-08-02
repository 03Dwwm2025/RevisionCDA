import { describe, it, expect } from 'vitest';
import { basculerExclusif } from './useDepliants';

describe('basculerExclusif', () => {
  it('ouvre une section quand aucune ne l’est', () => {
    expect(basculerExclusif(null, 'PARTIE I')).toBe('PARTIE I');
  });

  it('referme la section ouverte quand on la reclique', () => {
    expect(basculerExclusif('PARTIE I', 'PARTIE I')).toBeNull();
  });

  it('remplace la section ouverte quand on en ouvre une autre', () => {
    expect(basculerExclusif('PARTIE I', 'PARTIE III')).toBe('PARTIE III');
  });
});
