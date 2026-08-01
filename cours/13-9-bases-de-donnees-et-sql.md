## 9. Bases de données et SQL

SQL (*Structured Query Language*) est le langage des bases de données relationnelles. Il se divise en sous-langages :

- **DDL** (*Data Definition*) : structure — `CREATE`, `ALTER`, `DROP`.
- **DML** (*Data Manipulation*) : données — `SELECT`, `INSERT`, `UPDATE`, `DELETE`.
- **DCL** (*Data Control*) : droits — `GRANT`, `REVOKE`.
- **TCL** (*Transaction Control*) : transactions — `BEGIN`, `COMMIT`, `ROLLBACK`.

### 9.1 Les requêtes DML essentielles

```sql
-- Lecture simple
SELECT idDemande, dateDebut, dateFin, statut
FROM Demande
WHERE statut = 'EN_ATTENTE'
ORDER BY dateDebut ASC;

-- Lecture avec jointure
SELECT s.nom, s.email, d.dateDebut, d.dateFin, d.statut
FROM Demande d
JOIN Salarie s ON s.idSalarie = d.idSalarie
WHERE d.statut = 'EN_ATTENTE'
ORDER BY d.dateDebut;

-- Insertion
INSERT INTO Demande (dateDebut, dateFin, statut, idSalarie)
VALUES ('2026-07-01', '2026-07-15', 'EN_ATTENTE', 42);

-- Mise à jour
UPDATE Demande SET statut = 'VALIDEE' WHERE idDemande = 7;

-- Suppression
DELETE FROM Demande WHERE idDemande = 7;
```

---

### 9.2 Les jointures

| Jointure | Résultat |
| --- | --- |
| `INNER JOIN` | Uniquement les lignes avec correspondance dans **les deux** tables |
| `LEFT JOIN` | Toutes les lignes de gauche + correspondances à droite (NULL si absent) |
| `RIGHT JOIN` | Toutes les lignes de droite + correspondances à gauche |

```sql
-- LEFT JOIN : tous les salariés, même ceux sans demande
SELECT s.nom, d.dateDebut
FROM Salarie s
LEFT JOIN Demande d ON d.idSalarie = s.idSalarie;
-- Un salarié sans demande apparaît avec dateDebut = NULL
```

---

**Les autres jointures :**

| Jointure | Résultat |
| --- | --- |
| `FULL OUTER JOIN` | Toutes les lignes des deux tables, avec `NULL` là où il n'y a pas de correspondance |
| `CROSS JOIN` | Le produit cartésien — chaque ligne de gauche avec chaque ligne de droite |
| Auto-jointure | Une table jointe avec elle-même, via deux alias |

```sql
-- Auto-jointure : afficher chaque salarié avec le nom de son manager
SELECT s.nom AS salarie, m.nom AS manager
FROM Salarie s
LEFT JOIN Salarie m ON m.idSalarie = s.idManager;
```

---

### 9.3 Agréger et regrouper

Les **fonctions d'agrégation** calculent une valeur unique à partir d'un ensemble de lignes.

| Fonction | Calcul |
| --- | --- |
| `COUNT(*)` | Nombre de lignes |
| `COUNT(col)` | Nombre de valeurs non-`NULL` dans la colonne |
| `SUM(col)` | Somme |
| `AVG(col)` | Moyenne |
| `MIN` / `MAX` | Plus petite / plus grande valeur |

```sql
-- Combien de demandes en attente, au total ?
SELECT COUNT(*) AS nbEnAttente
FROM Demande
WHERE statut = 'EN_ATTENTE';
```

**`GROUP BY` — un résultat par groupe :**

```sql
-- Nombre de demandes et total de jours posés, par salarié
SELECT s.nom,
       COUNT(*)          AS nbDemandes,
       SUM(d.nbJours)    AS totalJours
FROM Demande d
JOIN Salarie s ON s.idSalarie = d.idSalarie
GROUP BY s.idSalarie, s.nom
ORDER BY totalJours DESC;
```

**Règle à retenir :** toute colonne du `SELECT` qui n'est pas dans une fonction d'agrégation doit apparaître dans le `GROUP BY`. Sinon le SGBD ne sait pas quelle valeur choisir dans le groupe (et refuse la requête).

