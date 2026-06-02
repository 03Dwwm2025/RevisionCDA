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

```csharp
[Fact]
public void Deposer_RefuseSiDatesIncoherentes()
{
    // Arrange
    var service = new ServiceConges(new FakeDemandeRepository());

    // Act
    var resultat = service.Deposer(1,
        debut: new DateOnly(2026, 7, 10),
        fin:   new DateOnly(2026, 7, 1)); // fin avant début

    // Assert
    Assert.False(resultat.Succes);
    Assert.Equal("Dates incohérentes.", resultat.Message);
}
```

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

### 13.7 SAST, DAST et la sécurité dans les tests

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
