/** Formule courte du temps écoulé : « à l'instant », « il y a 3 jours »… */
export function ilYA(iso: string, maintenant: number = Date.now()): string {
  const minutes = Math.floor((maintenant - new Date(iso).getTime()) / 60000);

  if (Number.isNaN(minutes) || minutes < 0) return '';
  if (minutes < 2) return 'à l’instant';
  if (minutes < 60) return `il y a ${minutes} minutes`;

  const heures = Math.floor(minutes / 60);
  if (heures < 24) return `il y a ${heures} heure${heures > 1 ? 's' : ''}`;

  const jours = Math.floor(heures / 24);
  if (jours === 1) return 'hier';
  if (jours < 31) return `il y a ${jours} jours`;

  const mois = Math.floor(jours / 30);
  return `il y a ${mois} mois`;
}
