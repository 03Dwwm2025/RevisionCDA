import type { Question } from '../../types/quiz';

export const questionsEnvironnement: Question[] = [
  {
    id: 'env-001',
    theme: 'environnement',
    type: 'qcm',
    difficulte: 2,
    enonce:
      'En intégration continue, pourquoi installer les dépendances à partir du fichier de verrouillage plutôt qu’en résolvant les versions à chaque exécution ?',
    options: [
      'Pour que le build soit reproductible : deux exécutions installent exactement le même arbre de dépendances',
      'Parce que c’est plus rapide à taper dans le fichier de pipeline',
      'Parce que la résolution de versions ne fonctionne pas sur un serveur',
      'Parce que cela met automatiquement les dépendances à jour',
    ],
    bonneReponse: 0,
    explication:
      'Résoudre les versions à chaque fois autorise une dépendance transitive à évoluer entre deux exécutions : le build peut casser sans qu’une seule ligne du projet ait changé. Chaque écosystème a sa commande d’installation stricte — `npm ci`, `composer install`, `pip install -r` avec versions figées, restauration verrouillée en .NET.',
  },
  {
    id: 'env-002',
    theme: 'environnement',
    type: 'association',
    difficulte: 2,
    enonce: 'Associez chaque façon de déclarer une dépendance au risque qu’elle fait courir.',
    paires: [
      { gauche: 'Version exacte figée', droite: 'Aucun risque de surprise, mais aucun correctif de sécurité automatique' },
      { gauche: 'Correctifs autorisés seulement', droite: 'Risque faible : seules les corrections entrent' },
      { gauche: 'Versions mineures autorisées', droite: 'Risque modéré : une bibliothèque mal versionnée peut casser' },
      { gauche: 'Aucune limite de version', droite: 'Risque élevé : une version majeure incompatible peut entrer seule' },
    ],
    explication:
      'Ces plages reposent entièrement sur la discipline SemVer des mainteneurs : rien n’empêche techniquement une version mineure d’introduire une rupture. C’est pour ça que le fichier de verrouillage reste indispensable — il fige l’arbre réellement installé, quelle que soit la plage déclarée. Les notations varient (`~` et `^` chez npm et Composer, crochets chez NuGet, `~=` chez pip).',
  },
  {
    id: 'env-003',
    theme: 'environnement',
    type: 'vrai_faux',
    difficulte: 1,
    enonce: 'Le fichier de verrouillage des dépendances doit être versionné dans Git.',
    bonneReponse: true,
    explication:
      'C’est lui qui garantit que la machine du développeur, celle du collègue, la CI et le serveur installent le même arbre, jusqu’aux dépendances transitives. L’ignorer réintroduit la classe entière des bugs « ça marchait chez moi ». Il porte un nom différent partout — `package-lock.json`, `composer.lock`, `poetry.lock`, `Gemfile.lock`, `packages.lock.json` — mais le rôle est identique.',
  },
  {
    id: 'env-004',
    theme: 'environnement',
    type: 'qcm',
    difficulte: 1,
    enonce: 'Quel fichier fait partie du dépôt, à côté d’un `.env` ignoré par Git ?',
    options: [
      '`.env.example`, qui liste les variables attendues sans leurs valeurs',
      '`.env.production`, avec les vrais mots de passe',
      '`.env.backup`, une copie de sécurité du `.env`',
      'Aucun : on documente les variables uniquement à l’oral',
    ],
    bonneReponse: 0,
    explication:
      'Le `.env.example` documente le contrat de configuration : un nouvel arrivant sait quelles variables renseigner sans qu’aucun secret ne soit versionné. Toute valeur sensible commitée doit être considérée comme compromise, même après suppression, car elle reste dans l’historique Git.',
  },
  {
    id: 'env-005',
    theme: 'environnement',
    type: 'association',
    difficulte: 2,
    enonce: 'Associez chaque outil de débogage à ce qu’il fait.',
    paires: [
      { gauche: 'Point d’arrêt', droite: 'Suspend l’exécution à une ligne précise' },
      { gauche: 'Point d’arrêt conditionnel', droite: 'Ne suspend que si une condition est vraie' },
      { gauche: 'Pas à pas détaillé (step into)', droite: 'Entre dans la méthode appelée' },
      { gauche: 'Pile d’appels', droite: 'Montre la chaîne des appels qui a mené ici' },
    ],
    explication:
      'Le débogueur donne l’état complet du programme à un instant donné, là où un affichage en console ne montre que ce qu’on a pensé à afficher. Le point d’arrêt conditionnel est particulièrement utile dans une boucle : on ne s’arrête que sur l’itération qui pose problème.',
  },
  {
    id: 'env-006',
    theme: 'environnement',
    type: 'qcm',
    difficulte: 2,
    enonce: 'À quoi sert un fichier `.editorconfig` dans un projet ?',
    options: [
      'À imposer les mêmes règles de mise en forme (indentation, fins de ligne, encodage) quel que soit l’éditeur utilisé',
      'À configurer la base de données locale',
      'À lister les extensions VS Code obligatoires',
      'À définir les variables d’environnement du projet',
    ],
    bonneReponse: 0,
    explication:
      'Sans lui, un fichier édité sous Windows avec des tabulations et un autre édité sous macOS avec des espaces produisent des diffs illisibles où toutes les lignes apparaissent modifiées. Le `.editorconfig` est lu nativement par la plupart des éditeurs, sans extension à installer.',
  },
  {
    id: 'env-007',
    theme: 'environnement',
    type: 'vrai_faux',
    difficulte: 2,
    enonce: 'Installer une dépendance n’ajoute que le code de cette bibliothèque à votre projet.',
    bonneReponse: false,
    explication:
      'Elle apporte aussi tout son arbre de dépendances transitives, qui peut représenter des centaines de paquets écrits par des inconnus. C’est la surface d’attaque décrite par OWASP A06 : avant d’installer, on regarde le nombre de mainteneurs, la fréquence des publications, et on se méfie des noms proches d’un paquet connu (typosquatting).',
  },
  {
    id: 'env-008',
    theme: 'environnement',
    type: 'association',
    difficulte: 1,
    enonce: 'Associez chaque type de veille au sujet qu’il couvre.',
    paires: [
      { gauche: 'Veille technologique', droite: 'Nouveautés des langages et des frameworks' },
      { gauche: 'Veille sécurité', droite: 'Failles publiées sur les dépendances utilisées' },
      { gauche: 'Veille métier', droite: 'Évolutions du domaine et de la réglementation' },
      { gauche: 'Veille concurrentielle', droite: 'Ce que proposent les produits comparables' },
    ],
    explication:
      'La veille est une compétence attendue du référentiel et une question fréquente à l’entretien final. Une réponse concrète — deux ou trois sources réellement suivies et un exemple de décision technique qu’elles ont fait changer — vaut mieux qu’une liste d’outils.',
  },
  {
    id: 'env-009',
    theme: 'environnement',
    type: 'qcm',
    difficulte: 1,
    enonce: 'Quel est le meilleur test pour savoir si l’environnement d’un projet est correctement documenté ?',
    options: [
      'Un collègue clone le dépôt et fait tourner le projet sans avoir à poser de question',
      'Le README fait plus de deux pages',
      'Tous les développeurs utilisent le même IDE',
      'Le projet compile sur la machine de son auteur',
    ],
    bonneReponse: 0,
    explication:
      'C’est le critère opérationnel : prérequis annoncés, commandes exactes, configuration fournie par un `.env.example` et un `compose.yaml`. Tout ce qui nécessite un savoir tacite (« il faut aussi installer ça, et modifier ce fichier ») est une dette qui se paie à chaque nouvel arrivant.',
  },
  {
    id: 'env-010',
    theme: 'environnement',
    type: 'completer_code',
    difficulte: 2,
    enonce: 'Complétez ce `.gitignore` en choisissant, pour chaque catégorie, ce qui ne doit pas être versionné.',
    codeAvecTrous: `# Dépendances installées (elles se réinstallent)
___1___

# Résultat de compilation (il se reconstruit)
___2___

# Secrets et configuration locale
___3___
*.local`,
    choix: [
      'node_modules/ vendor/ packages/',
      'dist/ build/ bin/ obj/',
      '.env',
      'le fichier de verrouillage',
      'le code source',
      'la documentation',
    ],
    bonnesReponses: ['node_modules/ vendor/ packages/', 'dist/ build/ bin/ obj/', '.env'],
    explication:
      'Le critère est simple : tout ce qui se régénère, ou qui contient un secret, reste hors du dépôt. Attention au piège inverse — le fichier de verrouillage, lui, DOIT être versionné : il se régénère, mais pas à l’identique, et c’est justement ce qui garantit la reproductibilité.',
  },
  {
    id: 'env-011',
    theme: 'environnement',
    type: 'qcm',
    difficulte: 3,
    enonce: 'Une dépendance figée depuis deux ans dans un projet en production : quel est le risque principal ?',
    options: [
      'Elle accumule les failles connues et publiées, exploitables par n’importe qui (OWASP A06)',
      'Elle ralentit le temps de compilation',
      'Elle empêche de changer d’IDE',
      'Elle augmente la taille du dépôt Git',
    ],
    bonneReponse: 0,
    explication:
      'Une faille publiée dans un bulletin CVE devient une recette d’attaque publique. Le risque augmente avec le temps, sans qu’aucune ligne du code applicatif n’ait changé. La parade est la veille outillée : Dependabot, `npm audit` ou `dotnet list package --vulnerable` dans le pipeline.',
  },
  {
    id: 'env-012',
    theme: 'environnement',
    type: 'remettre_ordre',
    difficulte: 1,
    enonce: 'Remettez dans l’ordre les étapes de mise en route d’un projet récupéré sur un dépôt Git.',
    elements: [
      'Cloner le dépôt',
      'Installer les dépendances avec le fichier de verrouillage',
      'Copier le .env.example en .env et renseigner les valeurs locales',
      'Démarrer les services annexes (base de données) avec Docker Compose',
      'Appliquer les migrations de base de données',
      'Lancer l’application en mode développement',
    ],
    explication:
      'Cet enchaînement est ce que doit décrire le README. Les dépendances viennent avant la configuration, et la base doit tourner avant qu’on puisse appliquer les migrations. Si une étape manque dans la documentation, elle se paie à chaque arrivée d’une nouvelle personne sur le projet.',
  },
  {
    id: 'env-013',
    theme: 'environnement',
    type: 'qcm',
    difficulte: 2,
    enonce:
      'Pourquoi distinguer les dépendances de développement des dépendances de production ?',
    options: [
      'Seules les secondes partent en production : l’image livrée reste légère et sa surface d’attaque réduite',
      'Les premières sont payantes, les secondes gratuites',
      'Les premières s’installent plus vite',
      'La distinction est purement documentaire, sans effet réel',
    ],
    bonneReponse: 0,
    explication:
      'Outils de test, analyseurs de code et cadriciels de construction n’ont rien à faire sur le serveur : ils alourdissent l’image et ajoutent des vulnérabilités potentielles sans servir à l’exécution. C’est aussi la raison d’être de la construction en deux étapes dans un Dockerfile.',
  },
  {
    id: 'env-014',
    theme: 'environnement',
    type: 'qcm',
    difficulte: 2,
    enonce: 'Pourquoi faire tourner la base de données locale dans un conteneur plutôt que de l’installer sur sa machine ?',
    options: [
      'Toute l’équipe travaille sur la même version, et la base se recrée d’une commande',
      'Un conteneur consomme moins de mémoire qu’une installation classique',
      'Une base installée ne peut pas coexister avec une autre version',
      'Le conteneur chiffre automatiquement les données',
    ],
    bonneReponse: 0,
    explication:
      'La version du moteur devient une ligne dans un fichier versionné : plus de « chez moi ça passe » lié à un écart de version. Repartir d’une base vide devient une commande, et faire cohabiter deux projets sur deux versions différentes ne pose plus de problème.',
  },
  {
    id: 'env-015',
    theme: 'environnement',
    type: 'association',
    difficulte: 2,
    enonce: 'Associez chaque outil de qualité à ce qu’il contrôle.',
    paires: [
      { gauche: 'Analyseur statique (linter)', droite: 'Les erreurs probables et les écarts aux règles de code' },
      { gauche: 'Formateur automatique', droite: 'La mise en forme : indentation, guillemets, retours à la ligne' },
      { gauche: 'Vérificateur de types', droite: 'La cohérence des types avant même l’exécution' },
      { gauche: 'Analyse de sécurité du code', droite: 'Les motifs vulnérables : injections, secrets en dur' },
    ],
    explication:
      'Ces quatre outils se complètent et se branchent tous dans l’intégration continue. Le formateur évite les débats de style et les diffs pollués par des changements d’indentation ; l’analyseur, lui, attrape de vrais défauts.',
  },
  {
    id: 'env-016',
    theme: 'environnement',
    type: 'qcm',
    difficulte: 2,
    enonce:
      'Une bibliothèque publie une version majeure. Que t’indique ce seul numéro, avant même de lire les notes ?',
    options: [
      'Qu’elle contient au moins un changement incompatible : la mise à jour demande de vérifier le code appelant',
      'Qu’elle corrige une faille de sécurité',
      'Qu’elle est plus rapide que la précédente',
      'Qu’elle abandonne les versions antérieures du langage',
    ],
    bonneReponse: 0,
    explication:
      'C’est la convention du versionnement sémantique : majeure pour une rupture, mineure pour un ajout compatible, correctif pour une correction. Elle ne dit rien de la qualité ni des performances — seulement du risque de casse, ce qui est déjà l’information la plus utile.',
  },
  {
    id: 'env-017',
    theme: 'environnement',
    type: 'qcm',
    difficulte: 1,
    enonce: 'À quoi sert un client d’API comme Postman ou l’interface générée par la documentation ?',
    options: [
      'À appeler et tester les points d’entrée sans avoir besoin du front-end',
      'À générer automatiquement le code du serveur',
      'À remplacer les tests automatisés',
      'À surveiller l’API une fois en production',
    ],
    bonneReponse: 0,
    explication:
      'On développe l’API et l’interface rarement en même temps : pouvoir appeler un point d’entrée seul, avec un jeton et un corps choisis, permet de valider le contrat avant que le front n’existe. Cela ne remplace pas les tests automatisés — c’est un outil d’exploration, pas de non-régression.',
  },
  {
    id: 'env-018',
    theme: 'environnement',
    type: 'vrai_faux',
    difficulte: 2,
    enonce:
      'Un secret poussé par erreur puis supprimé par un commit suivant peut être considéré comme protégé.',
    bonneReponse: false,
    explication:
      'Il reste dans l’historique, accessible à quiconque a le dépôt — et les robots qui scrutent les dépôts publics le trouvent en quelques minutes. La seule réponse correcte est de révoquer le secret et d’en générer un nouveau ; nettoyer l’historique ne vient qu’après.',
  },
  {
    id: 'env-019',
    theme: 'environnement',
    type: 'qcm',
    difficulte: 2,
    enonce:
      'Comment garantir que toute l’équipe utilise la même version du moteur d’exécution du projet ?',
    options: [
      'La déclarer dans un fichier versionné du projet, lu par les outils et par l’intégration continue',
      'L’indiquer dans le README et faire confiance',
      'Demander à chacun d’installer la dernière version disponible',
      'Laisser chacun choisir : le code est compatible de toute façon',
    ],
    bonneReponse: 0,
    explication:
      'Chaque écosystème a son fichier de déclaration de version, lu par les gestionnaires de versions d’outils et par la CI. Un écart de version majeure entre une machine et le serveur produit des erreurs qui n’apparaissent qu’au déploiement — exactement ce qu’on cherche à éviter.',
  },
  {
    id: 'env-020',
    theme: 'environnement',
    type: 'remettre_ordre',
    difficulte: 2,
    enonce: 'Remettez dans l’ordre la réaction à un signalement de vulnérabilité sur une dépendance.',
    elements: [
      'Le scan de dépendances signale la faille et sa gravité',
      'Vérifier si le projet utilise réellement la partie vulnérable',
      'Regarder la version corrigée proposée et son écart avec la version en place',
      'Mettre à jour et lancer la suite de tests',
      'Livrer le correctif, en priorisant selon la gravité',
    ],
    explication:
      'L’étape la plus souvent sautée est la deuxième : toutes les failles signalées ne sont pas atteignables depuis le code du projet, et une gravité élevée sur une fonction jamais appelée ne justifie pas une livraison en urgence. Inversement, une faille exploitable à distance sur un composant exposé se traite le jour même.',
  },
];
