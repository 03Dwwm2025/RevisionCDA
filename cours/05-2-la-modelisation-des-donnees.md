## 2. La modélisation des données

Les données sont le cœur d'une application de gestion. On les modélise par raffinements successifs : **dictionnaire de données → MCD → MLD → MPD**, du plus conceptuel au plus physique.

```
Dictionnaire    →     MCD      →     MLD      →     MPD
(inventaire)       (métier,       (tables et      (SQL prêt
                   pas de tech)    clés, pas       à créer)
                                   de SGBD)
```

### 2.1 Le dictionnaire de données

C'est l'inventaire exhaustif et normalisé de toutes les informations manipulées par l'application. Il liste chaque donnée avec son nom, son type, ses contraintes et ses règles éventuelles.

| Nom | Libellé complet | Type | Contraintes | Règle de calcul |
| --- | --- | --- | --- | --- |
| idSalarie | Identifiant du salarié | entier | PK, auto-incrément | — |
| nom | Nom de famille | chaîne(50) | obligatoire | — |
| email | Adresse e-mail | chaîne(120) | obligatoire, unique | — |
| soldeConges | Solde de congés | décimal | ≥ 0 | acquis − pris |
| dateDebut | Date début de congé | date | obligatoire | — |
| statut | Statut de la demande | chaîne(20) | EN_ATTENTE / VALIDEE / REFUSEE | — |

**Règles de nomenclature :** noms courts et explicites, une seule langue, un seul pattern (camelCase ou snake_case), pas de caractères spéciaux, pas de doublon.

---

### 2.2 Le MCD — Modèle Conceptuel de Données

Issu de la méthode **Merise**, le MCD décrit les données et leurs liens de façon **indépendante de toute technologie**. On pense « métier », pas « base de données ».

Ses éléments :
- **Entité** : un objet du métier (Salarié, Demande, Service). Elle possède des **attributs** et un **identifiant** unique.
- **Association** : un lien entre entités (un Salarié *dépose* une Demande).
- **Cardinalités** : sur chaque patte de l'association, un couple (min, max) indiquant combien de fois une entité participe au lien.

| Cardinalité | Lecture |
| --- | --- |
| (0,1) | participe au plus une fois, éventuellement aucune |
| (1,1) | participe exactement une fois |
| (0,n) | participe de zéro à plusieurs fois |
| (1,n) | participe d'une à plusieurs fois |

**Exemple CongeApp :**

```
SALARIE ——(0,n)——[ dépose ]——(1,1)—— DEMANDE
```

Lecture : un salarié peut déposer de 0 à plusieurs demandes. Chaque demande est déposée par exactement 1 salarié. → Relation **un-à-plusieurs** (one-to-many).

---

### 2.3 Le MLD — Modèle Logique de Données

Le MLD **traduit le MCD en tables et relations** sans encore choisir de SGBD précis. C'est l'étape intermédiaire entre la vision métier (MCD) et le SQL réel (MPD).

**Règles de passage MCD → MLD :**

| Dans le MCD | Dans le MLD |
| --- | --- |
| Entité | Table |
| Attribut | Colonne |
| Identifiant | Clé primaire (PK) |
| Association one-to-many | Clé étrangère (FK) dans la table "côté many" |
| Association many-to-many | Nouvelle table de liaison avec les deux FK comme PK |

**Exemple — MLD de CongeApp (notation textuelle) :**

```
Salarie (idSalarie, nom, email, soldeConges, #idService)
          ↑ PK                                ↑ FK vers Service

Demande (idDemande, dateDebut, dateFin, statut, #idSalarie)
          ↑ PK                                   ↑ FK vers Salarie

Service (idService, nomService)
          ↑ PK
```

Lecture : le `#` indique une clé étrangère. La table `Demande` porte la FK `idSalarie` car c'est elle qui est du côté "many" (une demande appartient à UN salarié).

---

### 2.4 Le MPD — Modèle Physique de Données

Le MPD est le schéma SQL final, spécifique au SGBD choisi (SQL Server, PostgreSQL, MySQL…). On passe du MLD au MPD en ajoutant les types de données précis, les valeurs par défaut, les contraintes et la syntaxe du SGBD.

