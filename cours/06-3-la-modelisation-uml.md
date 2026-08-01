## 3. La modélisation UML

Là où Merise se concentre sur les données, **UML** (*Unified Modeling Language*) modélise aussi les **comportements** et la **structure objet**. UML compte 14 diagrammes ; cinq suffisent largement au CDA, et on les classe en deux familles :

| Famille | Ce qu'elle décrit | Diagrammes |
| --- | --- | --- |
| **Statique** (structurel) | Ce qui existe, indépendamment du temps | Classes, composants, déploiement |
| **Dynamique** (comportemental) | Ce qui se passe, dans le temps | Cas d'utilisation, séquence, activité, états-transitions |

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

Vue **statique** de la structure : les classes, leurs attributs, leurs méthodes et leurs relations. C'est la base de la conception objet — il se traduit presque ligne pour ligne en code, dans n'importe quel langage objet.

**Notation :**
- `+` public, `-` privé, `#` protégé
- `attribut : type` → une propriété de la classe
- `methode() : typeRetour` → une méthode, avec son type de retour

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

**Du diagramme de classes au code :** chaque boîte devient une classe, chaque attribut une propriété, chaque méthode une fonction, et chaque relation soit une référence en mémoire, soit une clé étrangère en base.

```javascript
// ← Traduction directe du diagramme ci-dessus
class Salarie {
  #solde;                      // le # marque un champ privé (le - du diagramme)

  constructor(id, nom, email, solde) {
    this.idSalarie = id;       // - idSalarie : int
    this.nom = nom;            // - nom : string
    this.email = email;
    this.#solde = solde;
    this.demandes = [];        // la relation « dépose » (1 à *) devient une liste
  }

  calculerSolde() { return this.#solde; }   // + calculerSolde() : int
  sePresenter()   { return `Je suis ${this.nom}`; }
}

class Manager extends Salarie {             // ← héritage (flèche triangulaire)
  constructor(id, nom, email, solde, service) {
    super(id, nom, email, solde);
    this.service = service;
  }

  validerDemande(idDemande) { /* ... */ }
}
```

La traduction est la même dans tout langage objet : `extends` en JavaScript, `:` en C#, `extends` en Java, parenthèses en Python. Ce qui compte, c'est que le diagramme se lise directement dans le code — et inversement.

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

---

### 3.4 Diagramme d'activité

Vue **dynamique** du **déroulement d'un processus métier** : les étapes, les décisions, les branches parallèles. C'est l'équivalent UML de l'organigramme, mais normalisé. On l'utilise pour décrire un cas d'utilisation complexe, un algorithme métier ou un flux avec plusieurs acteurs.

**Éléments :**

| Symbole | Nom | Rôle |
| --- | --- | --- |
| Cercle plein | Nœud initial | Le début du processus |
| Rectangle arrondi | Action | Une étape |
| Losange | Nœud de décision / fusion | Un branchement conditionnel `[garde]` |
| Barre épaisse | Fourche / jointure | Démarre ou resynchronise des branches parallèles |
| Cercle plein cerclé | Nœud final | La fin du processus |
| Couloir (*swimlane*) | Partition | Qui exécute quelle étape |

**Exemple — le traitement d'une demande de congé :**

```
  SALARIÉ           │        SYSTÈME             │       MANAGER
                    │                            │
   ● début          │                            │
   │                │                            │
   ▼                │                            │
 [Saisir demande]   │                            │
   │                │                            │
   └───────────────►│  [Vérifier le solde]       │
                    │        │                   │
                    │        ◇ solde suffisant ? │
                    │       ╱ ╲                  │
                    │  [non]   [oui]             │
                    │    │       │               │
                    │    ▼       ▼               │
                    │ [Refuser] [Enregistrer     │
                    │  auto]     EN_ATTENTE]     │
                    │    │       │               │
                    │    │       └──────────────►│ [Examiner]
                    │    │                       │     │
                    │    │                       │     ◇ décision ?
                    │    │                       │    ╱ ╲
                    │    │                       │ [refuse] [valide]
                    │    │                       │    │       │
                    │    │◄──────────────────────┘    │       │
                    │    ▼                            ▼       ▼
                    │ [Notifier le salarié] ◄─────────┴───────┘
                    │    │
                    │    ▼
                    │    ◉ fin
```

