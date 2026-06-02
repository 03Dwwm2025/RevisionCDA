import type { Question } from '../../types/quiz';

export const questionsBddSql: Question[] = [
  // --- DDL / DML / DCL ---
  {
    id: 'bdd-001',
    theme: 'bdd-sql',
    type: 'association',
    difficulte: 1,
    enonce: 'Associez chaque sous-langage SQL à ses instructions caractéristiques.',
    paires: [
      { gauche: 'DDL (Data Definition)', droite: 'CREATE, ALTER, DROP' },
      { gauche: 'DML (Data Manipulation)', droite: 'SELECT, INSERT, UPDATE, DELETE' },
      { gauche: 'DCL (Data Control)', droite: 'GRANT, REVOKE' },
      { gauche: 'TCL (Transaction Control)', droite: 'BEGIN, COMMIT, ROLLBACK' },
    ],
    explication:
      'DDL structure la base, DML manipule les données, DCL gère les droits, TCL contrôle les transactions. L\'essentiel du quotidien est DML ; DDL est géré via migrations (EF Core, Flyway…).',
  },
  {
    id: 'bdd-002',
    theme: 'bdd-sql',
    type: 'qcm',
    difficulte: 1,
    enonce: 'Quelle est la différence entre `INNER JOIN` et `LEFT JOIN` ?',
    options: [
      '`INNER JOIN` retourne toutes les lignes de la table gauche, même sans correspondance ; `LEFT JOIN` ne retourne que les correspondances',
      '`INNER JOIN` retourne uniquement les lignes qui ont une correspondance dans les deux tables ; `LEFT JOIN` retourne toutes les lignes de gauche, avec NULL à droite si pas de correspondance',
      'Les deux sont identiques, seul l\'ordre des tables change le résultat',
      '`LEFT JOIN` est plus rapide car il scanne une seule table',
    ],
    bonneReponse: 1,
    explication:
      'INNER JOIN = intersection (les deux côtés ont une valeur). LEFT JOIN = toutes les lignes de gauche + les correspondances à droite (NULL si absent). Cas d\'usage typique : lister tous les salariés même ceux sans demande de congé → LEFT JOIN.',
  },
  {
    id: 'bdd-003',
    theme: 'bdd-sql',
    type: 'completer_code',
    difficulte: 2,
    enonce: 'Complétez cette requête SQL qui liste les demandes en attente avec le nom du salarié.',
    codeAvecTrous: `SELECT s.nom, d.dateDebut, d.statut
FROM Demande d
___1___ Salarie s ___2___ s.idSalarie = d.idSalarie
WHERE d.statut = ___3___
ORDER BY d.dateDebut;`,
    choix: ['JOIN', 'LEFT JOIN', 'ON', 'WHERE', 'AND', "'EN_ATTENTE'", '"EN_ATTENTE"', 'EN_ATTENTE'],
    bonnesReponses: ['JOIN', 'ON', "'EN_ATTENTE'"],
    explication:
      '`JOIN` (= INNER JOIN) car on veut seulement les demandes liées à un salarié existant. `ON` relie les clés étrangères. La valeur de statut est une chaîne entourée de guillemets simples (norme SQL).',
  },
  {
    id: 'bdd-004',
    theme: 'bdd-sql',
    type: 'association',
    difficulte: 1,
    enonce: 'Associez chaque lettre d\'ACID à sa signification.',
    paires: [
      { gauche: 'A — Atomicité', droite: 'Tout ou rien : toutes les opérations réussissent ou aucune' },
      { gauche: 'C — Cohérence', droite: 'La base passe d\'un état valide à un autre état valide' },
      { gauche: 'I — Isolation', droite: 'Les transactions concurrentes ne s\'interfèrent pas' },
      { gauche: 'D — Durabilité', droite: 'Une transaction validée (COMMIT) survit aux pannes' },
    ],
    explication:
      'ACID garantit la fiabilité des transactions. L\'atomicité est la plus connue : débiter ET créditer, ou rien. Sans isolation, deux transactions simultanées pourraient lire des données incohérentes. La durabilité s\'appuie sur les journaux de transaction (WAL).',
  },
  {
    id: 'bdd-005',
    theme: 'bdd-sql',
    type: 'vrai_faux',
    difficulte: 1,
    enonce: 'L\'injection SQL peut être évitée en utilisant des **requêtes paramétrées** (ou un ORM) plutôt qu\'en concaténant les valeurs dans la chaîne SQL.',
    bonneReponse: true,
    explication:
      'Les paramètres (`@id`, `?`) sont toujours traités comme des valeurs, jamais comme du code SQL. `"WHERE nom = \'" + saisie + "\'"` est vulnérable ; `cmd.Parameters.AddWithValue("@nom", saisie)` est sûr. Un ORM comme EF Core paramètre automatiquement.',
  },
  {
    id: 'bdd-006',
    theme: 'bdd-sql',
    type: 'qcm',
    difficulte: 2,
    enonce: 'Qu\'est-ce qu\'un **index** dans une base de données relationnelle ?',
    options: [
      'Une copie de la table triée pour accélérer les lectures sur les colonnes indexées',
      'Une contrainte qui empêche les doublons sur une colonne',
      'Un journal des modifications pour les transactions ACID',
      'Une clé étrangère qui pointe vers une autre table',
    ],
    bonneReponse: 0,
    explication:
      'Un index est une structure (souvent un B-tree) qui accélère les recherches (`WHERE`, `JOIN`, `ORDER BY`) sur les colonnes indexées. Contre-partie : chaque `INSERT/UPDATE/DELETE` doit aussi mettre à jour l\'index → trop d\'index ralentit les écritures.',
  },
  {
    id: 'bdd-007',
    theme: 'bdd-sql',
    type: 'remettre_ordre',
    difficulte: 2,
    enonce: 'Remettez dans l\'ordre les étapes de la modélisation de données (de la plus abstraite à la plus concrète).',
    elements: [
      'Dictionnaire de données (inventaire des informations)',
      'MCD — Modèle Conceptuel de Données (entités et associations)',
      'MLD — Modèle Logique de Données (tables et clés, indépendant du SGBD)',
      'MPD — Modèle Physique de Données (schéma SQL prêt à créer)',
    ],
    explication:
      'Dictionnaire → MCD → MLD → MPD : on part du métier (indépendant de toute technologie) pour arriver au SQL concret. Chaque étape applique des règles de passage : entités → tables, associations → clés étrangères ou tables de liaison.',
  },
  {
    id: 'bdd-008',
    theme: 'bdd-sql',
    type: 'qcm',
    difficulte: 2,
    enonce: 'Dans un MCD, une association avec les cardinalités **(0,n) — (1,1)** entre Salarié et Demande signifie :',
    options: [
      'Un salarié peut avoir de 0 à plusieurs demandes ; chaque demande appartient à exactement 1 salarié',
      'Une demande peut avoir de 0 à plusieurs salariés ; chaque salarié est lié à exactement 1 demande',
      'Les deux entités ont chacune une seule occurrence possible',
      'C\'est une relation many-to-many qui génère une table de liaison',
    ],
    bonneReponse: 0,
    explication:
      'La cardinalité se lit depuis chaque entité vers l\'association. Côté Salarié : (0,n) → un salarié peut n\'avoir aucune demande ou en avoir plusieurs. Côté Demande : (1,1) → une demande appartient à exactement 1 salarié. Règle MPD : la clé étrangère `idSalarie` va dans la table `Demande`.',
  },
  {
    id: 'bdd-009',
    theme: 'bdd-sql',
    type: 'association',
    difficulte: 2,
    enonce: 'Associez chaque forme normale à la propriété qu\'elle garantit.',
    paires: [
      { gauche: '1NF', droite: 'Chaque champ est atomique (indivisible) ; pas de groupes répétés' },
      { gauche: '2NF', droite: 'Pas de dépendance partielle : chaque attribut non-clé dépend de toute la clé' },
      { gauche: '3NF', droite: 'Pas de dépendance transitive entre attributs non-clés' },
      { gauche: 'BCNF', droite: 'Forme renforcée de 3NF : tout déterminant est une clé candidate' },
    ],
    explication:
      '1NF → 2NF → 3NF : chaque forme inclut les précédentes. En pratique le CDA attend la 3NF. Exemple 3NF : si on stocke `codePostal` et `ville` dans `Salarie`, `ville` dépend de `codePostal` (transitif) → on extrait `Commune(codePostal, ville)`.',
  },
  {
    id: 'bdd-010',
    theme: 'bdd-sql',
    type: 'qcm',
    difficulte: 2,
    enonce: `En Entity Framework Core, que fait ce code ?\n\n\`\`\`csharp\nvar demandes = await _db.Demandes\n    .Where(d => d.IdSalarie == id && d.Statut == "EN_ATTENTE")\n    .OrderBy(d => d.DateDebut)\n    .ToListAsync();\n\`\`\``,
    options: [
      'Charge toutes les demandes en mémoire puis filtre en C#',
      'Génère une requête SQL paramétrée `SELECT … WHERE … ORDER BY` exécutée côté base',
      'Lève une exception si aucune demande n\'est trouvée',
      'Exécute plusieurs requêtes SQL (une par condition)',
    ],
    bonneReponse: 1,
    explication:
      'EF Core traduit LINQ en SQL paramétré à l\'exécution : `SELECT … FROM Demande WHERE IdSalarie = @p0 AND Statut = @p1 ORDER BY DateDebut`. Le filtre et le tri se font **en base**, pas en mémoire. `ToListAsync()` déclenche l\'exécution.',
  },
  {
    id: 'bdd-011',
    theme: 'bdd-sql',
    type: 'completer_code',
    difficulte: 3,
    enonce: 'Complétez ce script SQL de création de la table `Demande` avec les contraintes correctes.',
    codeAvecTrous: `CREATE TABLE Demande (
  idDemande  INT ___1___ IDENTITY,
  dateDebut  DATE NOT NULL,
  dateFin    DATE NOT NULL,
  statut     NVARCHAR(20) NOT NULL ___2___ 'EN_ATTENTE',
  idSalarie  INT NOT NULL,
  ___3___ (idSalarie) REFERENCES Salarie(idSalarie)
);`,
    choix: ['PRIMARY KEY', 'UNIQUE', 'NOT NULL', 'DEFAULT', 'CHECK', 'FOREIGN KEY', 'INDEX', 'REFERENCES'],
    bonnesReponses: ['PRIMARY KEY', 'DEFAULT', 'FOREIGN KEY'],
    explication:
      '`PRIMARY KEY` identifie chaque ligne de façon unique (+ IDENTITY pour l\'auto-incrément). `DEFAULT \'EN_ATTENTE\'` donne une valeur par défaut au statut. `FOREIGN KEY` crée le lien vers la table `Salarie` et garantit l\'intégrité référentielle.',
  },
  {
    id: 'bdd-012',
    theme: 'bdd-sql',
    type: 'vrai_faux',
    difficulte: 3,
    enonce: 'Dans une relation many-to-many (ex. Étudiant ↔ Formation), le MCD génère une **table de liaison** dans le MPD dont la clé primaire est la concaténation des deux clés étrangères.',
    bonneReponse: true,
    explication:
      'Ex : `Inscription(idEtudiant, idFormation, dateInscription)` avec `PK = (idEtudiant, idFormation)`. Les attributs portés par l\'association (ex. `dateInscription`) deviennent des colonnes de cette table. On peut aussi ajouter un identifiant technique si la PK composite est trop lourde.',
  },

  // --- Vues, procédures stockées, triggers ---
  {
    id: 'bdd-013',
    theme: 'bdd-sql',
    type: 'qcm',
    difficulte: 2,
    enonce: 'Qu\'est-ce qu\'une **vue** SQL ?',
    options: [
      'Une copie physique d\'une table, mise à jour automatiquement',
      'Une requête SELECT stockée et interrogeable comme une table, sans dupliquer les données',
      'Un index spécial qui accélère les jointures',
      'Un synonyme pour une procédure stockée sans paramètres',
    ],
    bonneReponse: 1,
    explication:
      'Une vue est une requête mémorisée — elle ne stocke pas de données. À chaque appel, elle recalcule le résultat. Utilité : simplifier des jointures complexes répétitives, restreindre l\'accès (on donne accès à la vue, pas à la table), présenter des données pré-filtrées.',
  },
  {
    id: 'bdd-014',
    theme: 'bdd-sql',
    type: 'completer_code',
    difficulte: 2,
    enonce: 'Complétez cette vue SQL qui liste les demandes en attente avec le nom du salarié.',
    codeAvecTrous: `___1___ VIEW VueDemandesEnAttente ___2___
SELECT d.idDemande, d.dateDebut, d.dateFin, s.nom
FROM Demande d
JOIN Salarie s ON s.idSalarie = d.idSalarie
WHERE d.statut = 'EN_ATTENTE';

-- Utilisation
___3___ * FROM VueDemandesEnAttente ORDER BY dateDebut;`,
    choix: ['CREATE', 'ALTER', 'DROP', 'AS', 'IS', 'WITH', 'SELECT', 'QUERY', 'GET'],
    bonnesReponses: ['CREATE', 'AS', 'SELECT'],
    explication:
      '`CREATE VIEW nom AS` définit la vue. `AS` introduit la requête de définition. La vue s\'utilise ensuite exactement comme une table avec `SELECT`. Pour la mettre à jour : `ALTER VIEW` ou `CREATE OR REPLACE VIEW`.',
  },
  {
    id: 'bdd-015',
    theme: 'bdd-sql',
    type: 'qcm',
    difficulte: 2,
    enonce: 'Quelle est la principale différence entre une **procédure stockée** et une **vue** ?',
    options: [
      'Une vue peut accepter des paramètres, pas une procédure stockée',
      'Une procédure stockée peut contenir de la logique (IF, boucles, INSERT/UPDATE/DELETE) et accepter des paramètres ; une vue est uniquement un SELECT',
      'Les procédures stockées sont plus lentes car elles ne sont pas mises en cache',
      'Il n\'y a aucune différence, ce sont des synonymes',
    ],
    bonneReponse: 1,
    explication:
      'Une vue = SELECT mémorisé, lecture seule. Une procédure stockée = bloc de code SQL complet avec logique conditionnelle, paramètres entrants/sortants, possibilité d\'INSERT/UPDATE/DELETE. Elle se déclenche à la demande via `EXEC NomProcedure @param = valeur`.',
  },
  {
    id: 'bdd-016',
    theme: 'bdd-sql',
    type: 'vrai_faux',
    difficulte: 2,
    enonce: 'Un **trigger** se déclenche automatiquement lors d\'un événement sur une table (INSERT, UPDATE ou DELETE), sans qu\'on ait besoin de l\'appeler explicitement.',
    bonneReponse: true,
    explication:
      'C\'est la caractéristique fondamentale d\'un trigger : il est invisible dans le code applicatif et s\'exécute automatiquement. Cas d\'usage : journaliser les modifications, maintenir une colonne calculée, enforcer des règles d\'intégrité complexes. À utiliser avec modération : rend le debugging difficile.',
  },
  {
    id: 'bdd-017',
    theme: 'bdd-sql',
    type: 'association',
    difficulte: 3,
    enonce: 'Associez chaque objet SQL à son rôle.',
    paires: [
      { gauche: 'Vue (VIEW)', droite: 'Requête SELECT mémorisée, interrogeable comme une table' },
      { gauche: 'Procédure stockée', droite: 'Bloc de code SQL paramétrable avec logique métier' },
      { gauche: 'Trigger', droite: 'Code déclenché automatiquement sur INSERT/UPDATE/DELETE' },
      { gauche: 'Index', droite: 'Structure accélérant les recherches sur une colonne' },
    ],
    explication:
      'Vue = simplification de lecture. Procédure = encapsulation de logique. Trigger = automatisation réactive. Index = optimisation des performances. Ces quatre objets sont les outils avancés du DBA au-delà des simples tables et requêtes.',
  },
];
