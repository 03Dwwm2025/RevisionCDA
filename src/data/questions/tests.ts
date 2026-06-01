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
    enonce: 'Complétez ce test unitaire xUnit (.NET) qui suit le pattern **AAA**.',
    codeAvecTrous: `[___1___]
public void Deposer_RefuseSiDatesIncoherentes()
{
    // ___2___ : préparer le contexte
    var service = new ServiceConges(new FakeRepository());

    // Act : exécuter l\'action à tester
    var resultat = service.Deposer(
        idSalarie: 1,
        debut: new DateOnly(2026, 7, 10),
        fin:   new DateOnly(2026, 7, 1)   // fin < début
    );

    // ___3___ : vérifier le résultat
    Assert.False(resultat.Succes);
}`,
    choix: ['Fact', 'Theory', 'Test', 'Arrange', 'Setup', 'Prepare', 'Assert', 'Verify', 'Check'],
    bonnesReponses: ['Fact', 'Arrange', 'Assert'],
    explication:
      '`[Fact]` marque un test sans paramètre dans xUnit (`[Theory]` pour les tests paramétrés). AAA = Arrange (préparer les données et dépendances), Act (appeler le code sous test), Assert (vérifier le résultat). `FakeRepository` est un test double qui remplace la vraie BDD.',
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
];
