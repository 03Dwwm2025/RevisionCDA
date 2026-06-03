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

### 6.6 Le polymorphisme

**Définition :** le polymorphisme, c'est le fait qu'**un même appel de méthode produise un résultat différent selon l'objet sur lequel il est appelé**. Même nom, comportement différent.

C'est l'un des piliers de la POO. Sans polymorphisme, on serait obligé d'écrire des `if/else` pour gérer chaque type d'objet, ce qui rend le code fragile et difficile à étendre.

**Exemple concret — sans polymorphisme :**

```csharp
// ❌ Sans polymorphisme : on doit tester le type manuellement
void AfficherPrime(string typeEmploye)
{
    if (typeEmploye == "manager")      Console.WriteLine("Prime : 2000€");
    else if (typeEmploye == "develo")  Console.WriteLine("Prime : 1000€");
    else if (typeEmploye == "stagia")  Console.WriteLine("Prime : 0€");
    // Ajouter un type = modifier cette méthode → fragile
}
```

**Exemple — avec polymorphisme :**

```csharp
// On définit la méthode CalculerPrime() dans chaque classe
public class Manager
{
    public string Nom { get; set; } = "";
    public decimal CalculerPrime() => 2000m;  // comportement propre au Manager
}

public class Developpeur
{
    public string Nom { get; set; } = "";
    public decimal CalculerPrime() => 1000m;  // comportement propre au Developpeur
}

public class Stagiaire
{
    public string Nom { get; set; } = "";
    public decimal CalculerPrime() => 0m;     // comportement propre au Stagiaire
}
```

Le **même appel** `.CalculerPrime()` renvoie un résultat différent selon l'objet. C'est ça, le polymorphisme : même nom de méthode, comportement adapté à chaque type.

---

### 6.7 La classe abstraite

En pratique, si plusieurs classes partagent des attributs et des méthodes communs (comme `Nom` et `CalculerPrime()` ci-dessus), on factorise dans une **classe parent**. Quand cette classe parent n'a pas de sens à être instanciée seule, on la déclare `abstract`.

**Qu'est-ce qu'une classe abstraite ?**

Une classe abstraite est un **modèle commun à plusieurs classes enfants**. Elle :
- **Ne peut pas être instanciée** directement (on ne peut pas faire `new Employe()`)
- Définit des méthodes que les enfants **doivent** implémenter (`abstract`)
- Peut aussi définir des méthodes que les enfants **peuvent** redéfinir (`virtual`) ou des méthodes communes à tous (méthodes normales)

**Pourquoi « abstraite » ?** Parce qu'un `Employe` seul n'a pas de sens dans notre métier — il est toujours soit un `Manager`, soit un `Developpeur`, soit un `Stagiaire`. On ne peut jamais créer un employé « générique ».

```csharp
// ← CLASSE ABSTRAITE : modèle commun, ne peut pas être instanciée
public abstract class Employe
{
    // ← Attribut commun à tous les employés
    public string Nom { get; set; } = "";

    // ← Méthode ABSTRACT : pas de code ici, chaque enfant DOIT la définir
    //   (chaque type d'employé calcule sa prime différemment)
    public abstract decimal CalculerPrime();

    // ← Méthode VIRTUAL : a un code par défaut, mais les enfants PEUVENT le changer
    public virtual string Role() => "Employé";
}

// ← CLASSE ENFANT 1 : hérite d'Employe et implémente CalculerPrime()
public class Manager : Employe
{
    // override = "je remplace la version du parent"
    public override decimal CalculerPrime() => 2000m;   // ← comportement du Manager
    public override string  Role()          => "Manager"; // ← remplace "Employé"
}

// ← CLASSE ENFANT 2 : hérite d'Employe et implémente CalculerPrime()
public class Developpeur : Employe
{
    public override decimal CalculerPrime() => 1000m;   // ← comportement du Developpeur
    // Role() non redéfini → reste "Employé" (valeur du parent)
}

// ← INTERDIT : Employe est abstraite, on ne peut pas l'instancier
// new Employe() → ❌ erreur de compilation
```

