## 3. La modélisation UML

Là où Merise se concentre sur les données, **UML** (*Unified Modeling Language*) modélise aussi les **comportements** et la **structure objet**. Trois diagrammes sont incontournables au CDA.

### 3.1 Diagramme de cas d'utilisation

Il représente **qui** (les acteurs) fait **quoi** (les cas d'utilisation) avec le système. C'est le pont entre l'analyse des besoins et la conception.

**Éléments :**
- **Acteur** (bonhomme) : une entité externe qui interagit avec le système (utilisateur, autre système)
- **Cas d'utilisation** (ovale) : une fonctionnalité du système du point de vue de l'utilisateur
- **`<<include>>`** : le cas inclus est **toujours** exécuté (obligatoire)
- **`<<extend>>`** : le cas étendu est **parfois** exécuté (optionnel/conditionnel)

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
    │               │──── ( Gérer les soldes ) ────────────┼──── Admin RH
                    │                                      │
                    └──────────────────────────────────────┘
```

**Relations entre cas :**

```
( Déposer une demande )
        │
        <<include>>
        │
        ▼
( Vérifier le solde )      ← toujours exécuté lors du dépôt

( Consulter son solde )
        │
        <<extend>>
        │
        ▼
( Afficher l'historique )  ← optionnel, déclenché sous condition
```

---

### 3.2 Diagramme de classes

Vue **statique** de la structure du code : les classes, leurs attributs, leurs méthodes et leurs relations. Les visibilités : `+` public, `-` privé, `#` protégé.

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
│       Manager         │
├──────────────────────┤
│ - equipe : List       │
├──────────────────────┤
│ + validerDemande()   │
└──────────────────────┘
```

**Types de relations :**

| Relation | Symbole | Signification |
| --- | --- | --- |
| Association | `────` | « utilise » ou « est lié à » |
| Agrégation | `◇────` | « contient » (parties indépendantes) |
| Composition | `◆────` | « est composé de » (parties dépendantes — même cycle de vie) |
| Héritage | `────▷` | « est un » |
| Implémentation | `- - -▷` | « implémente l'interface » |

Les **multiplicités** (1, *, 0..1, 1..n) jouent le même rôle que les cardinalités Merise.

---

### 3.3 Diagramme de séquence

Vue **dynamique** : les **messages échangés dans le temps** entre objets pour réaliser un scénario. Le temps s'écoule de haut en bas ; chaque acteur/objet a une *ligne de vie* verticale.

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

> **📌 À retenir**
>
> - **Cas d'utilisation** : le *quoi* (fonctionnalités du point de vue utilisateur)
> - **Diagramme de classes** : le *comment structuré* (organisation statique du code)
> - **Diagramme de séquence** : le *comment dynamique* (déroulé d'un scénario dans le temps)
