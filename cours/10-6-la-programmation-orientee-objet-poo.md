## 6. La programmation orientée objet (POO)

La POO organise le code autour d'**objets** qui regroupent des données (attributs) et des comportements (méthodes). Les exemples ci-dessous sont en C# (ta stack principale), mais les concepts sont universels.

### 6.1 Le vocabulaire de base

| Terme | Définition |
| --- | --- |
| **Classe** | Modèle (moule) qui définit la structure et le comportement d'un objet |
| **Objet** | Une **instance** concrète créée à partir d'une classe |
| **Attribut / Champ** | Une donnée stockée dans la classe (`private decimal _solde`) |
| **Propriété** | Encapsule un champ avec `get`/`set` — contrôle l'accès |
| **Méthode** | Un comportement défini dans la classe |
| **Déclaration** | Réserver un emplacement mémoire (`Eleve e;`) |
| **Initialisation** | Donner une première valeur (`e = new Eleve()`) |
| **Instanciation** | Déclaration + initialisation en une ligne (`Eleve e = new Eleve()`) |

```csharp
public class Eleve
{
    // Propriétés auto (get/set générés automatiquement)
    public string Nom    { get; set; } = "";
    public string Prenom { get; set; } = "";
    public DateOnly DateNaissance { get; set; }

    public int CalculerAge()
    {
        var aujourd = DateOnly.FromDateTime(DateTime.Now);
        int age = aujourd.Year - DateNaissance.Year;
        if (DateNaissance > aujourd.AddYears(-age)) age--;
        return age;
    }
}

// Instanciation
Eleve e = new Eleve();          // new Eleve() appelle le constructeur
e.Nom = "Dumont";
int age = e.CalculerAge();

// Depuis C# 9 : syntaxe allégée (type inféré)
Eleve e2 = new() { Nom = "Martin", Prenom = "Léa" };
```

---

### 6.2 Les propriétés en profondeur

Les propriétés sont le mécanisme d'encapsulation principal en C#. Il en existe plusieurs variantes :

```csharp
public class CompteBancaire
{
    // 1. Champ privé (backing field) + propriété manuelle
    private decimal _solde;
    public decimal Solde
    {
        get => _solde;
        private set   // seule la classe peut modifier le solde
        {
            if (value < 0) throw new ArgumentException("Solde négatif interdit.");
            _solde = value;
        }
    }

    // 2. Propriété auto — le compilateur génère le backing field
    public string Titulaire { get; set; } = "";

    // 3. Lecture seule depuis l'extérieur, modifiable dans la classe
    public int NbOperations { get; private set; }

    // 4. Init-only (C# 9) — assignable seulement à la création
    public string IBAN { get; init; } = "";

    // 5. Propriété calculée (pas de backing field)
    public bool EstPositif => _solde > 0;

    public void Deposer(decimal montant)
    {
        if (montant <= 0) throw new ArgumentException("Montant invalide.");
        Solde += montant;         // passe par le setter privé
        NbOperations++;
    }
}

// Utilisation
var compte = new CompteBancaire { IBAN = "FR76...", Titulaire = "Valentin" };
compte.Deposer(500m);
Console.WriteLine(compte.Solde);      // 500
Console.WriteLine(compte.EstPositif); // true
// compte.Solde = -100;               // ❌ erreur de compilation (set private)
// compte.IBAN  = "autre";            // ❌ erreur (init-only)
```

---

### 6.3 Constructeurs et surcharge

Le **constructeur** est une méthode spéciale (même nom que la classe) appelée automatiquement à l'instanciation. Il initialise l'objet dans un état valide.

```csharp
public class Demande
{
    public DateOnly Debut   { get; }
    public DateOnly Fin     { get; }
    public string   Statut  { get; private set; } = "EN_ATTENTE";
    public int      IdSalarie { get; }

    // Constructeur principal
    public Demande(int idSalarie, DateOnly debut, DateOnly fin)
    {
        if (fin < debut) throw new ArgumentException("Fin avant début.");
        IdSalarie = idSalarie;
        Debut     = debut;
        Fin       = fin;
    }

    // Surcharge : même jour de début et de fin
    public Demande(int idSalarie, DateOnly jourUnique)
        : this(idSalarie, jourUnique, jourUnique)  // appelle le constructeur principal
    { }

    public int NbJours() => (Fin.DayNumber - Debut.DayNumber) + 1;
}

var d1 = new Demande(42, new DateOnly(2026, 7, 1), new DateOnly(2026, 7, 15));
var d2 = new Demande(42, new DateOnly(2026, 8, 15)); // sur un seul jour
```

