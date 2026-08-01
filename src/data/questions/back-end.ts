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
];
