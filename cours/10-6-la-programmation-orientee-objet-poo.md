## 6. La programmation orientée objet (POO)

### 6.0 Qu'est-ce qu'une classe ?

Une **classe** est un plan, un moule, qui décrit la structure et le comportement d'un type d'objet. Elle regroupe des **données** (les attributs) et des **comportements** (les méthodes) qui vont ensemble.

Pourquoi utiliser des classes ?
- **Sécurité** : on contrôle qui peut lire ou modifier les données.
- **Lisibilité** : le code est organisé par concept métier (`Eleve`, `Demande`, `Salarie`…).
- **Réutilisabilité** : une classe définie une fois peut être instanciée autant de fois qu'on veut, partout dans le projet.

```csharp
// Une classe, c'est un moule...
public class Eleve
{
    public string Nom       { get; set; }
    public string Prenom    { get; set; }
    public DateOnly DateNaissance { get; set; }
}

// ...dont on crée autant d'objets qu'on veut
Eleve eleve1 = new Eleve();
Eleve eleve2 = new Eleve();
// eleve1 et eleve2 sont deux objets indépendants, issus du même moule
```

---

### 6.1 Le vocabulaire de base

| Terme | Définition |
| --- | --- |
| **Déclaration** | Réserver un emplacement mémoire pour une variable (`Eleve unEleve;`) |
| **Initialisation** | Donner une **première valeur** à une variable existante (`unEleve = new Eleve()`) |
| **Affectation** | Donner une valeur à une variable (pas forcément la première) (`unEleve.Nom = "Martin"`) |
| **Instanciation** | Déclarer **et** initialiser en une seule opération (`Eleve unEleve = new Eleve()`) |
| **Objet** | Une **instance** concrète créée à partir d'une classe |

```csharp
Eleve unEleve;                   // Déclaration   — la variable existe en mémoire, sans valeur
unEleve = new Eleve();           // Initialisation — on lui donne sa première valeur

// Affectation d'une propriété (donne une valeur, mais ce n'est pas la "première valeur" de la variable)
unEleve.Nom = "Dumont";

// Instanciation : déclaration + initialisation en une ligne
Eleve autreEleve = new Eleve();
```

---

### 6.2 Attributs et méthodes

Les **attributs** sont les données propres à chaque objet. Une **méthode** est une fonction définie à l'intérieur de la classe — elle agit sur les attributs ou effectue un calcul.

```csharp
public class Eleve
{
    // Attributs (propriétés)
    public string  Nom           { get; set; }
    public string  Prenom        { get; set; }
    public DateOnly DateNaissance { get; set; }
    public string  AdresseUn     { get; set; }
    public string  AdresseDeux   { get; set; }
    public string  CodePostal    { get; set; }
    public string  Ville         { get; set; }

    // Méthode : une fonction définie dans la classe
    public int CalculerAge(DateOnly laDateNaissance)
    {
        var dateJour = DateOnly.FromDateTime(DateTime.Now);
        int age = dateJour.Year - laDateNaissance.Year;
        // Correction si l'anniversaire n'est pas encore passé cette année
        if (laDateNaissance > dateJour.AddYears(-age)) age--;
        return age;
    }
}
```

**Utilisation :**

```csharp
Eleve unEleve = new Eleve();                          // instanciation
unEleve.Nom  = "Dumont";                             // affectation d'un attribut (propriété)

int sonAge = unEleve.CalculerAge(unEleve.DateNaissance); // appel de méthode avec paramètre
```

---

### 6.3 Encapsulation et modificateurs d'accès

L'**encapsulation** consiste à contrôler qui peut accéder aux données d'un objet. On expose ce qui doit l'être, on cache le reste.

