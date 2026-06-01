import type { Question } from '../../types/quiz';

export const questionsGit: Question[] = [
  {
    id: 'git-001',
    theme: 'git',
    type: 'association',
    difficulte: 1,
    enonce: 'Associez chaque concept Git à sa définition.',
    paires: [
      { gauche: 'Commit', droite: 'Instantané daté d\'un ensemble de modifications, avec un message' },
      { gauche: 'Branche', droite: 'Ligne de développement parallèle (pointeur sur un commit)' },
      { gauche: 'Remote', droite: 'Le dépôt distant partagé (GitHub, GitLab…)' },
      { gauche: 'Pull Request', droite: 'Demande de fusion d\'une branche après revue de code' },
    ],
    explication:
      'Une branche est juste un pointeur léger sur un commit — créer une branche ne copie pas les fichiers. Le remote est la référence partagée ; `git push` synchronise les commits locaux vers le remote. La PR est le mécanisme de revue avant merge.',
  },
  {
    id: 'git-002',
    theme: 'git',
    type: 'remettre_ordre',
    difficulte: 1,
    enonce: 'Remettez dans l\'ordre les étapes du workflow GitHub Flow pour ajouter une fonctionnalité.',
    elements: [
      'Créer une branche à partir de `main` (`git checkout -b feature/x`)',
      'Développer et committer les modifications sur la branche',
      'Pousser la branche sur le remote (`git push origin feature/x`)',
      'Ouvrir une Pull Request vers `main` et attendre la revue',
      'Merger la PR dans `main` après validation de la CI et de la revue',
    ],
    explication:
      'GitHub Flow : `main` est toujours déployable. Toute modification passe par une branche courte + PR. La CI tourne automatiquement sur la PR. Le merge se fait uniquement si les tests passent et la revue est approuvée.',
  },
  {
    id: 'git-003',
    theme: 'git',
    type: 'vrai_faux',
    difficulte: 1,
    enonce: 'Committer un secret (mot de passe, clé API) par erreur dans Git reste dangereux même si on le supprime dans le commit suivant.',
    bonneReponse: true,
    explication:
      'Le secret reste dans l\'historique Git (le commit original existe toujours). Quiconque clone ou a cloné le dépôt peut le retrouver. Solution : révoquer immédiatement le secret, utiliser `git filter-repo` pour réécrire l\'historique, et configurer le scan de secrets (GitHub secret scanning, gitleaks).',
  },
  {
    id: 'git-004',
    theme: 'git',
    type: 'qcm',
    difficulte: 1,
    enonce: 'Quelle commande crée une nouvelle branche **et** bascule immédiatement dessus ?',
    options: [
      '`git branch feature/x`',
      '`git checkout -b feature/x`',
      '`git switch feature/x`',
      '`git merge feature/x`',
    ],
    bonneReponse: 1,
    explication:
      '`git branch feature/x` crée la branche mais reste sur la branche actuelle. `git checkout -b feature/x` = créer + basculer. Depuis Git 2.23, `git switch -c feature/x` est l\'équivalent moderne. `git merge` fusionne, il ne crée pas.',
  },
  {
    id: 'git-005',
    theme: 'git',
    type: 'qcm',
    difficulte: 2,
    enonce: 'Quelle convention de message de commit est recommandée pour améliorer la lisibilité de l\'historique ?',
    options: [
      'Un texte libre aussi court que possible',
      'Conventional Commits : `type(scope): description` — ex. `feat: ajout dépôt de demande`',
      'Un numéro de ticket uniquement — ex. `#42`',
      'Le nom du fichier modifié — ex. `DemandeService.cs`',
    ],
    bonneReponse: 1,
    explication:
      'Conventional Commits définit des types normalisés : `feat` (nouvelle fonctionnalité), `fix` (correctif), `docs`, `refactor`, `test`, `chore`… Cela permet de générer des changelogs automatiquement et de lire l\'historique d\'un coup d\'œil.',
  },
  {
    id: 'git-006',
    theme: 'git',
    type: 'completer_code',
    difficulte: 2,
    enonce: 'Complétez les commandes Git pour créer une branche, committer et pousser.',
    codeAvecTrous: `# Créer et basculer sur une nouvelle branche
git ___1___ -b feature/depot-demande

# Indexer tous les fichiers modifiés
git ___2___ .

# Créer un commit avec un message conventionnel
git commit -m "feat: ajout du dépôt de demande de congé"

# Pousser la branche sur le remote
git ___3___ origin feature/depot-demande`,
    choix: ['checkout', 'branch', 'switch', 'add', 'stage', 'commit', 'push', 'pull'],
    bonnesReponses: ['checkout', 'add', 'push'],
    explication:
      '`git checkout -b` crée et bascule. `git add .` indexe les changements (la "staging area"). `git push origin <branche>` envoie la branche sur le remote. Ordre immuable : add → commit → push.',
  },
  {
    id: 'git-007',
    theme: 'git',
    type: 'vrai_faux',
    difficulte: 2,
    enonce: 'Le fichier `.gitignore` empêche Git de traquer les fichiers listés, **y compris s\'ils ont déjà été commités par le passé**.',
    bonneReponse: false,
    explication:
      '`.gitignore` ne s\'applique qu\'aux fichiers **non encore trackés**. Si un fichier a déjà été commité, il continuera d\'être suivi même s\'il est ajouté au `.gitignore`. Pour stopper le suivi : `git rm --cached <fichier>` puis committer.',
  },
  {
    id: 'git-008',
    theme: 'git',
    type: 'qcm',
    difficulte: 2,
    enonce: 'Quelle est la différence entre `git merge` et `git rebase` ?',
    options: [
      '`merge` crée un commit de fusion qui préserve l\'historique des deux branches ; `rebase` rejoue les commits sur la base de la branche cible (historique linéaire)',
      '`rebase` crée un commit de fusion ; `merge` rejoue les commits',
      'Les deux sont identiques, `rebase` est juste plus récent',
      '`merge` fonctionne uniquement sur des branches locales ; `rebase` est pour les remotes',
    ],
    bonneReponse: 0,
    explication:
      '`merge` : historique fidèle avec un merge commit. `rebase` : réécriture de l\'historique pour un log linéaire. Règle d\'or : ne jamais rebaser une branche partagée (push force nécessaire → danger pour les autres). Préférer `merge` ou `squash` pour les PRs publiques.',
  },
  {
    id: 'git-009',
    theme: 'git',
    type: 'qcm',
    difficulte: 3,
    enonce: 'Lors d\'un conflit de merge, Git marque les zones conflictuelles dans les fichiers. Comment résoudre proprement un conflit ?',
    options: [
      'Faire `git merge --abort` puis recréer la branche depuis main',
      'Éditer les fichiers conflictuels pour choisir la bonne version, supprimer les marqueurs `<<<<<<<`, puis `git add` et `git commit`',
      'Faire `git reset --hard HEAD` pour annuler tous les changements locaux',
      'Supprimer le fichier conflictuel et le recréer',
    ],
    bonneReponse: 1,
    explication:
      'Git marque les conflits avec `<<<<<<< HEAD`, `=======`, `>>>>>>> branche`. Il faut manuellement choisir le code correct (ou fusionner les deux), supprimer tous les marqueurs, puis `git add <fichier>` et `git commit` pour finaliser le merge. Les IDEs (VS Code, Rider) ont une UI dédiée.',
  },
  {
    id: 'git-010',
    theme: 'git',
    type: 'vrai_faux',
    difficulte: 3,
    enonce: 'Protéger la branche `main` en exigeant une PR approuvée avant le merge est une bonne pratique de sécurité (OWASP A08 — intégrité de la chaîne).',
    bonneReponse: true,
    explication:
      'La protection de branche empêche les pushs directs sur `main` et oblige à passer par une PR avec revue. C\'est une mesure de défense de la chaîne de livraison : un attaquant qui compromet un compte développeur ne peut pas pusher du code malveillant directement en prod.',
  },
];
