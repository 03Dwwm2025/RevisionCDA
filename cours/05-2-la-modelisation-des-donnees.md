## 2. La modélisation des données

Les données sont le cœur d'une application de gestion. On les modélise par raffinements successifs : **dictionnaire de données → MCD → MLD → MPD**, du plus conceptuel (indépendant de toute technologie) au plus physique (le schéma SQL réel).

### 2.1 Le dictionnaire de données

C'est l'inventaire exhaustif et normalisé de toutes les informations manipulées. On distingue :

- Les **données d'application** : utiles au métier et à l'utilisateur (nom, prénom, date…).
- Les **données d'exploitation** : utiles seulement au développeur/système (identifiants techniques, dates de création, etc.).

**Démarche en trois temps :**

1. **Récupérer / inventer / réfléchir** aux informations : questionner le client, exploiter l'existant, anticiper les besoins.
1. **Trier les données** : éliminer les données inutiles, rendre chaque information **indivisible** (atomique), puis regrouper par entité.
1. **Élaborer le dictionnaire** dans un tableau normalisé.

| Nom | Libellé complet | Type | Contraintes | Règle de calcul |
| --- | --- | --- | --- | --- |
| idSalarie | Identifiant du salarié | entier | PK, auto-incrément | — |
| nom | Nom de famille | chaîne(50) | obligatoire | — |
| email | Adresse e-mail | chaîne(120) | obligatoire, unique | — |
| soldeConges | Solde de congés | décimal | ≥ 0 | acquis − pris |

**Règles de nomenclature :** pas de doublons ; références uniques de la forme **idEntité** ; noms courts mais explicites ; pas de caractères spéciaux ; jamais de chiffre en premier caractère ; une seule langue (selon la cible) ; un seul pattern d'écriture (ex : *camelCase* partout).

### 2.2 Le MCD (Modèle Conceptuel de Données)

Issu de la méthode **Merise**, le MCD décrit les données et leurs liens, indépendamment de toute base de données. Ses briques :

- **Entité** : un objet du métier (Salarié, Demande, Service). Elle possède des **attributs** (ses propriétés) et un **identifiant** unique.
- **Association** : un lien entre entités (un Salarié *dépose* une Demande). Une association peut elle-même porter des attributs.
- **Cardinalités** : sur chaque patte de l'association, un couple (min, max) indiquant combien de fois une occurrence participe au lien.

| Cardinalité | Lecture |
| --- | --- |
| (0,1) | participe au plus une fois, éventuellement aucune |
| (1,1) | participe exactement une fois |
| (0,n) | participe de zéro à plusieurs fois |
| (1,n) | participe d'une à plusieurs fois (au moins une) |

Exemple : un Salarié dépose **(0,n)** demandes ; une Demande est déposée par **(1,1)** salarié. C'est une relation « un-à-plusieurs ».

### 2.3 Le MLD (Modèle Logique de Données)

Étape intermédiaire qui traduit le MCD en tables, relations et clés, toujours sans choisir un SGBD précis. Concrètement, c'est l'application des règles de passage qui aboutiront au MPD.

### 2.4 Le MPD (Modèle Physique de Données)

Le MPD est le schéma final, prêt à être créé dans le SGBD. Il doit être **« fixe au maximum »**. Règles de passage du MCD vers le MPD :

- Les **entités deviennent des tables**, les **attributs deviennent des champs**.
- Les **références uniques deviennent les clés primaires** de leur table respective (et héritent de leur unicité).
- Les **associations disparaissent** au profit de **clés étrangères**.
- Dans une relation **one-to-many**, l'entité « faible » reçoit comme clé étrangère la référence de l'entité « forte ». Les éventuels attributs de la relation sont reportés dans l'entité faible. Cette clé peut être renommée.
- Dans une relation **many-to-many**, l'association génère une **nouvelle table** dont la clé primaire est la **concaténation** des références des deux entités. Les attributs de la relation deviennent des champs de cette table. Les clés et la table peuvent être renommées.
- L'ensemble des attributs **conservent leur nom et leurs propriétés** (type, longueur, contraintes…).

```
-- MPD de CongeApp (extrait, dialecte SQL standard)
CREATE TABLE Salarie (
  idSalarie    INT PRIMARY KEY IDENTITY,
  nom          NVARCHAR(50)  NOT NULL,
  email        NVARCHAR(120) NOT NULL UNIQUE,
  idService    INT NOT NULL,
  FOREIGN KEY (idService) REFERENCES Service(idService)
);

CREATE TABLE Demande (
  idDemande    INT PRIMARY KEY IDENTITY,
  dateDebut    DATE NOT NULL,
  dateFin      DATE NOT NULL,
  statut       NVARCHAR(20) NOT NULL DEFAULT 'EN_ATTENTE',
  idSalarie    INT NOT NULL,   -- clé étrangère (one-to-many)
  FOREIGN KEY (idSalarie) REFERENCES Salarie(idSalarie)
);
```

### 2.5 La normalisation (formes normales)

La normalisation élimine les redondances et les anomalies. Trois formes normales sont attendues au minimum :

**1NF (atomicité) :** chaque champ contient une valeur **atomique** (indivisible), pas de liste ni de groupe répété. Une ligne est identifiable par une clé. → Mauvais : un champ `telephones = "06.., 07.."`. Bon : une table `Telephone` liée.

**2NF :** être en 1NF **et** que chaque attribut non-clé dépende de la **totalité** de la clé primaire (pertinent quand la clé est composite). On supprime les dépendances partielles.

**3NF :** être en 2NF **et** qu'aucun attribut non-clé ne dépende d'un autre attribut non-clé (pas de dépendance **transitive**). → Si on stockait `codePostal` et `ville` dans la table Salarie, `ville` dépend de `codePostal`, pas de la clé : on l'extrait dans une table dédiée.

### 2.6 Les propriétés d'une base de données

Une bonne base de données garantit quatre propriétés fondamentales : la **persistance** (les données survivent à l'arrêt de l'application), la **disponibilité** (elles sont accessibles quand on en a besoin), la **sécurisation** (accès contrôlé) et l'**intégrité** (les données restent cohérentes et valides).

> **🔒 Sécurité**
>
> La modélisation est un levier de sécurité majeur, souvent négligé.
> - **Minimisation (RGPD)** : ne pas créer de champs « au cas où ». Chaque donnée personnelle stockée est un risque.
> - **Intégrité** : les contraintes (`NOT NULL`, `UNIQUE`, `FOREIGN KEY`, `CHECK`) sont une première ligne de défense contre les données corrompues ou injectées.
> - **Jamais de mot de passe en clair** : on stocke uniquement une **empreinte** (hash + sel), jamais le mot de passe lui-même (voir la section Sécurité du développement).
> - **Chiffrement au repos** (*encryption at rest*) pour les données très sensibles, et **pseudonymisation** quand c'est possible.
> - Prévoir une **durée de conservation** et une procédure d'effacement (droit à l'oubli).
