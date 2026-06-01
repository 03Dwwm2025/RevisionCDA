# RévisionCDA — Brief projet

## Objectif

Site web **personnel** de révision pour la formation **CDA (Concepteur Développeur d'Applications)**, promo 2026. Deux usages :
1. **Lire les cours** découpés par thème.
2. **S'entraîner** avec des quizz variés, en révision ciblée ou en mode examen.

Pas de comptes, pas de backend, pas de stats à partager. C'est un outil de révision pour une seule personne (moi, Valentin).

## Stack & contraintes

- **React + Vite** (TypeScript).
- **100 % statique** : tout le contenu (cours + questions) vit dans des fichiers JSON/TS dans le repo. Aucune API, aucune base de données.
- **Progression de session en mémoire** (state React). On peut ajouter `localStorage` pour mémoriser les derniers scores par thème, mais rien de plus.
- Style propre et lisible (le contenu est dense : code, tableaux). Pas de framework lourd imposé ; Tailwind est le bienvenu.
- **Déploiement** : conteneur Docker (build multi-stage → Nginx) + GitHub Actions vers un VPS existant. À câbler en fin de projet, en réutilisant le pipeline déjà en place sur d'autres projets (voir avec moi).

## Architecture des écrans

- **Accueil** : liste des thèmes avec, pour chacun, le dernier score si dispo. Bouton d'accès direct au **mode examen**.
- **Nav latérale** : liste des thèmes (Conception, POO, BDD/SQL, API, Front, Git, Tests, Sécurité/OWASP, Docker, CI/CD, Mise en prod…).
- **Lecture d'un chapitre** : affichage **pleine largeur** (pas de cours/quizz côte à côte — on veut de la place pour le code et les tableaux). En bas du chapitre, bouton **« M'entraîner sur ce thème »** qui lance le quizz filtré sur ce thème.
- **Quizz thème** : enchaîne les questions du thème, correction immédiate ou en fin de série (à décider), puis **récap des erreurs**.
- **Mode examen** : pioche aléatoire toutes catégories confondues, **chronométré**, score final + récap des erreurs.

## Modèle de données des questions

Chaque question porte au minimum : `id`, `theme`, `type`, `difficulte` (1–3), `enonce`, `explication` (affichée à la correction). Le champ de réponse dépend du `type`.

Cinq types à supporter :

1. **`qcm`** — une bonne réponse parmi plusieurs. `options: string[]`, `bonneReponse: index`.
2. **`vrai_faux`** — `bonneReponse: boolean`.
3. **`association`** — associer terme ↔ définition. `paires: { gauche, droite }[]` (l'UI mélange la colonne droite).
4. **`completer_code`** — un bloc de code/SQL avec un ou plusieurs trous. **Réponse par choix** (menu déroulant ou étiquettes à glisser) plutôt que saisie libre, pour éviter les faux négatifs sur un espace en trop. `codeAvecTrous`, `choix: string[]`, `bonnesReponses: []`.
5. **`remettre_ordre`** — remettre des éléments dans le bon ordre (ex. étapes d'un build multi-stage, cycle d'une requête HTTP, normalisation 1NF→3NF). `elements: string[]` dans l'ordre correct (l'UI les mélange).

Le moteur de quizz lit le `type` pour savoir comment afficher et corriger chaque question.

## Contenu (cours + questions)

- Le **cours complet** existe déjà (document Word « Cours CDA — Conception au déploiement », 31 pages, 3 parties : Conception / Développement / Déploiement + sécurité intégrée partout + annexes). Il sert de **source unique** pour le contenu des chapitres ET de réservoir pour rédiger les questions. Je le fournirai dans le repo (voir avec moi le format : .docx ou déjà converti en .md/.json).
- Découper le cours **par thème** en fichiers de contenu.
- Rédiger les questions par thème. Démarrer petit (un thème complet en exemple, ex. POO ou Docker) pour valider les 5 formats, puis étendre.

## Ordre de travail suggéré

1. Scaffolder le projet React/Vite + TypeScript, mettre en place la nav et le routing.
2. Définir les types TS du modèle de données (cours + 5 types de questions).
3. Écran de lecture de chapitre (rendu du contenu + bouton « m'entraîner »).
4. Moteur de quizz gérant les 5 types, avec correction + récap erreurs.
5. Mode examen (pioche aléatoire + chrono).
6. Intégrer le contenu réel du cours et un premier lot de questions.
7. Dockerfile multi-stage + Nginx, puis pipeline GitHub Actions vers le VPS.

## Décisions déjà prises (ne pas reposer la question)

- Perso, pas de comptes/backend/stats partagées.
- Statique, contenu en JSON/TS dans le repo.
- Cours et quizz **liés mais en séquence**, jamais côte à côte.
- **Cinq** types de quizz (ci-dessus), tous retenus.
- « Compléter le code » se corrige **par choix**, pas par saisie libre.
- Modes **révision ciblée par thème** et **examen mélangé chronométré**.