**`readonly` vs `const` :**

```csharp
public class Regles
{
    public const int MAX_JOURS_CONGE = 25;          // compile-time, toujours pareil
    public readonly DateTime DateCreation;           // défini dans le constructeur, immuable ensuite

    public Regles() { DateCreation = DateTime.Now; }
}
```

---

### 6.4 Encapsulation et modificateurs d'accès

| Modificateur | Portée |
| --- | --- |
| `public` | Accessible de partout |
| `internal` | Visible dans le même assembly (projet) |
| `protected` | Classe + classes enfants uniquement |
| `private` | Classe uniquement (défaut pour les membres) |
| `protected internal` | Assembly OU enfants |

**Bonne pratique :** champs `private`, exposés via propriétés. On peut ainsi valider, calculer ou limiter l'accès.

**`static` :** appartient à la **classe** elle-même, pas aux instances. Accessible sans `new`.

```csharp
public class MathUtils
{
    // Méthode statique — s'appelle sans instancier MathUtils
    public static int Clamper(int valeur, int min, int max)
        => Math.Max(min, Math.Min(max, valeur));

    // Champ statique — partagé entre toutes les instances
    private static int _compteurInstances = 0;
}

int v = MathUtils.Clamper(150, 0, 100); // v = 100
```

---

### 6.5 Héritage

L'héritage permet à une classe **enfant** de réutiliser et d'étendre une classe **parent**.

```csharp
public class Personne
{
    public string Nom   { get; set; } = "";
    public string Email { get; set; } = "";

    public virtual string SePresenter()
        => $"Je m'appelle {Nom}.";
}

public class Salarie : Personne
{
    public decimal SoldeConges { get; set; }
    public string  Service     { get; set; } = "";

    // Appel du constructeur parent avec base()
    public Salarie(string nom, string email, string service)
    {
        Nom     = nom;
        Email   = email;
        Service = service;
    }

    // override : redéfinit la méthode virtuelle du parent
    public override string SePresenter()
        => $"{base.SePresenter()} Je travaille au service {Service}.";
    //          ↑ base.SePresenter() réutilise la version parent
}

public class Manager : Salarie
{
    public Manager(string nom, string email, string service)
        : base(nom, email, service) { }  // base() transmet les args au constructeur Salarie

    public override string SePresenter()
        => $"{base.SePresenter()} Je suis manager.";
}
```

**C# n'autorise pas l'héritage multiple de classes** — une classe ne peut avoir qu'un seul parent. En revanche, elle peut implémenter autant d'interfaces qu'elle veut.

---

### 6.6 `override` vs `new` — la différence critique

```csharp
public class Animal
{
    public virtual string Cri() => "...";
}

// override : liaison tardive (late binding) — le type RÉEL détermine la méthode
public class Chien : Animal
{
    public override string Cri() => "Woof";
}

// new : masquage (hiding) — le type DÉCLARÉ détermine la méthode
public class Chat : Animal
{
    public new string Cri() => "Miaou";  // masque, ne redéfinit pas
}

Animal a1 = new Chien();
Animal a2 = new Chat();

Console.WriteLine(a1.Cri()); // "Woof"  ← override : type réel (Chien)
Console.WriteLine(a2.Cri()); // "..."   ← new : type déclaré (Animal) !
```

