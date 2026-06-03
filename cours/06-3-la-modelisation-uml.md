## 3. La modélisation UML

Là où Merise se concentre sur les données, **UML** (*Unified Modeling Language*) modélise aussi les **comportements** et la **structure objet**. Trois diagrammes sont incontournables au CDA.

---

### 3.1 Diagramme de cas d'utilisation

Il représente **qui** (les acteurs) fait **quoi** (les cas d'utilisation) avec le système. C'est le pont entre l'analyse des besoins et la conception — il ne décrit pas *comment* c'est fait, seulement *quoi* et *par qui*.

**Éléments :**
- **Acteur** (bonhomme bâton) : une entité externe qui interagit avec le système (personne, autre application)
- **Cas d'utilisation** (ovale) : une fonctionnalité vue du côté utilisateur
- **`<<include>>`** : le cas inclus est **toujours** exécuté — c'est une dépendance obligatoire
- **`<<extend>>`** : le cas étendu est **parfois** exécuté — c'est une extension conditionnelle

```
                    ┌──────────────────────────────────────┐
                    │             CongeApp                 │
                    │                                      │
Salarié ────────────┤──── ( Déposer une demande )          │
    │               │──── ( Consulter son solde )          │
    │               │                                      │
    │               │──── ( Valider une demande ) ─────────┼──── Manager
    │               │                                      │
    │               │──── ( Gérer les utilisateurs ) ──────┼──── Admin RH
    │               │──── ( Gérer les soldes )      ───────┼──── Admin RH
                    │                                      │
                    └──────────────────────────────────────┘
```

**`<<include>>` vs `<<extend>>` — la différence :**

```
( Déposer une demande ) ──<<include>>──► ( Vérifier le solde )
← "Déposer" inclut TOUJOURS "Vérifier le solde" — sans vérification, le dépôt ne peut pas se faire

( Consulter son solde ) ◄──<<extend>>── ( Afficher l'historique détaillé )
← "Afficher l'historique" est optionnel — il ÉTEND "Consulter" sous certaines conditions
```

---

### 3.2 Diagramme de classes

Vue **statique** de la structure : les classes, leurs attributs, leurs méthodes et leurs relations. C'est la base de la conception objet — il se traduit presque directement en code C#.

**Notation :**
- `+` public, `-` privé, `#` protégé
- `attribut : type` → propriété C#
- `methode() : typeRetour` → méthode C#

```
┌─────────────────────────┐          ┌──────────────────────────┐
│        Salarie           │          │         Demande           │
├─────────────────────────┤          ├──────────────────────────┤
│ - idSalarie : int        │  1    *  │ - idDemande : int         │
│ - nom : string           │◄─────────│ - dateDebut : date        │
│ - email : string         │  dépose  │ - dateFin : date          │
│ - soldeConges : decimal  │          │ - statut : string         │
├─────────────────────────┤          ├──────────────────────────┤
│ + calculerSolde() : int  │          │ + valider() : void        │
│ + sePresenter() : string │          │ + nbJours() : int         │
└─────────────────────────┘          └──────────────────────────┘
           △
           │ hérite
┌──────────────────────┐
│       Manager        │
├──────────────────────┤
│ - service : string   │
├──────────────────────┤
│ + validerDemande()   │
└──────────────────────┘
```

**Du diagramme de classes au code C# :** chaque boîte devient une classe, chaque attribut une propriété, chaque relation une FK ou une navigation property.

```csharp
// ← Traduction directe du diagramme ci-dessus
public class Salarie
{
    public int     IdSalarie   { get; set; }  // - idSalarie : int
    public string  Nom         { get; set; } = "";  // - nom : string
    public string  Email       { get; set; } = "";
    public decimal SoldeConges { get; set; }

    // La relation "dépose" (1 à *) se traduit par une liste côté Salarie
    public List<Demande> Demandes { get; set; } = new();

    public int    CalculerSolde()  { /* ... */ return 0; }
    public string SePresenter()    => $"Je suis {Nom}";
}

public class Manager : Salarie   // ← héritage (flèche triangulaire)
{
    public string Service { get; set; } = "";
    public void ValiderDemande(int idDemande) { /* ... */ }
}
```

**Types de relations :**

| Relation | Symbole | Signification | Exemple |
| --- | --- | --- | --- |
| Association | `────` | « est lié à » | Salarié dépose Demande |
| Agrégation | `◇────` | « contient, mais les parties survivent » | Équipe contient des Salariés (un salarié existe sans équipe) |
| Composition | `◆────` | « est fait de, les parties disparaissent avec le tout » | Commande est composée de LignesCommande (les lignes n'ont pas de sens sans la commande) |
| Héritage | `────▷` | « est un type de » | Manager est un Salarie |
| Implémentation | `- - -▷` | « respecte ce contrat » | ServiceConges implémente IServiceConges |

**Agrégation vs Composition — la différence clé :**

- **Agrégation** : les parties peuvent exister sans le tout. Si on supprime l'Équipe, les Salariés continuent d'exister.
- **Composition** : les parties n'ont pas de sens sans le tout. Si on supprime une Commande, ses LignesCommande sont supprimées aussi.

---

### 3.3 Diagramme de séquence

Vue **dynamique** : les **messages échangés dans le temps** entre objets pour réaliser un scénario. Le temps s'écoule de haut en bas ; chaque participant a une *ligne de vie* verticale.

```
Salarié      UI          Controller    Service      Repository    BDD
   │           │              │            │              │          │
   │ saisir    │              │            │              │          │
   │──────────►│              │            │              │          │
   │           │ POST /demande│            │              │          │
   │           │─────────────►│            │              │          │
   │           │              │ deposer()  │              │          │
   │           │              │───────────►│              │          │
   │           │              │            │ inserer()    │          │
   │           │              │            │─────────────►│          │
   │           │              │            │              │ INSERT   │
   │           │              │            │              │─────────►│
   │           │              │            │◄─────────────│ OK       │
   │           │              │◄───────────│              │          │
   │           │◄─────────────│ 201 Created│              │          │
   │◄──────────│              │            │              │          │
```

Le diagramme de séquence complète le diagramme de classes : là où le diagramme de classes montre la **structure** (qui existe), le diagramme de séquence montre le **comportement** (qui appelle qui, dans quel ordre).

> **📌 À retenir**
>
> | Diagramme | Répond à | Type |
> | --- | --- | --- |
> | Cas d'utilisation | Qui fait quoi ? | Fonctionnel |
> | Classes | Comment c'est structuré ? | Statique |
> | Séquence | Dans quel ordre ça se passe ? | Dynamique |
