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

### 9.3 Transactions et propriétés ACID

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

### 9.4 Les index

Un index est une structure qui **accélère les recherches** sur les colonnes fréquemment filtrées ou jointes.

```sql
CREATE INDEX IX_Demande_IdSalarie ON Demande(idSalarie);
CREATE INDEX IX_Demande_Statut    ON Demande(statut);
```

**Compromis :** un index accélère les lectures (`SELECT`) mais ralentit les écritures (`INSERT`/`UPDATE`/`DELETE`). À doser.

---

### 9.5 Les vues

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

### 9.6 Les procédures stockées

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

### 9.7 Les triggers (déclencheurs)

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

### 9.8 Les ORM — Entity Framework Core

Un **ORM** (*Object-Relational Mapping*) fait le pont entre les objets C# et les tables SQL.

```csharp
// EF Core traduit LINQ en SQL paramétré
var demandes = await _db.Demandes
    .Include(d => d.Salarie)
    .Where(d => d.Statut == "EN_ATTENTE")
    .OrderBy(d => d.DateDebut)
    .ToListAsync();

// INSERT
_db.Demandes.Add(nouvelleDemande);
await _db.SaveChangesAsync();

// UPDATE
demande.Statut = "VALIDEE";
await _db.SaveChangesAsync();
```

---

> **🔒 Sécurité**
>
> - **Injection SQL** (OWASP A03) : ne **jamais** concaténer des valeurs utilisateur dans une requête. Toujours des requêtes paramétrées ou un ORM.
> - **Moindre privilège** : le compte SQL applicatif n'a que `SELECT/INSERT/UPDATE/DELETE` — pas `DROP`, `CREATE` ou droits d'admin.
> - **Secrets hors du code** : la chaîne de connexion va dans une variable d'environnement, jamais dans le code versionné.
> - **Mots de passe** stockés uniquement **hachés + salés** (bcrypt, Argon2).
