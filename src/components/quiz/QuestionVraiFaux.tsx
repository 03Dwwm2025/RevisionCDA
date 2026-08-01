import type { QuestionVraiFaux as TypeVF } from '../../types/quiz';
import Icone from '../Icone';

interface Props {
  question: TypeVF;
  reponseValidee?: boolean;
  onRepondre: (reponse: boolean) => void;
}

export default function QuestionVraiFaux({ question, reponseValidee, onRepondre }: Props) {
  const enCorrection = reponseValidee !== undefined;

  return (
    <div className="grid grid-cols-2 gap-3">
      {[true, false].map((valeur) => {
        const estBonne = valeur === question.bonneReponse;
        const estChoisie = reponseValidee === valeur;

        let styles =
          'border-ardoise-200 hover:border-encre-400 hover:bg-encre-50 dark:border-ardoise-700 dark:hover:border-encre-500 dark:hover:bg-encre-500/10';
        if (enCorrection) {
          if (estBonne)
            styles = 'border-emerald-400 bg-emerald-50 dark:border-emerald-600 dark:bg-emerald-500/10';
          else if (estChoisie)
            styles = 'border-rose-400 bg-rose-50 dark:border-rose-600 dark:bg-rose-500/10';
          else styles = 'border-ardoise-200 opacity-50 dark:border-ardoise-800';
        }

        return (
          <button
            key={String(valeur)}
            type="button"
            disabled={enCorrection}
            onClick={() => onRepondre(valeur)}
            className={`flex items-center justify-center gap-2 rounded-xl border py-4 text-base font-semibold text-ardoise-800 transition-all disabled:cursor-default dark:text-ardoise-200 ${styles}`}
          >
            {enCorrection && (estBonne || estChoisie) && (
              <Icone
                nom={estBonne ? 'coche' : 'croix'}
                className={`h-5 w-5 ${estBonne ? 'text-emerald-600' : 'text-rose-600'}`}
              />
            )}
            {valeur ? 'Vrai' : 'Faux'}
          </button>
        );
      })}
    </div>
  );
}