> **Retenir :** `override` = polymorphisme (comportement selon l'objet réel). `new` = masquage (comportement selon le type de la variable). En pratique, utiliser `override` presque toujours.

---

### 6.7 Classe abstraite vs Interface vs `sealed`

**Classe abstraite** — modèle enrichi, non instanciable :

```csharp
public abstract class Rapport
{
    public string Titre { get; set; } = "";

    // Méthode abstraite : DOIT être implémentée par les enfants
    public abstract string Generer();

    // Méthode concrète : partagée par tous les enfants
    public void Sauvegarder()
    {
        string contenu = Generer(); // appel polymorphique
        File.WriteAllText($"{Titre}.txt", contenu);
    }
}

public class RapportConges : Rapport
{
    public override string Generer() => "Liste des congés...";
}
// new Rapport() → ❌ erreur, classe abstraite non instanciable
```

**Interface** — contrat pur, plusieurs implémentations :

```csharp
public interface IExportable  { byte[] Exporter(); }
public interface INotifiable  { void Notifier(string msg); }

// Une classe peut implémenter plusieurs interfaces
public class ServiceConges : IExportable, INotifiable
{
    public byte[] Exporter()       => /* ... */ Array.Empty<byte>();
    public void   Notifier(string msg) => Console.WriteLine(msg);
}
```

| | Classe abstraite | Interface |
| --- | --- | --- |
| Instanciable | ❌ | ❌ |
| Champs / état | ✅ | ❌ |
| Code concret | ✅ | ✅ (depuis C# 8, implémentations par défaut) |
| Héritage | Un seul parent | Plusieurs interfaces |

**`sealed`** — interdit l'héritage :

```csharp
public sealed class Singleton
{
    private static Singleton? _instance;
    private Singleton() { }
    public static Singleton Instance => _instance ??= new Singleton();
}
// public class SousClasse : Singleton { } → ❌ erreur
```

---

### 6.8 Polymorphisme — exemple complet

```csharp
// Hiérarchie
public abstract class Employe
{
    public string Nom { get; set; } = "";
    public abstract decimal CalculerPrime();
    public virtual  string  Role()  => "Employé";
}

public class Stagiaire : Employe
{
    public override decimal CalculerPrime() => 0m;
    public override string  Role()          => "Stagiaire";
}

public class Developpeur : Employe
{
    public override decimal CalculerPrime() => 1000m;
}

public class Manager : Employe
{
    public override decimal CalculerPrime() => 2000m;
    public override string  Role()          => "Manager";
}

// Polymorphisme en action
List<Employe> equipe = new()
{
    new Manager    { Nom = "Alice" },
    new Developpeur{ Nom = "Bob" },
    new Stagiaire  { Nom = "Charlie" },
};

// Même appel, comportement différent selon le type réel
foreach (var e in equipe)
    Console.WriteLine($"{e.Nom} ({e.Role()}) → prime : {e.CalculerPrime()}€");

// Alice (Manager) → prime : 2000€
// Bob (Employé)   → prime : 1000€
// Charlie (Stagiaire) → prime : 0€
```

---

### 6.9 Les records (C# 9+)

Les **records** sont des classes optimisées pour les données **immutables**. Parfaits pour les DTO.

```csharp
// Déclaration compacte — propriétés init-only, Equals/GetHashCode/ToString générés
public record DemandeDto(int IdSalarie, DateOnly Debut, DateOnly Fin);

var dto = new DemandeDto(42, new DateOnly(2026, 7, 1), new DateOnly(2026, 7, 15));
var dto2 = dto with { IdSalarie = 99 }; // copie avec modification (non destructif)
Console.WriteLine(dto == dto2);          // false (comparaison par valeur)
```

---

### 6.10 Collections génériques

En pratique, on manipule rarement des tableaux bruts — on utilise les **collections génériques** de `System.Collections.Generic` :

```csharp
// List<T> — tableau dynamique
List<Demande> demandes = new();
demandes.Add(nouvelleDemande);
demandes.Remove(demande);
demandes.Where(d => d.Statut == "EN_ATTENTE").ToList();

// Dictionary<TKey, TValue> — association clé → valeur
Dictionary<int, Salarie> salariesParId = new();
salariesParId[42] = new Salarie { Nom = "Dumont" };
bool existe = salariesParId.ContainsKey(42);

// HashSet<T> — ensemble sans doublon
HashSet<string> statuts = new() { "EN_ATTENTE", "VALIDEE", "REFUSEE" };

// Queue<T> / Stack<T> — file FIFO / pile LIFO
Queue<string> fileAttente = new();
fileAttente.Enqueue("demande-1");
string prochaine = fileAttente.Dequeue();
```

Le `<T>` est un **type générique** : `List<Demande>` accepte uniquement des `Demande`, `List<string>` uniquement des `string`. Le compilateur détecte les erreurs de type avant l'exécution.

---

> **📌 Les quatre piliers à retenir**
>
> | Pilier | En une phrase |
> | --- | --- |
> | **Encapsulation** | Protéger les données, n'exposer que ce qui est nécessaire |
> | **Héritage** | Réutiliser et spécialiser sans dupliquer |
> | **Polymorphisme** | Même appel, comportement adapté au type réel |
> | **Abstraction** | Masquer la complexité derrière un contrat clair |
