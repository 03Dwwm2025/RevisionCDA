# Révision CDA

Site personnel de révision pour le titre professionnel **Concepteur Développeur d'Applications** (niveau 6, promo 2026).

Deux usages : lire le cours découpé par chapitre, et s'entraîner sur des séries de questions — par thème, en examen blanc chronométré, ou en rejouant ses erreurs passées.

## Ce qu'il y a dedans

- **26 chapitres** couvrant les trois blocs de compétences du référentiel : conception, développement, déploiement — avec la sécurité traitée à chaque étape.
- **344 questions** réparties sur 17 thèmes, dans cinq formats : choix multiple, vrai/faux, association, complétion de code et remise en ordre.
- **Trois modes d'entraînement** : série par thème, examen blanc (25 questions tirées de façon équilibrée entre les thèmes, 30 minutes), et rattrapage des questions déjà ratées.
- **Progression mémorisée** dans le navigateur : dernier score par thème et liste des erreurs à rejouer.

## Démarrer

```bash
npm install
npm run dev        # http://localhost:5173
```

## Commandes

| Commande | Rôle |
| --- | --- |
| `npm run dev` | Serveur de développement |
| `npm run build` | Vérification des types puis build de production dans `dist/` |
| `npm run preview` | Servir le build de production en local |
| `npm test` | Suite de tests (Vitest) |
| `npm run test:watch` | Tests en continu pendant le développement |
| `npm run lint` | ESLint sur le code du site |
| `npm run verifier` | Enchaîne lint, tests et build |

## Structure

```
cours/                   Contenu du cours en markdown + index.json et parties.json
public/cours             Lien symbolique vers cours/, servi tel quel par Vite
src/
  components/            Mise en page, navigation, icônes
  components/quiz/       Moteur de quiz et les cinq types de question
  data/questions/        Les questions, un fichier par thème
  hooks/                 Chargement du cours, progression, thème clair/sombre
  pages/                 Accueil, lecture, quiz par thème, examen, erreurs
  types/                 Modèle de données du cours et des questions
  utils/                 Mélange, tirage stratifié, accents de partie
```

## Ajouter du contenu

**Un chapitre** : déposer le fichier `.md` dans `cours/`, puis l'ajouter à `cours/index.json` avec son titre et sa partie. Pour proposer un quiz en fin de chapitre, ajouter une entrée dans `src/data/questions/chapitres.ts`.

**Des questions** : les ajouter au fichier du thème dans `src/data/questions/`, puis mettre à jour `src/data/questions/compte.ts`. La suite de tests vérifie l'intégrité des données à chaque exécution :

- identifiants uniques, thème cohérent, énoncé et explication non vides ;
- choix multiples : au moins trois options distinctes, bonne réponse dans les bornes ;
- associations : aucun terme ni définition en double ;
- complétion de code : trous numérotés de 1 à N, une réponse par trou, réponses présentes dans les choix, au moins un distracteur, et question résoluble ;
- remise en ordre : au moins trois éléments distincts ;
- compteurs de la navigation synchronisés avec les données réelles.

Un `npm test` avant de commiter suffit à attraper les erreurs de saisie.

## Déploiement

Hébergé sur **Vercel**. Le `vercel.json` fournit la réécriture SPA (pour que les liens profonds fonctionnent au rechargement), les en-têtes de sécurité et le cache des ressources versionnées.

## Choix techniques

- **React + Vite + TypeScript**, aucune dépendance d'interface : la mise en forme est faite avec Tailwind v4 et un petit jeu d'icônes SVG local.
- **Tout est statique** : le contenu vit dans le dépôt, il n'y a ni API ni base de données.
- **Aucun compte** : la progression reste dans le `localStorage` du navigateur.
- Le lot de questions et le moteur de rendu markdown sont chargés à la demande, pour que l'accueil reste léger.