**`WHERE` vs `HAVING` — le piège classique :**

```sql
SELECT s.nom, COUNT(*) AS nbDemandes
FROM Demande d
JOIN Salarie s ON s.idSalarie = d.idSalarie
WHERE d.statut = 'VALIDEE'      -- ← filtre les LIGNES, avant le regroupement
GROUP BY s.idSalarie, s.nom
HAVING COUNT(*) > 3             -- ← filtre les GROUPES, après le regroupement
ORDER BY nbDemandes DESC;
```

| Clause | Filtre quoi | Peut utiliser une agrégation ? |
| --- | --- | --- |
| `WHERE` | Les lignes, **avant** le `GROUP BY` | Non |
| `HAVING` | Les groupes, **après** le `GROUP BY` | Oui |

**L'ordre d'exécution logique d'une requête** — différent de l'ordre d'écriture, et c'est ce qui explique le point précédent :

```
FROM → JOIN → WHERE → GROUP BY → HAVING → SELECT → ORDER BY → LIMIT
```

C'est pour cette raison qu'un alias défini dans le `SELECT` n'est pas utilisable dans le `WHERE` : au moment où le `WHERE` s'exécute, le `SELECT` n'a pas encore eu lieu.

---

### 9.4 Les sous-requêtes

Une **sous-requête** est une requête imbriquée dans une autre.

```sql
-- Sous-requête scalaire : les salariés au-dessus de la moyenne des soldes
SELECT nom, soldeConges
FROM Salarie
WHERE soldeConges > (SELECT AVG(soldeConges) FROM Salarie);

-- Sous-requête de liste avec IN
SELECT nom FROM Salarie
WHERE idSalarie IN (SELECT idSalarie FROM Demande WHERE statut = 'EN_ATTENTE');

-- Sous-requête corrélée avec EXISTS : dépend de la ligne courante
SELECT s.nom
FROM Salarie s
WHERE EXISTS (SELECT 1 FROM Demande d
              WHERE d.idSalarie = s.idSalarie AND d.statut = 'EN_ATTENTE');

-- Sous-requête dans le FROM (table dérivée)
SELECT nom, totalJours
FROM (SELECT idSalarie, SUM(nbJours) AS totalJours
      FROM Demande GROUP BY idSalarie) AS bilan
JOIN Salarie s ON s.idSalarie = bilan.idSalarie
WHERE totalJours > 20;
```

**`IN` ou `EXISTS` ?** `EXISTS` s'arrête à la première correspondance trouvée, ce qui le rend souvent préférable sur de gros volumes. `IN` reste plus lisible sur une petite liste de valeurs. Et attention : `NOT IN` renvoie un résultat vide si la sous-requête contient un seul `NULL` — `NOT EXISTS` n'a pas ce défaut.

**Sous-requête ou jointure ?** Une jointure est en général plus rapide et plus lisible pour ramener des colonnes des deux tables. La sous-requête s'impose quand on a besoin d'un calcul intermédiaire (une moyenne, un maximum) avant de filtrer.

---

### 9.5 Le DDL et les contraintes

Le **DDL** définit la structure. Au-delà du `CREATE TABLE` vu au chapitre Modélisation :

```sql
-- Ajouter une colonne à une table existante
ALTER TABLE Salarie ADD dateEmbauche DATE NULL;

-- Modifier le type d'une colonne
ALTER TABLE Salarie ALTER COLUMN nom NVARCHAR(80) NOT NULL;

-- Ajouter une contrainte nommée (le nom facilite le diagnostic d'erreur)
ALTER TABLE Demande
  ADD CONSTRAINT CK_Demande_Dates CHECK (dateFin >= dateDebut);

-- Supprimer une colonne, puis une table
ALTER TABLE Salarie DROP COLUMN dateEmbauche;
DROP TABLE LogDemande;
```

**Les cinq contraintes d'intégrité :**

| Contrainte | Garantit |
| --- | --- |
| `PRIMARY KEY` | Identifiant unique et non nul de la ligne |
| `FOREIGN KEY` | La valeur existe dans la table référencée (intégrité référentielle) |
| `UNIQUE` | Pas de doublon sur la colonne (un e-mail par salarié) |
| `NOT NULL` | La valeur est obligatoire |
| `CHECK` | Une règle métier exprimée en SQL (`soldeConges >= 0`) |

