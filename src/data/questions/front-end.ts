import type { Question } from '../../types/quiz';

export const questionsFrontEnd: Question[] = [
  {
    id: 'front-001',
    theme: 'front-end',
    type: 'association',
    difficulte: 1,
    enonce: 'Associez chaque technologie front-end à son rôle.',
    paires: [
      { gauche: 'HTML', droite: 'Structure et sémantique du contenu (squelette)' },
      { gauche: 'CSS', droite: 'Apparence et mise en page (styles, responsive)' },
      { gauche: 'JavaScript', droite: 'Comportement et interactivité côté navigateur' },
      { gauche: 'TypeScript', droite: 'Sur-ensemble typé de JavaScript réduisant les bugs à la compilation' },
    ],
    explication:
      'HTML structure (balises sémantiques : `<header>`, `<nav>`, `<main>`, `<article>`). CSS stylise (Flexbox, Grid, media queries). JS rend interactif. TypeScript ajoute le typage statique : les erreurs de type sont détectées à la compilation, pas au runtime.',
  },
  {
    id: 'front-002',
    theme: 'front-end',
    type: 'qcm',
    difficulte: 1,
    enonce: 'Qu\'est-ce qu\'une **SPA** (Single Page Application) ?',
    options: [
      'Une application qui n\'a qu\'une seule page HTML statique sans JavaScript',
      'Une application web dont toute la navigation se fait sans rechargement complet de page (le routage est géré côté client)',
      'Une application mobile native compilée pour le Web',
      'Un site web sans base de données',
    ],
    bonneReponse: 1,
    explication:
      'Dans une SPA (React, Vue, Angular), le navigateur charge l\'app une fois puis navigue entre "pages" via le routeur côté client (React Router). Les données arrivent via des appels API (`fetch`). Avantage : navigation fluide. Contre : temps de chargement initial + SEO à soigner.',
  },
  {
    id: 'front-003',
    theme: 'front-end',
    type: 'vrai_faux',
    difficulte: 1,
    enonce: 'La validation d\'un formulaire côté client (JavaScript) suffit à sécuriser l\'application contre les données malveillantes.',
    bonneReponse: false,
    explication:
      'La validation côté client est du **confort UX** : elle peut être contournée en quelques secondes (désactiver JS, Postman, curl). La validation qui protège est celle du **serveur** (Controller + règles métier). Il faut les deux, mais seule la validation serveur est de la sécurité.',
  },
  {
    id: 'front-004',
    theme: 'front-end',
    type: 'qcm',
    difficulte: 2,
    enonce: 'Où faut-il stocker un token JWT dans une SPA pour minimiser les risques de vol ?',
    options: [
      'Dans `localStorage` pour la persistance entre sessions',
      'Dans `sessionStorage` pour la durée de l\'onglet',
      'Dans un cookie `HttpOnly` + `Secure` (non accessible au JavaScript)',
      'Dans une variable React state exportée globalement',
    ],
    bonneReponse: 2,
    explication:
      '`localStorage` et `sessionStorage` sont accessibles au JavaScript → vulnérables au XSS. Un cookie `HttpOnly` ne peut pas être lu par JS, donc un script XSS ne peut pas le voler. `Secure` le limite à HTTPS. Contrepartie : il faut gérer le CSRF (attribut `SameSite` sur le cookie).',
  },
  {
    id: 'front-005',
    theme: 'front-end',
    type: 'completer_code',
    difficulte: 2,
    enonce: 'Complétez cet appel `fetch` pour créer une demande avec authentification JWT.',
    codeAvecTrous: `const res = await fetch("/api/demandes", {
  method: "___1___",
  headers: {
    "Content-Type": "application/json",
    "Authorization": \`___2___ \${token}\`
  },
  body: ___3___({ dateDebut, dateFin })
});
if (!res.ok) throw new Error(\`Erreur \${res.status}\`);`,
    choix: ['POST', 'GET', 'PUT', 'Bearer', 'Token', 'Basic', 'JSON.stringify', 'JSON.parse', 'JSON.encode'],
    bonnesReponses: ['POST', 'Bearer', 'JSON.stringify'],
    explication:
      '`POST` pour créer une ressource. `Bearer <token>` est le schéma standard pour envoyer un JWT dans l\'en-tête Authorization. `JSON.stringify` sérialise l\'objet JavaScript en chaîne JSON pour le corps de la requête.',
  },
  {
    id: 'front-006',
    theme: 'front-end',
    type: 'qcm',
    difficulte: 2,
    enonce: 'Qu\'est-ce que le **Flexbox** en CSS et à quoi sert-il principalement ?',
    options: [
      'Un framework JavaScript pour créer des animations fluides',
      'Un modèle de mise en page CSS pour distribuer l\'espace et aligner les éléments sur un axe (ligne ou colonne)',
      'Un système de grille CSS à deux dimensions (lignes ET colonnes)',
      'Un preprocesseur CSS comme Sass ou Less',
    ],
    bonneReponse: 1,
    explication:
      'Flexbox est unidimensionnel (une ligne OU une colonne). CSS Grid est bidimensionnel (lignes ET colonnes). Flexbox est idéal pour les barres de navigation, les cartes alignées, les boutons de formulaire. Grid est mieux pour les layouts de pages entières. Les deux se complètent.',
  },
  {
    id: 'front-007',
    theme: 'front-end',
    type: 'vrai_faux',
    difficulte: 2,
    enonce: 'React échappe automatiquement le contenu JSX affiché avec `{}`, ce qui protège contre la majorité des attaques XSS courantes.',
    bonneReponse: true,
    explication:
      'React échappe les chaînes insérées via `{variable}` en entités HTML (`<` → `&lt;`). C\'est pourquoi `dangerouslySetInnerHTML` est à éviter : il contourne cette protection. La CSP (Content-Security-Policy) ajoute une couche supplémentaire en interdisant les scripts inline.',
  },
  {
    id: 'front-008',
    theme: 'front-end',
    type: 'qcm',
    difficulte: 3,
    enonce: 'Qu\'est-ce qu\'une attaque **CSRF** (Cross-Site Request Forgery) et quelle est la parade recommandée ?',
    options: [
      'Un script malveillant injecté dans la page ; parade : échapper les sorties',
      'Un site malveillant déclenche une action sur un site légitime où la victime est connectée ; parade : token anti-CSRF + cookie SameSite',
      'Un attaquant intercepte les communications réseau ; parade : HTTPS',
      'Un bot réalise des milliers de connexions simultanées ; parade : rate limiting',
    ],
    bonneReponse: 1,
    explication:
      'CSRF : la victime, connectée sur `banque.fr`, visite `evil.com` qui déclenche `POST banque.fr/virement` — le navigateur envoie automatiquement les cookies. Parades : cookie `SameSite=Strict` (bloque l\'envoi cross-site) + token CSRF (valeur aléatoire dans le formulaire vérifiée côté serveur).',
  },
];