```sql
-- Traduction directe du MLD en SQL (dialecte SQL Server)
CREATE TABLE Service (
  idService    INT PRIMARY KEY IDENTITY,
  nomService   NVARCHAR(50) NOT NULL
);

CREATE TABLE Salarie (
  idSalarie    INT PRIMARY KEY IDENTITY,
  nom          NVARCHAR(50)  NOT NULL,
  email        NVARCHAR(120) NOT NULL UNIQUE,
  soldeConges  DECIMAL(5,1)  NOT NULL DEFAULT 0,
  idService    INT NOT NULL,
  FOREIGN KEY (idService) REFERENCES Service(idService)
);

CREATE TABLE Demande (
  idDemande    INT PRIMARY KEY IDENTITY,
  dateDebut    DATE NOT NULL,
  dateFin      DATE NOT NULL,
  statut       NVARCHAR(20) NOT NULL DEFAULT 'EN_ATTENTE',
  idSalarie    INT NOT NULL,
  FOREIGN KEY (idSalarie) REFERENCES Salarie(idSalarie)
);
```

**Association many-to-many — exemple :**

Si un Salarié peut avoir plusieurs Compétences, et une Compétence peut être maîtrisée par plusieurs Salariés, le MCD génère une table de liaison :

```
SALARIE ——(0,n)——[ possède ]——(0,n)—— COMPETENCE
```

MLD : `Salarie_Competence (#idSalarie, #idCompetence, niveauMaitrise)`

```sql
CREATE TABLE Salarie_Competence (
  idSalarie   INT NOT NULL,
  idCompetence INT NOT NULL,
  niveau      INT CHECK (niveau BETWEEN 1 AND 5),
  PRIMARY KEY (idSalarie, idCompetence),       -- PK composite
  FOREIGN KEY (idSalarie)    REFERENCES Salarie(idSalarie),
  FOREIGN KEY (idCompetence) REFERENCES Competence(idCompetence)
);
```

---

### 2.5 Les propriétés ACID d'une base de données

Une base de données fiable garantit les quatre propriétés **ACID** pour ses transactions :

| Lettre | Propriété | Signification |
| --- | --- | --- |
| **A** | **Atomicité** | Une transaction est « tout ou rien » : soit toutes les opérations réussissent, soit aucune n'est appliquée |
| **C** | **Cohérence** | La base passe toujours d'un état valide à un autre état valide — les contraintes sont respectées |
| **I** | **Intégrité** | Les données restent exactes et cohérentes : clés étrangères respectées, contraintes NOT NULL/UNIQUE vérifiées |
| **D** | **Durabilité** | Une transaction validée (COMMIT) est définitivement enregistrée, même en cas de panne système |

**Exemple d'utilité de l'atomicité :** lors du dépôt d'une demande, on doit à la fois déduire le solde du salarié ET créer l'enregistrement de la demande. Si l'une des deux opérations échoue, la transaction est annulée (`ROLLBACK`) — on ne se retrouve jamais avec un solde débité sans demande créée.

```sql
BEGIN TRANSACTION;
  UPDATE Salarie SET soldeConges = soldeConges - 10 WHERE idSalarie = 42;
  INSERT INTO Demande (dateDebut, dateFin, statut, idSalarie)
  VALUES ('2026-07-01', '2026-07-10', 'VALIDEE', 42);
COMMIT;
-- En cas d'erreur : ROLLBACK annule les deux opérations
```

---

### 2.6 Les autres propriétés d'une bonne base de données

Au-delà d'ACID, une base de données doit garantir :

- **Persistance** : les données survivent à l'arrêt de l'application ou du serveur.
- **Disponibilité** : les données sont accessibles quand on en a besoin.
- **Sécurisation** : les accès sont contrôlés (authentification, droits par utilisateur).

> **🔒 Sécurité**
>
> - **Minimisation (RGPD)** : ne pas créer de colonnes « au cas où ». Chaque donnée personnelle stockée est un risque.
> - **Intégrité** : les contraintes SQL (`NOT NULL`, `UNIQUE`, `FOREIGN KEY`, `CHECK`) sont une première ligne de défense contre les données corrompues.
> - **Jamais de mot de passe en clair** : stocker uniquement une empreinte (hash + sel, voir le chapitre Sécurité).
> - Prévoir une **durée de conservation** et une procédure d'effacement (droit à l'oubli RGPD).