**Le comportement en cascade :**

```sql
CREATE TABLE Demande (
  idDemande INT PRIMARY KEY IDENTITY,
  idSalarie INT NOT NULL,
  FOREIGN KEY (idSalarie) REFERENCES Salarie(idSalarie)
    ON DELETE CASCADE      -- supprimer un salarié supprime ses demandes
    ON UPDATE NO ACTION
);
```

| Option | Effet à la suppression du parent |
| --- | --- |
| `NO ACTION` / `RESTRICT` | La suppression est refusée s'il reste des enfants (comportement par défaut) |
| `CASCADE` | Les enfants sont supprimés avec le parent |
| `SET NULL` | La clé étrangère des enfants passe à `NULL` (la colonne doit l'autoriser) |

`CASCADE` est pratique mais dangereux : une suppression anodine peut vider une partie de la base en chaîne. Pour des données à valeur légale ou comptable, on lui préfère la **suppression logique** — une colonne `dateSuppression` ou `actif`, et les lignes restent en base.

---

### 9.6 Le DCL — gérer les droits

Le **DCL** contrôle qui a le droit de faire quoi. C'est la traduction en base du principe du moindre privilège.

```sql
-- Le compte applicatif ne peut que lire et écrire les données
GRANT SELECT, INSERT, UPDATE, DELETE ON Demande TO app_congeapp;

-- Il n'a aucun droit de structure : pas de DROP, pas de CREATE
REVOKE ALTER ON Demande FROM app_congeapp;

-- Un compte de lecture seule pour les rapports
GRANT SELECT ON VueDemandesEnAttente TO app_reporting;
```

Un compte applicatif qui possède les droits d'administration transforme une injection SQL réussie en compromission totale de la base. Séparer les comptes limite les dégâts.

---

### 9.7 Transactions et propriétés ACID

Une **transaction** regroupe plusieurs opérations en un bloc « tout ou rien ». Voir le chapitre Modélisation des données pour le détail des propriétés ACID.

```sql
BEGIN TRANSACTION;
  UPDATE Salarie SET soldeConges = soldeConges - 10 WHERE idSalarie = 42;
  INSERT INTO Demande (dateDebut, dateFin, statut, idSalarie)
  VALUES ('2026-07-01', '2026-07-10', 'VALIDEE', 42);
COMMIT; -- valide les deux opérations
-- ou ROLLBACK; -- annule tout en cas d'erreur
```

---

### 9.8 Les index

Un index est une structure qui **accélère les recherches** sur les colonnes fréquemment filtrées ou jointes.

```sql
CREATE INDEX IX_Demande_IdSalarie ON Demande(idSalarie);
CREATE INDEX IX_Demande_Statut    ON Demande(statut);
```

**Compromis :** un index accélère les lectures (`SELECT`) mais ralentit les écritures (`INSERT`/`UPDATE`/`DELETE`). À doser.

---

### 9.9 Les vues

Une **vue** est une **requête stockée** que l'on peut interroger comme une table. Elle ne stocke pas de données — elle les calcule à chaque appel.

```sql
-- Créer une vue : demandes en attente avec le nom du salarié
CREATE VIEW VueDemandesEnAttente AS
SELECT d.idDemande, d.dateDebut, d.dateFin, s.nom, s.email
FROM Demande d
JOIN Salarie s ON s.idSalarie = d.idSalarie
WHERE d.statut = 'EN_ATTENTE';

-- Utiliser la vue comme une table
SELECT * FROM VueDemandesEnAttente ORDER BY dateDebut;

-- Supprimer une vue
DROP VIEW VueDemandesEnAttente;
```

**Utilité :**
- Simplifier des requêtes complexes (jointures répétitives)
- Restreindre l'accès aux données sensibles (on donne accès à la vue, pas à la table)
- Présenter des données déjà formatées/filtrées

---

### 9.10 Les procédures stockées

Une **procédure stockée** est un **bloc de code SQL** enregistré dans la base de données et exécutable à la demande. Elle peut accepter des paramètres et contenir de la logique (conditions, boucles).

```sql
-- Créer une procédure stockée
CREATE PROCEDURE ValiderDemande
    @idDemande INT,
    @idManager INT
AS
BEGIN
    -- Vérifier que la demande existe et est en attente
    IF NOT EXISTS (
        SELECT 1 FROM Demande
        WHERE idDemande = @idDemande AND statut = 'EN_ATTENTE'
    )
    BEGIN
        RAISERROR('Demande introuvable ou déjà traitée.', 16, 1);
        RETURN;
    END

    -- Mettre à jour le statut
    UPDATE Demande
    SET statut = 'VALIDEE'
    WHERE idDemande = @idDemande;

    PRINT 'Demande validée avec succès.';
END;

-- Exécuter la procédure
EXEC ValiderDemande @idDemande = 7, @idManager = 3;
```

**Avantages :** logique centralisée en base, performances (plan d'exécution mis en cache), sécurité (on donne le droit d'exécuter la procédure sans accès direct aux tables).

---

### 9.11 Les triggers (déclencheurs)

Un **trigger** est un bloc SQL qui s'exécute **automatiquement** en réaction à un événement sur une table (`INSERT`, `UPDATE`, `DELETE`).

```sql
-- Trigger : journaliser chaque changement de statut d'une demande
CREATE TRIGGER TR_Demande_LogStatut
ON Demande
AFTER UPDATE
AS
BEGIN
    -- Insérer dans une table de log si le statut a changé
    INSERT INTO LogDemande (idDemande, ancienStatut, nouveauStatut, dateModification)
    SELECT
        i.idDemande,
        d.statut,       -- ancien statut (table deleted = état avant UPDATE)
        i.statut,       -- nouveau statut (table inserted = état après UPDATE)
        GETDATE()
    FROM inserted i
    JOIN deleted d ON i.idDemande = d.idDemande
    WHERE i.statut <> d.statut;  -- uniquement si le statut a vraiment changé
END;
```

**Tables spéciales dans les triggers :**
- `inserted` : contient les nouvelles valeurs (après INSERT ou UPDATE)
- `deleted` : contient les anciennes valeurs (avant DELETE ou UPDATE)

**Cas d'utilisation :** audit des modifications, mise à jour automatique d'une colonne calculée, journalisation.

**⚠️ À utiliser avec modération** : les triggers sont invisibles dans le code applicatif, ce qui complique le débogage. Préférer la logique dans le Service quand c'est possible.

---

### 9.12 Les ORM

Un **ORM** (*Object-Relational Mapping*) fait le pont entre les objets du code et les tables de la base : il traduit les uns dans les autres, et génère le SQL.

```javascript
// L'ORM compose la requête, puis la traduit en SQL paramétré
const demandes = await db.demande.findMany({
  where:   { statut: 'EN_ATTENTE' },
  include: { salarie: true },       // jointure vers la table Salarie
  orderBy: { dateDebut: 'asc' },
});
// → SELECT ... FROM Demande d JOIN Salarie s ON ... WHERE d.statut = $1 ORDER BY ...

// Insertion
await db.demande.create({ data: { dateDebut, dateFin, statut: 'EN_ATTENTE', idSalarie } });

// Mise à jour
await db.demande.update({ where: { idDemande: 7 }, data: { statut: 'VALIDEE' } });
```

La syntaxe change d'un ORM à l'autre — Prisma ou Sequelize en JavaScript, Entity Framework en .NET, Hibernate en Java, Doctrine en PHP, SQLAlchemy en Python — mais le principe est identique : on décrit la requête avec des objets, l'ORM produit le SQL paramétré et fait la correspondance avec les classes du domaine.

---

### 9.13 Les bases NoSQL

Le référentiel CDA demande de savoir accéder aux données **SQL et NoSQL**. *NoSQL* signifie « *Not Only SQL* » : ce sont des bases qui abandonnent volontairement le modèle relationnel (tables, schéma fixe, jointures) pour gagner en souplesse de structure ou en montée en charge horizontale.

**Les quatre familles :**

| Famille | Modèle de données | Représentants | Cas d'usage typique |
| --- | --- | --- | --- |
| **Document** | Des documents JSON, structure libre | MongoDB, CouchDB | Catalogue produit, contenus hétérogènes |
| **Clé-valeur** | Une clé, une valeur | Redis, Memcached | Cache, session, file d'attente |
| **Colonnes** | Familles de colonnes, très gros volumes | Cassandra, HBase | Séries temporelles, journaux massifs |
| **Graphe** | Des nœuds et des relations | Neo4j | Réseau social, moteur de recommandation |

**Le vocabulaire, comparé au relationnel :**

| Relationnel | Document (MongoDB) |
| --- | --- |
| Table | Collection |
| Ligne | Document |
| Colonne | Champ |
| Jointure | Imbrication (ou référence + seconde requête) |
| Schéma imposé | Schéma libre, porté par l'application |

**La même donnée, des deux côtés :**

```sql
-- Relationnel : les données sont réparties dans deux tables normalisées
SELECT s.nom, d.dateDebut FROM Salarie s JOIN Demande d ON d.idSalarie = s.idSalarie;
```

```javascript
// Document : le salarié embarque ses demandes, une seule lecture suffit
{
  "_id": ObjectId("..."),
  "nom": "Dumont",
  "email": "a.dumont@ent.fr",
  "soldeConges": 25,
  "demandes": [
    { "dateDebut": "2026-07-01", "dateFin": "2026-07-15", "statut": "VALIDEE" },
    { "dateDebut": "2026-09-05", "dateFin": "2026-09-08", "statut": "EN_ATTENTE" }
  ]
}

// Les opérations de base
db.salaries.find({ "demandes.statut": "EN_ATTENTE" });
db.salaries.updateOne({ _id: id }, { $push: { demandes: nouvelleDemande } });
db.salaries.aggregate([
  { $unwind: "$demandes" },
  { $group: { _id: "$nom", total: { $sum: 1 } } }
]);
```

**ACID contre BASE :**

Là où le relationnel garantit ACID, beaucoup de bases NoSQL distribuées proposent le compromis **BASE** — *Basically Available, Soft state, Eventually consistent* : la donnée finit par être cohérente sur tous les nœuds, mais pas à l'instant de l'écriture. C'est acceptable pour un compteur de vues, pas pour un solde de congés.

Ce compromis vient du **théorème CAP** : un système distribué doit choisir deux propriétés sur trois entre **C**ohérence, **A**vailability (disponibilité) et **P**artition tolerance (tolérance au découpage réseau). Comme la tolérance aux pannes réseau est imposée dès qu'on distribue, le vrai choix se joue entre cohérence et disponibilité.

**Comment choisir :**

| Prendre du relationnel quand… | Prendre du NoSQL quand… |
| --- | --- |
| Les données sont fortement liées entre elles | Les documents sont autonomes, peu liés |
| Les transactions multi-tables sont critiques | La cohérence immédiate n'est pas vitale |
| Le schéma est stable et connu | La structure varie d'un enregistrement à l'autre |
| Le volume tient sur un serveur | Il faut répartir sur beaucoup de machines |

Pour CongeApp — des soldes, des transactions, des données très liées — le relationnel est le bon choix. Le NoSQL y aurait quand même sa place en **complément** : Redis pour stocker les sessions et mettre en cache le planning d'équipe. Les deux modèles cohabitent très bien dans une même application ; c'est ce qu'on appelle la **persistance polyglotte**.

> **Sécurité côté NoSQL :** l'injection existe aussi. Passer un objet JSON reçu du client directement dans un filtre MongoDB permet d'injecter des opérateurs (`{"$ne": null}` pour contourner une vérification de mot de passe). Le réflexe est le même qu'en SQL : valider et typer les entrées, ne pas construire une requête à partir d'un objet brut.

---

> **🔒 Sécurité**
>
> - **Injection SQL** (OWASP A03) : ne **jamais** concaténer des valeurs utilisateur dans une requête. Toujours des requêtes paramétrées ou un ORM.
> - **Moindre privilège** : le compte SQL applicatif n'a que `SELECT/INSERT/UPDATE/DELETE` — pas `DROP`, `CREATE` ou droits d'admin.
> - **Secrets hors du code** : la chaîne de connexion va dans une variable d'environnement, jamais dans le code versionné.
> - **Mots de passe** stockés uniquement **hachés + salés** (bcrypt, Argon2).
