import type { Question } from '../../types/quiz';

export const questionsApiRest: Question[] = [
  // --- Verbes HTTP ---
  {
    id: 'api-001',
    theme: 'api-rest',
    type: 'association',
    difficulte: 1,
    enonce: 'Associez chaque verbe HTTP à l\'action CRUD correspondante.',
    paires: [
      { gauche: 'GET', droite: 'Lire une ressource (sans effet de bord)' },
      { gauche: 'POST', droite: 'Créer une nouvelle ressource' },
      { gauche: 'PUT', droite: 'Remplacer intégralement une ressource existante' },
      { gauche: 'DELETE', droite: 'Supprimer une ressource' },
    ],
    explication:
      'PATCH (non dans la liste) modifie partiellement. GET est idempotent et sans effet de bord → peut être mis en cache. POST n\'est pas idempotent (deux appels = deux créations). PUT remplace tout l\'objet ; PATCH ne met à jour que les champs fournis.',
  },
  {
    id: 'api-002',
    theme: 'api-rest',
    type: 'qcm',
    difficulte: 1,
    enonce: 'Quel code HTTP renvoyer après la **création réussie** d’une ressource par POST ?',
    options: ['201 Created', '200 OK', '204 No Content', '202 Accepted'],
    bonneReponse: 0,
    explication:
      '201 Created signale la création, avec idéalement un en-tête `Location` qui pointe vers la nouvelle ressource. 200 convient à une lecture réussie, 204 à un succès sans corps de réponse (souvent DELETE), 202 à un traitement accepté mais pas encore terminé.',
  },
  {
    id: 'api-003',
    theme: 'api-rest',
    type: 'association',
    difficulte: 1,
    enonce: 'Associez chaque code de statut HTTP à sa signification.',
    paires: [
      { gauche: '400 Bad Request', droite: 'La requête est malformée ou les données invalides' },
      { gauche: '401 Unauthorized', droite: 'Non authentifié (pas de token ou token invalide)' },
      { gauche: '403 Forbidden', droite: 'Authentifié mais non autorisé à effectuer cette action' },
      { gauche: '404 Not Found', droite: 'La ressource demandée n\'existe pas' },
    ],
    explication:
      '401 vs 403 : 401 = "qui es-tu ?" (authentification manquante/invalide), 403 = "je sais qui tu es, mais tu n\'as pas le droit" (autorisation insuffisante). Confondre les deux est une erreur fréquente qui peut révéler l\'existence de ressources cachées.',
  },
  {
    id: 'api-004',
    theme: 'api-rest',
    type: 'completer_code',
    difficulte: 2,
    enonce:
      'Complétez ces échanges HTTP : création réussie, puis création refusée pour données invalides.',
    codeAvecTrous: `POST /api/demandes
Content-Type: application/json

{ "dateDebut": "2026-07-01", "dateFin": "2026-07-15" }

--- Réponse en cas de succès ---
HTTP/1.1 ___1___ Created
___2___: /api/demandes/42

--- Réponse si la date de fin précède la date de début ---
HTTP/1.1 ___3___ Bad Request
Content-Type: application/json

{ "erreurs": { "dateFin": "doit être postérieure à la date de début" } }`,
    choix: ['201', '200', '204', 'Location', 'Content-Location', 'Link', '400', '404', '500'],
    bonnesReponses: ['201', 'Location', '400'],
    explication:
      'L’en-tête `Location` évite au client de deviner l’adresse de la ressource créée. Le 400 désigne une faute du client : la requête est malformée. Un 500 accuserait le serveur à tort et déclencherait des alertes pour rien.',
  },
  {
    id: 'api-005',
    theme: 'api-rest',
    type: 'vrai_faux',
    difficulte: 1,
    enonce: 'Un token **JWT** (JSON Web Token) contient des informations (claims) lisibles par n\'importe qui, mais sa **signature** garantit qu\'il n\'a pas été modifié.',
    bonneReponse: true,
    explication:
      'Un JWT est composé de 3 parties base64 : header, payload (claims), signature. Le payload n\'est **pas chiffré** par défaut → ne jamais y mettre de données sensibles (mot de passe, numéro de CB). La signature HMAC ou RSA prouve l\'intégrité : toute modification invalide le token.',
  },
  {
    id: 'api-006',
    theme: 'api-rest',
    type: 'qcm',
    difficulte: 2,
    enonce: 'Où doit être envoyé le token JWT pour authentifier une requête API ?',
    options: [
      'Dans le corps (body) de la requête JSON',
      'Dans l\'en-tête `Authorization: Bearer <token>`',
      'Dans un cookie de session classique',
      'Dans un paramètre d\'URL `?token=...`',
    ],
    bonneReponse: 1,
    explication:
      'La convention REST est `Authorization: Bearer <token>`. Mettre le token en URL est dangereux (journaux serveur, historique navigateur). Dans le body ne fonctionne pas avec GET. Les cookies HttpOnly sont une alternative valide mais nécessitent une gestion CSRF.',
  },
  {
    id: 'api-007',
    theme: 'api-rest',
    type: 'qcm',
    difficulte: 2,
    enonce: 'Qu’est-ce que le CORS, et pourquoi le configurer strictement ?',
    options: [
      'Une protection du navigateur qui bloque les appels vers une autre origine ; le serveur déclare les origines qu’il accepte',
      'Un format d’encodage des données JSON qui remplace UTF-8',
      'Un protocole de chiffrement alternatif à HTTPS',
      'Une politique de cache HTTP pour les API publiques',
    ],
    bonneReponse: 0,
    explication:
      'Par défaut, un navigateur refuse qu’une page appelle une API sur un autre domaine. Le serveur lève cette restriction avec l’en-tête `Access-Control-Allow-Origin`. Y mettre `*` en production autorise n’importe quel site à appeler l’API depuis le navigateur d’un utilisateur connecté : on liste les origines réellement nécessaires.',
  },
  {
    id: 'api-008',
    theme: 'api-rest',
    type: 'remettre_ordre',
    difficulte: 2,
    enonce:
      'Remettez dans l’ordre le trajet d’une requête de création dans une architecture en couches.',
    elements: [
      'Le client envoie la requête HTTP',
      'La couche de présentation valide le format des données reçues',
      'La couche métier applique les règles de gestion',
      'La couche d’accès aux données exécute la requête paramétrée',
      'La réponse remonte les couches et le client reçoit un 201',
    ],
    explication:
      'Les dépendances vont dans un seul sens. La couche de présentation ne parle jamais directement à la base, et la couche d’accès aux données ne porte aucune règle de gestion. C’est ce cloisonnement qui permet de tester le métier sans base de données.',
  },
  {
    id: 'api-009',
    theme: 'api-rest',
    type: 'vrai_faux',
    difficulte: 2,
    enonce:
      'La validation des entrées côté serveur reste obligatoire même si le front-end valide déjà avant l’envoi.',
    bonneReponse: true,
    explication:
      'La validation côté client améliore le confort d’usage, elle ne protège rien : un client HTTP en ligne de commande contourne l’interface et parle directement à l’API. Seule la validation serveur constitue une défense. On garde les deux, pour des raisons différentes.',
  },
  {
    id: 'api-010',
    theme: 'api-rest',
    type: 'qcm',
    difficulte: 3,
    enonce: 'Quelle différence entre `PUT /api/demandes/7` et `PATCH /api/demandes/7` ?',
    options: [
      'PUT et PATCH sont identiques, c\'est une question de convention',
      'PUT remplace l\'intégralité de la ressource ; PATCH n\'envoie et ne met à jour que les champs fournis',
      'PATCH crée une nouvelle ressource si l\'id n\'existe pas ; PUT lève une erreur 404',
      'PUT est réservé aux admins ; PATCH est accessible à tous les utilisateurs',
    ],
    bonneReponse: 1,
    explication:
      'PUT = remplacement complet (les champs non fournis reviennent à null/défaut). PATCH = mise à jour partielle. Pour valider le statut d\'une demande sans toucher aux dates, PATCH est le bon verbe. PUT nécessite d\'envoyer la ressource complète.',
  },
  {
    id: 'api-011',
    theme: 'api-rest',
    type: 'qcm',
    difficulte: 3,
    enonce: 'Quelle combinaison de mesures protège correctement une API REST contre les abus ?',
    options: [
      'HTTPS uniquement — le chiffrement suffit',
      'Authentification JWT + validation des entrées côté serveur + rate limiting + CORS strict',
      'Authentification par mot de passe en clair dans l\'URL + HTTPS',
      'CORS `*` pour la simplicité + JWT pour les routes sensibles',
    ],
    bonneReponse: 1,
    explication:
      'Défense en profondeur : JWT identifie l\'appelant, la validation empêche les injections et données malformées, le rate limiting bloque le brute force et le DoS, CORS strict interdit les appels depuis des origines non autorisées. Chaque couche couvre ce que l\'autre ne couvre pas.',
  },
  // --- Pagination, filtrage, versionnement ---
  {
    id: 'api-012',
    theme: 'api-rest',
    type: 'qcm',
    difficulte: 2,
    enonce: 'Pourquoi borner côté serveur le paramètre de taille d’une pagination ?',
    options: [
      'Parce qu’un client peut demander une page de un million d’éléments et saturer le serveur',
      'Parce que les navigateurs limitent la longueur des URL',
      'Parce que le protocole HTTP interdit les nombres au-delà de 1000',
      'Parce que les bases de données refusent les limites trop grandes',
    ],
    bonneReponse: 0,
    explication:
      'Tout paramètre venu du client est une entrée à valider, y compris dans la chaîne de requête. On ramène la valeur dans un intervalle raisonnable — au moins 1, au plus 100 par exemple — plutôt que de faire confiance. C’est la validation de formulaire, appliquée à l’URL.',
  },
  {
    id: 'api-013',
    theme: 'api-rest',
    type: 'association',
    difficulte: 3,
    enonce: 'Associez chaque stratégie de pagination à sa caractéristique.',
    paires: [
      { gauche: 'Par décalage (page + taille)', droite: 'Simple, permet d’aller directement à la page N, mais lent sur de gros décalages' },
      { gauche: 'Par curseur (après le dernier identifiant)', droite: 'Stable et rapide sur de gros volumes, mais avance seulement de proche en proche' },
    ],
    explication:
      'La pagination par décalage souffre aussi d’un défaut fonctionnel : si une ligne est insérée pendant la navigation, tous les résultats se décalent et un élément peut apparaître deux fois ou être sauté. Le curseur n’a pas ce problème.',
  },
  {
    id: 'api-014',
    theme: 'api-rest',
    type: 'qcm',
    difficulte: 2,
    enonce: 'Lequel de ces changements impose une nouvelle version majeure de l’API ?',
    options: [
      'Renommer un champ de la réponse JSON',
      'Ajouter un champ optionnel dans la réponse',
      'Ajouter un nouvel endpoint',
      'Corriger un message d’erreur',
    ],
    bonneReponse: 0,
    explication:
      'Renommer ou supprimer un champ, changer un type, rendre obligatoire un paramètre optionnel : tout cela casse les clients existants. Ajouter un champ ou un endpoint est rétrocompatible. C’est la logique de SemVer appliquée au contrat d’API.',
  },
  {
    id: 'api-015',
    theme: 'api-rest',
    type: 'association',
    difficulte: 2,
    enonce: 'Associez chaque façon de porter la version d’une API à sa forme.',
    paires: [
      { gauche: 'Dans l’URL', droite: '/api/v2/demandes' },
      { gauche: 'Dans un en-tête dédié', droite: 'Api-Version: 2.0' },
      { gauche: 'Dans le type de média', droite: 'Accept: application/vnd.congeapp.v2+json' },
    ],
    explication:
      'La version dans l’URL est la plus répandue parce qu’elle est visible au débogage et testable dans un navigateur. La négociation par type de média est la plus conforme à l’esprit REST, et la plus rare en pratique.',
  },
  // --- Authentification ---
  {
    id: 'api-016',
    theme: 'api-rest',
    type: 'association',
    difficulte: 3,
    enonce: 'Associez chaque caractéristique au mode d’authentification correspondant.',
    paires: [
      { gauche: 'L’état vit sur le serveur', droite: 'Session + cookie' },
      { gauche: 'L’état vit dans le jeton, chez le client', droite: 'JWT' },
      { gauche: 'La déconnexion immédiate est simple', droite: 'Session + cookie — on supprime la session' },
      { gauche: 'Chaque serveur vérifie seul, sans état partagé', droite: 'JWT — vérification de signature' },
    ],
    explication:
      'Il n’y a pas de gagnant universel. La session convient à une application web servie par le même domaine ; le jeton convient à une API consommée par plusieurs clients. Le défaut du JWT est justement l’absence de révocation immédiate.',
  },
  {
    id: 'api-017',
    theme: 'api-rest',
    type: 'qcm',
    difficulte: 3,
    enonce: 'À quoi sert le jeton de rafraîchissement à côté du jeton d’accès ?',
    options: [
      'À obtenir un nouveau jeton d’accès sans se reconnecter, tout en restant révocable côté serveur',
      'À chiffrer le jeton d’accès pendant son transport',
      'À stocker les droits de l’utilisateur',
      'À accélérer la vérification de la signature',
    ],
    bonneReponse: 0,
    explication:
      'Le jeton d’accès reste court (15 à 60 minutes) pour limiter la fenêtre en cas de vol. Le jeton de rafraîchissement, lui, est enregistré côté serveur : on peut le révoquer, ce qui rattrape le principal défaut du JWT. Il se stocke dans un cookie HttpOnly.',
  },
  {
    id: 'api-018',
    theme: 'api-rest',
    type: 'qcm',
    difficulte: 2,
    enonce: 'Où stocker un jeton JWT côté navigateur, et pourquoi ?',
    options: [
      'Dans un cookie HttpOnly et Secure : JavaScript ne peut pas le lire, donc un XSS ne peut pas le voler',
      'Dans le localStorage : c’est le plus simple à manipuler en JavaScript',
      'Dans une variable globale JavaScript, effacée au rechargement',
      'Dans l’URL, en paramètre de requête',
    ],
    bonneReponse: 0,
    explication:
      'Le localStorage est lisible par n’importe quel script de la page : un XSS y récupère le jeton immédiatement. Le cookie HttpOnly ferme cette porte, mais réintroduit le risque CSRF — d’où l’attribut SameSite. Le jeton dans l’URL est le pire choix : il finit dans les journaux serveur et l’historique du navigateur.',
  },
  {
    id: 'api-019',
    theme: 'api-rest',
    type: 'remettre_ordre',
    difficulte: 2,
    enonce: 'Remettez dans l’ordre le cycle d’authentification avec jeton d’accès et jeton de rafraîchissement.',
    elements: [
      'L’utilisateur envoie ses identifiants',
      'Le serveur renvoie un jeton d’accès court et un jeton de rafraîchissement long',
      'Le client joint le jeton d’accès à chaque requête',
      'Le jeton d’accès expire',
      'Le client demande un nouveau jeton avec son jeton de rafraîchissement',
      'Le serveur vérifie que le jeton de rafraîchissement n’a pas été révoqué et renvoie un nouveau jeton d’accès',
    ],
    explication:
      'La vérification en base du jeton de rafraîchissement est l’étape qui rend le système révocable : à la déconnexion ou en cas de vol détecté, on le supprime et plus aucun renouvellement n’est possible.',
  },
  {
    id: 'api-020',
    theme: 'api-rest',
    type: 'vrai_faux',
    difficulte: 2,
    enonce: 'Une API REST bien conçue renvoie la liste complète des ressources sur un GET de collection.',
    bonneReponse: false,
    explication:
      'Une collection se pagine. Renvoyer 50 000 lignes sature le serveur, le réseau et le client, et le temps de réponse se dégrade au fil de la croissance des données. On renvoie une page, avec le total et le nombre de pages pour que le client puisse naviguer.',
  },
  {
    id: 'api-021',
    theme: 'api-rest',
    type: 'completer_code',
    difficulte: 2,
    enonce:
      'Complétez cette réponse d’API paginée, pour que le client puisse naviguer sans deviner.',
    codeAvecTrous: `GET /api/demandes?page=2&taille=20&statut=EN_ATTENTE

HTTP/1.1 200 OK
Content-Type: application/json

{
  "donnees": [ ... ],
  "___1___": 2,
  "___2___": 20,
  "___3___": 137
}`,
    choix: ['page', 'taille', 'total', 'statut', 'tri', 'donnees'],
    bonnesReponses: ['page', 'taille', 'total'],
    explication:
      'Rappeler la page et la taille demandées évite au client de tenir un état de son côté ; le total lui permet de calculer le nombre de pages et d’afficher une pagination correcte. Certaines API transportent ces informations dans des en-têtes plutôt que dans le corps : les deux se défendent, l’essentiel est de rester cohérent.',
  },
];