| Modificateur | Portée |
| --- | --- |
| `public` | Accessible de partout |
| `internal` | Visible uniquement dans le projet (l'assembly) |
| `protected` | Accessible dans la classe et ses classes enfants uniquement |
| `private` | Visible uniquement dans la classe elle-même |
| `static` | Rend l'élément accessible et utilisable sans avoir besoin d'instancier la classe |

```csharp
public class CompteBancaire
{
    private decimal _solde;          // private : personne ne peut lire _solde directement

    public decimal Solde => _solde;  // public : on expose la lecture, mais pas l'écriture

    public void Deposer(decimal montant)
    {
        if (montant > 0) _solde += montant; // seule la classe modifie _solde
    }
}

// Utilisation
var compte = new CompteBancaire();
compte.Deposer(500);
Console.WriteLine(compte.Solde); // 500 ✅
// compte._solde = -9999;        // ❌ erreur : _solde est private
```

**`static` en pratique :**

```csharp
public class MathUtils
{
    // Méthode statique : pas besoin de faire new MathUtils()
    public static int Max(int a, int b) => a > b ? a : b;
}

int resultat = MathUtils.Max(10, 42); // appelé directement sur la classe
```

> **💡 Bonne pratique :** les attributs sont `private`, exposés via des propriétés `public`. Cela permet de valider une valeur avant de l'affecter, ou de la rendre en lecture seule.

---

### 6.4 Constructeur et surcharge

Le **constructeur** est une méthode particulière qui porte **le même nom que la classe**. Il est appelé automatiquement lors de l'instanciation et sert à initialiser l'objet dans un état valide.

La **surcharge** (*overload*) permet d'avoir **plusieurs versions d'une méthode avec le même nom** dans une même classe. Pour les distinguer, on change les arguments (nombre ou types). C'est particulièrement utile sur les constructeurs.

```csharp
public class Demande
{
    public DateOnly Debut     { get; }
    public DateOnly Fin       { get; }
    public string   Statut    { get; } = "EN_ATTENTE";
    public int      IdSalarie { get; }

    // Constructeur 1 : avec une plage de dates
    public Demande(int idSalarie, DateOnly debut, DateOnly fin)
    {
        IdSalarie = idSalarie;
        Debut     = debut;
        Fin       = fin;
    }

    // Surcharge : même nom, arguments différents — pour un jour unique
    public Demande(int idSalarie, DateOnly jourUnique)
    {
        IdSalarie = idSalarie;
        Debut     = jourUnique;
        Fin       = jourUnique;
    }

    // Surcharge de méthode ordinaire
    public int NbJours() => (Fin.DayNumber - Debut.DayNumber) + 1;
    public int NbJours(DateOnly debut, DateOnly fin) => (fin.DayNumber - debut.DayNumber) + 1;
}

// Les deux constructeurs sont utilisables
var d1 = new Demande(42, new DateOnly(2026, 7, 1), new DateOnly(2026, 7, 15));
var d2 = new Demande(42, new DateOnly(2026, 8, 15)); // jour unique
```

---

### 6.5 Héritage

L'**héritage** permet à une classe **enfant** de récupérer les attributs et méthodes d'une classe **parent**, puis de les enrichir. On évite la duplication de code.

```csharp
// Classe parent
public class Personne
{
    public string Nom   { get; set; } = "";
    public string Email { get; set; } = "";

    public void SePresenter() => Console.WriteLine($"Je m'appelle {Nom}.");
}

// Classe enfant : hérite de Personne (syntaxe : EnfantClass : ParentClass)
public class Salarie : Personne
{
    public decimal SoldeConges { get; set; }
    public string  Service     { get; set; } = "";
}

// Salarie hérite de Nom, Email et SePresenter()
Salarie s = new Salarie();
s.Nom     = "Dumont";   // hérité de Personne
s.Service = "RH";       // propre à Salarie
s.SePresenter();        // méthode héritée
```

> En C#, une classe ne peut hériter que d'**une seule classe parent**. En revanche, elle peut implémenter plusieurs interfaces.

---

### 6.6 Classe abstraite et polymorphisme

**Classe abstraite** : une classe modèle qui **ne peut pas être instanciée** directement. Elle doit être implémentée par des classes dérivées. Elle peut contenir des méthodes `abstract` (sans corps, à implémenter obligatoirement) et des méthodes `virtual` (avec un corps, redéfinissables avec `override`).

```csharp
public abstract class Employe
{
    public string Nom { get; set; } = "";

    // abstract : pas de corps — les enfants DOIVENT l'implémenter
    public abstract decimal CalculerPrime();

    // virtual : a un corps, mais les enfants PEUVENT le redéfinir
    public virtual string Role() => "Employé";
}

public class Manager : Employe
{
    public override decimal CalculerPrime() => 2000m;
    public override string  Role()          => "Manager";
}

public class Developpeur : Employe
{
    public override decimal CalculerPrime() => 1000m;
    // Role() non redéfini → retourne "Employé" (version parent)
}

// new Employe() → ❌ interdit, classe abstraite
```

**Polymorphisme** : même appel de méthode, comportement différent selon le type réel de l'objet. Il découle de l'héritage et de l'`override`.

```csharp
// La variable est de type Employe, mais l'objet réel est un Manager ou Developpeur
Employe e1 = new Manager    { Nom = "Alice" };
Employe e2 = new Developpeur{ Nom = "Bob"   };

// Même appel → résultat différent selon le type réel
Console.WriteLine(e1.CalculerPrime()); // 2000 (Manager)
Console.WriteLine(e2.CalculerPrime()); // 1000 (Developpeur)
Console.WriteLine(e1.Role());          // "Manager"
Console.WriteLine(e2.Role());          // "Employé"
```

---

### 6.7 Interface

Une **interface** est un contrat : elle déclare des méthodes et propriétés que toute classe qui l'implémente **devra** fournir. C'est le principe d'un échangeur — on sait ce qu'on peut faire avec un objet sans connaître son implémentation concrète.

```csharp
// Déclaration de l'interface
public interface INotifiable
{
    void Notifier(string message);
}

public interface IExportable
{
    byte[] Exporter();
}

// Une classe peut implémenter plusieurs interfaces (contrairement à l'héritage)
public class ServiceConges : INotifiable, IExportable
{
    public void   Notifier(string message) => Console.WriteLine($"Notif : {message}");
    public byte[] Exporter()               => System.Text.Encoding.UTF8.GetBytes("export...");
}

// On peut utiliser le type de l'interface
INotifiable notif = new ServiceConges();
notif.Notifier("Demande validée !");
```

| | Classe abstraite | Interface |
| --- | --- | --- |
| Instanciable | ❌ | ❌ |
| Peut avoir du code concret | ✅ | ❌ (en règle générale) |
| Peut avoir des champs/état | ✅ | ❌ |
| Héritage multiple | ❌ (une seule) | ✅ (plusieurs interfaces) |

---

### 6.8 Documenter le code

En C#, le triple slash `///` génère un bloc de documentation structuré, exploité par l'IDE (IntelliSense) et les outils de génération de doc.

```csharp
/// <summary>
/// Calcule l'âge de l'élève à partir de sa date de naissance.
/// </summary>
/// <param name="laDateNaissance">La date de naissance de l'élève.</param>
/// <returns>L'âge en années révolues.</returns>
public int CalculerAge(DateOnly laDateNaissance)
{
    // ...
}
```

> **📌 Les quatre piliers de la POO**
>
> | Pilier | En une phrase |
> | --- | --- |
> | **Encapsulation** | Protéger les données, n'exposer que ce qui est nécessaire |
> | **Héritage** | Réutiliser et spécialiser sans dupliquer |
> | **Polymorphisme** | Même appel, comportement adapté au type réel de l'objet |
> | **Abstraction** | Masquer la complexité derrière un contrat clair |
