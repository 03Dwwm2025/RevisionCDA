## 13. Les tests

Tester, c'est vérifier que le logiciel fait ce qu'on attend — et continue de le faire après chaque modification. Les tests automatisés sont le **filet de sécurité** du développeur : ils permettent de refactorer, d'ajouter des fonctionnalités et de corriger des bugs sans craindre d'introduire des régressions ailleurs.

Un projet sans tests force chaque modification à être vérifiée manuellement, intégralement, à chaque fois. Avec des tests, on déroule un clic et on sait en quelques secondes si on a cassé quelque chose.

---

### 13.1 La pyramide de tests

On organise les tests en trois niveaux, en forme de pyramide : beaucoup de tests rapides à la base, peu de tests lents au sommet.

```
        ▲
       /E2E\        ← Peu nombreux, lents, coûteux
      /──────\
     /Intégra-\     ← Nombre modéré
    /──────────\
   / Unitaires  \   ← Beaucoup, rapides, base de la pyramide
  ──────────────────
```

| Niveau | Portée | Vitesse | Quantité | Exemple |
| --- | --- | --- | --- | --- |
| **Unitaires** | Une méthode/classe isolée | Millisecondes | Beaucoup | Tester que `ServiceConges.Deposer()` refuse si les dates sont incohérentes |
| **Intégration** | Plusieurs composants ensemble | Secondes | Modéré | Tester que le Repository insère bien en base et que le Service le lit |
| **End-to-End (E2E)** | L'application complète, comme un vrai utilisateur | Minutes | Peu | Simuler un utilisateur qui se connecte, dépose une demande et voit la confirmation |

**Pourquoi cette forme de pyramide ?**

Les tests unitaires sont rapides à écrire, rapides à exécuter et très précis : quand l'un échoue, on sait exactement quelle méthode est en cause. Les tests E2E, eux, sont lents, fragiles (ils dépendent de l'interface, du réseau, de la BDD…) et quand ils échouent, il faut chercher d'où vient le problème.

**Inverser la pyramide** — avoir trop d'E2E et peu d'unitaires — ralentit la CI, génère des tests *flaky* (qui échouent aléatoirement) et fait perdre confiance à l'équipe.

---

### 13.2 Les tests unitaires

Un test unitaire vérifie **une seule unité de logique** en isolation complète. Il ne touche ni à la base de données, ni au réseau, ni au système de fichiers. Si le test échoue, c'est forcément à cause du code qu'il teste.

**Caractéristiques d'un bon test unitaire :**

| Critère | Explication |
| --- | --- |
| **Rapide** | S'exécute en millisecondes — on peut en lancer des centaines à la seconde |
| **Isolé** | Ne dépend d'aucun autre test — l'ordre d'exécution ne doit pas avoir d'importance |
| **Reproductible** | Donne toujours le même résultat, quelle que soit la machine ou le moment |
| **Précis** | Un test vérifie un seul comportement — si deux assertions échouent, on ne sait plus lequel est le vrai problème |
| **Auto-documenté** | Le nom du test décrit ce qu'il vérifie : `Deposer_RefuseSiDatesIncoherentes` |

**Le pattern AAA — Arrange, Act, Assert :**

Tout test unitaire se structure en trois étapes :
- **Arrange** : préparer l'environnement de test (instancier les objets, configurer les dépendances)
- **Act** : exécuter l'action à tester (appeler la méthode)
- **Assert** : vérifier que le résultat est celui attendu

```javascript
test('refuse une demande dont la date de fin précède la date de début', () => {
  // Arrange — préparer l'objet testé et ses doublures
  const service = new ServiceConges(new DepotDemandeFactice());

  // Act — une seule action, celle qu'on teste
  const resultat = service.deposer(1, '2026-07-10', '2026-07-01');

  // Assert — vérifier le résultat attendu
  expect(resultat.succes).toBe(false);
  expect(resultat.message).toBe('Dates incohérentes.');
});
```

Le nom du test est une phrase qui décrit le comportement attendu : quand il échoue dans la CI, on comprend le problème sans ouvrir le code. La syntaxe change selon l'outil — `test`/`expect` en JavaScript, attributs et assertions en C# ou en Java, `assert` en Python — la structure Arrange/Act/Assert, elle, ne change pas.

---

### 13.3 Les tests doubles (stubs, mocks, fakes)

