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
  // --- Agrégats et regroupement ---
  {
    id: 'bdd-018',
    theme: 'bdd-sql',
    type: 'qcm',
    difficulte: 2,
    enonce: 'Quelle est la différence entre `WHERE` et `HAVING` ?',
    options: [
      '`WHERE` filtre les lignes avant le regroupement, `HAVING` filtre les groupes après',
      '`HAVING` filtre les lignes, `WHERE` filtre les colonnes',
      'Ils sont équivalents, `HAVING` est simplement plus récent',
      '`WHERE` s’utilise sur les tables, `HAVING` sur les vues',
    ],
    bonneReponse: 0,
    explication:
      'Conséquence directe de l’ordre d’exécution FROM → WHERE → GROUP BY → HAVING → SELECT : au moment du WHERE, les groupes n’existent pas encore, donc on ne peut pas y utiliser COUNT() ou SUM(). Après le GROUP BY, HAVING peut filtrer sur une agrégation.',
  },
  {
    id: 'bdd-019',
    theme: 'bdd-sql',
    type: 'remettre_ordre',
    difficulte: 3,
    enonce: 'Remettez les clauses SQL dans leur ordre d’exécution logique (et non d’écriture).',
    elements: ['FROM', 'JOIN', 'WHERE', 'GROUP BY', 'HAVING', 'SELECT', 'ORDER BY', 'LIMIT'],
    explication:
      'Cet ordre explique deux comportements déroutants : un alias défini dans le SELECT n’est pas utilisable dans le WHERE (le SELECT n’a pas encore eu lieu), et une agrégation ne peut pas figurer dans le WHERE. En revanche l’alias est disponible dans le ORDER BY, qui s’exécute après le SELECT.',
  },
  {
    id: 'bdd-020',
    theme: 'bdd-sql',
    type: 'completer_code',
    difficulte: 2,
    enonce:
      'Complétez cette requête : le nombre de demandes validées par salarié, uniquement pour ceux qui en ont plus de trois.',
    codeAvecTrous: `SELECT s.nom, COUNT(*) AS nbDemandes
FROM Demande d
JOIN Salarie s ON s.idSalarie = d.idSalarie
___1___ d.statut = 'VALIDEE'
___2___ s.idSalarie, s.nom
___3___ COUNT(*) > 3
ORDER BY nbDemandes DESC;`,
    choix: ['WHERE', 'GROUP BY', 'HAVING', 'ORDER BY', 'PARTITION BY', 'FILTER'],
    bonnesReponses: ['WHERE', 'GROUP BY', 'HAVING'],
    explication:
      'Le filtre sur le statut porte sur les lignes : il va dans le WHERE, avant le regroupement. Le filtre sur le nombre porte sur les groupes : il va dans le HAVING, après. Mettre `statut = VALIDEE` dans le HAVING serait une erreur de performance, et souvent une erreur de syntaxe.',
  },
  {
    id: 'bdd-021',
    theme: 'bdd-sql',
    type: 'qcm',
    difficulte: 2,
    enonce: 'Quelle est la différence entre `COUNT(*)` et `COUNT(colonne)` ?',
    options: [
      '`COUNT(*)` compte toutes les lignes, `COUNT(colonne)` ignore les valeurs NULL',
      '`COUNT(*)` est plus lent mais plus précis',
      '`COUNT(colonne)` compte les valeurs distinctes',
      'Il n’y a aucune différence',
    ],
    bonneReponse: 0,
    explication:
      'C’est un piège classique : sur une table de 100 salariés dont 30 n’ont pas de manager, `COUNT(*)` renvoie 100 et `COUNT(idManager)` renvoie 70. Pour les valeurs distinctes, il faut `COUNT(DISTINCT colonne)`.',
  },
  {
    id: 'bdd-022',
    theme: 'bdd-sql',
    type: 'vrai_faux',
    difficulte: 2,
    enonce:
      'Dans une requête avec `GROUP BY`, toute colonne du `SELECT` qui n’est pas agrégée doit figurer dans le `GROUP BY`.',
    bonneReponse: true,
    explication:
      'Sinon le SGBD ne sait pas quelle valeur choisir parmi celles du groupe et refuse la requête. C’est pour ça qu’on écrit `GROUP BY s.idSalarie, s.nom` et pas seulement `GROUP BY s.idSalarie` quand on affiche le nom.',
  },
  // --- Sous-requêtes ---
  {
    id: 'bdd-023',
    theme: 'bdd-sql',
    type: 'qcm',
    difficulte: 3,
    enonce: 'Pourquoi préférer `NOT EXISTS` à `NOT IN` sur une sous-requête ?',
    options: [
      'Parce que `NOT IN` renvoie un résultat vide si la sous-requête contient une seule valeur NULL',
      'Parce que `NOT IN` n’est pas standard SQL',
      'Parce que `NOT EXISTS` renvoie toujours plus de lignes',
      'Parce que `NOT IN` est interdit dans une clause WHERE',
    ],
    bonneReponse: 0,
    explication:
      'Avec `NOT IN (1, 2, NULL)`, la comparaison devient indéterminée pour chaque ligne et la requête ne renvoie rien — sans erreur, ce qui rend le bug difficile à trouver. `NOT EXISTS` n’a pas ce comportement. `EXISTS` s’arrête aussi à la première correspondance, ce qui est souvent plus rapide sur de gros volumes.',
  },
  {
    id: 'bdd-024',
    theme: 'bdd-sql',
    type: 'association',
    difficulte: 2,
    enonce: 'Associez chaque type de sous-requête à sa forme.',
    paires: [
      { gauche: 'Sous-requête scalaire', droite: 'Renvoie une seule valeur, comparable avec > ou =' },
      { gauche: 'Sous-requête de liste', droite: 'Renvoie une colonne de valeurs, utilisée avec IN' },
      { gauche: 'Sous-requête corrélée', droite: 'Dépend de la ligne courante de la requête externe' },
      { gauche: 'Table dérivée', droite: 'Placée dans le FROM et nommée par un alias' },
    ],
    explication:
      'La sous-requête corrélée est réévaluée pour chaque ligne externe, ce qui la rend coûteuse mais parfois indispensable. La table dérivée permet de calculer un résultat intermédiaire (une somme par salarié) puis de filtrer dessus.',
  },
  {
    id: 'bdd-025',
    theme: 'bdd-sql',
    type: 'qcm',
    difficulte: 2,
    enonce: 'Quand une jointure est-elle préférable à une sous-requête ?',
    options: [
      'Quand on veut ramener des colonnes des deux tables : c’est plus lisible et souvent plus rapide',
      'Toujours : les sous-requêtes sont dépréciées',
      'Quand la sous-requête renverrait plus de 100 lignes',
      'Quand on utilise un ORM',
    ],
    bonneReponse: 0,
    explication:
      'La jointure s’impose dès qu’on affiche des données des deux tables. La sous-requête reste utile quand on a besoin d’un calcul intermédiaire avant de filtrer (comparer à une moyenne, à un maximum), ou pour tester une existence sans ramener de colonnes.',
  },
  // --- DDL et contraintes ---
  {
    id: 'bdd-026',
    theme: 'bdd-sql',
    type: 'association',
    difficulte: 1,
    enonce: 'Associez chaque contrainte d’intégrité à ce qu’elle garantit.',
    paires: [
      { gauche: 'PRIMARY KEY', droite: 'Identifiant unique et non nul de la ligne' },
      { gauche: 'FOREIGN KEY', droite: 'La valeur existe bien dans la table référencée' },
      { gauche: 'UNIQUE', droite: 'Pas de doublon sur la colonne' },
      { gauche: 'CHECK', droite: 'Une règle métier exprimée en SQL' },
    ],
    explication:
      'Ces contraintes sont la première ligne de défense de l’intégrité des données : elles s’appliquent quelle que soit l’application qui écrit en base, y compris un script manuel. Les valider aussi côté application sert à donner un message clair à l’utilisateur.',
  },
  {
    id: 'bdd-027',
    theme: 'bdd-sql',
    type: 'qcm',
    difficulte: 2,
    enonce: 'Que fait `ON DELETE CASCADE` sur une clé étrangère ?',
    options: [
      'Supprimer une ligne parent supprime automatiquement toutes les lignes enfants qui la référencent',
      'Empêche de supprimer le parent tant qu’il a des enfants',
      'Met la clé étrangère des enfants à NULL',
      'Recopie les enfants dans une table d’archive avant suppression',
    ],
    bonneReponse: 0,
    explication:
      'Pratique mais dangereux : une suppression anodine peut vider une partie de la base en chaîne. Les alternatives sont NO ACTION (refuser la suppression, comportement par défaut) et SET NULL. Pour des données à valeur légale ou comptable, on préfère la suppression logique — une colonne `dateSuppression` et les lignes restent en base.',
  },
  {
    id: 'bdd-028',
    theme: 'bdd-sql',
    type: 'completer_code',
    difficulte: 2,
    enonce: 'Complétez ces instructions DDL sur une table existante.',
    codeAvecTrous: `-- Ajouter une colonne
___1___ TABLE Salarie ADD dateEmbauche DATE NULL;

-- Ajouter une règle métier nommée
ALTER TABLE Demande
  ADD ___2___ CK_Demande_Dates ___3___ (dateFin >= dateDebut);`,
    choix: ['ALTER', 'CREATE', 'UPDATE', 'CONSTRAINT', 'INDEX', 'CHECK', 'UNIQUE'],
    bonnesReponses: ['ALTER', 'CONSTRAINT', 'CHECK'],
    explication:
      'Nommer explicitement la contrainte (`CK_Demande_Dates`) rend le message d’erreur exploitable : sans nom, le SGBD en génère un aléatoire et le diagnostic devient pénible. La convention courante est un préfixe par type : PK_, FK_, UQ_, CK_, IX_.',
  },
  {
    id: 'bdd-029',
    theme: 'bdd-sql',
    type: 'association',
    difficulte: 2,
    enonce: 'Associez chaque sous-langage SQL à son rôle.',
    paires: [
      { gauche: 'DDL', droite: 'Définir la structure : CREATE, ALTER, DROP' },
      { gauche: 'DML', droite: 'Manipuler les données : SELECT, INSERT, UPDATE, DELETE' },
      { gauche: 'DCL', droite: 'Gérer les droits : GRANT, REVOKE' },
      { gauche: 'TCL', droite: 'Piloter les transactions : BEGIN, COMMIT, ROLLBACK' },
    ],
    explication:
      'Le DCL est le plus souvent oublié, alors qu’il porte le principe du moindre privilège : un compte applicatif limité au DML transforme une injection SQL réussie en incident contenu plutôt qu’en compromission totale de la base.',
  },
  {
    id: 'bdd-030',
    theme: 'bdd-sql',
    type: 'qcm',
    difficulte: 2,
    enonce: 'Quels droits faut-il accorder au compte SQL utilisé par l’application en production ?',
    options: [
      'SELECT, INSERT, UPDATE, DELETE sur les tables nécessaires, et rien de plus',
      'Tous les droits, pour éviter les erreurs en production',
      'Uniquement SELECT, l’écriture passant par un autre canal',
      'Les droits d’administration, mais avec un mot de passe long',
    ],
    bonneReponse: 0,
    explication:
      'C’est le principe du moindre privilège. Sans droit DROP ni ALTER, une injection SQL réussie ne peut pas détruire la structure de la base. Un compte de lecture seule distinct pour les rapports va encore plus loin dans la séparation.',
  },
  // --- NoSQL ---
  {
    id: 'bdd-031',
    theme: 'bdd-sql',
    type: 'association',
    difficulte: 2,
    enonce: 'Associez chaque famille NoSQL à son usage typique.',
    paires: [
      { gauche: 'Document (MongoDB)', droite: 'Contenus hétérogènes, structure variable d’un enregistrement à l’autre' },
      { gauche: 'Clé-valeur (Redis)', droite: 'Cache, sessions, file d’attente' },
      { gauche: 'Colonnes (Cassandra)', droite: 'Très gros volumes, séries temporelles et journaux' },
      { gauche: 'Graphe (Neo4j)', droite: 'Réseaux de relations, moteurs de recommandation' },
    ],
    explication:
      'NoSQL signifie « Not Only SQL » : ce sont des modèles qui abandonnent le relationnel pour gagner en souplesse ou en répartition sur plusieurs machines. Chaque famille répond à un problème différent — il n’y a pas un NoSQL, il y en a quatre.',
  },
  {
    id: 'bdd-032',
    theme: 'bdd-sql',
    type: 'association',
    difficulte: 1,
    enonce: 'Associez chaque terme du relationnel à son équivalent en base documentaire.',
    paires: [
      { gauche: 'Table', droite: 'Collection' },
      { gauche: 'Ligne', droite: 'Document' },
      { gauche: 'Colonne', droite: 'Champ' },
      { gauche: 'Jointure', droite: 'Imbrication du document enfant dans le parent' },
    ],
    explication:
      'La différence de fond est le schéma : imposé par la base en relationnel, porté par l’application en documentaire. Cette souplesse est un atout quand la structure varie, et un piège quand personne ne garantit plus la cohérence.',
  },
  {
    id: 'bdd-033',
    theme: 'bdd-sql',
    type: 'qcm',
    difficulte: 3,
    enonce: 'Que signifie le compromis BASE, opposé à ACID dans les bases distribuées ?',
    options: [
      'Basically Available, Soft state, Eventually consistent : la donnée finit par être cohérente sur tous les nœuds',
      'Backup And Secure Encryption : un modèle de chiffrement des sauvegardes',
      'Batch Access Storage Engine : un moteur de traitement par lots',
      'Un synonyme d’ACID utilisé par les bases NoSQL',
    ],
    bonneReponse: 0,
    explication:
      'La cohérence n’est pas garantie à l’instant de l’écriture, mais atteinte après un délai de propagation. C’est acceptable pour un compteur de vues, pas pour un solde de congés ou un virement bancaire — d’où le choix du relationnel sur les données transactionnelles.',
  },
  {
    id: 'bdd-034',
    theme: 'bdd-sql',
    type: 'qcm',
    difficulte: 3,
    enonce: 'Que dit le théorème CAP à propos d’un système distribué ?',
    options: [
      'Il faut choisir deux propriétés sur trois : cohérence, disponibilité, tolérance au partitionnement',
      'Un système distribué est toujours plus rapide qu’un système centralisé',
      'La cohérence et la disponibilité sont automatiquement garanties',
      'Le nombre de nœuds doit être impair',
    ],
    bonneReponse: 0,
    explication:
      'Comme la tolérance aux pannes réseau est imposée dès qu’on distribue les données, le vrai arbitrage se joue entre cohérence et disponibilité. Les bases ACID privilégient la cohérence, beaucoup de bases NoSQL privilégient la disponibilité.',
  },
  {
    id: 'bdd-035',
    theme: 'bdd-sql',
    type: 'qcm',
    difficulte: 2,
    enonce:
      'Pour une application de gestion des congés (soldes, transactions, données très liées), quel choix de stockage se justifie ?',
    options: [
      'Une base relationnelle pour le métier, éventuellement complétée par Redis pour les sessions et le cache',
      'Une base documentaire, plus moderne',
      'Une base graphe, car les salariés sont reliés entre eux',
      'Un fichier JSON sur le disque du serveur',
    ],
    bonneReponse: 0,
    explication:
      'Données fortement liées et transactions critiques : le relationnel est le bon choix. Rien n’empêche d’utiliser aussi un magasin clé-valeur pour ce qu’il fait mieux (sessions, cache). Faire cohabiter plusieurs modèles selon l’usage s’appelle la persistance polyglotte.',
  },
  {
    id: 'bdd-036',
    theme: 'bdd-sql',
    type: 'vrai_faux',
    difficulte: 3,
    enonce: 'Les bases NoSQL ne sont pas exposées aux injections.',
    bonneReponse: false,
    explication:
      'Passer un objet JSON reçu du client directement dans un filtre MongoDB permet d’injecter des opérateurs : un champ `motDePasse` valant `{"$ne": null}` contourne la vérification. Le réflexe est le même qu’en SQL : valider et typer les entrées, ne pas construire une requête à partir d’un objet brut.',
  },
  {
    id: 'bdd-037',
    theme: 'bdd-sql',
    type: 'association',
    difficulte: 2,
    enonce: 'Relationnel ou NoSQL : associez chaque situation au modèle le plus adapté.',
    paires: [
      { gauche: 'Transactions multi-tables critiques', droite: 'Relationnel' },
      { gauche: 'Documents autonomes à structure variable', droite: 'NoSQL documentaire' },
      { gauche: 'Cache de session à durée de vie courte', droite: 'NoSQL clé-valeur' },
      { gauche: 'Suggestions d’amis dans un réseau social', droite: 'NoSQL graphe' },
    ],
    explication:
      'Le critère de choix est la forme des données et la nature des accès, pas la mode. Une requête de recommandation qui exigerait sept jointures récursives en SQL s’écrit naturellement dans une base graphe.',
  },
  {
    id: 'bdd-038',
    theme: 'bdd-sql',
    type: 'vrai_faux',
    difficulte: 2,
    enonce: 'Dans une base documentaire, imbriquer les demandes dans le document du salarié évite une jointure.',
    bonneReponse: true,
    explication:
      'C’est l’intérêt principal du modèle documentaire : une seule lecture ramène le salarié et ses demandes. La contrepartie est la duplication — si une information imbriquée est partagée par plusieurs documents, sa mise à jour devient une opération sur tous les documents concernés.',
  },
];
