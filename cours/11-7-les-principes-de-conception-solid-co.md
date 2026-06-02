## 7. Les principes de conception (SOLID & co.)

Écrire du code qui *marche* ne suffit pas : il doit être **maintenable**. SOLID est un ensemble de cinq principes de conception objet formulés par Robert C. Martin. Ils visent à réduire le **couplage** (dépendances entre les composants) et à augmenter la **cohésion** (une classe = une responsabilité claire).

| Lettre | Principe | Idée centrale |
| --- | --- | --- |
| **S** | Single Responsibility | Une classe = une seule responsabilité, une seule raison de changer |
| **O** | Open/Closed | Ouvert à l'extension, fermé à la modification |
| **L** | Liskov Substitution | Un enfant peut remplacer son parent sans rien casser |
| **I** | Interface Segregation | Plusieurs interfaces spécifiques > une interface fourre-tout |
| **D** | Dependency Inversion | Dépendre d'abstractions, pas d'implémentations concrètes |

---

### 7.1 S — Single Responsibility Principle

**Théorie :** Une classe ne doit avoir qu'une seule **raison de changer**. Si une classe peut changer pour deux raisons différentes, elle a deux responsabilités — c'est une violation du SRP.

Une classe qui gère trop de choses est difficile à comprendre, à tester et à faire évoluer : modifier la logique d'envoi d'e-mail ne devrait pas risquer de casser le calcul des congés.

**Violation :**

```csharp
public class ServiceConges
{
    public Resultat Deposer(DemandeDto dto) { /* règles métier */ }
    public void EnvoyerEmail(string email)  { /* SMTP — 2ème responsabilité */ }
    public string GenererPdf(int id)        { /* PDF   — 3ème responsabilité */ }
}
```

**Correction :**

```csharp
public class ServiceConges      { public Resultat Deposer(DemandeDto dto) { ... } }
public class ServiceNotification { public void Envoyer(string email) { ... } }
public class ServicePdf          { public string Generer(int id) { ... } }
```

---

### 7.2 O — Open/Closed Principle

**Théorie :** Un module doit être **ouvert à l'extension** (on peut ajouter de nouveaux comportements) mais **fermé à la modification** (le code existant et stabilisé ne doit pas être retouché). On étend via l'héritage ou les interfaces plutôt qu'en modifiant ce qui fonctionne.

L'objectif est de pouvoir faire évoluer le logiciel sans risquer de casser ce qui marchait.

**Violation :** chaque nouveau type de prime nécessite de modifier `ServicePaie`.

```csharp
public decimal CalculerPrime(Employe e)
{
    if (e.Type == "manager")   return 2000m;
    if (e.Type == "terrain")   return 1500m;
    // Ajouter un type = modifier cette méthode = risque de régression
}
```

**Correction :** on étend sans modifier.

```csharp
public interface ICalculPrime { decimal Calculer(Employe e); }

public class PrimeManager  : ICalculPrime { public decimal Calculer(Employe e) => 2000m; }
public class PrimeTerrain  : ICalculPrime { public decimal Calculer(Employe e) => 1500m; }
// Nouveau type → nouvelle classe, ServicePaie ne change pas
```

---

### 7.3 L — Liskov Substitution Principle

**Théorie :** Si `B` hérite de `A`, alors partout où on utilise `A`, on doit pouvoir utiliser `B` **sans que le comportement attendu soit brisé**. Un enfant ne doit pas restreindre ou contredire le contrat de son parent.

C'est le principe qui garantit que l'héritage est utilisé de façon cohérente : une classe enfant est vraiment « un type de » son parent.

**Violation classique :**

```csharp
public class Rectangle { public virtual int Largeur { get; set; } public virtual int Hauteur { get; set; } }
public class Carre : Rectangle
{
    // Forcer Largeur == Hauteur viole le contrat de Rectangle
    public override int Largeur { set { base.Largeur = base.Hauteur = value; } get => base.Largeur; }
}

Rectangle r = new Carre();
r.Largeur = 4; r.Hauteur = 5;
// Aire attendue : 20 — Aire obtenue : 25 → comportement cassé
```

**Règle pratique :** si l'héritage oblige à lancer des exceptions ou à restreindre le comportement parent, c'est souvent le signe d'une mauvaise hiérarchie. Préférer la composition.

---

### 7.4 I — Interface Segregation Principle

**Théorie :** Une classe ne doit pas être forcée d'implémenter des méthodes qu'elle n'utilise pas. Mieux vaut plusieurs interfaces précises qu'une seule interface générale.

Des interfaces trop larges créent des dépendances inutiles et forcent des implémentations vides ou levant des exceptions.

**Violation :**

```csharp
public interface IEntite
{
    void Sauvegarder();
    void EnvoyerParEmail();
    void Imprimer();          // Demande n'a pas besoin de ça
}

public class Demande : IEntite
{
    public void Sauvegarder()    { ... }
    public void EnvoyerParEmail(){ ... }
    public void Imprimer() => throw new NotImplementedException(); // 🚩
}
```

**Correction :**

```csharp
public interface ISauvegardable { void Sauvegarder(); }
public interface IEnvoyable      { void EnvoyerParEmail(); }
public interface IImprimable     { void Imprimer(); }

public class Demande : ISauvegardable, IEnvoyable { ... } // pas IImprimable
```

---

### 7.5 D — Dependency Inversion Principle

**Théorie :** Les modules de haut niveau ne doivent pas dépendre des modules de bas niveau — les deux doivent dépendre d'**abstractions** (interfaces). Les détails d'implémentation dépendent des abstractions, pas l'inverse.

C'est le principe au cœur de l'**injection de dépendances** d'ASP.NET Core. En injectant une interface plutôt qu'une classe concrète, on rend le code testable (on peut substituer un faux service en test) et évolutif (changer l'implémentation sans toucher au code client).

**Violation :**

```csharp
public class ServiceConges
{
    // Couplage fort à la classe concrète
    private readonly DemandeRepository _repo = new DemandeRepository();
}
```

**Correction :**

```csharp
public interface IDemandeRepository { void Inserer(Demande d); }

public class ServiceConges
{
    private readonly IDemandeRepository _repo;
    // Reçoit l'abstraction — peut recevoir un FakeRepository en test
    public ServiceConges(IDemandeRepository repo) => _repo = repo;
}
```

---

### 7.6 DRY, KISS, YAGNI

Ces trois principes complètent SOLID au quotidien :

| Principe | Signification | Anti-pattern à éviter |
| --- | --- | --- |
| **DRY** — *Don't Repeat Yourself* | Une logique a une seule source de vérité | Copier-coller du code → si la règle change, on oublie de corriger partout |
| **KISS** — *Keep It Simple* | La solution la plus simple qui fonctionne | Sur-engineering, abstractions prématurées |
| **YAGNI** — *You Aren't Gonna Need It* | Ne pas coder ce dont on n'a pas encore besoin | Développer des fonctionnalités hypothétiques → dette technique |

> **📌 À retenir**
>
> Un code qui respecte SOLID est presque toujours **plus facile à tester**. Si une classe est difficile à tester unitairement, c'est souvent le signe d'une violation de SRP (trop de responsabilités) ou de DIP (dépendances concrètes non injectables). La testabilité est un bon indicateur de qualité de conception.
