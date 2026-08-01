import type { Question } from '../../types/quiz';

export const questionsGestionProjet: Question[] = [
  {
    id: 'gp-001',
    theme: 'gestion-projet',
    type: 'qcm',
    difficulte: 1,
    enonce: 'Quel est le principal inconvénient du cycle en cascade (Waterfall) ?',
    options: [
      'Le client ne voit le produit qu’à la fin, et toute erreur détectée tardivement coûte très cher à corriger',
      'Il ne produit aucune documentation',
      'Il est impossible de planifier un projet en cascade',
      'Il interdit d’écrire des tests',
    ],
    bonneReponse: 0,
    explication:
      'En cascade, les phases s’enchaînent linéairement : une erreur d’analyse détectée en phase de test oblige à remonter jusqu’à la conception. Le coût de correction d’un défaut augmente fortement avec le temps écoulé depuis son introduction. La cascade reste pertinente sur des projets aux besoins stables et très encadrés.',
  },
  {
    id: 'gp-002',
    theme: 'gestion-projet',
    type: 'association',
    difficulte: 1,
    enonce: 'Associez chaque rôle Scrum à sa responsabilité principale.',
    paires: [
      { gauche: 'Product Owner', droite: 'Porte la vision du produit et priorise le backlog' },
      { gauche: 'Scrum Master', droite: 'Facilite les cérémonies et lève les obstacles' },
      { gauche: 'Équipe de développement', droite: 'Réalise l’incrément, en auto-organisation' },
    ],
    explication:
      'Trois rôles seulement dans Scrum. Le Product Owner décide QUOI et dans quel ordre ; l’équipe décide COMMENT et combien elle prend ; le Scrum Master est garant de la méthode, pas un chef de projet. Confondre Scrum Master et chef de projet est l’erreur classique.',
  },
  {
    id: 'gp-003',
    theme: 'gestion-projet',
    type: 'association',
    difficulte: 2,
    enonce: 'Associez chaque cérémonie Scrum à son objectif.',
    paires: [
      { gauche: 'Sprint Planning', droite: 'Choisir les stories du sprint et estimer la charge' },
      { gauche: 'Daily Scrum', droite: 'Synchroniser l’équipe en 15 minutes et signaler les blocages' },
      { gauche: 'Sprint Review', droite: 'Montrer l’incrément au client et recueillir son retour' },
      { gauche: 'Rétrospective', droite: 'Améliorer la façon de travailler de l’équipe' },
    ],
    explication:
      'La Review porte sur le PRODUIT (on montre au client), la Rétrospective porte sur le PROCESSUS (comment on travaille). Les confondre est l’erreur la plus fréquente à l’oral.',
  },
  {
    id: 'gp-004',
    theme: 'gestion-projet',
    type: 'vrai_faux',
    difficulte: 2,
    enonce: 'La vélocité d’une équipe permet de comparer sa performance à celle d’une autre équipe.',
    bonneReponse: false,
    explication:
      'La vélocité est une unité propre à chaque équipe : les points de complexité n’ont pas la même valeur d’une équipe à l’autre. Elle sert à PRÉVOIR le reste-à-faire de cette équipe, pas à comparer ni à évaluer les personnes. Dès qu’elle devient un objectif, elle est gonflée et perd toute valeur prédictive.',
  },
  {
    id: 'gp-005',
    theme: 'gestion-projet',
    type: 'qcm',
    difficulte: 2,
    enonce: 'Pourquoi estime-t-on les user stories en points de complexité plutôt qu’en heures ?',
    options: [
      'Parce que la taille relative d’une story fait consensus, là où la durée dépend de qui la réalise',
      'Parce que les points sont plus précis que les heures',
      'Parce que la méthode Scrum interdit de parler de temps',
      'Parce que les points permettent de facturer le client plus facilement',
    ],
    bonneReponse: 0,
    explication:
      'Un développeur chevronné et un débutant ne mettent pas le même temps, mais s’accordent sur le fait qu’une story est deux fois plus grosse qu’une autre. Le point mesure l’effort relatif : volume, complexité technique et incertitude. La conversion en durée se fait ensuite, via la vélocité observée.',
  },
  {
    id: 'gp-006',
    theme: 'gestion-projet',
    type: 'qcm',
    difficulte: 2,
    enonce: 'Que révèle un fort désaccord d’estimation lors d’un planning poker (l’un dit 2, l’autre 13) ?',
    options: [
      'Que les deux personnes n’ont pas compris la même chose : la discussion vaut plus que le chiffre',
      'Que l’un des deux se trompe et qu’il faut prendre la moyenne',
      'Qu’il faut retirer la story du sprint',
      'Que l’estimation doit être tranchée par le Scrum Master',
    ],
    bonneReponse: 0,
    explication:
      'L’écart est le vrai produit de l’exercice : il signale une ambiguïté dans la story, une contrainte technique connue d’un seul, ou un périmètre compris différemment. Prendre la moyenne masquerait le problème au lieu de le résoudre.',
  },
  {
    id: 'gp-007',
    theme: 'gestion-projet',
    type: 'vrai_faux',
    difficulte: 2,
    enonce: 'Une story est « terminée » dès que le développeur a fini de coder la fonctionnalité.',
    bonneReponse: false,
    explication:
      'C’est le rôle de la définition de terminé (Definition of Done) : une liste commune de conditions — code revu et fusionné, tests écrits, CI verte, critères d’acceptation vérifiés, documentation à jour. Sans elle, « terminé » veut dire « ça marche sur ma machine » et la dette s’accumule sprint après sprint.',
  },
  {
    id: 'gp-008',
    theme: 'gestion-projet',
    type: 'qcm',
    difficulte: 2,
    enonce: 'Sur un graphe d’avancement (burndown), que signale un palier horizontal de plusieurs jours ?',
    options: [
      'Une tâche bloquée, ou un travail découpé trop gros pour être terminé',
      'Que l’équipe est en avance sur le sprint',
      'Que la vélocité a augmenté',
      'Que le sprint est terminé plus tôt que prévu',
    ],
    bonneReponse: 0,
    explication:
      'Le reste-à-faire ne descend que lorsqu’une story est terminée au sens de la Definition of Done. Un palier signifie que rien n’a été fini : soit un blocage, soit des stories trop grosses. Une chute brutale le dernier jour révèle le même problème de découpage.',
  },
  {
    id: 'gp-009',
    theme: 'gestion-projet',
    type: 'qcm',
    difficulte: 1,
    enonce: 'Qu’est-ce que la limite de WIP (Work In Progress) sur un tableau Kanban ?',
    options: [
      'Un nombre maximum de tâches simultanées par colonne, pour éviter la surcharge',
      'Le nombre de tâches à terminer avant la fin du sprint',
      'Le nombre maximum de personnes dans l’équipe',
      'La durée maximale d’une tâche en jours',
    ],
    bonneReponse: 0,
    explication:
      'Kanban fonctionne en flux continu, sans sprint. La limite de WIP force à finir avant de commencer autre chose : elle réduit le temps de traversée et fait apparaître les goulets d’étranglement, au lieu de les masquer sous une accumulation de tâches en cours.',
  },
  {
    id: 'gp-010',
    theme: 'gestion-projet',
    type: 'remettre_ordre',
    difficulte: 1,
    enonce: 'Remettez les phases du cycle de vie d’un logiciel dans l’ordre.',
    elements: [
      'Expression des besoins',
      'Analyse et conception',
      'Développement',
      'Tests',
      'Déploiement',
      'Maintenance',
    ],
    explication:
      'Ces phases existent quelle que soit la méthode. En cascade, elles s’enchaînent une seule fois du début à la fin ; en agile, elles se répètent à chaque sprint sur un périmètre réduit. La maintenance est la phase la plus longue et la plus coûteuse de la vie d’une application.',
  },
  {
    id: 'gp-011',
    theme: 'gestion-projet',
    type: 'association',
    difficulte: 2,
    enonce: 'Associez chaque valeur du manifeste agile à ce qu’elle place au second plan.',
    paires: [
      { gauche: 'Les individus et leurs interactions', droite: 'avant les processus et les outils' },
      { gauche: 'Un logiciel qui fonctionne', droite: 'avant une documentation exhaustive' },
      { gauche: 'La collaboration avec le client', droite: 'avant la négociation contractuelle' },
      { gauche: 'L’adaptation au changement', droite: 'avant le respect d’un plan' },
    ],
    explication:
      'Le manifeste dit « avant », pas « à la place de » : la documentation et les contrats gardent leur valeur, ils passent simplement au second rang quand il faut arbitrer. Le raccourci « agile = pas de documentation » est un contresens fréquent.',
  },
  {
    id: 'gp-012',
    theme: 'gestion-projet',
    type: 'qcm',
    difficulte: 3,
    enonce: 'Une équipe a une vélocité stable de 30 points par sprint et un reste-à-faire de 125 points. Que peut-on en dire ?',
    options: [
      'Il reste environ 5 sprints, sous réserve que le périmètre ne bouge pas',
      'Le projet sera livré dans 125 jours',
      'Il faut augmenter la vélocité à 40 pour tenir les délais',
      'La vélocité étant stable, le reste-à-faire ne changera plus',
    ],
    bonneReponse: 0,
    explication:
      '125 / 30 donne un peu plus de 4 sprints, soit 5 sprints en pratique. C’est une prévision, pas un engagement : le backlog évolue, des stories sont découvertes en route. C’est justement l’intérêt de l’agilité — replanifier à chaque sprint avec des données réelles plutôt que de tenir un plan initial devenu faux.',
  },
  {
    id: 'gp-013',
    theme: 'gestion-projet',
    type: 'vrai_faux',
    difficulte: 1,
    enonce: 'Dans Scrum, le Product Owner est responsable du contenu et de la priorisation du backlog.',
    bonneReponse: true,
    explication:
      'Le Product Owner est le propriétaire du backlog : il en définit le contenu, l’ordre, et arbitre les priorités avec les parties prenantes. L’équipe de développement, elle, décide de la quantité de travail qu’elle embarque dans un sprint et de la façon de le réaliser.',
  },
  {
    id: 'gp-014',
    theme: 'gestion-projet',
    type: 'qcm',
    difficulte: 2,
    enonce: 'Pourquoi utilise-t-on souvent une suite de Fibonacci (1, 2, 3, 5, 8, 13) pour estimer ?',
    options: [
      'Parce que l’écart croissant traduit le fait qu’une grosse story est aussi une story mal connue',
      'Parce que ces nombres sont plus faciles à additionner',
      'Parce que Fibonacci est imposé par le manifeste agile',
      'Parce que cela permet d’estimer en heures de façon déguisée',
    ],
    bonneReponse: 0,
    explication:
      'Plus une story est grosse, plus l’incertitude est forte : distinguer 12 de 13 n’a aucun sens à cette échelle. Les écarts qui s’élargissent obligent à trancher franchement, et une story estimée à 13 ou plus est en général un signal qu’il faut la découper.',
  },
];
