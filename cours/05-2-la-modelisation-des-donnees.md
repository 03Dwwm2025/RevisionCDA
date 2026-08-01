## 2. La modélisation des données

Les données sont le cœur d'une application de gestion. On les modélise par raffinements successifs : **dictionnaire de données → MCD → MLD → MPD**, du plus conceptuel au plus physique.

```
Dictionnaire  →    MCD     →  normalisation →    MLD     →    MPD
(inventaire)    (métier,        (1NF, 2NF,     (tables et    (SQL prêt
                pas de tech)      3NF)          clés, pas     à créer)
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

### 2.3 La normalisation — 1NF, 2NF, 3NF

Normaliser, c'est organiser les tables pour **supprimer la redondance** et les anomalies qu'elle entraîne. Une base non normalisée stocke la même information à plusieurs endroits : à la première mise à jour partielle, les copies divergent et on ne sait plus laquelle croire.

**Les trois anomalies d'une table non normalisée :**

| Anomalie | Ce qui se passe |
| --- | --- |
| **Insertion** | Impossible d'enregistrer un service tant qu'aucun salarié n'y est rattaché |
| **Mise à jour** | Renommer un service oblige à modifier toutes les lignes qui le mentionnent — en oublier une crée une incohérence |
| **Suppression** | Supprimer le dernier salarié d'un service fait disparaître le service lui-même |

**Le point de départ — une table dénormalisée :**

```
DemandeBrute
+-----------+----------+---------------------+--------------+------------+---------+
| idDemande | nomSala  | emailSalarie        | nomService   | dateDebut  | nbJours |
+-----------+----------+---------------------+--------------+------------+---------+
| 1         | Dumont   | a.dumont@ent.fr     | Comptabilité | 2026-07-01 | 10      |
| 2         | Dumont   | a.dumont@ent.fr     | Comptabilité | 2026-09-05 | 3       |
| 3         | Nadir    | s.nadir@ent.fr      | Comptabilité | 2026-07-01 | 5       |
+-----------+----------+---------------------+--------------+------------+---------+
```

Le nom, l'e-mail et le service de Dumont sont répétés à chaque demande. On déroule les trois formes normales dessus.

---

**1NF — Première forme normale : des valeurs atomiques**

Une table est en 1NF si **chaque cellule contient une seule valeur** (pas de liste), s'il n'y a pas de groupe de colonnes répétitives, et si la table possède une clé primaire.

```
❌ Viole la 1NF — plusieurs valeurs dans une cellule
| idSalarie | nom    | competences              |
| 1         | Dumont | "SQL, C#, Docker"        |

❌ Viole la 1NF — colonnes répétitives
| idSalarie | nom    | competence1 | competence2 | competence3 |

✅ Respecte la 1NF — une ligne par valeur
SalarieCompetence
| idSalarie | competence |
| 1         | SQL        |
| 1         | C#         |
| 1         | Docker     |
```

Pourquoi ça compte : avec une liste dans une cellule, on ne peut ni filtrer (`WHERE competence = 'SQL'` échoue), ni indexer, ni compter proprement.

---

**2NF — Deuxième forme normale : dépendance de la clé ENTIÈRE**

Une table est en 2NF si elle est en 1NF **et** si chaque colonne non-clé dépend de **toute** la clé primaire, pas seulement d'une partie. Cette forme ne concerne que les tables à **clé primaire composite** — avec une clé simple, la 2NF est acquise d'office.

```
❌ Viole la 2NF
SalarieCompetence (#idSalarie, #idCompetence, niveau, nomSalarie)
                    └────── clé composite ──────┘   ↑        ↑
                                          dépend des deux   dépend
                                                        d'idSalarie SEUL
```

`nomSalarie` ne dépend que d'`idSalarie` : c'est une **dépendance partielle**. Résultat, le nom est répété sur chaque compétence du salarié.

```
✅ Respecte la 2NF
SalarieCompetence (#idSalarie, #idCompetence, niveau)
Salarie           (idSalarie, nomSalarie, email)
```

---

**3NF — Troisième forme normale : pas de dépendance transitive**

Une table est en 3NF si elle est en 2NF **et** si aucune colonne non-clé ne dépend d'une autre colonne non-clé.

```
❌ Viole la 3NF
Salarie (idSalarie, nom, email, idService, nomService, etageService)
                                    ↑          └──────────┬────────┘
                                    └── nomService et etageService dépendent
                                        d'idService, PAS d'idSalarie
```

`idSalarie → idService → nomService` : c'est une **dépendance transitive**. Conséquence directe, renommer un service oblige à modifier toutes les lignes de salariés de ce service.

```
✅ Respecte la 3NF
Salarie (idSalarie, nom, email, #idService)
Service (idService, nomService, etageService)
```

---

**La formule pour retenir les trois :**

> *« Toute colonne dépend de **la clé** (1NF), de **la clé entière** (2NF), et de **rien que la clé** (3NF). »*

**Notre exemple, une fois normalisé :**

```
Service (idService, nomService)
Salarie (idSalarie, nom, email, soldeConges, #idService)
Demande (idDemande, dateDebut, dateFin, nbJours, statut, #idSalarie)
```

C'est exactement le MLD obtenu en appliquant les règles de passage du MCD. Un MCD bien construit produit naturellement un modèle en 3NF — la normalisation sert à **vérifier** son modèle, et à rattraper un schéma existant mal conçu.

**Et la dénormalisation ?**

Dénormaliser, c'est réintroduire volontairement de la redondance pour accélérer les lectures (par exemple stocker `nbDemandesEnAttente` sur le salarié plutôt que de le recompter à chaque affichage). C'est un compromis assumé : on gagne en vitesse de lecture, on paie en complexité de mise à jour. On dénormalise après avoir mesuré un vrai problème de performance, pas par défaut.

---

### 2.4 Le MLD — Modèle Logique de Données

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

### 2.5 Le MPD — Modèle Physique de Données

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

### 2.6 Les propriétés ACID d'une base de données

Une base de données fiable garantit les quatre propriétés **ACID** pour ses transactions :

| Lettre | Propriété | Signification |
| --- | --- | --- |
| **A** | **Atomicité** | Une transaction est « tout ou rien » : soit toutes les opérations réussissent, soit aucune n'est appliquée |
| **C** | **Cohérence** | La base passe toujours d'un état valide à un autre état valide — les contraintes sont respectées |
| **I** | **Isolation** | Deux transactions simultanées ne se perturbent pas : chacune se déroule comme si elle était seule sur la base |
| **D** | **Durabilité** | Une transaction validée (COMMIT) est définitivement enregistrée, même en cas de panne système |

> **Attention au piège :** le **I** d'ACID, c'est **Isolation**, pas « Intégrité ». L'intégrité est une propriété du modèle de données (les contraintes `NOT NULL`, `UNIQUE`, `FOREIGN KEY`, `CHECK`) ; l'isolation est une propriété des **transactions concurrentes**. Source : Härder & Reuter, *Principles of Transaction-Oriented Database Recovery* (1983), l'article qui a nommé ACID.

**Exemple d'utilité de l'isolation :** deux managers valident la même demande au même instant. Sans isolation, les deux transactions lisent le statut `EN_ATTENTE` avant que l'autre n'ait écrit, et le solde est débité deux fois. Le SGBD sérialise les accès pour l'empêcher.

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

### 2.7 Les autres propriétés d'une bonne base de données

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
