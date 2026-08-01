import type { Question } from '../../types/quiz';

export const questionsTests: Question[] = [
  {
    id: 'tests-001',
    theme: 'tests',
    type: 'association',
    difficulte: 1,
    enonce: 'Associez chaque niveau de la pyramide de tests à sa description.',
    paires: [
      { gauche: 'Tests unitaires', droite: 'Testent une méthode/classe isolée — rapides, nombreux, base de la pyramide' },
      { gauche: 'Tests d\'intégration', droite: 'Testent plusieurs composants ensemble (ex. service + BDD)' },
      { gauche: 'Tests End-to-End (E2E)', droite: 'Testent l\'application complète comme un utilisateur — lents, peu nombreux' },
      { gauche: 'Tests de performance', droite: 'Mesurent le comportement sous charge (temps de réponse, débit)' },
    ],
    explication:
      'Pyramide : beaucoup de tests unitaires (rapides, isolés, peu coûteux), moins d\'intégration, encore moins d\'E2E. Inverser la pyramide (trop d\'E2E) ralentit la CI et rend le feedback peu précis quand un test échoue.',
  },
  {
    id: 'tests-002',
    theme: 'tests',
    type: 'remettre_ordre',
    difficulte: 1,
    enonce: 'Remettez dans l\'ordre le cycle **TDD** (Test-Driven Development).',
    elements: [
      'Écrire un test qui décrit le comportement attendu (le test échoue — Red)',
      'Écrire le minimum de code pour faire passer le test (Green)',
      'Refactorer le code pour l\'améliorer sans casser les tests (Refactor)',
    ],
    explication:
      'Red → Green → Refactor. L\'intérêt : le test écrit en premier sert de spécification exécutable. Le refactoring est sécurisé car les tests vérifient qu\'on n\'a rien cassé. TDD favorise SRP (on ne code que ce qui est nécessaire pour le test).',
  },
  {
    id: 'tests-003',
    theme: 'tests',
    type: 'completer_code',
    difficulte: 2,
    enonce: 'Complétez ce test unitaire écrit selon le patron AAA.',
    codeAvecTrous: `test "refuse une demande dont la date de fin precede la date de debut" :

    # ___1___ : préparer le contexte et les doublures
    service = nouveau ServiceConges(nouveau DepotFactice())

    # ___2___ : exécuter l'action à tester, une seule fois
    resultat = service.deposer(idSalarie = 1,
                               debut = "2026-07-10",
                               fin   = "2026-07-01")

    # ___3___ : vérifier le résultat attendu
    verifier(resultat.succes == faux)`,
    choix: ['Arrange', 'Act', 'Assert', 'Setup', 'Run', 'Check'],
    bonnesReponses: ['Arrange', 'Act', 'Assert'],
    explication:
      'Arrange prépare, Act exécute une seule action, Assert vérifie. Ce découpage se retrouve dans tous les cadriciels de test, sous des noms voisins — given/when/then côté comportement. Le dépôt factice remplace la base de données : le test reste rapide et ne dépend d’aucune infrastructure.',
  },
  {
    id: 'tests-004',
    theme: 'tests',
    type: 'vrai_faux',
    difficulte: 1,
    enonce: 'Un taux de couverture de code de 100 % garantit que l\'application est exempte de bugs.',
    bonneReponse: false,
    explication:
      'La couverture mesure quelles lignes ont été **exécutées** pendant les tests, pas si les comportements sont **correctement vérifiés**. On peut atteindre 100 % avec des assertions vides. Un test sans assertion passe toujours. La qualité des tests (bons assert, cas limites) compte plus que le ratio.',
  },
  {
    id: 'tests-005',
    theme: 'tests',
    type: 'qcm',
    difficulte: 2,
    enonce: 'Qu\'est-ce qu\'un **test double** (mock, stub, fake) ?',
    options: [
      'Un test qui s\'exécute deux fois pour vérifier l\'idempotence',
      'Un objet qui remplace une dépendance réelle (BDD, e-mail, API externe) dans un test unitaire',
      'Un test de performance qui simule deux utilisateurs simultanés',
      'Une copie d\'un test unitaire pour tester les cas limites',
    ],
    bonneReponse: 1,
    explication:
      'Les doubles de test (stub, mock, fake, spy) remplacent les dépendances difficiles à utiliser en test (base de données, envoi d\'e-mail, horloge système). Ils permettent d\'isoler le code sous test et de contrôler les entrées/sorties. En .NET : Moq, NSubstitute, ou classes Fake manuelles.',
  },
  {
    id: 'tests-006',
    theme: 'tests',
    type: 'qcm',
    difficulte: 2,
    enonce: 'Quelle est la différence entre **SAST** et **DAST** ?',
    options: [
      'SAST analyse le code source statiquement (sans l\'exécuter) ; DAST teste l\'application en cours d\'exécution',
      'DAST analyse le code source ; SAST teste l\'application déployée',
      'SAST est pour les tests unitaires ; DAST est pour les tests E2E',
      'Les deux sont équivalents, ce sont des acronymes différents pour la même chose',
    ],
    bonneReponse: 0,
    explication:
      'SAST (Static Application Security Testing) : analyse le code source à la recherche de failles (injection, secrets exposés…) sans l\'exécuter — intégrable très tôt dans la CI. DAST (Dynamic) : attaque l\'application déployée pour trouver des vulnérabilités runtime (type scanner comme OWASP ZAP).',
  },
  {
    id: 'tests-007',
    theme: 'tests',
    type: 'vrai_faux',
    difficulte: 2,
    enonce: 'Les tests d\'intégration peuvent utiliser une vraie base de données (ex. SQLite en mémoire) plutôt qu\'un mock pour tester les requêtes SQL.',
    bonneReponse: true,
    explication:
      'Les tests d\'intégration visent précisément à vérifier que les composants fonctionnent ensemble — y compris la couche SQL. Une BDD in-memory (SQLite, SQL Server LocalDB) ou un conteneur Docker de test (Testcontainers) permet de tester les requêtes réelles sans dépendre d\'une BDD de prod.',
  },
  {
    id: 'tests-008',
    theme: 'tests',
    type: 'qcm',
    difficulte: 3,
    enonce: 'Pourquoi favorise-t-on des tests **rapides et isolés** dans la CI plutôt que des tests E2E lents ?',
    options: [
      'Les tests E2E sont trop difficiles à écrire pour être utilisés en CI',
      'Un test lent retarde le feedback ; un test non isolé peut être flaky (résultats aléatoires) et éroder la confiance dans la CI',
      'Les tests E2E ne peuvent pas détecter de régressions contrairement aux tests unitaires',
      'La CI ne supporte pas l\'exécution de tests E2E par manque de ressources',
    ],
    bonneReponse: 1,
    explication:
      'Un pipeline CI qui prend 20 minutes ralentit tous les développeurs. Les tests flaky (qui échouent sans raison) amènent l\'équipe à les ignorer, ce qui dégrade toute la CI. La pyramide vise un feedback rapide : tests unitaires en secondes, intégration en minutes, E2E sur l\'environnement de staging après merge.',
  },
  // --- Plan de tests et recette ---
  {
    id: 'tests-009',
    theme: 'tests',
    type: 'association',
    difficulte: 2,
    enonce: 'Associez chaque document de test à son contenu.',
    paires: [
      { gauche: 'Plan de tests', droite: 'La stratégie : quoi tester, à quels niveaux, avec quels critères d’arrêt' },
      { gauche: 'Cahier de recettes', droite: 'Les scénarios fonctionnels à dérouler avec le client' },
      { gauche: 'Jeu d’essai', droite: 'Le lot de données préparé pour exécuter les tests' },
      { gauche: 'Procès-verbal de recette', droite: 'Le compte rendu signé de la campagne de validation' },
    ],
    explication:
      'Ces quatre documents sont le livrable attendu par la compétence « préparer et exécuter les plans de tests ». Le plan décrit la stratégie, le cahier de recettes décrit les scénarios, le jeu d’essai fournit les données, le procès-verbal acte le résultat.',
  },
  {
    id: 'tests-010',
    theme: 'tests',
    type: 'association',
    difficulte: 2,
    enonce: 'Associez chaque catégorie de jeu d’essai à un exemple, pour une demande de congé.',
    paires: [
      { gauche: 'Cas nominal', droite: 'Demande de 5 jours avec un solde de 25' },
      { gauche: 'Cas limite', droite: 'Demande de 25 jours avec un solde de exactement 25' },
      { gauche: 'Cas d’erreur', droite: 'Date de fin antérieure à la date de début' },
      { gauche: 'Donnée hostile', droite: 'Une balise script saisie dans le champ motif' },
    ],
    explication:
      'L’erreur courante est de ne préparer que le cas nominal. Les bugs se logent aux limites (la valeur exacte, zéro, la valeur maximale) et dans les cas d’erreur. Les données hostiles vérifient que la validation résiste aux entrées malveillantes.',
  },
  {
    id: 'tests-011',
    theme: 'tests',
    type: 'qcm',
    difficulte: 2,
    enonce: 'Qu’est-ce qu’un test de non-régression ?',
    options: [
      'Le rejeu des tests déjà passés, pour vérifier qu’une nouvelle version n’a rien cassé',
      'Un test qui vérifie que les performances ne se dégradent pas',
      'Un test exécuté uniquement avant la mise en production',
      'Un test écrit par le client pendant la recette',
    ],
    bonneReponse: 0,
    explication:
      'C’est exactement ce que fait la CI à chaque commit : elle rejoue toute la suite de tests. Automatiser la non-régression est ce qui rend un rythme de livraison élevé tenable — sans elle, chaque modification exige une vérification manuelle intégrale.',
  },
  {
    id: 'tests-012',
    theme: 'tests',
    type: 'qcm',
    difficulte: 2,
    enonce: 'Que devient un critère d’acceptation rédigé en Given/When/Then lors de la phase de test ?',
    options: [
      'Un cas de test : le contexte devient le prérequis, l’action les étapes, le résultat attendu la vérification',
      'Une user story supplémentaire dans le backlog',
      'Une contrainte à ajouter en base de données',
      'Rien : les critères d’acceptation ne servent qu’à l’analyse',
    ],
    bonneReponse: 0,
    explication:
      'C’est le même document vu à deux moments du projet. Écrire des critères d’acceptation précis à l’analyse fait gagner du temps à la recette, et permet d’automatiser directement les scénarios en tests.',
  },
  {
    id: 'tests-013',
    theme: 'tests',
    type: 'remettre_ordre',
    difficulte: 2,
    enonce: 'Remettez dans l’ordre les champs d’un cas de test formalisé.',
    elements: [
      'Identifiant du cas de test',
      'Objectif',
      'Prérequis',
      'Étapes numérotées',
      'Résultat attendu',
      'Résultat obtenu',
      'Verdict conforme ou non conforme',
    ],
    explication:
      'Cette trame rend le test reproductible par un tiers : un cas de test qui ne précise pas ses prérequis ou dont les étapes sont floues donne des résultats différents selon la personne qui l’exécute.',
  },
  {
    id: 'tests-014',
    theme: 'tests',
    type: 'association',
    difficulte: 2,
    enonce: 'Associez chaque test non fonctionnel à ce qu’il vérifie.',
    paires: [
      { gauche: 'Test de charge', droite: 'Le comportement au volume d’utilisateurs attendu' },
      { gauche: 'Test de stress', droite: 'Le point de rupture, et la manière dont le système casse' },
      { gauche: 'Test d’accessibilité', droite: 'La conformité aux critères RGAA et WCAG' },
      { gauche: 'Test de compatibilité', droite: 'Le rendu sur les navigateurs et tailles d’écran ciblés' },
    ],
    explication:
      'Les besoins non-fonctionnels définis à l’analyse (performance, disponibilité, accessibilité) se vérifient eux aussi. Un test de charge chiffré est un argument concret dans un dossier de projet, bien plus qu’une affirmation de principe.',
  },
  {
    id: 'tests-015',
    theme: 'tests',
    type: 'qcm',
    difficulte: 2,
    enonce: 'Quels outils permettent d’automatiser un test de bout en bout dans un navigateur ?',
    options: [
      'Playwright, Cypress ou Selenium',
      'JMeter, k6 ou Gatling',
      'Moq, NSubstitute ou FakeItEasy',
      'SonarQube, CodeQL ou Semgrep',
    ],
    bonneReponse: 0,
    explication:
      'Playwright, Cypress et Selenium pilotent un vrai navigateur et rejouent un parcours utilisateur complet. JMeter et k6 servent aux tests de charge, Moq aux doublures unitaires, SonarQube et CodeQL à l’analyse statique de sécurité.',
  },
  {
    id: 'tests-016',
    theme: 'tests',
    type: 'vrai_faux',
    difficulte: 2,
    enonce: 'On peut se contenter de tests de bout en bout puisqu’ils couvrent l’application entière.',
    bonneReponse: false,
    explication:
      'C’est la pyramide inversée : les tests E2E sont lents, fragiles, et quand l’un échoue il faut chercher d’où vient le problème. On en garde peu, sur les parcours vitaux, et on met la masse des vérifications au niveau unitaire, où elles sont rapides et précises.',
  },
  {
    id: 'tests-017',
    theme: 'tests',
    type: 'qcm',
    difficulte: 3,
    enonce: 'Une anomalie est corrigée en production. Quel réflexe complète la correction ?',
    options: [
      'Écrire un test qui reproduit le bug, vérifier qu’il échoue, puis appliquer le correctif',
      'Ajouter un commentaire dans le code pour signaler le problème',
      'Augmenter la couverture de code globale de 5 %',
      'Redéployer immédiatement sans autre vérification',
    ],
    bonneReponse: 0,
    explication:
      'Un test qui reproduit le bug avant correction prouve deux choses : que le bug est compris, et que le correctif fonctionne. Il rejoint ensuite la suite de non-régression et garantit que le problème ne reviendra pas silencieusement.',
  },
  {
    id: 'tests-018',
    theme: 'tests',
    type: 'qcm',
    difficulte: 1,
    enonce: 'Qu’est-ce que la VABF dans le vocabulaire de la recette ?',
    options: [
      'La vérification d’aptitude au bon fonctionnement : la campagne de validation menée avec le client',
      'Une méthode de test unitaire automatisé',
      'Un outil d’analyse de vulnérabilités',
      'Le procès-verbal de mise en production',
    ],
    bonneReponse: 0,
    explication:
      'C’est la phase où le client déroule le cahier de recettes sur l’environnement de préproduction et prononce l’acceptation, éventuellement avec réserves. Elle précède la mise en production et se conclut par un procès-verbal.',
  },
];
