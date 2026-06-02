## 2. La modélisation des données

Les données sont le cœur d'une application de gestion. On les modélise par raffinements successifs : **dictionnaire de données → MCD → MLD → MPD**, du plus conceptuel au plus physique.

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

Issu de la méthode **Merise**, le MCD décrit les données et leurs liens de façon **indépendante de toute technologie**. Ses éléments :

- **Entité** : un objet du métier (Salarié, Demande, Service). Elle possède des **attributs** et un **identifiant** unique.
- **Association** : un lien entre entités (un Salarié *dépose* une Demande).
- **Cardinalités** : sur chaque patte de l'association, un couple (min, max) indiquant la participation.

| Cardinalité | Lecture |
| --- | --- |
| (0,1) | participe au plus une fois, éventuellement aucune |
| (1,1) | participe exactement une fois |
| (0,n) | participe de zéro à plusieurs fois |
| (1,n) | participe d'une à plusieurs fois |

**Exemple :** un Salarié dépose **(0,n)** demandes ; une Demande est déposée par **(1,1)** salarié → relation **un-à-plusieurs**.

---

### 2.3 Le MLD — Modèle Logique de Données

Étape intermédiaire qui traduit le MCD en tables, relations et clés, **sans choisir de SGBD précis**. On applique les règles de passage :

- Chaque entité → une table
- Chaque association one-to-many → une clé étrangère dans la table « faible »
- Chaque association many-to-many → une table de liaison

---

### 2.4 Le MPD — Modèle Physique de Données

Le MPD est le schéma SQL final, prêt à être exécuté dans le SGBD choisi.

**Règles de passage MCD → MPD :**
- Les entités deviennent des **tables**, leurs attributs des **colonnes**.
- Les identifiants deviennent des **clés primaires** (PRIMARY KEY).
- Les associations disparaissent au profit de **clés étrangères** (FOREIGN KEY).
- Dans une relation **many-to-many**, l'association génère une **table de liaison** dont la PK est la concaténation des deux clés étrangères.

```sql
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
  idSalarie    INT NOT NULL,
  FOREIGN KEY (idSalarie) REFERENCES Salarie(idSalarie)
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

**Exemple d'utilité de l'atomicité :** lors du dépôt d'une demande, on doit à la fois déduire le solde du salarié ET créer l'enregistrement de la demande. Si l'une des deux opérations échoue, la transaction est annulée (ROLLBACK) — on ne se retrouve jamais avec un solde débité sans demande créée.

```sql
BEGIN TRANSACTION;
  UPDATE Salarie SET soldeConges = soldeConges - 10 WHERE idSalarie = 42;
  INSERT INTO Demande (dateDebut, dateFin, statut, idSalarie)
  VALUES ('2026-07-01', '2026-07-10', 'VALIDEE', 42);
COMMIT; -- ou ROLLBACK si erreur
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
