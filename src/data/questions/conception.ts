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

  // --- Cycle de vie ---
  {
    id: 'concep-012',
    theme: 'conception',
    type: 'association',
    difficulte: 1,
    enonce: 'Associez chaque méthode de gestion de projet à sa caractéristique principale.',
    paires: [
      { gauche: 'Waterfall (cascade)', droite: 'Étapes séquentielles, plan complet en début de projet' },
      { gauche: 'Scrum', droite: 'Sprints courts avec démo au client à chaque fin de sprint' },
      { gauche: 'Kanban', droite: 'Flux continu, tableau de colonnes, limite du WIP' },
      { gauche: 'Agile (valeur)', droite: 'Logiciel fonctionnel et collaboration client avant plan rigide' },
    ],
    explication:
      'Waterfall = plan complet puis exécution linéaire (bon pour besoins stables). Scrum = itérations courtes avec cérémonie de démo. Kanban = flux continu sans sprints. L\'Agile est un ensemble de valeurs dont Scrum et Kanban sont des implémentations.',
  },
  {
    id: 'concep-013',
    theme: 'conception',
    type: 'association',
    difficulte: 1,
    enonce: 'Associez chaque rôle Scrum à sa responsabilité.',
    paires: [
      { gauche: 'Product Owner', droite: 'Porte la vision du produit et priorise le backlog' },
      { gauche: 'Scrum Master', droite: 'Facilite les cérémonies et lève les obstacles de l\'équipe' },
      { gauche: 'Équipe de développement', droite: 'Auto-organisée, réalise les stories du sprint' },
      { gauche: 'Daily Scrum', droite: 'Réunion quotidienne de 15 min : fait / à faire / blocages' },
    ],
    explication:
      'Le PO représente le client. Le Scrum Master n\'est pas un chef de projet — il est au service de l\'équipe. L\'équipe s\'auto-organise pour choisir comment réaliser les stories. Le Daily est timeboxé à 15 min.',
  },
  {
    id: 'concep-014',
    theme: 'conception',
    type: 'vrai_faux',
    difficulte: 1,
    enonce: 'Dans un projet en mode Waterfall, le client voit une version fonctionnelle du produit à chaque fin de sprint.',
    bonneReponse: false,
    explication:
      'Dans le Waterfall, le client ne voit le produit qu\'en fin de projet (après toutes les phases). En Agile/Scrum, une démo (*Sprint Review*) est réalisée à chaque fin de sprint. C\'est l\'un des avantages clés de l\'Agile : feedback rapide et régulier.',
  },
  {
    id: 'concep-015',
    theme: 'conception',
    type: 'remettre_ordre',
    difficulte: 2,
    enonce: 'Remettez dans l\'ordre les cérémonies d\'un sprint Scrum.',
    elements: [
      'Sprint Planning — choisir les stories et estimer la charge',
      'Daily Scrum — synchronisation quotidienne (15 min)',
      'Sprint Review — démonstration au client, recueil du feedback',
      'Rétrospective — amélioration continue des pratiques d\'équipe',
    ],
    explication:
      'Planning (début) → Dailys (pendant) → Review (fin, démonstration) → Rétro (fin, amélioration interne). La Review est tournée vers le produit et le client ; la Rétro est tournée vers le fonctionnement de l\'équipe.',
  },

  // --- Maquettage UI/UX ---
  {
    id: 'concep-017',
    theme: 'conception',
    type: 'association',
    difficulte: 1,
    enonce: 'Associez chaque étape du maquettage à son rôle.',
    paires: [
      { gauche: 'Zoning', droite: 'Découper la page en grandes zones fonctionnelles sans détail ni texte' },
      { gauche: 'Wireframe', droite: 'Placer les vrais éléments (boutons, champs, titres) sans couleur ni style' },
      { gauche: 'Mockup', droite: 'Ajouter couleurs, typographie et images pour valider le rendu visuel' },
      { gauche: 'Prototype', droite: 'Rendre le mockup cliquable pour simuler la navigation sans coder' },
    ],
    explication:
      'Le maquettage progresse du plus abstrait (zoning) au plus concret (prototype). Chaque étape a un rôle précis. Montrer un mockup couleurs trop tôt focalise le client sur les couleurs plutôt que sur la logique de navigation.',
  },
  {
    id: 'concep-018',
    theme: 'conception',
    type: 'remettre_ordre',
    difficulte: 1,
    enonce: 'Remettez dans l\'ordre les étapes de création d\'une maquette (de la plus abstraite à la plus concrète).',
    elements: [
      'Zoning — blocs grossiers, structure générale de la page',
      'Wireframe — filaire N&B, placement des éléments sans style',
      'Mockup — couleurs, typographie, images, validation visuelle',
      'Prototype — cliquable, navigation simulée, test des interactions',
    ],
    explication:
      'L\'ordre est imposé par la logique de conception : on valide la structure avant le style, et le style avant les interactions. Inverser cet ordre conduit à refaire du travail (ex. changer la navigation dans un prototype coûte plus cher que dans un wireframe).',
  },
  {
    id: 'concep-019',
    theme: 'conception',
    type: 'vrai_faux',
    difficulte: 1,
    enonce: 'Un wireframe doit utiliser les vraies couleurs et la vraie typographie pour que le client puisse valider le rendu visuel.',
    bonneReponse: false,
    explication:
      'Le wireframe est volontairement en noir et blanc, sans style. L\'objectif est de valider la structure et la hiérarchie de l\'information sans que le client soit distrait par les couleurs. La validation visuelle est le rôle du mockup, à l\'étape suivante.',
  },
  {
    id: 'concep-020',
    theme: 'conception',
    type: 'qcm',
    difficulte: 1,
    enonce: 'Quelle est la différence fondamentale entre **UI** et **UX** ?',
    options: [
      'L\'UI concerne les applications mobiles, l\'UX les applications web',
      'L\'UI est ce qu\'on voit (couleurs, typographie, mise en page) ; l\'UX est ce qu\'on ressent (facilité d\'utilisation, satisfaction)',
      'L\'UI est conçu par le développeur front-end ; l\'UX est conçu par le chef de projet',
      'Il n\'y a pas de différence : UI et UX sont deux termes synonymes',
    ],
    bonneReponse: 1,
    explication:
      'UI = User Interface : le travail graphique (ce qu\'on voit). UX = User eXperience : l\'expérience globale de l\'utilisateur (ce qu\'on ressent). Une belle UI avec une mauvaise UX reste une mauvaise application. Exemple : une app peut être graphiquement soignée mais impossible à utiliser si on ne trouve pas les boutons.',
  },
  {
    id: 'concep-021',
    theme: 'conception',
    type: 'association',
    difficulte: 1,
    enonce: 'Associez chaque principe UX à son exemple concret.',
    paires: [
      { gauche: 'Cohérence', droite: 'Le bouton "Valider" est violet partout dans l\'app, jamais vert ni rouge' },
      { gauche: 'Retour visuel (feedback)', droite: 'Un loader s\'affiche pendant l\'envoi du formulaire pour éviter le double-clic' },
      { gauche: 'Prévention des erreurs', droite: 'Le bouton "Valider" est désactivé tant que les dates ne sont pas cohérentes' },
      { gauche: 'Affordance', droite: 'Un bouton a un relief et une couleur distincte pour avoir l\'air cliquable' },
    ],
    explication:
      'Ces principes s\'appliquent dès la maquette. La cohérence évite la surprise. Le feedback rassure. La prévention vaut mieux que le message d\'erreur. L\'affordance guide sans instruction : l\'utilisateur sait instinctivement ce qui est cliquable.',
  },
  {
    id: 'concep-022',
    theme: 'conception',
    type: 'qcm',
    difficulte: 2,
    enonce: 'Parmi les critères WCAG/RGAA suivants, lequel concerne le **ratio de contraste** du texte normal ?',
    options: [
      'Le texte doit avoir un ratio de contraste ≥ 3:1 par rapport au fond',
      'Le texte doit avoir un ratio de contraste ≥ 4,5:1 par rapport au fond',
      'Le texte doit avoir un ratio de contraste ≥ 7:1 par rapport au fond',
      'Aucune règle chiffrée : c\'est au designer de juger',
    ],
    bonneReponse: 1,
    explication:
      'WCAG 2.1 niveau AA exige un ratio ≥ 4,5:1 pour le texte normal et ≥ 3:1 pour le texte grand (≥ 18pt). Un texte gris clair sur fond blanc est souvent insuffisant. Des outils comme le "Colour Contrast Analyser" ou Figma permettent de vérifier ce ratio dès la maquette.',
  },
  {
    id: 'concep-023',
    theme: 'conception',
    type: 'vrai_faux',
    difficulte: 2,
    enonce: 'Le RGAA (Référentiel Général d\'Amélioration de l\'Accessibilité) est obligatoire pour **tous** les sites web en France.',
    bonneReponse: false,
    explication:
      'Le RGAA est obligatoire pour les organismes publics (État, collectivités, certains organismes parapublics) et fortement recommandé pour tous les autres. Il est basé sur les WCAG du W3C. L\'ignorer dans un projet public expose à des sanctions. Dans un projet privé, c\'est une bonne pratique et un avantage concurrentiel.',
  },
  {
    id: 'concep-024',
    theme: 'conception',
    type: 'completer_code',
    difficulte: 2,
    enonce: 'Complétez ce HTML pour qu\'il respecte les critères d\'accessibilité WCAG (association label/champ et alternative textuelle).',
    codeAvecTrous: `<form>
  <!-- Champ de formulaire accessible -->
  <___1___ ___2___="dateDebut">Date de début</___1___>
  <input type="date" id="dateDebut" required>

  <!-- Image porteuse d'information accessible -->
  <img src="check.svg" ___3___="Demande validée">
</form>`,
    choix: ['label', 'span', 'div', 'for', 'name', 'class', 'alt', 'title', 'aria-label'],
    bonnesReponses: ['label', 'for', 'alt'],
    explication:
      '`<label for="dateDebut">` lie le label à l\'input via l\'`id`. Un lecteur d\'écran annoncera "Date de début" quand le champ est focalisé. `alt="Demande validée"` donne une alternative textuelle à l\'image. Un `<span>` ou `<div>` cliquable n\'est pas accessible au clavier — toujours préférer `<button>` ou `<label>`.',
  },
  {
    id: 'concep-025',
    theme: 'conception',
    type: 'association',
    difficulte: 2,
    enonce: 'Associez chaque heuristique de Nielsen à son exemple d\'application concrète.',
    paires: [
      { gauche: 'Visibilité du statut système', droite: 'Un loader et "Envoi en cours…" s\'affichent pendant la soumission d\'un formulaire' },
      { gauche: 'Liberté et contrôle utilisateur', droite: 'Un bouton "Annuler" et un raccourci CTRL+Z permettent de revenir en arrière' },
      { gauche: 'Aider à diagnostiquer les erreurs', droite: 'Le message indique "Les dates se chevauchent avec la demande du 01/07" plutôt que "Erreur 422"' },
      { gauche: 'Reconnaissance > mémorisation', droite: 'Un menu déroulant liste les statuts possibles plutôt que de forcer la saisie libre' },
    ],
    explication:
      'Les 10 heuristiques de Nielsen sont une grille d\'évaluation d\'interface. Une évaluation heuristique est réalisée par un expert (pas par de vrais utilisateurs). Elle identifie les violations et les classe par sévérité. C\'est une méthode rapide et peu coûteuse avant un test utilisateur.',
  },
  {
    id: 'concep-026',
    theme: 'conception',
    type: 'qcm',
    difficulte: 2,
    enonce: 'Quel est le rôle principal d\'un **persona** dans la conception d\'une interface ?',
    options: [
      'Définir la charte graphique (couleurs, typographie) de l\'application',
      'Représenter un profil utilisateur fictif mais réaliste pour guider les choix de conception et arbitrer les dilemmes d\'UX',
      'Lister les fonctionnalités à développer par ordre de priorité',
      'Décrire techniquement les flux de données entre les composants',
    ],
    bonneReponse: 1,
    explication:
      'Un persona est construit à partir d\'interviews et d\'observations réelles. Il représente un type d\'utilisateur avec ses objectifs, ses frustrations et ses habitudes. Quand on hésite entre deux choix d\'interface, on se demande "que ferait Marie dans cette situation ?". Un projet peut avoir 2-3 personas avec des besoins antagonistes à équilibrer.',
  },
  {
    id: 'concep-027',
    theme: 'conception',
    type: 'remettre_ordre',
    difficulte: 2,
    enonce: 'Remettez dans l\'ordre les niveaux de l\'Atomic Design (du plus simple au plus complexe).',
    elements: [
      'Atomes — éléments irréductibles (bouton, icône, champ)',
      'Molécules — combinaison d\'atomes (champ de recherche = input + bouton)',
      'Organismes — combinaison de molécules (header = logo + nav + avatar)',
      'Templates — structure de page (layout avec sidebar + zone contenu)',
      'Pages — template avec données réelles (la vraie page "Mes demandes")',
    ],
    explication:
      'Brad Frost a défini l\'Atomic Design pour structurer les design systems. L\'intérêt : les composants code React/Vue mappent directement sur ces niveaux. Les atomes sont les CSS tokens (couleur, espacement). Les molécules et organismes sont les composants réutilisables. Les templates guident le layout. Les pages sont l\'assemblage final.',
  },
  {
    id: 'concep-028',
    theme: 'conception',
    type: 'completer_code',
    difficulte: 2,
    enonce: 'Complétez ce HTML Tailwind pour rendre la sidebar responsive : cachée sur mobile, visible à partir de `md`, et le bouton hamburger visible uniquement sur mobile.',
    codeAvecTrous: `<!-- Sidebar : cachée sur mobile, affichée en bloc à partir de md -->
<aside class="___1___ md:block w-64 bg-gray-100 p-4">
  Navigation
</aside>

<!-- Bouton hamburger : visible sur mobile, caché à partir de md -->
<button class="block ___2___ p-2">
  ☰ Menu
</button>`,
    choix: ['hidden', 'flex', 'block', 'md:hidden', 'md:block', 'invisible', 'w-full', 'md:flex'],
    bonnesReponses: ['hidden', 'md:hidden'],
    explication:
      'En mobile-first Tailwind, la classe de base s\'applique à tous les écrans, le préfixe `md:` s\'applique à partir de 768px. `hidden` = `display: none` par défaut. `md:block` = `display: block` à partir de md. Le bouton hamburger fait l\'inverse : visible par défaut (`block`), caché à partir de md (`md:hidden`).',
  },
  {
    id: 'concep-029',
    theme: 'conception',
    type: 'qcm',
    difficulte: 2,
    enonce: 'Pourquoi l\'approche **mobile-first** est-elle recommandée pour le responsive design ?',
    options: [
      'Parce que les applications mobiles se vendent mieux que les applications web desktop',
      'Parce que contraindre la conception au petit écran d\'abord force à prioriser l\'essentiel, puis à enrichir progressivement pour les grands écrans',
      'Parce que le CSS ne peut pas gérer les grands écrans sans l\'approche mobile-first',
      'Parce que les frameworks CSS modernes ne supportent que le mobile-first',
    ],
    bonneReponse: 1,
    explication:
      'Le petit écran est la contrainte la plus forte : peu de place, navigation tactile, connexion parfois lente. En partant du mobile, on identifie l\'essentiel et on ajoute des fonctionnalités pour les écrans plus grands. L\'inverse (desktop-first) aboutit souvent à des interfaces mobiles surchargées où on a "caché" des éléments plutôt que les avoir supprimés.',
  },
  {
    id: 'concep-030',
    theme: 'conception',
    type: 'vrai_faux',
    difficulte: 2,
    enonce: 'Sur mobile, une cible tactile (bouton, lien) de **16 × 16 px** est suffisante pour garantir une bonne expérience utilisateur.',
    bonneReponse: false,
    explication:
      'La recommandation Apple et Google est une cible minimale de **44 × 44 px**. Un lien texte de 12px est cliquable sur desktop mais quasiment impossible à toucher sans erreur sur mobile. Le maquettage mobile doit anticiper cette contrainte : les boutons et liens doivent avoir une zone de frappe suffisante, même si l\'icône visible est plus petite.',
  },

  // --- ACID dans la modélisation des données ---
  {
    id: 'concep-016',
    theme: 'conception',
    type: 'qcm',
    difficulte: 2,
    enonce:
      'Deux managers valident la même demande au même instant. Les deux transactions lisent le statut « EN_ATTENTE » avant que l\'autre n\'ait écrit, et le solde est débité deux fois. Quelle propriété ACID est en cause ?',
    options: [
      'L\'isolation',
      'L\'atomicité',
      'La durabilité',
      'La cohérence',
    ],
    bonneReponse: 0,
    explication:
      'Le I d\'ACID est l\'Isolation, pas l\'Intégrité — c\'est le piège classique. L\'isolation garantit que deux transactions concurrentes se déroulent comme si chacune était seule sur la base. L\'atomicité, elle, ne concerne qu\'une transaction prise isolément (tout ou rien). L\'intégrité est une propriété du modèle de données (contraintes NOT NULL, UNIQUE, FOREIGN KEY), pas une lettre d\'ACID.',
  },
  // --- Normalisation ---
  {
    id: 'concep-047',
    theme: 'conception',
    type: 'qcm',
    difficulte: 1,
    enonce:
      'Une table contient une colonne `competences` qui vaut « SQL, C#, Docker » pour un salarié. Quelle forme normale est violée ?',
    options: ['La 1NF', 'La 2NF', 'La 3NF', 'Aucune, c’est correct'],
    bonneReponse: 0,
    explication:
      'La 1NF exige des valeurs atomiques : une seule valeur par cellule. Avec une liste, on ne peut ni filtrer (WHERE competence = \'SQL\' échoue), ni indexer, ni compter proprement. La solution est une table de liaison avec une ligne par compétence.',
  },
  {
    id: 'concep-031',
    theme: 'conception',
    type: 'qcm',
    difficulte: 2,
    enonce:
      'Table `SalarieCompetence (#idSalarie, #idCompetence, niveau, nomSalarie)`. Quelle forme normale est violée, et pourquoi ?',
    options: [
      'La 2NF : `nomSalarie` ne dépend que d’une partie de la clé composite',
      'La 1NF : la clé est composite',
      'La 3NF : `nomSalarie` dépend d’une autre colonne non-clé',
      'Aucune : la table est bien en 3NF',
    ],
    bonneReponse: 0,
    explication:
      'C’est une dépendance partielle : `nomSalarie` dépend d’`idSalarie` seul, pas du couple. Résultat, le nom est dupliqué sur chaque compétence du salarié. La 2NF ne concerne que les tables à clé composite — avec une clé simple, elle est acquise d’office.',
  },
  {
    id: 'concep-032',
    theme: 'conception',
    type: 'qcm',
    difficulte: 2,
    enonce:
      'Table `Salarie (idSalarie, nom, idService, nomService)`. Quelle forme normale est violée ?',
    options: [
      'La 3NF : `nomService` dépend d’`idService`, qui n’est pas la clé primaire',
      'La 1NF : il y a trop de colonnes',
      'La 2NF : la clé n’est pas composite',
      'Aucune : les clés étrangères sont autorisées',
    ],
    bonneReponse: 0,
    explication:
      'C’est une dépendance transitive : idSalarie → idService → nomService. Conséquence concrète, renommer un service oblige à modifier toutes les lignes de salariés de ce service, et en oublier une crée une incohérence. La solution est une table `Service` séparée.',
  },
  {
    id: 'concep-033',
    theme: 'conception',
    type: 'remettre_ordre',
    difficulte: 1,
    enonce: 'Remettez dans l’ordre les étapes de la modélisation des données.',
    elements: [
      'Dictionnaire de données (inventaire des informations)',
      'MCD (entités, associations, cardinalités)',
      'Normalisation (1NF, 2NF, 3NF)',
      'MLD (tables, clés primaires et étrangères)',
      'MPD (script SQL du SGBD cible)',
    ],
    explication:
      'On va du plus conceptuel au plus physique. La normalisation sert à vérifier le modèle avant de le traduire en tables : un MCD bien construit produit naturellement un schéma en 3NF.',
  },
  {
    id: 'concep-034',
    theme: 'conception',
    type: 'association',
    difficulte: 2,
    enonce: 'Associez chaque forme normale à la règle qu’elle impose.',
    paires: [
      { gauche: '1NF', droite: 'Chaque cellule contient une valeur atomique' },
      { gauche: '2NF', droite: 'Chaque colonne dépend de la clé entière, pas d’une partie' },
      { gauche: '3NF', droite: 'Aucune colonne non-clé ne dépend d’une autre colonne non-clé' },
    ],
    explication:
      'La formule mnémotechnique : « toute colonne dépend de la clé, de toute la clé, et de rien que la clé ». La 2NF traite les dépendances partielles, la 3NF les dépendances transitives.',
  },
  {
    id: 'concep-035',
    theme: 'conception',
    type: 'vrai_faux',
    difficulte: 2,
    enonce: 'Dénormaliser une base est une erreur de conception qu’il faut systématiquement corriger.',
    bonneReponse: false,
    explication:
      'Dénormaliser est un compromis assumé : on réintroduit de la redondance pour accélérer les lectures, au prix d’une mise à jour plus complexe. Ce qui est fautif, c’est de le faire par défaut ou par ignorance. On dénormalise après avoir mesuré un vrai problème de performance, et on documente la raison.',
  },
  {
    id: 'concep-036',
    theme: 'conception',
    type: 'association',
    difficulte: 2,
    enonce: 'Associez chaque anomalie d’une table non normalisée à sa manifestation.',
    paires: [
      { gauche: 'Anomalie d’insertion', droite: 'Impossible d’enregistrer un service sans salarié rattaché' },
      { gauche: 'Anomalie de mise à jour', droite: 'Renommer un service oblige à modifier de nombreuses lignes' },
      { gauche: 'Anomalie de suppression', droite: 'Supprimer le dernier salarié fait disparaître le service' },
    ],
    explication:
      'Ces trois anomalies sont la justification concrète de la normalisation : elles viennent toutes du fait que la même information est stockée à plusieurs endroits, ou qu’elle n’a nulle part où exister seule.',
  },
  // --- Diagrammes UML dynamiques ---
  {
    id: 'concep-037',
    theme: 'conception',
    type: 'qcm',
    difficulte: 2,
    enonce:
      'Quel diagramme UML utiliser pour décrire les états successifs d’une demande de congé (en attente, validée, refusée, annulée) et les transitions autorisées ?',
    options: [
      'Le diagramme d’états-transitions',
      'Le diagramme de classes',
      'Le diagramme de cas d’utilisation',
      'Le diagramme de composants',
    ],
    bonneReponse: 0,
    explication:
      'Le diagramme d’états-transitions décrit le cycle de vie d’UN objet : ses états et les événements qui le font changer. Dès qu’une entité porte une colonne `statut`, c’est le bon outil — et il se traduit directement en tests unitaires du Service.',
  },
  {
    id: 'concep-038',
    theme: 'conception',
    type: 'qcm',
    difficulte: 2,
    enonce: 'Quelle est la différence entre un diagramme de séquence et un diagramme d’activité ?',
    options: [
      'La séquence montre qui appelle qui entre objets techniques ; l’activité montre l’enchaînement du processus métier',
      'La séquence est statique, l’activité est dynamique',
      'La séquence sert au front-end, l’activité au back-end',
      'Ils sont équivalents, seule la notation change',
    ],
    bonneReponse: 0,
    explication:
      'Les deux sont dynamiques, mais pas au même niveau : la séquence parle au développeur (Controller, Service, Repository, avec les messages échangés), l’activité parle au client (les étapes du processus, les décisions, les acteurs en couloirs).',
  },
  {
    id: 'concep-039',
    theme: 'conception',
    type: 'association',
    difficulte: 2,
    enonce: 'Associez chaque symbole du diagramme d’activité à son rôle.',
    paires: [
      { gauche: 'Losange', droite: 'Décision conditionnelle, avec une garde sur chaque branche' },
      { gauche: 'Barre épaisse', droite: 'Fourche ou jointure de branches parallèles' },
      { gauche: 'Rectangle arrondi', droite: 'Une action, une étape du processus' },
      { gauche: 'Couloir (swimlane)', droite: 'Indique qui exécute quelle étape' },
    ],
    explication:
      'Les couloirs sont ce qui distingue un diagramme d’activité d’un simple organigramme : ils rendent visible la répartition des responsabilités entre le salarié, le système et le manager.',
  },
  {
    id: 'concep-040',
    theme: 'conception',
    type: 'association',
    difficulte: 2,
    enonce: 'Classez chaque diagramme UML dans sa famille.',
    paires: [
      { gauche: 'Diagramme de classes', droite: 'Statique — la structure' },
      { gauche: 'Diagramme de déploiement', droite: 'Statique — les machines et artefacts' },
      { gauche: 'Diagramme de séquence', droite: 'Dynamique — les messages dans le temps' },
      { gauche: 'Diagramme d’états-transitions', droite: 'Dynamique — le cycle de vie d’un objet' },
    ],
    explication:
      'Statique = ce qui existe indépendamment du temps ; dynamique = ce qui se passe. Le diagramme de déploiement, souvent oublié, est celui qu’on attend dans un dossier de projet pour expliquer l’architecture de production.',
  },
  {
    id: 'concep-041',
    theme: 'conception',
    type: 'qcm',
    difficulte: 3,
    enonce:
      'Sur un diagramme d’états-transitions, la transition depuis VALIDEE porte l’étiquette `annuler() [dateDebut > aujourd’hui] / recréditer le solde`. Que signifie la partie entre crochets ?',
    options: [
      'Une garde : la transition n’a lieu que si la condition est vraie',
      'Une action exécutée pendant la transition',
      'Le nom de l’état d’arrivée',
      'Un commentaire sans effet',
    ],
    bonneReponse: 0,
    explication:
      'La syntaxe d’une transition est `événement [garde] / action`. Ici : l’événement est l’annulation, la garde impose que le congé n’ait pas commencé, et l’action recrédite le solde. Chacun de ces trois éléments devient une règle testable dans le code.',
  },
  // --- Règles de gestion ---
  {
    id: 'concep-042',
    theme: 'conception',
    type: 'qcm',
    difficulte: 2,
    enonce: 'Qu’est-ce qu’une règle de gestion ?',
    options: [
      'Une contrainte du métier exprimée en une phrase, indépendante de toute technique',
      'Une règle de nommage des variables dans le code',
      'Une consigne de l’équipe sur la façon de gérer les branches Git',
      'Un critère de performance imposé par le client',
    ],
    bonneReponse: 0,
    explication:
      'Les règles de gestion sont le maillon entre le cahier des charges et le modèle : chacune finit en contrainte SQL, en test dans la couche métier, ou dans les deux. On les repère aux verbes « doit », « ne peut pas », « seulement si », « au maximum ».',
  },
  {
    id: 'concep-043',
    theme: 'conception',
    type: 'association',
    difficulte: 3,
    enonce: 'Associez chaque règle de gestion à l’endroit où elle se traduit le plus naturellement.',
    paires: [
      { gauche: 'Un salarié appartient à un seul service', droite: 'Cardinalité du MCD puis clé étrangère' },
      { gauche: 'La date de fin est postérieure à la date de début', droite: 'Contrainte CHECK en base' },
      { gauche: 'Une demande ne peut pas dépasser le solde disponible', droite: 'Règle métier dans le Service (elle demande un calcul)' },
      { gauche: 'Seul le manager du service peut valider', droite: 'Contrôle d’autorisation côté serveur' },
    ],
    explication:
      'Le réflexe qui compte : pour chaque règle, se demander OÙ on la fait respecter. Posée uniquement dans l’interface, elle est contournable en trois secondes ; posée uniquement en base, elle donne un message d’erreur incompréhensible. Souvent la bonne réponse est les deux.',
  },
  {
    id: 'concep-044',
    theme: 'conception',
    type: 'vrai_faux',
    difficulte: 1,
    enonce: 'Une règle de gestion doit mentionner la technologie utilisée pour l’implémenter.',
    bonneReponse: false,
    explication:
      'Une règle de gestion est une contrainte du métier, formulée dans les mots du client : « un salarié ne peut pas déposer une demande dépassant son solde ». Sa traduction technique vient ensuite, et peut changer sans que la règle change.',
  },
  // --- Éco-conception ---
  {
    id: 'concep-045',
    theme: 'conception',
    type: 'qcm',
    difficulte: 2,
    enonce: 'En éco-conception numérique, quel levier a le plus d’impact ?',
    options: [
      'Supprimer les fonctionnalités et les écrans inutilisés',
      'Compresser les images en WebP',
      'Réduire le nombre de polices de caractères',
      'Activer la mise en cache du navigateur',
    ],
    bonneReponse: 0,
    explication:
      'La page la plus économe est celle qui n’existe pas. Les optimisations techniques (images, polices, cache) sont utiles, mais elles agissent en aval : une fonctionnalité que personne n’utilise coûte de la bande passante, du stockage et de la maintenance à chaque visite.',
  },
  {
    id: 'concep-046',
    theme: 'conception',
    type: 'vrai_faux',
    difficulte: 2,
    enonce: 'L’éco-conception et le RGPD se rejoignent sur le principe de minimisation des données.',
    bonneReponse: true,
    explication:
      'Ne collecter que le strictement nécessaire est à la fois une obligation légale (article 5 du RGPD) et un geste de sobriété : moins de stockage, des sauvegardes plus légères, et une surface de risque réduite en cas de fuite. L’accessibilité converge aussi — une page sobre en HTML sémantique est plus lisible pour un lecteur d’écran.',
  },
];
