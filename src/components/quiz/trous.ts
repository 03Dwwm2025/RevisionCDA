export const MARQUEUR = /^___(\d+)___$/;

export interface AnalyseTrous {
  parts: string[];
  /** Numéro du marqueur (___2___ → 2) vers sa position dans `bonnesReponses`. */
  positionParNumero: Map<number, number>;
  nbTrous: number;
}

/**
 * Un même marqueur peut apparaître plusieurs fois dans un extrait — la balise
 * ouvrante et la balise fermante d'un `<label>`, par exemple. C'est un seul
 * trou, avec une seule réponse à donner : les occurrences partagent leur valeur.
 */
export function analyserTrous(codeAvecTrous: string): AnalyseTrous {
  const parts = codeAvecTrous.split(/(___\d+___)/g);
  const numeros = parts
    .map((p) => MARQUEUR.exec(p))
    .filter((m): m is RegExpExecArray => m !== null)
    .map((m) => Number(m[1]));
  const distincts = [...new Set(numeros)].sort((a, b) => a - b);

  return {
    parts,
    positionParNumero: new Map(distincts.map((num, i) => [num, i])),
    nbTrous: distincts.length,
  };
}
