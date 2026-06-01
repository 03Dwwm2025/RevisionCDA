## 9. Bases de données et SQL

SQL (*Structured Query Language*) est le langage des bases relationnelles. Il se divise en sous-langages :

- **DDL** (*Data Definition*) : structure — `CREATE`, `ALTER`, `DROP`.
- **DML** (*Data Manipulation*) : données — `SELECT`, `INSERT`, `UPDATE`, `DELETE`.
- **DCL** (*Data Control*) : droits — `GRANT`, `REVOKE`.

```
-- Lecture avec jointure
SELECT s.nom, d.dateDebut, d.statut
FROM Demande d
JOIN Salarie s ON s.idSalarie = d.idSalarie
WHERE d.statut = 'EN_ATTENTE'
ORDER BY d.dateDebut;

-- Écriture
INSERT INTO Demande (dateDebut, dateFin, statut, idSalarie)
VALUES ('2026-07-01', '2026-07-15', 'EN_ATTENTE', 42);

UPDATE Demande SET statut = 'VALIDEE' WHERE idDemande = 7;
DELETE FROM Demande WHERE idDemande = 7;
```

### 9.1 Jointures, transactions, index

**Jointures :** `INNER JOIN` (intersection), `LEFT JOIN` (toutes les lignes de gauche, même sans correspondance), etc. Elles relient les tables via les clés étrangères.

**Transactions (ACID) :** un ensemble d'opérations « tout ou rien ». ACID = **A**tomicité, **C**ohérence, **I**solation, **D**urabilité. Ex : débiter le solde **et** créer la demande, ou rien.

**Index :** structure accélérant les recherches (sur les colonnes filtrées/jointes). Trop d'index ralentit les écritures : à doser.

### 9.2 Les ORM

Un **ORM** (*Object-Relational Mapping*) fait le pont entre objets et tables, évitant d'écrire le SQL à la main. En .NET, c'est **Entity Framework Core** : on manipule des objets C#, EF génère le SQL paramétré.

```
// Entity Framework Core
var demandes = await _db.Demandes
    .Where(d => d.IdSalarie == idSalarie && d.Statut == "EN_ATTENTE")
    .OrderBy(d => d.DateDebut)
    .ToListAsync();
```

> **🔒 Sécurité**
>
> La base de données est une cible privilégiée. Points critiques :
> - **Injection SQL** : la faille n°1 historique. Toujours des **requêtes paramétrées** ou un ORM. Jamais `"... WHERE nom = '" + saisie + "'"`.
> - **Moindre privilège** : le compte applicatif n'a que SELECT/INSERT/UPDATE/DELETE sur ses tables — pas de droits d'administration.
> - **Secrets hors du code** : la chaîne de connexion (avec le mot de passe) va dans une variable d'environnement ou un coffre, jamais en dur dans le code versionné.
> - **Chiffrement** des données sensibles et des **sauvegardes**, transit chiffré (TLS) entre l'app et la base.
> - **Mots de passe utilisateurs** stockés uniquement **hachés + salés** (Argon2/bcrypt).