**Séquence ou activité — comment choisir ?** Le diagramme de séquence montre **qui appelle qui** entre objets techniques (Controller, Service, Repository). Le diagramme d'activité montre **l'enchaînement métier**, sans se soucier de l'implémentation. Le premier parle au développeur, le second au client.

---

### 3.5 Diagramme d'états-transitions

Vue **dynamique** du **cycle de vie d'un seul objet** : les états qu'il peut prendre et les événements qui le font passer de l'un à l'autre. Dès qu'une entité porte une colonne `statut`, ce diagramme est le bon outil pour cadrer ses règles.

**Notation :** un état est un rectangle arrondi ; une transition est une flèche étiquetée `événement [garde] / action`.

**Exemple — le cycle de vie d'une Demande :**

```
        ● 
        │ créer()
        ▼
  ┌──────────────┐   valider() [rôle=Manager]    ┌──────────┐
  │  EN_ATTENTE  │──────────────────────────────►│  VALIDEE │
  └──────────────┘                               └──────────┘
      │      │                                        │
      │      │ refuser() [rôle=Manager]               │ annuler()
      │      │                                        │ [dateDebut > aujourd'hui]
      │      ▼                                        │ / recréditer le solde
      │  ┌──────────┐                                 │
      │  │  REFUSEE │                                 │
      │  └──────────┘                                 ▼
      │      │                                  ┌───────────┐
      │ annuler()                               │  ANNULEE  │
      └────────────────────────────────────────►└───────────┘
                                                       │
                                                       ▼
                                                       ◉
```

Ce que le diagramme rend visible immédiatement :
- une demande `REFUSEE` ne peut plus être validée — la transition n'existe pas ;
- l'annulation d'une demande validée **recrédite le solde** (l'action `/ recréditer le solde`) ;
- on ne peut annuler qu'une demande qui n'a pas commencé (la garde `[dateDebut > aujourd'hui]`).

Ces trois règles se traduisent directement en tests unitaires du Service, et en contraintes dans le code. C'est le diagramme qui rapporte le plus par rapport au temps passé à le dessiner.

---

### 3.6 Les deux diagrammes du déploiement

Pour le bloc 3 (préparer le déploiement), deux diagrammes statiques complètent la panoplie :

- **Diagramme de composants** : les briques logicielles et leurs interfaces (le front, l'API, la base, le service d'envoi d'e-mails) et qui dépend de qui.
- **Diagramme de déploiement** : sur **quelle machine** tourne quoi. Les nœuds (serveur VPS, poste client, conteneur) et les artefacts qu'ils hébergent.

```
  ┌───────────────────┐            ┌──────────────────────────────────┐
  │  <<device>>       │   HTTPS    │  <<device>> VPS Linux            │
  │  Poste client     │───────────►│  ┌────────────────────────────┐  │
  │  ┌─────────────┐  │            │  │ <<container>> nginx        │  │
  │  │ Navigateur  │  │            │  ├────────────────────────────┤  │
  │  └─────────────┘  │            │  │ <<container>> api (:3000)  │  │
  └───────────────────┘            │  ├────────────────────────────┤  │
                                   │  │ <<container>> db (:5432)   │  │
                                   │  └────────────────────────────┘  │
                                   └──────────────────────────────────┘
```

C'est ce schéma qu'on attend dans un dossier de projet pour expliquer l'architecture de production.

---

> **📌 À retenir**
>
> | Diagramme | Répond à | Famille |
> | --- | --- | --- |
> | Cas d'utilisation | Qui fait quoi ? | Dynamique (fonctionnel) |
> | Classes | Comment c'est structuré ? | Statique |
> | Séquence | Qui appelle qui, dans quel ordre ? | Dynamique |
> | Activité | Comment se déroule le processus métier ? | Dynamique |
> | États-transitions | Quels états peut prendre cet objet ? | Dynamique |
> | Composants / Déploiement | Quelles briques, sur quelles machines ? | Statique |
