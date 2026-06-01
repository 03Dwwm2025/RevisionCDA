import type { Question } from '../../types/quiz';

export const questionsConception: Question[] = [
  // --- Analyse des besoins ---
  {
    id: 'concep-001',
    theme: 'conception',
    type: 'qcm',
    difficulte: 1,
    enonce: 'Quelle est la structure d\'une **user story** en méthode agile ?',
    options: [
      '`Fonctionnalité : <action> → Résultat : <effet>`',
      '`En tant que <rôle>, je veux <action> afin de <bénéfice>`',
      '`Si <condition> alors <action>, sinon <alternative>`',
      '`Acteur : <rôle> — Cas d\'utilisation : <action>`',
    ],
    bonneReponse: 1,
    explication:
      'Le gabarit "En tant que / Je veux / Afin de" centre le besoin sur la valeur apportée à l\'utilisateur, pas sur la technique. Chaque story s\'accompagne de critères d\'acceptation qui définissent quand la story est "terminée".',
  },
  {
    id: 'concep-002',
    theme: 'conception',
    type: 'association',
    difficulte: 1,
    enonce: 'Associez chaque catégorie MoSCoW à sa signification.',
    paires: [
      { gauche: 'Must have', droite: 'Indispensable : sans ça, le produit n\'a pas de sens' },
      { gauche: 'Should have', droite: 'Important mais contournable temporairement' },
      { gauche: 'Could have', droite: 'Confort, si le temps le permet' },
      { gauche: 'Won\'t have', droite: 'Hors périmètre pour cette version' },
    ],
    explication:
      'MoSCoW aide à prioriser les fonctionnalités avec le client. "Must have" = MVP (Minimum Viable Product). "Won\'t have" ne veut pas dire jamais : ça peut revenir en backlog d\'une prochaine version. La priorisation est négociée avec le client/PO.',
  },
  {
    id: 'concep-003',
    theme: 'conception',
    type: 'vrai_faux',
    difficulte: 1,
    enonce: 'Un besoin **non-fonctionnel** décrit ce que le système doit faire (ex. "déposer une demande de congé").',
    bonneReponse: false,
    explication:
      '"Déposer une demande" est un besoin **fonctionnel**. Les besoins non-fonctionnels décrivent des contraintes de qualité : performance (< 2s de réponse), disponibilité (99,9 %), sécurité, accessibilité, compatibilité navigateurs. Ils ne font pas partie d\'une user story mais d\'un cahier des charges technique.',
  },
  // --- Modélisation données ---
  {
    id: 'concep-004',
    theme: 'conception',
    type: 'remettre_ordre',
    difficulte: 2,
    enonce: 'Remettez dans l\'ordre les étapes de la modélisation de données (de la plus abstraite à la plus physique).',
    elements: [
      'Dictionnaire de données',
      'MCD — Modèle Conceptuel de Données',
      'MLD — Modèle Logique de Données',
      'MPD — Modèle Physique de Données (schéma SQL)',
    ],
    explication:
      'Dictionnaire → MCD → MLD → MPD. Le MCD est la vision métier (entités, associations, cardinalités). Le MLD applique les règles de passage (associations → clés étrangères). Le MPD est le SQL prêt à exécuter dans le SGBD cible.',
  },
  {
    id: 'concep-005',
    theme: 'conception',
    type: 'qcm',
    difficulte: 2,
    enonce: 'Dans un MCD, une relation avec les cardinalités **(1,n) — (0,n)** entre Salarié et Compétence génère quoi dans le MPD ?',
    options: [
      'Une clé étrangère `idSalarie` dans la table `Competence`',
      'Une clé étrangère `idCompetence` dans la table `Salarie`',
      'Une table de liaison `Salarie_Competence` avec les deux clés comme PK composite',
      'Rien : les associations many-to-many ne se traduisent pas en SQL',
    ],
    bonneReponse: 2,
    explication:
      'Une relation many-to-many (n-to-n) génère une table de liaison dont la clé primaire est la concaténation des deux clés étrangères. Ex : `Salarie_Competence(idSalarie, idCompetence, niveauMaitrise)`. Les attributs portés par l\'association deviennent des colonnes de cette table.',
  },
  {
    id: 'concep-006',
    theme: 'conception',
    type: 'qcm',
    difficulte: 1,
    enonce: 'Quelle propriété garantit qu\'une donnée est **atomique** au sens de la 1NF (première forme normale) ?',
    options: [
      'La donnée a une valeur par défaut',
      'La donnée est indivisible : elle ne contient pas une liste ou un groupe de valeurs',
      'La donnée est unique dans toute la table',
      'La donnée référence une clé étrangère',
    ],
    bonneReponse: 1,
    explication:
      'Exemple de violation 1NF : stocker `telephones = "06.12.34.56.78, 07.98.76.54.32"` dans une colonne. Solution : créer une table `Telephone(idSalarie, numero)`. Chaque champ doit contenir exactement une valeur indivisible.',
  },
  // --- Modélisation UML ---
  {
    id: 'concep-007',
    theme: 'conception',
    type: 'association',
    difficulte: 1,
    enonce: 'Associez chaque diagramme UML à ce qu\'il modélise.',
    paires: [
      { gauche: 'Diagramme de cas d\'utilisation', droite: 'Qui (acteurs) fait quoi (cas) avec le système' },
      { gauche: 'Diagramme de classes', droite: 'Structure statique : classes, attributs, méthodes, relations' },
      { gauche: 'Diagramme de séquence', droite: 'Échanges de messages entre objets dans le temps (dynamique)' },
      { gauche: 'Diagramme d\'activité', droite: 'Flux de contrôle d\'un processus ou algorithme (étapes, décisions)' },
    ],
    explication:
      'Diagramme de classes = statique (structure). Séquence = dynamique (le déroulé). Cas d\'utilisation = pont entre l\'analyse et la conception. Le CDA exige de maîtriser ces trois premiers ainsi que les cardinalités et les relations (héritage, association, composition).',
  },
  {
    id: 'concep-008',
    theme: 'conception',
    type: 'qcm',
    difficulte: 2,
    enonce: 'En UML, quelle relation entre `Voiture` et `Moteur` est une **composition** (et non une association simple) ?',
    options: [
      '`Voiture` utilise un `Moteur` partagé avec d\'autres `Voiture`',
      '`Voiture` contient un `Moteur` qui ne peut exister sans elle : si la voiture est détruite, le moteur aussi',
      '`Voiture` hérite de `Moteur`',
      '`Voiture` implémente l\'interface `IMoteur`',
    ],
    bonneReponse: 1,
    explication:
      'Composition (losange plein) = relation "partie-tout" avec cycle de vie partagé. Le `Moteur` n\'existe pas sans la `Voiture`. Agrégation (losange creux) = le tout peut exister sans la partie (ex. `Équipe` agrège des `Employés` qui existent indépendamment). Héritage = flèche creuse.',
  },
  {
    id: 'concep-009',
    theme: 'conception',
    type: 'vrai_faux',
    difficulte: 2,
    enonce: 'Dans un diagramme de cas d\'utilisation, la relation `<<include>>` signifie qu\'un cas d\'utilisation est **toujours** exécuté quand le cas principal est exécuté.',
    bonneReponse: true,
    explication:
      '`<<include>>` = inclusion obligatoire (ex. "Déposer une demande" inclut toujours "Vérifier l\'identité"). `<<extend>>` = extension conditionnelle (ex. "Consulter le solde" peut optionnellement étendre "Afficher l\'historique détaillé"). Ne pas les confondre.',
  },
  {
    id: 'concep-010',
    theme: 'conception',
    type: 'completer_code',
    difficulte: 3,
    enonce: 'Complétez ce script DDL qui traduit le MPD de CongeApp (règles de passage MCD → MPD).',
    codeAvecTrous: `CREATE TABLE Salarie (
  idSalarie  INT ___1___ IDENTITY,
  nom        NVARCHAR(50)  NOT NULL,
  email      NVARCHAR(120) NOT NULL ___2___
);

CREATE TABLE Demande (
  idDemande  INT PRIMARY KEY IDENTITY,
  dateDebut  DATE NOT NULL,
  dateFin    DATE NOT NULL,
  statut     NVARCHAR(20) NOT NULL DEFAULT 'EN_ATTENTE',
  idSalarie  INT NOT NULL,
  ___3___ (idSalarie) REFERENCES Salarie(idSalarie)
);`,
    choix: ['PRIMARY KEY', 'UNIQUE KEY', 'NOT NULL', 'UNIQUE', 'DEFAULT NULL', 'FOREIGN KEY', 'INDEX', 'CHECK'],
    bonnesReponses: ['PRIMARY KEY', 'UNIQUE', 'FOREIGN KEY'],
    explication:
      '`PRIMARY KEY` sur `idSalarie` garantit l\'unicité et sert d\'identifiant. `UNIQUE` sur `email` interdit les doublons. `FOREIGN KEY` dans `Demande` traduit l\'association MCD : une demande appartient à un salarié (cardinalité 1,1 du côté Demande).',
  },
  {
    id: 'concep-011',
    theme: 'conception',
    type: 'qcm',
    difficulte: 3,
    enonce: 'Pourquoi la sécurité doit-elle être intégrée dès l\'**analyse des besoins** (principe Privacy by Design) ?',
    options: [
      'Pour satisfaire une obligation légale formelle mais sans impact technique',
      'Parce qu\'une faille de conception (ex. absence de contrôle d\'accès dans le modèle) coûte 10× plus cher à corriger après le développement qu\'à l\'intégrer dès le début',
      'Parce que les développeurs ne peuvent pas corriger des failles de sécurité une fois le code livré',
      'Pour pouvoir obtenir une certification ISO 27001 obligatoire pour les PME',
    ],
    bonneReponse: 1,
    explication:
      'Règle classique : le coût d\'une correction augmente à chaque phase (analyse → design → dev → test → prod). Définir dès l\'analyse qui a le droit de voir quoi (RBAC), quelles données sont collectées (minimisation RGPD), et quelles exigences de sécurité sont non-fonctionnelles évite de refactorer toute l\'architecture plus tard.',
  },
];
