## 7. Les principes de conception (SOLID & co.)

Écrire du code qui *marche* ne suffit pas : il doit être **maintenable**. SOLID est un ensemble de cinq principes de conception objet qui rendent le code extensible, testable et résistant au changement.

### 7.1 S — Single Responsibility Principle (SRP)

> **Une classe = une seule raison de changer.**

Si une classe fait deux choses, elle doit changer pour deux raisons différentes — ce qui augmente le risque de régression.

**Violation :**

```csharp
public class ServiceConges
{
    public Resultat Deposer(DemandeDto dto) { /* règles métier */ }
    public void EnvoyerEmailNotification(string email) { /* SMTP */ }
    public string GenererPdfRécapitulatif(int idDemande) { /* PDF */ }
}
```

`ServiceConges` gère ici la logique métier, l'envoi d'e-mails et la génération de PDF. Si le format du PDF change, on modifie un service de congés — incohérent.

**Correction :**

```csharp
public class ServiceConges     { public Resultat Deposer(DemandeDto dto) { ... } }
public class ServiceNotification { public void Envoyer(string email, string msg) { ... } }
public class ServicePdf         { public string Generer(int idDemande) { ... } }
```

Chaque classe a une responsabilité unique et une seule raison de changer.

---

### 7.2 O — Open/Closed Principle (OCP)

> **Ouvert à l'extension, fermé à la modification.**

On doit pouvoir ajouter un nouveau comportement sans modifier le code existant et stabilisé.

**Violation :**

```csharp
public decimal CalculerPrime(Employe e)
{
    if (e.Type == "manager")   return 2000m;
    if (e.Type == "terrain")   return 1500m;
    if (e.Type == "stagiaire") return 0m;
    // À chaque nouveau type, on retouche cette méthode
}
```

**Correction via interface :**

```csharp
public interface ICalculPrime
{
    decimal Calculer(Employe e);
}

public class PrimeManager  : ICalculPrime { public decimal Calculer(Employe e) => 2000m; }
public class PrimeTerrain  : ICalculPrime { public decimal Calculer(Employe e) => 1500m; }
public class PrimeStagiaire: ICalculPrime { public decimal Calculer(Employe e) => 0m; }

// ServicePaie ne change pas quand on ajoute un nouveau type de prime :
public class ServicePaie
{
    private readonly ICalculPrime _calcul;
    public ServicePaie(ICalculPrime calcul) => _calcul = calcul;
    public decimal GetPrime(Employe e) => _calcul.Calculer(e);
}
```

---

### 7.3 L — Liskov Substitution Principle (LSP)

> **Une classe enfant doit pouvoir remplacer son parent sans rien casser.**

Si `Manager` hérite d'`Employe`, tout code qui fonctionne avec `Employe` doit fonctionner identiquement avec un `Manager`.

**Violation classique (carré/rectangle) :**

```csharp
public class Rectangle
{
    public virtual int Largeur  { get; set; }
    public virtual int Hauteur  { get; set; }
    public int Aire() => Largeur * Hauteur;
}

public class Carre : Rectangle
{
    // Un carré force Largeur == Hauteur → viole le contrat de Rectangle
    public override int Largeur  { set { base.Largeur = base.Hauteur = value; } ... }
}
```

```csharp
Rectangle r = new Carre();
r.Largeur = 4;
r.Hauteur = 5;
Console.WriteLine(r.Aire()); // Attendu : 20 — Obtenu : 25 → comportement cassé
```

**Règle :** si l'héritage force à surcharger des méthodes pour restreindre ou modifier leur contrat, c'est une violation LSP. Préférer la composition ou des interfaces distinctes.

---

### 7.4 I — Interface Segregation Principle (ISP)

> **Plusieurs interfaces spécifiques valent mieux qu'une interface fourre-tout.**

Ne pas forcer une classe à implémenter des méthodes qu'elle n'utilise pas.

**Violation :**

```csharp
public interface IEntite
{
    void Sauvegarder();
    void EnvoyerParEmail();
    void Imprimer();
}

// Demande doit implémenter Imprimer() alors qu'elle n'est jamais imprimée
public class Demande : IEntite
{
    public void Sauvegarder() { ... }
    public void EnvoyerParEmail() { ... }
    public void Imprimer() => throw new NotImplementedException(); // 🚩
}
```

**Correction :**

```csharp
public interface ISauvegardable  { void Sauvegarder(); }
public interface IEnvoyable      { void EnvoyerParEmail(); }
public interface IImprimable     { void Imprimer(); }

public class Demande  : ISauvegardable, IEnvoyable { ... } // pas IImprimable
public class Contrat  : ISauvegardable, IImprimable { ... }
```

---

### 7.5 D — Dependency Inversion Principle (DIP)

> **Dépendre d'abstractions (interfaces), pas d'implémentations concrètes.**

C'est le principe au cœur de l'**injection de dépendances** d'ASP.NET Core.

**Violation :**

```csharp
public class ServiceConges
{
    // Dépend directement de la classe concrète → couplage fort, non testable
    private readonly DemandeRepository _repo = new DemandeRepository();
}
```

**Correction :**

```csharp
public interface IDemandeRepository
{
    void Inserer(Demande d);
    List<Demande> GetParSalarie(int id);
}

public class ServiceConges
{
    private readonly IDemandeRepository _repo;
    // Le constructeur reçoit l'abstraction, pas le concret
    public ServiceConges(IDemandeRepository repo) => _repo = repo;
}
```

**Enregistrement dans `Program.cs` (ASP.NET Core) :**

```csharp
builder.Services.AddScoped<IDemandeRepository, DemandeRepository>();
builder.Services.AddScoped<IServiceConges, ServiceConges>();
```

En test, on injecte un `FakeDemandeRepository` à la place — sans toucher à la BDD.

---

### 7.6 DRY, KISS, YAGNI

Ces trois principes complètent SOLID au quotidien :

| Principe | Signification | En pratique |
| --- | --- | --- |
| **DRY** | *Don't Repeat Yourself* — une logique a une seule source de vérité | Extraire une méthode plutôt que copier-coller |
| **KISS** | *Keep It Simple* — la solution la plus simple qui fonctionne | Éviter les abstractions prématurées |
| **YAGNI** | *You Aren't Gonna Need It* — ne pas coder ce dont on n'a pas besoin | Ne pas créer de "généricité au cas où" |

**DRY en pratique :**

```csharp
// ❌ Logique de calcul de durée dupliquée dans deux méthodes
public bool EstValide(Demande d) {
    int jours = (d.DateFin - d.DateDebut).Days + 1;
    return jours <= solde;
}
public string Résumé(Demande d) {
    int jours = (d.DateFin - d.DateDebut).Days + 1; // dupliqué
    return $"{jours} jour(s)";
}

// ✅ Extraction
private int NbJours(Demande d) => (d.DateFin - d.DateDebut).Days + 1;
```

> **📌 À retenir**
>
> SOLID rend le code **testable** : SRP isole chaque responsabilité, DIP permet l'injection de faux. Un code difficile à tester est souvent le symptôme d'une violation de SRP ou DIP. Ces principes ne sont pas des règles rigides mais des outils pour réduire le couplage et augmenter la cohésion.
