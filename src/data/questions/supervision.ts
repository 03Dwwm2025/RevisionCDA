import type { Question } from '../../types/quiz';

export const questionsSupervision: Question[] = [
  {
    id: 'super-001',
    theme: 'supervision',
    type: 'association',
    difficulte: 1,
    enonce: 'Associez chaque concept de supervision à sa définition.',
    paires: [
      { gauche: 'Logs applicatifs', droite: 'Journaux des événements de l\'application (requêtes, erreurs, actions)' },
      { gauche: 'Monitoring', droite: 'Surveillance continue des métriques (CPU, RAM, temps de réponse, erreurs)' },
      { gauche: 'Alerte', droite: 'Notification déclenchée quand une métrique dépasse un seuil' },
      { gauche: 'Sauvegarde', droite: 'Copie régulière des données pour permettre la restauration après incident' },
    ],
    explication:
      'Logs et monitoring sont complémentaires : les logs expliquent ce qui s\'est passé, le monitoring détecte en temps réel qu\'il se passe quelque chose d\'anormal. Les alertes transforment la détection passive en réaction active (PagerDuty, e-mail, Slack).',
  },
  {
    id: 'super-002',
    theme: 'supervision',
    type: 'qcm',
    difficulte: 1,
    enonce: 'Qu\'est-ce que le **RTO** (Recovery Time Objective) ?',
    options: [
      'La durée maximale de perte de données tolérée après un incident',
      'Le temps maximal toléré pour remettre le service en fonctionnement après un incident',
      'Le nombre de réplicas nécessaires pour garantir la disponibilité',
      'La fréquence des sauvegardes automatiques',
    ],
    bonneReponse: 1,
    explication:
      'RTO = combien de temps peut-on rester hors service ? RPO (Recovery Point Objective) = combien de données peut-on se permettre de perdre (durée entre la dernière sauvegarde et l\'incident). Exemple : RTO = 4h (le service doit être remis en marche en moins de 4h), RPO = 1h (on accepte de perdre 1h de données max).',
  },
  {
    id: 'super-003',
    theme: 'supervision',
    type: 'vrai_faux',
    difficulte: 1,
    enonce: 'Une sauvegarde qui n\'a jamais été testée par une restauration est considérée comme fiable.',
    bonneReponse: false,
    explication:
      'Une sauvegarde non testée n\'est pas une sauvegarde — c\'est une illusion de sauvegarde. Les données peuvent être corrompues, le format obsolète, ou la procédure de restauration inconnue. Les tests de restauration réguliers (en environnement de test isolé) sont indispensables.',
  },
  {
    id: 'super-004',
    theme: 'supervision',
    type: 'qcm',
    difficulte: 2,
    enonce: 'Quel outil open-source permet de visualiser des métriques système et applicatifs avec des tableaux de bord ?',
    options: [
      'fail2ban',
      'Certbot',
      'Grafana (avec Prometheus pour la collecte)',
      'Nginx',
    ],
    bonneReponse: 2,
    explication:
      'Prometheus collecte et stocke les métriques (scrape des endpoints `/metrics`). Grafana les visualise sous forme de dashboards. Uptime Kuma est une alternative légère pour la surveillance de disponibilité HTTP. Ces outils s\'auto-hébergent facilement via Docker Compose.',
  },
  {
    id: 'super-005',
    theme: 'supervision',
    type: 'vrai_faux',
    difficulte: 2,
    enonce: 'Les logs applicatifs ne doivent jamais contenir de données sensibles (mots de passe, tokens, données personnelles).',
    bonneReponse: true,
    explication:
      'OWASP A09 (Logging & Monitoring Failures) : journaliser trop ou trop peu est un risque. Journaliser un mot de passe ou un token JWT le stocke en clair dans les fichiers de log, accessibles à quiconque lit ces fichiers (admin système, accès incident). Logger l\'événement (`"connexion échouée pour user@example.com"`) sans la valeur sensible.',
  },
  {
    id: 'super-006',
    theme: 'supervision',
    type: 'qcm',
    difficulte: 2,
    enonce: 'Pourquoi la surveillance des **événements de sécurité** (connexions échouées, accès refusés) est-elle liée à l\'OWASP A09 ?',
    options: [
      'Parce que les logs consomment de l\'espace disque et peuvent provoquer un déni de service',
      'Parce que l\'absence de journalisation et de supervision empêche de détecter une attaque en cours ou d\'analyser un incident post-mortem',
      'Parce que les logs contiennent des données personnelles relevant du RGPD',
      'Parce que les outils de monitoring sont des vecteurs d\'injection',
    ],
    bonneReponse: 1,
    explication:
      'A09 = "Logging and Monitoring Failures". Sans logs des erreurs d\'authentification, une attaque par brute force passe inaperçue. Sans alertes sur les erreurs 5xx en pic, une panne n\'est découverte que par les utilisateurs. La supervision est la capacité à détecter, réagir et faire le post-mortem.',
  },
  {
    id: 'super-007',
    theme: 'supervision',
    type: 'remettre_ordre',
    difficulte: 2,
    enonce: 'Remettez dans l\'ordre les étapes d\'une réponse à un incident de production.',
    elements: [
      'Détecter l\'incident (alerte monitoring ou remontée utilisateur)',
      'Évaluer la sévérité et activer le plan de réponse (PRI)',
      'Mitiger immédiatement (rollback, coupure du service si nécessaire)',
      'Diagnostiquer la cause racine via les logs et métriques',
      'Corriger et redéployer, puis rédiger le post-mortem',
    ],
    explication:
      'L\'ordre : détecter → évaluer → mitiger (priorité : réduire l\'impact) → diagnostiquer → corriger. Le post-mortem documente la cause, la chronologie et les actions préventives. "Blame-free post-mortem" : l\'objectif est d\'apprendre, pas de punir.',
  },
  {
    id: 'super-008',
    theme: 'supervision',
    type: 'qcm',
    difficulte: 3,
    enonce: 'Quelle différence entre **PRA** (Plan de Reprise d\'Activité) et **PCA** (Plan de Continuité d\'Activité) ?',
    options: [
      'Ce sont des synonymes utilisés selon les pays',
      'Le PRA définit comment reprendre après une interruption (RTO/RPO) ; le PCA vise à maintenir une activité minimale pendant l\'incident sans interruption',
      'Le PCA est pour les bases de données ; le PRA est pour les serveurs applicatifs',
      'Le PRA est légalement obligatoire ; le PCA est facultatif',
    ],
    bonneReponse: 1,
    explication:
      'PRA (Disaster Recovery Plan) : on accepte une interruption et on définit comment reconstruire le service (RTO = combien de temps, RPO = combien de données perdues). PCA (Business Continuity Plan) : on maintient un service dégradé mais continu grâce à la redondance (multi-zone, failover). PCA > PRA en termes de disponibilité, mais plus coûteux.',
  },
];
