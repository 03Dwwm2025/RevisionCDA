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
  {
    id: 'git-011',
    theme: 'git',
    type: 'qcm',
    difficulte: 2,
    enonce:
      'Un commit fautif est déjà poussé sur la branche partagée. Quelle commande annule son effet sans réécrire l’historique ?',
    options: [
      '`git revert <commit>` — elle crée un nouveau commit qui défait le précédent',
      '`git reset --hard <commit>` — elle supprime le commit de l’historique',
      '`git checkout <commit>` — elle revient à l’état précédent',
      '`git clean -fd` — elle nettoie les fichiers non suivis',
    ],
    bonneReponse: 0,
    explication:
      '`revert` ajoute un commit inverse : l’historique reste intact et les autres branches ne cassent pas. `reset --hard` réécrit l’historique — acceptable sur une branche locale, dangereux dès que le commit est partagé, puisqu’il faudrait forcer la poussée et casser le dépôt des collègues.',
  },
  {
    id: 'git-012',
    theme: 'git',
    type: 'qcm',
    difficulte: 2,
    enonce:
      'Tu dois basculer d’urgence sur une autre branche, mais ton travail en cours n’est pas prêt à être commité. Que fais-tu ?',
    options: [
      'Mettre le travail de côté avec `git stash`, changer de branche, puis le récupérer avec `git stash pop`',
      'Commiter avec un message « wip » et corriger plus tard',
      'Copier les fichiers modifiés dans un dossier temporaire',
      'Créer une branche, commiter, puis supprimer la branche ensuite',
    ],
    bonneReponse: 0,
    explication:
      'Le remisage met les modifications de côté et rend l’arbre de travail propre en une commande. Un commit « wip » poussé pollue l’historique et casse la lecture des messages ; s’il reste local, c’est une alternative acceptable, à condition de le réécrire avant de pousser.',
  },
  {
    id: 'git-013',
    theme: 'git',
    type: 'vrai_faux',
    difficulte: 2,
    enonce:
      'Ajouter un fichier au `.gitignore` suffit à le retirer du dépôt s’il est déjà suivi par Git.',
    bonneReponse: false,
    explication:
      'Le fichier d’exclusion ne concerne que les fichiers non encore suivis. Un fichier déjà indexé continue d’être versionné : il faut le retirer explicitement de l’index tout en le gardant sur le disque. C’est le piège classique du fichier de secrets qu’on croit avoir sorti du dépôt.',
  },
  {
    id: 'git-014',
    theme: 'git',
    type: 'qcm',
    difficulte: 2,
    enonce: 'Quelle différence entre une étiquette annotée et une étiquette légère ?',
    options: [
      'L’annotée est un objet à part entière : elle porte un auteur, une date et un message',
      'La légère est la seule qui puisse être poussée sur le dépôt distant',
      'L’annotée s’applique à une branche, la légère à un commit',
      'Il n’y a aucune différence, seul le nom change',
    ],
    bonneReponse: 0,
    explication:
      'Une étiquette légère n’est qu’un pointeur vers un commit. L’annotée enregistre qui a publié la version, quand et pourquoi — c’est ce qu’on veut pour marquer une livraison. Les deux se poussent, mais uniquement sur demande explicite : les étiquettes ne partent pas avec une poussée ordinaire.',
  },
  {
    id: 'git-015',
    theme: 'git',
    type: 'qcm',
    difficulte: 3,
    enonce:
      'Une régression est apparue quelque part entre deux versions, sans qu’on sache quel commit l’a introduite. Quelle approche te la fait trouver le plus vite ?',
    options: [
      'Une recherche par dichotomie dans l’historique, en testant à chaque étape',
      'Relire tous les commits un par un depuis la dernière version stable',
      'Annuler les commits un par un jusqu’à ce que le problème disparaisse',
      'Recréer le projet à partir de la dernière version connue comme bonne',
    ],
    bonneReponse: 0,
    explication:
      'La dichotomie divise l’intervalle par deux à chaque essai : sur 1000 commits, une dizaine de tests suffisent. Git fournit la commande qui automatise le déplacement (`git bisect`) ; c’est à toi de dire à chaque étape si la version testée est bonne ou mauvaise.',
  },
  {
    id: 'git-016',
    theme: 'git',
    type: 'association',
    difficulte: 2,
    enonce: 'Associez chaque zone de Git à ce qu’elle contient.',
    paires: [
      { gauche: 'Répertoire de travail', droite: 'Les fichiers tels qu’ils sont sur le disque' },
      { gauche: 'Index (zone de préparation)', droite: 'Ce qui entrera dans le prochain commit' },
      { gauche: 'Dépôt local', droite: 'L’historique des commits sur cette machine' },
      { gauche: 'Dépôt distant', droite: 'L’historique partagé avec l’équipe' },
    ],
    explication:
      'Ces quatre zones expliquent le trio ajouter / commiter / pousser : on choisit ce qui entre dans l’index, on fige l’index en commit, puis on publie. La zone de préparation est ce qui permet de découper un travail en plusieurs commits cohérents plutôt qu’en un gros bloc.',
  },
  {
    id: 'git-017',
    theme: 'git',
    type: 'vrai_faux',
    difficulte: 3,
    enonce:
      'Forcer la poussée sur une branche partagée est sans conséquence tant que les tests passent.',
    bonneReponse: false,
    explication:
      'La poussée forcée réécrit l’historique distant : les commits que les collègues ont déjà récupérés disparaissent, et leur prochaine synchronisation part en conflit. C’est aussi le moyen d’effacer discrètement une trace, ce qui pose un problème d’intégrité (OWASP A08). Sur la branche principale, on la bloque au niveau du dépôt.',
  },
  {
    id: 'git-018',
    theme: 'git',
    type: 'qcm',
    difficulte: 2,
    enonce: 'À quoi sert une demande de fusion (pull request) au-delà de l’intégration du code ?',
    options: [
      'À faire relire le changement et à exiger que l’intégration continue soit verte avant la fusion',
      'À convertir automatiquement les commits en une seule version',
      'À déployer la branche en production pour la tester',
      'À sauvegarder la branche sur le dépôt distant',
    ],
    bonneReponse: 0,
    explication:
      'Elle transforme la fusion en point de contrôle : relecture par un pair, exécution des tests, analyse de sécurité. C’est la parade au risque d’intégrité de la chaîne de livraison — un seul compte compromis ne suffit plus à envoyer du code en production.',
  },
  {
    id: 'git-019',
    theme: 'git',
    type: 'remettre_ordre',
    difficulte: 2,
    enonce: 'Remettez dans l’ordre la résolution d’un conflit de fusion.',
    elements: [
      'Git signale les fichiers en conflit et interrompt la fusion',
      'Ouvrir chaque fichier et choisir la version à conserver',
      'Supprimer les marqueurs de conflit laissés dans le fichier',
      'Vérifier que le projet compile et que les tests passent',
      'Ajouter les fichiers résolus à l’index',
      'Finaliser la fusion par un commit',
    ],
    explication:
      'L’étape la plus souvent sautée est la vérification : un conflit résolu ligne à ligne peut produire un code syntaxiquement valide mais fonctionnellement faux. Les marqueurs oubliés, eux, se voient tout de suite — ils cassent la compilation.',
  },
  {
    id: 'git-020',
    theme: 'git',
    type: 'qcm',
    difficulte: 2,
    enonce: 'Un correctif urgent doit partir en production alors que la branche principale contient déjà des développements non terminés. Quelle stratégie ?',
    options: [
      'Créer une branche de correctif à partir de la dernière version livrée, corriger, livrer, puis reporter le correctif sur la branche principale',
      'Livrer la branche principale telle quelle, développements non terminés inclus',
      'Attendre que les développements en cours soient terminés',
      'Corriger directement en production, sans passer par le dépôt',
    ],
    bonneReponse: 0,
    explication:
      'On repart de l’étiquette de la version en production, ce qui garantit de ne livrer que le correctif. Le report sur la branche principale est l’étape qu’on oublie : sans lui, le bug revient à la livraison suivante. Corriger directement sur le serveur, c’est une modification qui n’existe dans aucun historique.',
  },
];
