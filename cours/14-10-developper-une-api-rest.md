## 10. Développer une API REST

Une **API REST** expose les fonctionnalités du back-end via HTTP, sous forme de **ressources** manipulées avec des verbes standard. Elle est le contrat entre le front-end et le back-end.

### 10.1 Les verbes HTTP et les ressources

```
GET    /api/demandes          → lister toutes les demandes
GET    /api/demandes/7        → lire la demande n°7
POST   /api/demandes          → créer une nouvelle demande
PUT    /api/demandes/7        → remplacer entièrement la demande n°7
PATCH  /api/demandes/7        → modifier partiellement la demande n°7
DELETE /api/demandes/7        → supprimer la demande n°7
```

| Verbe | Action | Idempotent ? |
| --- | --- | --- |
| `GET` | Lire | ✅ (sans effet de bord) |
| `POST` | Créer | ❌ (deux appels = deux créations) |
| `PUT` | Remplacer | ✅ (même résultat si répété) |
| `PATCH` | Modifier partiellement | ⚠️ (dépend de l'implémentation) |
| `DELETE` | Supprimer | ✅ (supprimer deux fois → même état) |

**PUT vs PATCH :** PUT remplace l'intégralité de la ressource (les champs non fournis passent à null). PATCH ne met à jour que les champs envoyés — préférable pour les mises à jour partielles.

---

### 10.2 Les codes de statut HTTP

```
2xx — Succès
  200 OK           → GET ou PUT réussi
  201 Created      → POST réussi (avec header Location vers la ressource créée)
  204 No Content   → DELETE réussi ou PUT sans corps de réponse

4xx — Erreur client
  400 Bad Request  → données invalides (validation échouée)
  401 Unauthorized → non authentifié (token manquant ou invalide)
  403 Forbidden    → authentifié mais non autorisé (mauvais rôle)
  404 Not Found    → ressource inexistante
  409 Conflict     → conflit (ex. email déjà utilisé)

5xx — Erreur serveur
  500 Internal Server Error → bug non géré côté serveur
  503 Service Unavailable   → serveur surchargé ou en maintenance
```

> **401 vs 403 :** 401 = "je ne sais pas qui tu es" (authentification manquante). 403 = "je sais qui tu es, mais tu n'as pas le droit" (autorisation refusée).

---

### 10.3 Les points d'entrée de l'API

```javascript
// Un point d'entrée par ressource et par verbe. Ici avec Express, mais le
// découpage est le même avec n'importe quel cadriciel HTTP.
app.get('/api/demandes/:id', authentifier, async (req, res) => {
  const demande = await serviceConges.parId(req.params.id);
  if (!demande) return res.sendStatus(404);                       // 404

  // Contrôle d'accès : la ressource appartient-elle à l'appelant ? (OWASP A01)
  if (demande.idSalarie !== req.utilisateur.id) return res.sendStatus(403);  // 403

  res.json(demande);                                              // 200
});

app.post('/api/demandes', authentifier, async (req, res) => {
  const erreurs = valider(req.body, schemaCreation);
  if (erreurs) return res.status(400).json({ erreurs });          // 400 — format

  const resultat = await serviceConges.deposer(req.utilisateur.id, req.body);

  return resultat.succes
    ? res.status(201).location(`/api/demandes/${resultat.id}`).json({ id: resultat.id })
    : res.status(400).json({ message: resultat.message });        // 400 — règle métier
});
```

---

### 10.4 Les DTO

On n'expose jamais l'entité directement — on utilise des DTO pour contrôler exactement ce qui entre et sort de l'API.

```javascript
// ← ENTRÉE (client → API) : on déclare ce qu'on accepte, et rien de plus
const schemaCreation = {
  dateDebut: { type: 'date', requis: true },
  dateFin:   { type: 'date', requis: true },
  // Pas d'identifiant (généré par la base), pas de statut (toujours EN_ATTENTE
  // à la création) : sinon un client pourrait créer une demande déjà validée.
};

// ← SORTIE (API → client) : on déclare ce qu'on expose, et rien de plus
function versReponse(demande, salarie) {
  return {
    id:         demande.id,
    dateDebut:  demande.dateDebut,
    statut:     demande.statut,
    nomSalarie: salarie.nom,     // enrichi par une jointure
    // ni empreinte de mot de passe, ni colonne technique
  };
}
```

---

### 10.5 Authentification JWT

**Qu'est-ce qu'un JWT ?**

Un **JWT** (*JSON Web Token*) est un jeton signé que le serveur remet au client après une connexion réussie. À chaque requête suivante, le client le renvoie dans le header `Authorization`. Le serveur vérifie la signature pour confirmer que le token est valide et n'a pas été modifié.

**Structure d'un JWT :** trois parties séparées par des points, encodées en base64 :

```
eyJhbGciOiJIUzI1NiJ9  .  eyJzdWIiOiI0MiIsInJvbGUiOiJTYWxhcmllIn0  .  signature
    header                         payload                              signature
```

Le **payload** contient les informations de l'utilisateur (non chiffré, mais signé) :
```json
{
  "sub": "42",         // ← id de l'utilisateur
  "name": "Valentin",
  "role": "Salarie",
  "exp": 1780000000    // ← expiration (Unix timestamp)
}
```

**Génération du token côté serveur :**

```javascript
import jwt from 'jsonwebtoken';

function genererJeton(salarie) {
  return jwt.sign(
    {
      sub:  salarie.id,          // à qui appartient ce jeton
      nom:  salarie.nom,
      role: salarie.role,
    },
    process.env.JWT_SECRET,      // le secret vient de l'environnement, pas du code
    {
      expiresIn: '1h',           // durée courte : limite la fenêtre en cas de vol
      issuer:    'congeapp.fr',
      audience:  'congeapp-users',
    },
  );
}
```

Le token est envoyé dans chaque requête : `Authorization: Bearer <token>`

**Vérification à l'entrée**, une fois pour toutes, avant d'atteindre le code métier :

```javascript
// Middleware d'authentification : vérifie la signature avant tout traitement
function authentifier(req, res, next) {
  const entete = req.headers.authorization ?? '';
  const jeton  = entete.startsWith('Bearer ') ? entete.slice(7) : null;
  if (!jeton) return res.sendStatus(401);

  try {
    // verify contrôle la signature, l'expiration, l'émetteur et l'audience
    const charge = jwt.verify(jeton, process.env.JWT_SECRET, {
      issuer:   'congeapp.fr',
      audience: 'congeapp-users',
    });
    req.utilisateur = { id: charge.sub, role: charge.role };
    next();
  } catch {
    return res.sendStatus(401);   // signature invalide ou jeton expiré
  }
}

// Autorisation : une fois l'identité connue, on vérifie les droits
const exigerRole = (role) => (req, res, next) =>
  req.utilisateur.role === role ? next() : res.sendStatus(403);

app.post('/api/demandes/:id/valider', authentifier, exigerRole('Manager'), /* ... */);
```

---

### 10.6 CORS — Cross-Origin Resource Sharing

**Pourquoi le CORS existe-t-il ?**

Par sécurité, les navigateurs bloquent les requêtes JavaScript vers un domaine différent de la page courante. Si ton front-end est sur `https://monapp.fr` et ton API sur `https://api.monapp.fr`, sans configuration CORS la requête `fetch()` sera bloquée par le navigateur.

Le serveur doit **explicitement autoriser** les origines qui peuvent l'appeler.

```javascript
import cors from 'cors';

app.use(cors({
  origin: ['https://monapp.fr', 'http://localhost:5173'],  // ← origines autorisées
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Authorization', 'Content-Type'],
  credentials: true,                                       // nécessaire si cookies
}));
```

> **⚠️ Éviter le joker `*` en production** — il autorise n'importe quel site à appeler l'API depuis le navigateur d'un utilisateur connecté. On liste les origines réellement nécessaires.

---

### 10.7 Pagination, filtrage, tri

Renvoyer 50 000 demandes dans un seul `GET /api/demandes` sature le serveur, le réseau et le navigateur. Une collection se pagine.

```
GET /api/demandes?page=2&taille=20&statut=EN_ATTENTE&tri=-dateDebut
                  └──── pagination ────┘ └─ filtre ─┘ └─── tri ───┘
                                                        (- = décroissant)
```

```javascript
app.get('/api/demandes', authentifier, async (req, res) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  // ← borner : sans cela, taille=1000000 devient une attaque par épuisement
  const taille = Math.min(100, Math.max(1, Number(req.query.taille) || 20));

  const { items, total } = await serviceConges.lister({ page, taille, statut: req.query.statut });

  res.json({
    donnees:    items,
    page,
    taille,
    total,
    totalPages: Math.ceil(total / taille),
  });
});
```

**Deux stratégies de pagination :**

| Stratégie | Requête | Avantage | Limite |
| --- | --- | --- | --- |
| Par décalage (*offset*) | `?page=2&taille=20` → `OFFSET 20 LIMIT 20` | Simple, permet d'aller directement à la page N | Lent sur de très gros décalages ; une insertion pendant la navigation décale les résultats |
| Par curseur | `?apres=<id du dernier>` | Stable et rapide même sur de gros volumes | On ne peut avancer que de proche en proche |

Retourner le total et le nombre de pages évite au client de deviner. Certaines API passent ces informations dans des en-têtes (`X-Total-Count`, `Link`) plutôt que dans le corps — les deux se défendent, l'important est d'être cohérent.

---

### 10.8 Versionner son API

Dès qu'un client extérieur consomme l'API, on ne peut plus casser un contrat sans prévenir. La version se place le plus souvent dans l'URL :

```
GET /api/v1/demandes     ← l'ancienne, maintenue le temps de la migration
GET /api/v2/demandes     ← la nouvelle, avec la réponse paginée
```

```javascript
// Deux versions montées côté à côté, le temps de la migration des clients
app.use('/api/v1/demandes', routeurDemandesV1);   // maintenue, figée
app.use('/api/v2/demandes', routeurDemandesV2);   // nouvelle, réponse paginée
```

| Emplacement de la version | Exemple | Remarque |
| --- | --- | --- |
| Dans l'URL | `/api/v2/demandes` | Le plus lisible et le plus répandu |
| Dans un en-tête | `Api-Version: 2.0` | URL plus propre, mais moins visible au débogage |
| Dans le type de média | `Accept: application/vnd.congeapp.v2+json` | Le plus « pur » au sens REST, le plus rare en pratique |

**Ce qui exige une nouvelle version majeure :** supprimer ou renommer un champ, changer un type, rendre obligatoire un paramètre qui ne l'était pas, modifier le sens d'un code de statut. **Ce qui n'en exige pas :** ajouter un champ optionnel dans la réponse, ajouter un endpoint. C'est exactement la logique de SemVer, appliquée au contrat d'API.

---

### 10.9 Session ou jeton : deux façons d'authentifier

| | **Session serveur + cookie** | **Jeton JWT** |
| --- | --- | --- |
| Où vit l'état | Sur le serveur (mémoire, Redis, base) | Dans le jeton lui-même, chez le client |
| Transport | Cookie envoyé automatiquement | En-tête `Authorization: Bearer` |
| Déconnexion immédiate | Oui — on supprime la session | Difficile : le jeton reste valide jusqu'à son expiration |
| Montée en charge | Il faut partager les sessions entre serveurs | Chaque serveur vérifie seul la signature |
| Exposé au CSRF | Oui (cookie automatique) → `SameSite` + jeton anti-CSRF | Non, si le jeton est dans un en-tête |
| Exposé au XSS | Limité si le cookie est `HttpOnly` | Oui, si le jeton est stocké en `localStorage` |

Il n'y a pas de gagnant universel : la session convient à une application web classique servie par le même domaine, le jeton convient à une API consommée par plusieurs clients (site, application mobile, service tiers).

**Le couple jeton d'accès / jeton de rafraîchissement** résout le compromis entre sécurité et confort :

```
1. Connexion réussie
   → jeton d'accès      (durée courte : 15 à 60 min, envoyé à chaque requête)
   → jeton de rafraîchissement (durée longue : plusieurs jours, stocké en cookie HttpOnly)

2. Le jeton d'accès expire
   → le client appelle POST /api/auth/refresh avec le jeton de rafraîchissement
   → le serveur vérifie qu'il est valide ET qu'il n'a pas été révoqué (il est en base)
   → il renvoie un nouveau jeton d'accès

3. Déconnexion ou vol détecté
   → on révoque le jeton de rafraîchissement en base : plus aucun renouvellement
```

Le jeton d'accès reste court pour limiter la fenêtre de vol ; le jeton de rafraîchissement, lui, est stocké côté serveur, donc **révocable** — ce qui rattrape le principal défaut du JWT.

---

### 10.10 Swagger / OpenAPI

Swagger génère automatiquement une **documentation interactive** de l'API accessible dans le navigateur. Très utile pour tester les endpoints pendant le développement.

```javascript
// La documentation est générée à partir d'une description OpenAPI du contrat,
// et servie uniquement hors production.
import swaggerUi from 'swagger-ui-express';

if (process.env.NODE_ENV !== 'production') {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(descriptionOpenApi));
}
```

L'interface Swagger permet de voir tous les endpoints, leurs paramètres, les codes de retour, et de les tester directement — sans Postman.

---

> **🔒 Sécurité**
>
> - **[Authorize]** sans précision = utilisateur connecté requis. `[Authorize(Roles="Manager")]` = rôle requis.
> - **Broken Access Control (A01)** : toujours vérifier côté serveur que l'utilisateur peut accéder à la ressource demandée — ne jamais se fier à l'id dans l'URL.
> - **CORS strict** : ne lister que les origines réellement nécessaires.
> - **Ne pas exposer de stack trace** en production.
