export interface ChapitreIndex {
  file: string;
  title: string;
  part: string | null;
}

export interface Chapitre extends ChapitreIndex {
  contenu: string;
}
