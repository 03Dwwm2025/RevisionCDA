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
];
