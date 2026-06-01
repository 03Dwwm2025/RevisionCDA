## 6. La programmation orientée objet (POO)

La POO organise le code autour d'**objets** qui regroupent des données (attributs) et des comportements (méthodes). Les exemples ci-dessous sont en C# (ta stack principale), mais les concepts sont universels.

### 6.1 Le vocabulaire de base

| Terme | Définition |
| --- | --- |
| **Classe** | Structure servant de modèle à des objets. Apporte sécurité, lisibilité et réutilisabilité (« utilisable de partout ») |
| **Objet** | Une **instance** d'une classe |
| **Déclaration** | Réserver un emplacement mémoire pour une variable |
| **Initialisation** | Donner une première valeur à une variable existante |
| **Affectation** | Donner une valeur à une variable |
| **Instanciation** | Déclarer **et** initialiser une variable (créer un objet à partir d'une classe) |
| **Attribut** | Une propriété (donnée) d'une classe |
| **Méthode** | Une fonction définie dans une classe |

```
// Définition d'une classe
public class Eleve
{
    public string Nom { get; set; }          // attribut (propriété)
    public string Prenom { get; set; }
    public DateOnly DateNaissance { get; set; }

    // Méthode : une fonction dans une classe
    public int CalculerAge()
    {
        var aujourdHui = DateOnly.FromDateTime(DateTime.Now);
        int age = aujourdHui.Year - DateNaissance.Year;
        if (DateNaissance > aujourdHui.AddYears(-age)) age--;
        return age;
    }
}

// Instanciation = déclaration + initialisation
Eleve unEleve = new Eleve();
unEleve.Nom = "Dumont";              // affectation d'une propriété
int sonAge = unEleve.CalculerAge();  // appel de méthode
```

### 6.2 Encapsulation et modificateurs d'accès

L'**encapsulation** consiste à protéger les données d'un objet en contrôlant qui peut y accéder. On expose ce qui doit l'être et on cache le reste, via les modificateurs de visibilité :

| Modificateur | Portée |
| --- | --- |
| **public** | Accessible de partout |
| **internal** | Visible dans le projet (l'assembly) |
| **protected** | Accessible uniquement dans la classe et ses classes enfants |
| **private** | Visible uniquement dans la classe (le fichier de la méthode) |
| **static** | Rend l'élément accessible/utilisable tout le temps, sans instance |

> **💡 Bon à savoir**
>
> Bonne pratique : attributs **privés**, exposés via des **propriétés** (`get`/`set`). On peut ainsi valider une valeur avant de l'affecter, ou la rendre en lecture seule.

### 6.3 Constructeur et surcharge

**Constructeur :** méthode portant le **même nom que la classe**, appelée automatiquement lors de l'instanciation. Elle sert à initialiser l'objet.

**Surcharge (overload) :** une méthode peut avoir **plusieurs versions de même nom** dans une même classe, qui se distinguent par leurs **arguments** (nombre ou types). Très utile sur les constructeurs.

```
public class Demande
{
    public DateOnly Debut { get; }
    public DateOnly Fin { get; }

    // Constructeur 1
    public Demande(DateOnly debut, DateOnly fin)
    { Debut = debut; Fin = fin; }

    // Surcharge : même nom, arguments différents
    public Demande(DateOnly jourUnique)
    { Debut = jourUnique; Fin = jourUnique; }
}
```

### 6.4 Héritage

L'**héritage** permet à une classe **enfant** de récupérer les attributs et méthodes d'une classe **parent**, puis de les compléter. On évite ainsi la duplication.

```
public class Personne
{
    public string Nom { get; set; }
}

// Salarie hérite de Personne
public class Salarie : Personne
{
    public decimal SoldeConges { get; set; }
}
```

### 6.5 Classe abstraite, polymorphisme et interface

**Classe abstraite :** une classe **modèle qui ne peut pas être instanciée** ; elle doit être **implémentée** par des classes dérivées. Elle peut contenir des méthodes `virtual` que les enfants vont **redéfinir** (`override`).

**Polymorphisme :** **même nom, comportement différent** selon l'objet réellement appelé. Il découle de l'héritage et de l'`override` : un même appel de méthode produit des résultats adaptés au type concret.

**Interface :** c'est le principe d'un **échangeur / contrat**. Une interface **oblige les classes qui l'implémentent** à fournir les méthodes (et propriétés) déclarées. Contrairement à l'héritage (une seule classe parent), une classe peut implémenter plusieurs interfaces.

```
// Interface = contrat
public interface INotifiable { void Notifier(string message); }

// Classe abstraite (non instanciable)
public abstract class Employe
{
    public string Nom { get; set; }
    public abstract decimal CalculerPrime();   // à implémenter
    public virtual string Role() => "Employé"; // redéfinissable
}

public class Manager : Employe, INotifiable
{
    public override decimal CalculerPrime() => 2000m;  // polymorphisme
    public override string Role() => "Manager";
    public void Notifier(string message) =>
        Console.WriteLine($"Mail au manager : {message}");
}
```

Les **quatre piliers de la POO** à retenir : **Encapsulation**, **Héritage**, **Polymorphisme**, **Abstraction**.

### 6.6 Documenter le code

En C#, les commentaires de documentation `///` créent un bloc structuré (avec description, paramètres, valeur de retour) exploité par l'IDE et la génération de doc.

```
/// <summary>Calcule l'âge à partir de la date de naissance.</summary>
/// <param name="naissance">Date de naissance.</param>
/// <returns>L'âge en années révolues.</returns>
public int CalculerAge(DateOnly naissance) { /* ... */ }
```
