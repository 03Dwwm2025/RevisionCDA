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

### 10.3 Contrôleur ASP.NET Core

```csharp
[ApiController]
[Route("api/demandes")]
public class DemandesController : ControllerBase
{
    private readonly IServiceConges _service;
    public DemandesController(IServiceConges service) => _service = service;

    [HttpGet("{id:int}")]
    [Authorize]
    public IActionResult Get(int id)
    {
        var d = _service.GetParId(id);
        if (d is null) return NotFound();  // 404

        // Vérification Broken Access Control (OWASP A01)
        var idConnecte = int.Parse(User.FindFirst("sub")!.Value);
        if (d.IdSalarie != idConnecte) return Forbid(); // 403

        return Ok(d); // 200
    }

    [HttpPost]
    [Authorize]
    public IActionResult Creer([FromBody] DemandeDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState); // 400 — format invalide
        var idSalarie = int.Parse(User.FindFirst("sub")!.Value);
        var res = _service.Deposer(idSalarie, dto);
        return res.Succes
            ? CreatedAtAction(nameof(Get), new { id = res.Id }, null) // 201
            : BadRequest(res.Message); // 400 — règle métier
    }
}
```

---

### 10.4 Les DTO

On n'expose jamais l'entité directement — on utilise des DTO pour contrôler exactement ce qui entre et sort de l'API.

```csharp
public class DemandeDto          // ← entrée (client → API)
{
    [Required] public DateOnly DateDebut { get; set; }
    [Required] public DateOnly DateFin   { get; set; }
    // Pas d'Id (généré par la BDD), pas de Statut (toujours EN_ATTENTE à la création)
}

public class DemandeReponseDto   // ← sortie (API → client)
{
    public int    Id         { get; set; }
    public string DateDebut  { get; set; } = "";
    public string Statut     { get; set; } = "";
    public string NomSalarie { get; set; } = ""; // enrichi via jointure
    // Pas de hashMotDePasse, pas de données internes
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

```csharp
public string GenererToken(Salarie salarie)
{
    var cle  = new SymmetricSecurityKey(
                   Encoding.UTF8.GetBytes(_config["Jwt:Secret"]!));
    var creds = new SigningCredentials(cle, SecurityAlgorithms.HmacSha256);

    var claims = new[]
    {
        new Claim("sub",  salarie.IdSalarie.ToString()),
        new Claim("name", salarie.Nom),
        new Claim("role", salarie.Role)
    };

    var token = new JwtSecurityToken(
        issuer:             _config["Jwt:Issuer"],
        audience:           _config["Jwt:Audience"],
        claims:             claims,
        expires:            DateTime.UtcNow.AddMinutes(60), // ← expire dans 1h
        signingCredentials: creds
    );

    return new JwtSecurityTokenHandler().WriteToken(token);
}
```

Le token est envoyé dans chaque requête : `Authorization: Bearer <token>`

**Vérification automatique par ASP.NET Core** (configurée en `Program.cs`) :

```csharp
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Secret"]!)),
            ValidateIssuer   = true,
            ValidIssuer      = builder.Configuration["Jwt:Issuer"],
            ValidateAudience = true,
            ValidAudience    = builder.Configuration["Jwt:Audience"],
            ValidateLifetime = true  // ← vérifie la date d'expiration
        };
    });
```

---

### 10.6 CORS — Cross-Origin Resource Sharing

**Pourquoi le CORS existe-t-il ?**

Par sécurité, les navigateurs bloquent les requêtes JavaScript vers un domaine différent de la page courante. Si ton front-end est sur `https://monapp.fr` et ton API sur `https://api.monapp.fr`, sans configuration CORS la requête `fetch()` sera bloquée par le navigateur.

Le serveur doit **explicitement autoriser** les origines qui peuvent l'appeler.

```csharp
// Program.cs — configuration CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("PolitiqueFront", policy =>
        policy
            .WithOrigins("https://monapp.fr", "http://localhost:5173") // ← origines autorisées
            .AllowAnyMethod()   // GET, POST, PUT, DELETE...
            .AllowAnyHeader()   // Authorization, Content-Type...
    );
});

// Activer le middleware CORS (avant UseAuthentication)
app.UseCors("PolitiqueFront");
```

> **⚠️ Ne jamais utiliser `.AllowAnyOrigin()` en production** — cela autorise n'importe quel site à appeler l'API, y compris des sites malveillants.

---

### 10.7 Swagger / OpenAPI

Swagger génère automatiquement une **documentation interactive** de l'API accessible dans le navigateur. Très utile pour tester les endpoints pendant le développement.

```csharp
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(); // → accessible sur /swagger
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
