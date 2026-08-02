import type { Question } from '../../types/quiz';

export const questionsBackEnd: Question[] = [
  // --- Validation des données ---
  {
    id: 'back-001',
    theme: 'back-end',
    type: 'vrai_faux',
    difficulte: 1,
    enonce:
      'La validation des données côté serveur est obligatoire même si le front-end valide déjà les données avant envoi.',
    bonneReponse: true,
    explication:
      'La validation front-end est du confort d’usage — elle se contourne en quelques secondes avec un client HTTP ou les outils du navigateur. La seule validation qui protège est celle du serveur. Il faut les deux, mais la validation serveur est la vraie ligne de défense.',
  },
  {
    id: 'back-002',
    theme: 'back-end',
    type: 'association',
    difficulte: 1,
    enonce: 'Associez chaque règle de validation à ce qu’elle vérifie sur une donnée reçue.',
    paires: [
      { gauche: 'Obligatoire', droite: 'La valeur est présente et non vide' },
      { gauche: 'Format', droite: 'La valeur respecte un motif attendu (adresse e-mail, code postal)' },
      { gauche: 'Intervalle', droite: 'La valeur numérique est comprise entre un minimum et un maximum' },
      { gauche: 'Longueur', droite: 'La chaîne ne dépasse pas le nombre de caractères autorisé' },
    ],
    explication:
      'Ces quatre familles couvrent la validation de format, qui se déclare le plus souvent près du modèle d’entrée : annotations sur les propriétés en C# ou en Java (Bean Validation), schéma de validation en JavaScript (Zod, Joi), règles de formulaire en PHP (Laravel). Le mécanisme change, le découpage reste le même.',
  },
  {
    id: 'back-003',
    theme: 'back-end',
    type: 'qcm',
    difficulte: 2,
    enonce:
      'Une donnée reçue échoue à la validation de format. Que doit renvoyer l’API, et avec quel contenu ?',
    options: [
      'Un 400 Bad Request, avec la liste des champs fautifs et le motif du rejet',
      'Un 500 Internal Server Error, puisque la requête n’a pas pu être traitée',
      'Un 200 OK avec un champ `erreur` dans le corps, pour simplifier le client',
      'Un 404 Not Found, la ressource valide n’existant pas',
    ],
    bonneReponse: 0,
    explication:
      'La faute vient du client : c’est un 4xx, et 400 pour des données malformées. Renvoyer 500 accuserait le serveur à tort et déclencherait des alertes pour rien. Renvoyer 200 oblige chaque client à inspecter le corps pour savoir si ça a marché. Le détail par champ permet au front d’afficher l’erreur au bon endroit.',
  },
  {
    id: 'back-004',
    theme: 'back-end',
    type: 'qcm',
    difficulte: 2,
    enonce:
      'Où se place la validation de format dans une architecture en couches, et pourquoi pas ailleurs ?',
    options: [
      'À l’entrée, dans la couche de présentation : les données malformées sont rejetées avant d’atteindre le métier',
      'Dans le Repository, au plus près de la base de données',
      'Dans la couche métier, avec les règles de gestion',
      'Nulle part : les contraintes de la base suffisent à tout rejeter',
    ],
    bonneReponse: 0,
    explication:
      'Rejeter tôt évite de faire descendre des données inutilisables dans tout le système. La couche métier reçoit alors des données bien formées et se concentre sur les règles de gestion. Les contraintes de la base restent le dernier filet, mais leurs messages d’erreur sont inexploitables pour l’utilisateur final.',
  },

  // --- Gestion des erreurs ---
  {
    id: 'back-005',
    theme: 'back-end',
    type: 'qcm',
    difficulte: 1,
    enonce: 'Pourquoi ne doit-on pas renvoyer la trace d’exécution d’une erreur au client en production ?',
    options: [
      'Parce qu’elle révèle la structure interne : chemins de fichiers, versions de bibliothèques, noms de tables',
      'Pour économiser de la bande passante',
      'Parce que les navigateurs ne savent pas l’afficher',
      'Parce que cela ralentit le serveur',
    ],
    bonneReponse: 0,
    explication:
      'Une trace d’exécution est du renseignement gratuit pour un attaquant : elle expose l’arborescence du projet, la version du cadriciel, parfois la requête SQL fautive. En production on renvoie un message générique et un identifiant de corrélation, et on garde le détail dans les journaux serveur. Cela relève d’OWASP A05, mauvaise configuration.',
  },
  {
    id: 'back-006',
    theme: 'back-end',
    type: 'vrai_faux',
    difficulte: 2,
    enonce:
      'Dans la chaîne de traitement d’une requête HTTP, l’étape qui identifie l’utilisateur doit s’exécuter avant celle qui vérifie ses droits.',
    bonneReponse: true,
    explication:
      'L’authentification établit QUI parle, l’autorisation vérifie ce que cette personne a le droit de faire. Inverser les deux revient à contrôler des droits sur une identité encore inconnue : les routes protégées deviennent accessibles. Tous les cadriciels imposent cet ordre, quel que soit le nom donné aux étapes (middleware, filtre, intercepteur).',
  },
  {
    id: 'back-007',
    theme: 'back-end',
    type: 'remettre_ordre',
    difficulte: 2,
    enonce:
      'Remettez dans l’ordre les étapes traversées par une requête HTTP entrante, de la plus externe à la plus interne.',
    elements: [
      'Capture globale des exceptions',
      'Redirection vers HTTPS',
      'Politique de partage entre origines (CORS)',
      'Authentification : identifier l’utilisateur',
      'Autorisation : vérifier ses droits',
      'Routage vers le point d’entrée métier',
    ],
    explication:
      'La capture des exceptions englobe tout, sinon une erreur survenue plus loin échappe au traitement. HTTPS avant le reste. Le contrôle d’origine avant l’authentification. Identifier avant d’autoriser. Le routage en dernier : c’est la destination. Cette chaîne s’appelle middleware, filtres ou intercepteurs selon la technologie, mais l’ordre est le même partout.',
  },

  // --- Configuration ---
  {
    id: 'back-008',
    theme: 'back-end',
    type: 'qcm',
    difficulte: 1,
    enonce: 'Où stocker la clé secrète qui signe les jetons d’authentification ?',
    options: [
      'Dans une variable d’environnement du serveur, ou un coffre à secrets',
      'Dans le fichier de configuration versionné, pour que l’équipe y ait accès',
      'En dur dans le code, pour éviter tout fichier externe',
      'Dans une table de la base de données',
    ],
    bonneReponse: 0,
    explication:
      'Un fichier de configuration versionné est visible de toute l’équipe et de quiconque accède au dépôt — et un secret entré une fois dans l’historique Git y reste. En dur dans le code, c’est pire encore. La variable d’environnement n’existe que sur la machine d’exécution ; un coffre (Vault, Key Vault, Secrets Manager) ajoute la rotation et la traçabilité.',
  },
  {
    id: 'back-009',
    theme: 'back-end',
    type: 'association',
    difficulte: 2,
    enonce: 'Associez chaque source de configuration à son usage.',
    paires: [
      { gauche: 'Fichier de configuration versionné', droite: 'Réglages de base, sans aucun secret' },
      { gauche: 'Fichier de surcharge par environnement', droite: 'Ajustements pour le développement local' },
      { gauche: 'Variables d’environnement', droite: 'Secrets et réglages de production, hors du dépôt' },
      { gauche: 'Coffre à secrets', droite: 'Secrets partagés, avec rotation et traçabilité des accès' },
    ],
    explication:
      'Ces sources se superposent du plus général au plus spécifique, les variables d’environnement ayant la priorité la plus haute. C’est ce mécanisme qui permet de livrer la même image applicative partout et de ne changer que la configuration — le principe de la douzaine de facteurs (12-factor app).',
  },

  // --- Journalisation ---
  {
    id: 'back-010',
    theme: 'back-end',
    type: 'association',
    difficulte: 1,
    enonce: 'Associez chaque niveau de journalisation à son usage.',
    paires: [
      { gauche: 'Debug', droite: 'Détails de mise au point — uniquement en développement' },
      { gauche: 'Information', droite: 'Événements normaux du flux (connexion, création)' },
      { gauche: 'Warning', droite: 'Situation anormale mais non bloquante' },
      { gauche: 'Error', droite: 'Erreur qui a empêché une opération d’aboutir' },
    ],
    explication:
      'La hiérarchie Trace < Debug < Information < Warning < Error < Critical est commune à la plupart des bibliothèques de journalisation, en .NET, Java ou Python. En production, on filtre à partir d’Information : Debug est trop verbeux et fait grossir les journaux pour rien.',
  },
  {
    id: 'back-011',
    theme: 'back-end',
    type: 'vrai_faux',
    difficulte: 2,
    enonce:
      'Il est acceptable de journaliser le mot de passe d’un utilisateur, même haché, pour faciliter le débogage.',
    bonneReponse: false,
    explication:
      'Le condensat d’un mot de passe reste une donnée sensible : qui accède aux journaux peut tenter de le casser hors ligne, tranquillement. Un journal enregistre l’événement — « connexion échouée pour tel compte, depuis telle adresse » — pas les secrets. Les journaux sont souvent lisibles par l’équipe d’exploitation : c’est une surface de fuite (OWASP A09).',
  },
  {
    id: 'back-012',
    theme: 'back-end',
    type: 'qcm',
    difficulte: 2,
    enonce:
      'Une opération échoue à cause d’une erreur technique (base injoignable). Que journaliser, et que renvoyer au client ?',
    options: [
      'Journaliser l’exception complète avec un identifiant de corrélation, renvoyer un message générique portant ce même identifiant',
      'Journaliser un message court et renvoyer l’exception complète au client pour qu’il la transmette au support',
      'Ne rien journaliser et renvoyer un message générique : les journaux coûtent cher',
      'Journaliser et renvoyer exactement la même chose, pour rester cohérent',
    ],
    bonneReponse: 0,
    explication:
      'L’identifiant de corrélation est le pont entre les deux : l’utilisateur signale « erreur ABC-123 », on retrouve la trace complète dans les journaux. Il donne le diagnostic sans rien exposer. Renvoyer l’exception au client, c’est la fuite d’informations décrite plus haut.',
  },
  {
    id: 'back-013',
    theme: 'back-end',
    type: 'qcm',
    difficulte: 3,
    enonce:
      'Quelle est la différence entre la validation des données et les règles de gestion, et où se placent-elles ?',
    options: [
      'La validation vérifie le format à l’entrée ; les règles de gestion vérifient la cohérence métier, dans la couche métier',
      'La validation vérifie le format et les règles de gestion, toutes deux à l’entrée',
      'La validation est côté client, les règles de gestion côté serveur',
      'Il n’y a pas de différence : tout se déclare sur le modèle d’entrée',
    ],
    bonneReponse: 0,
    explication:
      'La validation répond à « cette donnée est-elle bien formée ? » — champ présent, adresse e-mail plausible, longueur respectée. Elle ne dépend que de la donnée elle-même. Une règle de gestion répond à « cette opération est-elle permise ? » — solde suffisant, pas de chevauchement de dates — et exige de consulter d’autres données. C’est pour ça qu’elle vit dans la couche métier, pas sur le modèle d’entrée.',
  },
  {
    id: 'back-014',
    theme: 'back-end',
    type: 'qcm',
    difficulte: 2,
    enonce:
      'Déduire un solde et créer une demande sont deux écritures qui doivent réussir ensemble ou pas du tout. Comment le garantir ?',
    options: [
      'Les placer dans une même transaction, validée à la fin ou annulée en bloc',
      'Les exécuter l’une après l’autre et vérifier le résultat de chacune',
      'Rejouer la seconde écriture en cas d’échec',
      'Les exécuter en parallèle pour réduire la fenêtre d’incohérence',
    ],
    bonneReponse: 0,
    explication:
      'C’est l’atomicité, le A d’ACID. Vérifier après coup laisse une fenêtre où le solde est débité sans demande : si le serveur tombe entre les deux écritures, la base reste incohérente. La transaction déplace cette garantie du code vers le moteur.',
  },
  {
    id: 'back-015',
    theme: 'back-end',
    type: 'qcm',
    difficulte: 2,
    enonce: 'À quoi sert une limitation de débit sur les points d’entrée d’authentification ?',
    options: [
      'À ralentir les tentatives automatisées de découverte de mot de passe',
      'À réduire la charge de la base de données',
      'À éviter que deux utilisateurs se connectent en même temps',
      'À imposer un mot de passe plus long',
    ],
    bonneReponse: 0,
    explication:
      'Sans elle, un attaquant enchaîne des milliers d’essais à la seconde. En limitant à quelques tentatives par minute et par adresse, une attaque par force brute devient inexploitable. C’est l’une des parades attendues sur le risque d’identification et d’authentification défaillantes.',
  },
  {
    id: 'back-016',
    theme: 'back-end',
    type: 'qcm',
    difficulte: 2,
    enonce: 'À quoi sert un point d’entrée de santé exposé par l’application ?',
    options: [
      'À permettre au superviseur et à l’orchestrateur de savoir si l’instance répond et peut recevoir du trafic',
      'À afficher les statistiques d’usage aux administrateurs',
      'À redémarrer l’application à distance',
      'À vider le cache applicatif',
    ],
    bonneReponse: 0,
    explication:
      'On distingue souvent deux sondes : « le processus est-il vivant » et « est-il prêt à servir », cette dernière vérifiant les dépendances comme la base. C’est ce qui permet de ne pas router de trafic vers une instance qui démarre encore, et de redémarrer automatiquement une instance bloquée.',
  },
  {
    id: 'back-017',
    theme: 'back-end',
    type: 'qcm',
    difficulte: 3,
    enonce:
      'Une opération lente (génération d’un document, envoi de courriels en masse) est déclenchée par une requête HTTP. Quelle réponse renvoyer ?',
    options: [
      'Un 202, en confiant le travail à une file de traitement, avec un moyen de suivre l’avancement',
      'Un 200, après avoir attendu la fin du traitement',
      'Un 500 si le traitement dépasse le délai imparti',
      'Un 204, puisqu’il n’y a rien à renvoyer',
    ],
    bonneReponse: 0,
    explication:
      'Faire attendre la requête bloque une connexion, expose au dépassement de délai du serveur frontal et laisse l’utilisateur devant une page figée. Le 202 signale une demande acceptée mais pas terminée : le traitement part en tâche de fond, et le client interroge l’avancement.',
  },
  {
    id: 'back-018',
    theme: 'back-end',
    type: 'association',
    difficulte: 2,
    enonce: 'Associez chaque type de tâche de fond à son déclencheur.',
    paires: [
      { gauche: 'Tâche planifiée', droite: 'Une heure ou une périodicité : sauvegarde nocturne, purge des journaux' },
      { gauche: 'File de traitement', droite: 'Un message déposé par l’application : envoi d’un courriel, génération d’un export' },
      { gauche: 'Traitement par lots', droite: 'Un volume de données à traiter en une passe, hors des heures de charge' },
    ],
    explication:
      'Sortir ces traitements du cycle de la requête garde l’API rapide et permet de réessayer en cas d’échec sans que l’utilisateur ne soit concerné. La file apporte en plus la reprise sur erreur : un message non traité reste en attente au lieu d’être perdu.',
  },
  {
    id: 'back-019',
    theme: 'back-end',
    type: 'vrai_faux',
    difficulte: 3,
    enonce:
      'Mettre en cache une réponse coûteuse à calculer dispense de réfléchir à sa durée de validité.',
    bonneReponse: false,
    explication:
      'La question difficile du cache n’est pas de le remplir, c’est de savoir quand le vider. Une donnée périmée servie longtemps est parfois pire que la lenteur qu’on voulait corriger. On décide donc explicitement d’une durée de vie, ou d’un événement qui invalide l’entrée.',
  },
  {
    id: 'back-020',
    theme: 'back-end',
    type: 'qcm',
    difficulte: 3,
    enonce:
      'Deux requêtes simultanées lisent le même solde puis le décrémentent chacune. Le solde final est faux. Comment l’éviter ?',
    options: [
      'Encadrer lecture et écriture dans une transaction avec le niveau d’isolation adapté, ou verrouiller la ligne concernée',
      'Ajouter un délai aléatoire avant chaque écriture',
      'Recalculer le solde après coup et le corriger',
      'Interdire les requêtes simultanées sur l’API',
    ],
    bonneReponse: 0,
    explication:
      'C’est une mise à jour perdue : chacune lit la même valeur de départ et écrase l’autre. Le I d’ACID, l’isolation, existe exactement pour ça. En pratique on lit la ligne en la verrouillant, ou on écrit une mise à jour relative — retirer dix plutôt qu’écrire une valeur calculée en mémoire.',
  },
];
