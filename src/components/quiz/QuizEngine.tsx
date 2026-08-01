import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import type { Question, ResultatQuestion, Theme } from '../../types/quiz';
import { TYPE_LABELS } from '../../types/quiz';
import { shuffle } from '../../utils/shuffle';
import { useProgression } from '../../hooks/useProgression';
import { checkAnswer } from './checkAnswer';
import QuestionQCM from './QuestionQCM';
import QuestionVraiFaux from './QuestionVraiFaux';
import QuestionAssociation from './QuestionAssociation';
import QuestionCompleterCode from './QuestionCompleterCode';
import QuestionRemettreDansOrdre from './QuestionRemettreDansOrdre';
import QuizRecap from './QuizRecap';
import TexteRiche from './TexteRiche';
import Icone from '../Icone';

interface QuestionPreparee {
  question: Question;
  droitesMelangees: string[];
  elementsMelanges: string[];
}

export interface Retour {
  to: string;
  libelle: string;
}

interface Props {
  questions: Question[];
  titre: string;
  retour: Retour;
  onRejouer: () => void;
  dureeSecondes?: number;
  /** Renseigné quand la série porte sur un thème unique : le score est mémorisé. */
  themeSerie?: Theme;
}

function formaterDuree(secondes: number): string {
  const m = Math.floor(secondes / 60);
  const s = secondes % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

function classeDifficulte(niveau: number) {
  if (niveau === 1) return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300';
  if (niveau === 2) return 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300';
  return 'bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300';
}

export default function QuizEngine({
  questions,
  titre,
  retour,
  onRejouer,
  dureeSecondes,
  themeSerie,
}: Props) {
  const preparees = useMemo<QuestionPreparee[]>(
    () =>
      questions.map((q) => ({
        question: q,
        droitesMelangees: q.type === 'association' ? shuffle(q.paires.map((p) => p.droite)) : [],
        elementsMelanges: q.type === 'remettre_ordre' ? shuffle(q.elements) : [],
      })),
    [questions],
  );

  const [index, setIndex] = useState(0);
  const [reponse, setReponse] = useState<unknown>(null);
  const [juste, setJuste] = useState<boolean | null>(null);
  const [resultats, setResultats] = useState<ResultatQuestion[]>([]);
  const [termine, setTermine] = useState(false);
  const [tempsEcoule, setTempsEcoule] = useState(false);

  const [echeance] = useState<number | null>(() =>
    dureeSecondes ? Date.now() + dureeSecondes * 1000 : null,
  );
  const [restant, setRestant] = useState<number | null>(dureeSecondes ?? null);

  const { enregistrerSession } = useProgression();
  const dejaEnregistre = useRef(false);

  const terminer = useCallback(
    (finaux: ResultatQuestion[], parExpiration = false) => {
      if (dejaEnregistre.current) return;
      dejaEnregistre.current = true;
      if (parExpiration) setTempsEcoule(true);
      setResultats(finaux);
      setTermine(true);
      enregistrerSession(finaux, themeSerie);
    },
    [enregistrerSession, themeSerie],
  );

  // Chronomètre : on recalcule depuis une échéance absolue, ce qui reste juste
  // même si l'onglet passe en arrière-plan et que les minuteurs sont ralentis.
  useEffect(() => {
    if (echeance === null || termine) return;

    const battement = setInterval(() => {
      const reste = Math.max(0, Math.ceil((echeance - Date.now()) / 1000));
      setRestant(reste);
      if (reste === 0) terminer(resultats, true);
    }, 500);

    return () => clearInterval(battement);
  }, [echeance, termine, resultats, terminer]);

  const courante = preparees[index];
  const q = courante?.question;
  const enCorrection = reponse !== null;

  const valider = useCallback(
    (donnee: unknown) => {
      if (!q) return;
      setReponse(donnee);
      setJuste(checkAnswer(q, donnee));
    },
    [q],
  );

  const suivante = useCallback(() => {
    if (!q || juste === null) return;
    const finaux = [...resultats, { id: q.id, theme: q.theme, correct: juste, reponse }];

    if (index + 1 >= preparees.length) {
      terminer(finaux);
      return;
    }

    setResultats(finaux);
    setIndex((i) => i + 1);
    setReponse(null);
    setJuste(null);
  }, [q, juste, resultats, reponse, index, preparees.length, terminer]);

  // Entrée passe à la question suivante une fois la correction affichée.
  useEffect(() => {
    if (!enCorrection || termine) return;
    const surTouche = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        suivante();
      }
    };
    window.addEventListener('keydown', surTouche);
    return () => window.removeEventListener('keydown', surTouche);
  }, [enCorrection, termine, suivante]);

  if (termine || !q || !courante) {
    return (
      <QuizRecap
        questions={questions}
        resultats={resultats}
        retour={retour}
        onRejouer={onRejouer}
        tempsEcoule={tempsEcoule}
      />
    );
  }

  // La question en cours compte dès sa validation, sans attendre le passage à la suivante.
  const bonnes = resultats.filter((r) => r.correct).length + (juste ? 1 : 0);
  const avancement = (index / preparees.length) * 100;
  const couleurChrono =
    restant === null
      ? ''
      : restant > 300
        ? 'text-ardoise-500 dark:text-ardoise-400'
        : restant > 60
          ? 'text-amber-600 dark:text-amber-400'
          : 'text-rose-600 dark:text-rose-400';

  return (
    <div className="mx-auto max-w-3xl px-5 py-6 sm:px-8 sm:py-8">
      <div className="mb-6">
        <div className="mb-3 flex items-center justify-between gap-4">
          <Link
            to={retour.to}
            className="flex min-w-0 items-center gap-1.5 text-sm text-ardoise-500 transition-colors hover:text-ardoise-800 dark:text-ardoise-400 dark:hover:text-ardoise-100"
          >
            <Icone nom="gauche" className="h-4 w-4 shrink-0" />
            <span className="truncate">{titre}</span>
          </Link>

          {restant !== null && (
            <span
              className={`flex shrink-0 items-center gap-1.5 font-mono text-sm font-bold tabular-nums ${couleurChrono}`}
              aria-label="Temps restant"
            >
              <Icone nom="chrono" className="h-4 w-4" />
              {formaterDuree(restant)}
            </span>
          )}
        </div>

        <div className="mb-2 flex items-center justify-between text-xs text-ardoise-500 dark:text-ardoise-400">
          <span className="tabular-nums">
            Question {index + 1} sur {preparees.length}
          </span>
          <span className="tabular-nums">
            {bonnes} bonne{bonnes > 1 ? 's' : ''} réponse{bonnes > 1 ? 's' : ''}
          </span>
        </div>

        <div
          className="h-1.5 overflow-hidden rounded-full bg-ardoise-200 dark:bg-ardoise-800"
          role="progressbar"
          aria-valuenow={index + 1}
          aria-valuemin={1}
          aria-valuemax={preparees.length}
        >
          <div
            className="h-full rounded-full bg-encre-500 transition-[width] duration-300"
            style={{ width: `${avancement}%` }}
          />
        </div>
      </div>

      <div key={q.id} className="anim-entree">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className={`puce ${classeDifficulte(q.difficulte)}`}>
            {q.difficulte === 1 ? 'Facile' : q.difficulte === 2 ? 'Moyen' : 'Difficile'}
          </span>
          <span className="puce bg-ardoise-100 text-ardoise-600 dark:bg-ardoise-800 dark:text-ardoise-400">
            {TYPE_LABELS[q.type]}
          </span>
        </div>

        <div className="carte mb-4 p-5 sm:p-6">
          <p className="mb-5 text-lg leading-relaxed font-medium text-ardoise-900 dark:text-white">
            <TexteRiche>{q.enonce}</TexteRiche>
          </p>

          {q.type === 'qcm' && (
            <QuestionQCM
              question={q}
              reponseValidee={enCorrection ? (reponse as number) : undefined}
              onRepondre={valider}
            />
          )}
          {q.type === 'vrai_faux' && (
            <QuestionVraiFaux
              question={q}
              reponseValidee={enCorrection ? (reponse as boolean) : undefined}
              onRepondre={valider}
            />
          )}
          {q.type === 'association' && (
            <QuestionAssociation
              question={q}
              droitesMelangees={courante.droitesMelangees}
              reponseValidee={enCorrection ? (reponse as Record<string, string>) : undefined}
              onRepondre={valider}
            />
          )}
          {q.type === 'completer_code' && (
            <QuestionCompleterCode
              question={q}
              reponseValidee={enCorrection ? (reponse as string[]) : undefined}
              onRepondre={valider}
            />
          )}
          {q.type === 'remettre_ordre' && (
            <QuestionRemettreDansOrdre
              question={q}
              elementsMelanges={courante.elementsMelanges}
              reponseValidee={enCorrection ? (reponse as string[]) : undefined}
              onRepondre={valider}
            />
          )}
        </div>

        {enCorrection && (
          <div
            aria-live="polite"
            className={`mb-4 rounded-2xl border p-5 ${
              juste
                ? 'border-emerald-300 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-500/10'
                : 'border-rose-300 bg-rose-50 dark:border-rose-800 dark:bg-rose-500/10'
            }`}
          >
            <p
              className={`mb-2 flex items-center gap-2 font-bold ${
                juste
                  ? 'text-emerald-700 dark:text-emerald-300'
                  : 'text-rose-700 dark:text-rose-300'
              }`}
            >
              <Icone nom={juste ? 'coche' : 'croix'} className="h-5 w-5" />
              {juste ? 'Bonne réponse' : 'Réponse incorrecte'}
            </p>
            <p className="text-[15px] leading-relaxed text-ardoise-700 dark:text-ardoise-300">
              <TexteRiche>{q.explication}</TexteRiche>
            </p>
          </div>
        )}

        {enCorrection && (
          <div className="flex items-center justify-between gap-3">
            <p className="hidden text-xs text-ardoise-400 sm:block">
              Appuie sur Entrée pour continuer
            </p>
            <button type="button" onClick={suivante} className="btn btn-principal ml-auto">
              {index + 1 >= preparees.length ? 'Voir le bilan' : 'Question suivante'}
              <Icone nom="droite" className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