**Le polymorphisme avec la classe abstraite :**

La classe abstraite + `override` rend le polymorphisme encore plus puissant : on peut manipuler des objets via le type parent `Employe`, et C# appelle automatiquement la bonne version selon l'objet réel.

```csharp
// ← Les variables sont déclarées comme Employe (type parent)
//   mais les objets réels sont Manager et Developpeur
Employe e1 = new Manager     { Nom = "Alice" };   // ← objet réel : Manager
Employe e2 = new Developpeur { Nom = "Bob"   };   // ← objet réel : Developpeur

// ← MÊME appel sur les deux variables
// ← COMPORTEMENT DIFFÉRENT selon l'objet réel → c'est le polymorphisme
Console.WriteLine(e1.CalculerPrime()); // → 2000  (version Manager)
Console.WriteLine(e2.CalculerPrime()); // → 1000  (version Developpeur)
Console.WriteLine(e1.Role());          // → "Manager"
Console.WriteLine(e2.Role());          // → "Employé" (version parent, non redéfinie)
```

---

### 6.8 L'interface

**Qu'est-ce qu'une interface ?**

Une interface est un **contrat** : elle liste des méthodes que toute classe qui l'implémente **doit** obligatoirement fournir. Elle ne contient aucun code — seulement des signatures de méthodes.

**Analogie :** une prise électrique est une interface. Peu importe l'appareil (lampe, chargeur, télévision), s'il respecte le format de la prise, il peut s'y brancher. La prise ne sait pas ce que fait l'appareil — elle garantit juste que la connexion est possible.

En programmation : si une classe implémente l'interface `INotifiable`, on sait qu'elle possède une méthode `Notifier()`. On peut l'appeler sans savoir ce qu'elle fait concrètement (envoie un e-mail ? un SMS ? affiche à l'écran ?).

**Différence avec la classe abstraite :**

- La classe abstraite dit : *"tu es un type d'Employe, voici ce qu'un Employe sait faire"*
- L'interface dit : *"peu importe ce que tu es, si tu respectes ce contrat, tu peux faire ça"*

Une classe ne peut hériter que d'**une seule classe abstraite**, mais elle peut implémenter **autant d'interfaces qu'elle veut**.

```csharp
// ← INTERFACE 1 : contrat "peut notifier"
public interface INotifiable
{
    void Notifier(string message);  // ← signature seulement, pas de code
}

// ← INTERFACE 2 : contrat "peut exporter"
public interface IExportable
{
    byte[] Exporter();              // ← signature seulement, pas de code
}

// ← La classe implémente les DEUX interfaces
//   Elle doit fournir le code pour chaque méthode déclarée
public class ServiceConges : INotifiable, IExportable
{
    // ← Implémentation de INotifiable
    public void Notifier(string message)
    {
        Console.WriteLine($"Notification : {message}");
    }

    // ← Implémentation de IExportable
    public byte[] Exporter()
    {
        return System.Text.Encoding.UTF8.GetBytes("données exportées...");
    }
}
```

**Utilisation via l'interface :**

```csharp
// On déclare la variable avec le type de l'interface, pas la classe concrète
// → on sait seulement qu'on peut appeler Notifier(), rien d'autre
INotifiable notif = new ServiceConges();
notif.Notifier("Votre demande a été validée !");
```

**Récapitulatif :**

| | Classe abstraite | Interface |
| --- | --- | --- |
| Instanciable directement | ❌ | ❌ |
| Contient du code | ✅ | ❌ |
| Contient des attributs | ✅ | ❌ |
| Héritage/implémentation multiple | ❌ (une seule) | ✅ (plusieurs) |
| Représente | Une famille d'objets liés | Un contrat de capacité |

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
