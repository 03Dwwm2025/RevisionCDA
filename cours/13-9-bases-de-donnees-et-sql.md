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

-- Lecture avec jointure (nom du salarié + ses demandes)
SELECT s.nom, s.email, d.dateDebut, d.dateFin, d.statut
FROM Demande d
JOIN Salarie s ON s.idSalarie = d.idSalarie
WHERE d.statut = 'EN_ATTENTE'
ORDER BY d.dateDebut;

-- Insertion
INSERT INTO Demande (dateDebut, dateFin, statut, idSalarie)
VALUES ('2026-07-01', '2026-07-15', 'EN_ATTENTE', 42);

-- Mise à jour
UPDATE Demande
SET statut = 'VALIDEE'
WHERE idDemande = 7;

-- Suppression
DELETE FROM Demande WHERE idDemande = 7;
```

---

### 9.2 Les jointures

Les jointures relient des tables entre elles via leurs clés.

```sql
-- INNER JOIN : uniquement les lignes avec correspondance des deux côtés
SELECT s.nom, COUNT(d.idDemande) AS nbDemandes
FROM Salarie s
JOIN Demande d ON d.idSalarie = s.idSalarie
GROUP BY s.nom;

-- LEFT JOIN : tous les salariés, même ceux sans demande (NULL à droite)
SELECT s.nom, d.dateDebut
FROM Salarie s
LEFT JOIN Demande d ON d.idSalarie = s.idSalarie
ORDER BY s.nom;
-- → un salarié sans demande apparaît avec dateDebut = NULL
```

| Jointure | Résultat |
| --- | --- |
| `INNER JOIN` | Lignes avec correspondance dans les **deux** tables |
| `LEFT JOIN` | Toutes les lignes de **gauche** + correspondances à droite (NULL si absent) |
| `RIGHT JOIN` | Toutes les lignes de **droite** + correspondances à gauche |
| `FULL JOIN` | Toutes les lignes des deux tables |

---

### 9.3 Transactions et propriétés ACID

Une **transaction** regroupe plusieurs opérations en un bloc « tout ou rien ».

```sql
BEGIN TRANSACTION;

UPDATE Salarie SET soldeConges = soldeConges - 10 WHERE idSalarie = 42;
INSERT INTO Demande (dateDebut, dateFin, statut, idSalarie)
VALUES ('2026-07-01', '2026-07-10', 'VALIDEE', 42);

-- Si les deux réussissent
COMMIT;

-- Si une erreur survient
ROLLBACK; -- annule les deux opérations
```

**ACID** garantit la fiabilité des transactions :

| Lettre | Propriété | Signification |
| --- | --- | --- |
| **A** | Atomicité | Tout ou rien — pas de demi-transaction |
| **C** | Cohérence | La base passe d'un état valide à un autre |
| **I** | Isolation | Les transactions concurrentes ne s'interfèrent pas |
| **D** | Durabilité | Un COMMIT survit aux pannes (journal de transaction) |

---

### 9.4 Les index

Un index est une structure de données (B-tree) qui accélère les recherches sur les colonnes fréquemment filtrées ou jointes.

```sql
-- Index sur la clé étrangère (améliore les JOIN et WHERE)
CREATE INDEX IX_Demande_IdSalarie ON Demande(idSalarie);

-- Index sur le statut (filtres fréquents)
CREATE INDEX IX_Demande_Statut ON Demande(statut);
```

**Compromis :** chaque index accélère les lectures mais ralentit les écritures (l'index doit être mis à jour à chaque INSERT/UPDATE/DELETE). Indexer les colonnes utilisées dans `WHERE`, `JOIN` et `ORDER BY` — pas toutes les colonnes.

---

### 9.5 Les ORM — Entity Framework Core

Un **ORM** (*Object-Relational Mapping*) fait le pont entre les objets C# et les tables SQL. En .NET, c'est **Entity Framework Core** : on manipule des objets C#, EF génère le SQL paramétré.

```csharp
// Entité (classe C# qui correspond à la table Demande)
public class Demande
{
    public int    Id        { get; set; }
    public DateOnly DateDebut { get; set; }
    public DateOnly DateFin   { get; set; }
    public string  Statut    { get; set; } = "EN_ATTENTE";
    public int    IdSalarie  { get; set; }
    public Salarie? Salarie  { get; set; } // navigation property
}

// DbContext — représente la connexion et les tables
public class CongeAppDbContext : DbContext
{
    public DbSet<Demande>  Demandes  { get; set; }
    public DbSet<Salarie>  Salaries  { get; set; }
}
```

```csharp
// Requêtes EF Core — LINQ traduit en SQL paramétré
var demandes = await _db.Demandes
    .Include(d => d.Salarie)              // JOIN avec Salarie
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

**Migrations EF Core** — synchroniser le schéma de la base avec le code :

```bash
dotnet ef migrations add AjoutTableDemande
dotnet ef database update
```

---

> **🔒 Sécurité**
>
> - **Injection SQL** (OWASP A03) : ne **jamais** concaténer des valeurs utilisateur dans une requête SQL. Toujours des **requêtes paramétrées** (`cmd.Parameters.AddWithValue`) ou un ORM. `"WHERE nom = '" + saisie + "'"` est une faille critique.
> - **Moindre privilège** : le compte SQL applicatif n'a que `SELECT/INSERT/UPDATE/DELETE` sur ses tables — pas `DROP`, `CREATE`, ni droits d'administration.
> - **Secrets hors du code** : la chaîne de connexion (avec mot de passe) va dans une variable d'environnement ou un coffre-fort, jamais dans le code versionné.
> - **Mots de passe utilisateurs** stockés uniquement **hachés + salés** (Argon2 ou bcrypt) — jamais en clair, jamais chiffrés de façon réversible.
