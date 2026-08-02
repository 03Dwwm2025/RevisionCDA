import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Accueil from './pages/Accueil';

// Les pages de quiz embarquent tout le lot de questions : on les charge à la
// demande pour que l'accueil et la lecture du cours restent légers.
const LectureChapitre = lazy(() => import('./pages/LectureChapitre'));
const QuizTheme = lazy(() => import('./pages/QuizTheme'));
const ModeExamen = lazy(() => import('./pages/ModeExamen'));
const Revision = lazy(() => import('./pages/Revision'));
const Recherche = lazy(() => import('./pages/Recherche'));

function Attente() {
  return <div className="flex h-64 items-center justify-center text-ardoise-400">Chargement…</div>;
}

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<Attente />}>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Accueil />} />
            <Route path="cours/:slug" element={<LectureChapitre />} />
            <Route path="quiz/:slug" element={<QuizTheme />} />
            <Route path="examen" element={<ModeExamen />} />
            <Route path="revision" element={<Revision />} />
            <Route path="recherche" element={<Recherche />} />
            {/* Ancienne adresse, conservée pour les liens déjà enregistrés. */}
            <Route path="erreurs" element={<Revision />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
