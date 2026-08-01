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
    enonce: 'Quel code HTTP doit retourner une API après la **création réussie** d\'une ressource via POST ?',
    options: ['200 OK', '201 Created', '204 No Content', '202 Accepted'],
    bonneReponse: 1,
    explication:
      '201 Created = la ressource a été créée, avec idéalement un header `Location` pointant vers la nouvelle ressource (`CreatedAtAction` en ASP.NET Core). 200 est pour une lecture réussie. 204 = succès sans corps de réponse (souvent DELETE ou PUT). 202 = traitement asynchrone en cours.',
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
    enonce: 'Complétez ce contrôleur ASP.NET Core pour créer une demande (POST) et retourner les bons codes HTTP.',
    codeAvecTrous: `[HttpPost]
[___1___]
public IActionResult Creer([FromBody] DemandeDto dto)
{
    if (!ModelState.IsValid) return ___2___(ModelState);
    var res = _service.Deposer(dto);
    return ___3___(nameof(Get), new { id = res.Id }, res);
}`,
    choix: ['Authorize', 'AllowAnonymous', 'Route', 'BadRequest', 'NotFound', 'Ok', 'CreatedAtAction', 'Created'],
    bonnesReponses: ['Authorize', 'BadRequest', 'CreatedAtAction'],
    explication:
      '`[Authorize]` exige un utilisateur authentifié. `BadRequest(ModelState)` retourne 400 avec les erreurs de validation. `CreatedAtAction` retourne 201 avec le header `Location` pointant vers la route GET correspondante — la bonne pratique REST.',
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
    enonce: 'Qu\'est-ce que le **CORS** et pourquoi faut-il le configurer strictement ?',
    options: [
      'Un format d\'encodage des données JSON qui remplace UTF-8',
      'Un mécanisme du navigateur qui bloque les requêtes cross-origine ; configurer les origines autorisées côté serveur',
      'Un protocole de chiffrement alternatif à HTTPS',
      'Une politique de cache HTTP pour les API publiques',
    ],
    bonneReponse: 1,
    explication:
      'CORS (Cross-Origin Resource Sharing) : par défaut, un navigateur bloque les requêtes vers un domaine différent. Le serveur API doit déclarer les origines autorisées (`Access-Control-Allow-Origin`). Autoriser `*` en prod = risque XSS + fuite de données. En ASP.NET Core : `builder.Services.AddCors()`.',
  },
  {
    id: 'api-008',
    theme: 'api-rest',
    type: 'remettre_ordre',
    difficulte: 2,
    enonce: 'Remettez dans l\'ordre le cycle d\'une requête HTTP dans une architecture en couches (ASP.NET Core).',
    elements: [
      'Le client envoie la requête HTTP (ex. POST /api/demandes)',
      'Le Controller reçoit la requête, valide les données (`ModelState`)',
      'Le Service (métier) applique les règles et appelle le Repository',
      'Le Repository exécute la requête SQL paramétrée en base',
      'La réponse remonte : Controller retourne 201 avec la ressource créée',
    ],
    explication:
      'View/Client → Controller (validation) → Service (logique métier) → Repository (données) → BDD, puis retour inverse. Le Controller ne fait jamais de SQL directement, le Repository ne contient jamais de règles métier.',
  },
  {
    id: 'api-009',
    theme: 'api-rest',
    type: 'vrai_faux',
    difficulte: 2,
    enonce: 'La validation des entrées côté serveur est **obligatoire** même si le front-end valide déjà les données avant envoi.',
    bonneReponse: true,
    explication:
      'La validation client est du confort (UX). Elle peut être contournée facilement (Postman, curl, DevTools). Seule la validation serveur est de la sécurité. En ASP.NET Core : Data Annotations + `ModelState.IsValid`, ou FluentValidation.',
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
    enonce: 'Pourquoi borner le paramètre `taille` d’une pagination côté serveur ?',
    options: [
      'Parce qu’un client peut demander `taille=1000000` et provoquer une saturation du serveur',
      'Parce que les navigateurs limitent la longueur des URL',
      'Parce que le protocole HTTP interdit les nombres au-delà de 1000',
      'Parce que la base de données refuse les LIMIT trop grands',
    ],
    bonneReponse: 0,
    explication:
      'Tout paramètre venu du client est une entrée à valider. Un `Math.Clamp(taille, 1, 100)` transforme une requête abusive en requête normale. C’est la même logique que la validation d’un formulaire, appliquée aux paramètres de requête.',
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
    enonce: 'Complétez cette action paginée : borner la taille et renvoyer les métadonnées de pagination.',
    codeAvecTrous: `[HttpGet]
public IActionResult Lister([___1___] int page = 1, [___1___] int taille = 20)
{
    taille = Math.___2___(taille, 1, 100);
    var (items, total) = _service.Lister(page, taille);

    return ___3___(new { donnees = items, page, taille, total });
}`,
    choix: ['FromQuery', 'FromBody', 'FromRoute', 'Clamp', 'Max', 'Ok', 'Created', 'NoContent'],
    bonnesReponses: ['FromQuery', 'Clamp', 'Ok'],
    explication:
      '`[FromQuery]` lie les paramètres de la chaîne de requête (?page=2&taille=20). `Math.Clamp` borne la valeur dans un intervalle. `Ok()` renvoie 200 avec le corps. Renvoyer le total permet au client de calculer le nombre de pages sans deviner.',
  },
];
