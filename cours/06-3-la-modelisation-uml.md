## 3. La modélisation UML

Là où Merise se concentre sur les données, **UML** (Unified Modeling Language) modélise aussi les comportements et la structure objet. Trois diagrammes reviennent constamment dans le CDA.

### 3.1 Diagramme de cas d'utilisation

Il représente **qui** (les acteurs) fait **quoi** (les cas d'utilisation) avec le système. C'est le pont entre l'analyse des besoins et la conception. Les acteurs (bonshommes) sont reliés aux cas (ovales) ; les relations `<<include>>` (toujours) et `<<extend>>` (parfois) précisent les dépendances entre cas.

```
        CongeApp
   ┌────────────────────────┐
   │  ( Déposer demande )   │
Salarié──┤  ( Consulter solde )    │
   │  ( Valider demande ) ──┼── Manager
   │  ( Gérer utilisateurs )┼── Admin RH
   └────────────────────────┘
```

### 3.2 Diagramme de classes

Vue **statique** de la structure du code : les classes, leurs attributs, leurs méthodes et leurs relations (association, agrégation, composition, **héritage**). On y indique aussi la **visibilité** : `+` public, `-` privé, `#` protégé.

```
┌─────────────────────┐        ┌──────────────────┐
│ Salarie             │ 1    * │ Demande          │
├─────────────────────┤◄───────├──────────────────┤
│ - id : int          │ dépose │ - id : int       │
│ - nom : string      │        │ - dateDebut:date │
│ - email : string    │        │ - statut : enum  │
├─────────────────────┤        ├──────────────────┤
│ + calculerSolde()   │        │ + valider()      │
└─────────────────────┘        └──────────────────┘
```

Les **multiplicités** (1, *, 0..1) jouent le même rôle que les cardinalités Merise. Le diagramme de classes se traduit presque directement en code orienté objet (voir Partie II).

### 3.3 Diagramme de séquence

Vue **dynamique** : il montre les **messages échangés dans le temps** entre objets pour réaliser un scénario précis. Le temps s'écoule de haut en bas ; chaque acteur/objet a une *ligne de vie* verticale.

```
Salarié      UI        Controller    Service     Repository    BDD
  │           │            │            │            │          │
  │ saisir    │            │            │            │          │
  │──────────►│ POST       │            │            │          │
  │           │───────────►│ créer()    │            │          │
  │           │            │───────────►│ valider()  │          │
  │           │            │            │───────────►│ INSERT   │
  │           │            │            │            │─────────►│
  │           │◄───────────│◄───────────│◄───────────│ 201 OK   │
```

> **📌 À retenir**
>
> Retenir l'opposition : le **diagramme de classes** est *statique* (la structure), le **diagramme de séquence** est *dynamique* (le déroulé dans le temps). Le **cas d'utilisation** relie le tout au besoin métier.
