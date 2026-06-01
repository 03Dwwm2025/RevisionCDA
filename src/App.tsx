import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Accueil from './pages/Accueil';
import LectureChapitre from './pages/LectureChapitre';
import QuizTheme from './pages/QuizTheme';
import ModeExamen from './pages/ModeExamen';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Accueil />} />
          <Route path="cours/:slug" element={<LectureChapitre />} />
          <Route path="quiz/:slug" element={<QuizTheme />} />
          <Route path="examen" element={<ModeExamen />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