Pour isoler le code sous test, on remplace les dépendances réelles (base de données, envoi d'e-mail, appels API externes…) par des **doublures de test**. Ces objets simulent le comportement de la vraie dépendance, sans ses effets de bord.

| Type | Comportement | Quand l'utiliser |
| --- | --- | --- |
| **Stub** | Renvoie une valeur préconfigurée | Quand on a besoin d'une dépendance qui retourne une donnée, sans vérifier comment elle est appelée |
| **Mock** | Vérifie que certaines méthodes ont bien été appelées (avec les bons arguments) | Quand on veut s'assurer qu'une action a bien été déclenchée (ex. un e-mail a bien été envoyé) |
| **Fake** | Implémentation simplifiée mais fonctionnelle (ex. BDD en mémoire) | Quand on a besoin d'un comportement proche du réel, mais sans la vraie infrastructure |

**Pourquoi les tests doubles sont possibles grâce à DIP ?**

Si `ServiceConges` reçoit une interface `IDemandeRepository` dans son constructeur (et non une classe concrète), on peut lui passer un `FakeDemandeRepository` en test. Le Service ne sait pas qu'il parle à un faux — il fait confiance au contrat de l'interface. C'est l'un des bénéfices concrets du principe de Dependency Inversion vu dans le chapitre SOLID.

---

### 13.4 Le TDD — Test-Driven Development

Le TDD est une méthode de développement qui **inverse l'ordre habituel** : on écrit le test avant d'écrire le code qu'il va tester.

**Cycle Red → Green → Refactor :**

```
RED      → Écrire un test qui décrit le comportement voulu.
           Il échoue immédiatement (le code n'existe pas encore).

GREEN    → Écrire le minimum de code pour faire passer le test.
           Pas plus, pas mieux — juste ce qu'il faut.

REFACTOR → Améliorer la qualité du code (lisibilité, duplication, nommage)
           sans modifier son comportement. Les tests prouvent qu'on n'a rien cassé.
```

**Pourquoi travailler ainsi ?**

- Le test devient une **spécification exécutable** : avant de coder, on formalise exactement ce que la méthode doit faire.
- Le refactoring est **sécurisé** : on peut restructurer librement, les tests confirment que le comportement est préservé.
- On ne code que ce qui est nécessaire (**YAGNI**) : pas de fonctionnalité "au cas où", le test guide exactement ce qu'il faut implémenter.
- Le code TDD tend naturellement à être plus modulaire et testable, car écrire un test difficile est souvent le signe d'un couplage trop fort.

---

### 13.5 Les tests d'intégration

Là où les tests unitaires testent une brique isolée, les **tests d'intégration** vérifient que plusieurs briques fonctionnent **correctement ensemble**. Ils peuvent inclure une vraie base de données (en mémoire ou dans un conteneur Docker), des appels entre couches, etc.

**Ce qu'ils permettent de vérifier :**
- Que le SQL généré est correct et retourne bien les données attendues
- Que les relations entre tables fonctionnent (jointures, contraintes)
- Que le Service et le Repository interagissent comme prévu

**Ce qu'ils ne remplacent pas :**
Les tests d'intégration sont plus lents et plus complexes à maintenir que les unitaires. Ils ne doivent pas devenir la règle — on les réserve aux zones où l'intégration entre composants est critique (la couche d'accès aux données, notamment).

---

### 13.6 La couverture de code

La **couverture de code** (*code coverage*) mesure le pourcentage de lignes de code qui ont été **exécutées** au moins une fois pendant les tests. C'est un indicateur utile, mais à ne pas sur-interpréter.

**Ce que la couverture dit :** telle ligne a été exécutée pendant un test.

**Ce qu'elle ne dit pas :** si le résultat a été correctement vérifié. Un test sans assertion peut couvrir 100 % du code et ne détecter aucun bug.

Viser 100 % de couverture n'est donc pas un objectif en soi. Ce qui compte, c'est la **qualité des assertions** : est-ce que les cas limites sont testés ? Les cas d'erreur ? Les règles métier les plus critiques ?

---

### 13.7 Le plan de tests, le cahier de recettes et les jeux d'essai

Les tests automatisés ne couvrent qu'une partie du travail attendu. Le référentiel parle de **préparer et exécuter les plans de tests** : c'est un livrable documentaire, avec son vocabulaire.

| Document | Ce qu'il contient | Qui l'utilise |
| --- | --- | --- |
| **Plan de tests** | La stratégie : quoi tester, à quels niveaux, avec quels outils, dans quels environnements, avec quels critères d'arrêt | L'équipe de développement |
| **Cahier de recettes** | La liste des scénarios fonctionnels à dérouler, avec pour chacun les étapes, la donnée d'entrée et le résultat attendu | Le client, lors de la recette |
| **Jeu d'essai** | Le lot de données préparé pour exécuter les tests : cas normaux, cas limites, cas d'erreur | Celui qui exécute les tests |
| **Procès-verbal de recette** | Le compte rendu signé : ce qui est passé, ce qui a échoué, ce qui est accepté avec réserve | Le client et le prestataire |

**La trame d'un cas de test :**

| Champ | Exemple |
| --- | --- |
| Identifiant | TC-012 |
| Objectif | Refuser une demande dépassant le solde |
| Prérequis | Salarié « Dumont » connecté, solde = 3 jours |
| Étapes | 1. Ouvrir « Nouvelle demande » — 2. Saisir du 01/07 au 10/07 — 3. Valider |
| Résultat attendu | Message « Solde insuffisant (3 jours disponibles) », aucune demande créée |
| Résultat obtenu | *(rempli à l'exécution)* |
| Verdict | Conforme / Non conforme |

**Le jeu d'essai — l'erreur courante est de ne couvrir que le cas nominal :**

| Catégorie | Exemple pour une demande de congé |
| --- | --- |
| Cas nominal | Demande de 5 jours, solde de 25 |
| Cas limite | Demande de exactement 25 jours avec un solde de 25 ; demande d'un seul jour |
| Cas d'erreur | Date de fin avant la date de début ; solde insuffisant ; chevauchement |
| Cas interdit | Un salarié tente de valider sa propre demande |
| Donnée hostile | `' OR '1'='1` dans le motif ; `<script>` dans le nom |

Les **critères d'acceptation** rédigés en Given/When/Then à l'analyse des besoins deviennent directement des cas de test : c'est le même document, vu à deux moments du projet.

**Le vocabulaire de la recette :**

- **Tests fonctionnels** : on vérifie que l'application fait ce qui est écrit dans le cahier des charges. Boîte noire — on ne regarde pas le code.
- **Tests de non-régression** : on rejoue les tests déjà passés pour vérifier qu'une nouvelle version n'a rien cassé. C'est exactement ce que fait la CI à chaque commit — automatiser ces tests est ce qui rend le rythme de livraison tenable.
- **Recette (ou VABF, vérification d'aptitude au bon fonctionnement)** : la campagne de validation menée avec le client avant la mise en production.
- **Tests de bout en bout (E2E)** : le pilotage automatisé d'un vrai navigateur, qui rejoue le parcours utilisateur complet.

```javascript
// Playwright — un test de bout en bout
test('un salarié dépose une demande et la voit apparaître', async ({ page }) => {
  await page.goto('https://congeapp.local/connexion');
  await page.fill('#email', 'a.dumont@ent.fr');
  await page.fill('#motDePasse', 'MotDePasse1');
  await page.click('button[type=submit]');

  await page.click('text=Nouvelle demande');
  await page.fill('#dateDebut', '2026-07-01');
  await page.fill('#dateFin', '2026-07-15');
  await page.click('text=Envoyer');

  await expect(page.locator('.liste-demandes')).toContainText('En attente');
});
```

Outils courants : **Playwright**, **Cypress**, **Selenium**. Ils sont lents et fragiles — on en garde peu, sur les parcours vitaux uniquement (se connecter, déposer, valider).

---

### 13.8 Les tests non fonctionnels

Les besoins non-fonctionnels définis à l'analyse se vérifient eux aussi.

| Type de test | Ce qu'il vérifie | Outil |
| --- | --- | --- |
| **Charge** | Le comportement au volume attendu (100 utilisateurs simultanés) | k6, JMeter, Gatling |
| **Stress** | Le point de rupture — jusqu'où ça tient, et comment ça casse | k6, JMeter |
| **Performance** | Les temps de réponse par rapport à l'objectif (p95 < 500 ms) | k6, Lighthouse |
| **Accessibilité** | La conformité RGAA/WCAG | axe, Lighthouse, Wave |
| **Compatibilité** | Le rendu sur les navigateurs et tailles d'écran ciblés | BrowserStack, outils du navigateur |
| **Sécurité** | Les failles connues | OWASP ZAP, SAST/DAST (section suivante) |

Un test de charge qui montre que l'application tient 100 utilisateurs simultanés est un argument concret dans un dossier de projet — bien plus qu'une affirmation de principe.

---

### 13.9 SAST, DAST et la sécurité dans les tests

Les tests fonctionnels ne suffisent pas à garantir la sécurité. Deux types d'outils complètent le dispositif :

| Outil | Type | Ce qu'il analyse | Quand |
| --- | --- | --- | --- |
| **SAST** (*Static Application Security Testing*) | Analyse statique | Le code source, sans l'exécuter — détecte les injections, secrets exposés, mauvaises pratiques | À chaque push (CI) |
| **DAST** (*Dynamic Application Security Testing*) | Analyse dynamique | L'application en cours d'exécution — teste les réponses HTTP, les failles runtime | Sur l'environnement de staging |
| `npm audit` / Dependabot | Dépendances | CVE dans les librairies utilisées | À chaque push (CI) |

**Intégrer des tests de sécurité** dans la suite de tests :
- Vérifier qu'un utilisateur ne peut pas accéder aux données d'un autre (Broken Access Control — OWASP A01)
- Vérifier que les entrées malveillantes sont rejetées
- Vérifier que les rôles sont respectés (un salarié ne peut pas valider)

> **🔒 Sécurité**
>
> Un test qui passe ne prouve pas l'absence de faille — il prouve que le comportement **testé** est correct. La sécurité demande des tests dédiés aux cas limites, aux accès non autorisés et aux entrées malveillantes, en plus des tests fonctionnels classiques.
