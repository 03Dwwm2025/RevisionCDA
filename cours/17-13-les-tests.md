## 13. Les tests

Tester, c'est vérifier que le logiciel fait ce qu'on attend — et continue de le faire après chaque modification. Les tests automatisés sont le filet de sécurité qui permet de refactorer et d'évoluer sans régression.

### 13.1 La pyramide de tests

```
        ▲
       /E2E\        ← Peu nombreux, lents, coûteux
      /──────\
     /Intégra-\     ← Nombre modéré, testent plusieurs composants
    /──────────\
   / Unitaires  \   ← Beaucoup, rapides, isolés, base de la pyramide
  ──────────────────
```

| Niveau | Portée | Vitesse | Quantité |
| --- | --- | --- | --- |
| **Unitaires** | Une méthode/classe isolée | Millisecondes | Beaucoup |
| **Intégration** | Plusieurs composants (service + BDD) | Secondes | Modéré |
| **End-to-End (E2E)** | L'application complète, comme un utilisateur | Minutes | Peu |

**Inverser la pyramide** (trop d'E2E, peu d'unitaires) est une erreur fréquente : la CI devient lente, les tests échouent de façon aléatoire (*flaky*), et on perd confiance.

---

### 13.2 Les tests unitaires et le pattern AAA

Un test unitaire vérifie **une seule unité de logique** en isolation. Sa structure suit le pattern **AAA** :

```
Arrange → Act → Assert
```

```csharp
// Test unitaire avec xUnit (.NET)
[Fact]
public void Deposer_RefuseSiDatesIncoherentes()
{
    // Arrange : préparer le contexte
    var repo    = new FakeDemandeRepository();
    var service = new ServiceConges(repo);

    // Act : exécuter l'action à tester
    var resultat = service.Deposer(
        idSalarie: 1,
        debut: new DateOnly(2026, 7, 10),
        fin:   new DateOnly(2026, 7, 1)  // fin < début
    );

    // Assert : vérifier le résultat
    Assert.False(resultat.Succes);
    Assert.Equal("Dates incohérentes.", resultat.Message);
}
```

Caractéristiques d'un **bon test unitaire** :
- **Rapide** : pas de BDD, pas d'I/O réseau
- **Isolé** : ne dépend pas d'autres tests
- **Reproductible** : même résultat à chaque exécution
- **Précis** : un test = un comportement vérifié

---

### 13.3 Les tests doubles (mocks, stubs, fakes)

Pour isoler le code sous test, on remplace les dépendances réelles (BDD, e-mail, horloge…) par des **doubles de test** :

| Type | Rôle |
| --- | --- |
| **Stub** | Retourne des valeurs préconfigurées, pas de vérification |
| **Mock** | Vérifie que certaines méthodes ont été appelées |
| **Fake** | Implémentation simplifiée fonctionnelle (ex. BDD en mémoire) |

```csharp
// Fake : implémentation en mémoire pour les tests
public class FakeDemandeRepository : IDemandeRepository
{
    private readonly List<Demande> _demandes = new();

    public void Inserer(Demande d) => _demandes.Add(d);

    public List<Demande> GetParSalarie(int id)
        => _demandes.Where(d => d.IdSalarie == id).ToList();
}
```

```csharp
// Mock avec Moq (librairie .NET)
var mockRepo = new Mock<IDemandeRepository>();
mockRepo.Setup(r => r.GetParSalarie(1)).Returns(new List<Demande>());

var service = new ServiceConges(mockRepo.Object);
// ... appel et assertions ...
mockRepo.Verify(r => r.Inserer(It.IsAny<Demande>()), Times.Once);
```

> **💡 Pourquoi DIP rend les tests possibles ?** Si `ServiceConges` dépend de `IDemandeRepository` (interface), on peut injecter un `FakeDemandeRepository` en test. Sans DIP, impossible de tester sans vraie BDD.

---

### 13.4 Le TDD (Test-Driven Development)

Le TDD inverse l'ordre classique : **on écrit le test en premier**, puis le code.

**Cycle Red → Green → Refactor :**

```
1. RED    : écrire un test qui décrit le comportement souhaité → il échoue (normal)
2. GREEN  : écrire le minimum de code pour faire passer le test
3. REFACTOR : améliorer le code sans casser le test
```

```csharp
// 1. RED — le test échoue car la méthode n'existe pas encore
[Fact]
public void CalculerDuree_RetourneNombreDeJours()
{
    var d = new Demande { DateDebut = new DateOnly(2026,7,1), DateFin = new DateOnly(2026,7,5) };
    Assert.Equal(5, d.CalculerDuree()); // 5 jours inclus
}

// 2. GREEN — implémenter juste ce qu'il faut
public int CalculerDuree() => (DateFin.DayNumber - DateDebut.DayNumber) + 1;

// 3. REFACTOR — renommer, extraire, simplifier si besoin
```

Avantages du TDD : le test est une **spécification exécutable**, le refactoring est sécurisé, et on ne code que ce qui est nécessaire (YAGNI).

---

### 13.5 Les tests d'intégration

Les tests d'intégration vérifient que plusieurs composants fonctionnent **ensemble** — y compris la couche SQL.

```csharp
public class DemandeRepositoryTests : IDisposable
{
    private readonly SqliteConnection _conn;
    private readonly DemandeRepository _repo;

    public DemandeRepositoryTests()
    {
        // BDD SQLite en mémoire — rapide, pas de dépendance externe
        _conn = new SqliteConnection("Data Source=:memory:");
        _conn.Open();
        // ... créer les tables ...
        _repo = new DemandeRepository(_conn.ConnectionString);
    }

    [Fact]
    public void Inserer_PuisGetParSalarie_RetourneLaDemande()
    {
        _repo.Inserer(new Demande { IdSalarie = 1, DateDebut = ..., DateFin = ... });
        var result = _repo.GetParSalarie(1);
        Assert.Single(result);
    }

    public void Dispose() => _conn.Dispose();
}
```

---

### 13.6 La couverture de code et la sécurité

**Couverture de code** : mesure le pourcentage de lignes exécutées pendant les tests. Utile, mais **100 % de couverture ne garantit pas l'absence de bugs** — on peut couvrir une ligne sans l'asserter correctement.

**Tester la sécurité :**

```csharp
[Fact]
public void Deposer_RefuseSiSalarieNEstPasProprietaire()
{
    // Un salarié ne doit pas pouvoir modifier la demande d'un autre
    var resultat = service.Valider(idDemande: 42, utilisateurConnecte: 99);
    Assert.Equal(ResultatType.Interdit, resultat.Type); // 403
}
```

**SAST et DAST dans la CI :**

| Outil | Type | Moment |
| --- | --- | --- |
| **SAST** (Sonar, Semgrep) | Analyse statique du code | À chaque push |
| **DAST** (OWASP ZAP) | Test dynamique de l'app déployée | Sur l'environnement de staging |
| `npm audit` / `dotnet list package --vulnerable` | Dépendances vulnérables | À chaque push |

> **🔒 Sécurité**
>
> - Inclure des **tests de sécurité** : cas d'accès non autorisé, entrées malveillantes, contrôle des rôles.
> - **Dependabot** (GitHub) surveille les dépendances et ouvre automatiquement des PRs de mise à jour.
> - Un test qui passe ne prouve pas l'absence de faille — il prouve que le comportement testé est correct.
